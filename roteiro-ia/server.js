require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env
const express = require("express"); // Framework para servidor HTTP
const mysql = require("mysql2/promise"); // Cliente MySQL com suporte a Promises
const cors = require("cors"); // Middleware para liberar requisições de outros domínios
const path = require("path"); // Utilitário para manipulação de caminhos de arquivos
const OpenAI = require("openai"); // SDK da OpenAI para chamar modelos GPT

const app = express();

// Middlewares
app.use(cors()); // Permite requisições de qualquer origem
app.use(express.json()); // Permite interpretar JSON no body das requisições
app.use(express.static("public")); // Serve arquivos estáticos da pasta 'public'

// Inicializa cliente OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Conexão com banco MySQL (promessa)
const dbPromise = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "turismo"
});

// Função utilitária para formatar números como moeda brasileira
const formatCurrency = n => `R$ ${Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

// Rota da home, retorna index.html
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// Rota principal para gerar o roteiro
app.post("/roteiro", async (req, res) => {
    let { cidade, categoria, valor } = req.body; // Recebe dados do front
    cidade = cidade?.trim(); // Remove espaços extras
    categoria = categoria?.trim();
    // Converte valor para número, tratando formatos brasileiros
    valor = valor ? parseFloat(String(valor).replace(/\./g, "").replace(",", ".")) : null;

    try {
        const db = await dbPromise;

        // Monta consulta SQL dinâmica
        let query = "SELECT * FROM pontos_turisticos WHERE 1=1";
        const params = [];
        if (cidade) params.push(cidade), query += " AND cidade = ?";
        if (categoria) params.push(`%${categoria}%`), query += " AND categoria LIKE ?";

        // Executa consulta no banco
        const [rows] = await db.execute(query, params);

        // Função para padronizar cada ponto turístico
        const padronizaPonto = p => {
            const preco = p.preco_estimado ? Number(p.preco_estimado) : 0;
            return {
                nome: p.nome,
                cidade: p.cidade,
                descricao: p.descricao,
                categoria: p.categoria,
                preco,
                valor: preco > 0 ? formatCurrency(preco) : "sem custo"
            };
        };

        let pontosBanco = rows.map(padronizaPonto); // Padroniza pontos do banco
        let totalBanco = pontosBanco.reduce((s, p) => s + (p.preco || 0), 0); // Soma preços
        let pontos = [...pontosBanco]; // Começa com os pontos do banco

        // --- Monta prompt para GPT se necessário ---
        let prompt = "";
        if (pontosBanco.length === 0) {
            // Se não encontrou nada no banco, pergunta ao GPT
            if (cidade) prompt = `Liste pontos turísticos na cidade ${cidade}.`;
            else if (categoria) prompt = `Liste pontos turísticos da categoria ${categoria}.`;
            else prompt = "Liste pontos turísticos gerais no Brasil.";
            prompt += ` Responda em JSON válido no formato: [ { "nome": "...", "cidade": "...", "descricao": "...", "categoria": "...", "valor": "..." } ]`;
        } else if (valor) {
            // Se usuário passou orçamento, pede ao GPT para complementar
            let restante = Math.max(0, valor - totalBanco);
            if (restante > 0) prompt = `Monte pontos turísticos adicionais até R$ ${restante.toFixed(2)}. Responda em JSON válido no mesmo formato.`;
        }

        let pontosGPT = [];
        if (prompt) {
            // Chama GPT apenas se prompt definido
            const resposta = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Você é um guia turístico especializado." },
                    { role: "user", content: prompt }
                ],
                temperature: 0, // Resposta mais determinística
                max_tokens: 1000
            });

            try {
                // Converte resposta JSON do GPT para objeto e padroniza
                pontosGPT = JSON.parse(resposta.choices[0].message.content.replace(/```/g, "").trim())
                    .map(p => {
                        let preco = 0;
                        if (p.valor && p.valor !== "sem custo") {
                            const num = parseFloat(p.valor.replace(/[^\d.,-]/g, "").replace(",", "."));
                            preco = isNaN(num) ? 0 : num;
                        }
                        return { ...p, preco, valor: preco > 0 ? formatCurrency(preco) : "sem custo" };
                    });
            } catch (e) {
                console.warn("Erro ao parsear GPT:", e);
            }
        }

        // Se valor definido, respeita orçamento
        if (valor) {
            let total = totalBanco;
            for (const p of pontosGPT) if ((total + p.preco) <= valor) pontos.push(p), total += p.preco;
        } else pontos.push(...pontosGPT); // Caso contrário, adiciona todos do GPT

        // Retorna JSON para o front
        res.json({
            pontos: pontos.map(({ nome, cidade, descricao, categoria, valor }) => ({ nome, cidade, descricao, categoria, valor })),
            total: pontos.reduce((s, p) => s + (p.preco || 0), 0)
        });

    } catch (err) {
        // Trata erros
        console.error("Erro no /roteiro:", err);
        res.status(500).json({ erro: err.message });
    }
});

// Inicializa servidor
app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000 🚀"));
