require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const dbPromise = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "turismo"
});

const formatCurrency = n => `R$ ${Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.post("/roteiro", async (req, res) => {
    let { cidade, categoria, valor } = req.body;
    cidade = cidade?.trim();
    categoria = categoria?.trim();
    valor = valor ? parseFloat(String(valor).replace(/\./g, "").replace(",", ".")) : null;

    try {
        const db = await dbPromise;

        let query = "SELECT * FROM pontos_turisticos WHERE 1=1";
        const params = [];
        if (cidade) params.push(cidade), query += " AND cidade = ?";
        if (categoria) params.push(`%${categoria}%`), query += " AND categoria LIKE ?";

        const [rows] = await db.execute(query, params);

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

        let pontosBanco = rows.map(padronizaPonto);
        let totalBanco = pontosBanco.reduce((s, p) => s + (p.preco || 0), 0);
        let pontos = [...pontosBanco];

        let prompt = "";
        if (pontosBanco.length === 0) {
            if (cidade) prompt = `Liste pontos turísticos na cidade ${cidade}.`;
            else if (categoria) prompt = `Liste pontos turísticos da categoria ${categoria}.`;
            else prompt = "Liste pontos turísticos gerais no Brasil.";
            prompt += ` Responda em JSON válido no formato: [ { "nome": "...", "cidade": "...", "descricao": "...", "categoria": "...", "valor": "..." } ]`;
        } else if (valor) {
            let restante = Math.max(0, valor - totalBanco);
            if (restante > 0) prompt = `Monte pontos turísticos adicionais até R$ ${restante.toFixed(2)}. Responda em JSON válido no mesmo formato.`;
        }

        let pontosGPT = [];
        if (prompt) {
            const resposta = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Você é um guia turístico especializado." },
                    { role: "user", content: prompt }
                ],
                temperature: 0,
                max_tokens: 1000
            });

            const conteudoGPT = resposta.choices[0].message.content.replace(/```/g, "").trim();
            
            // Tenta extrair JSON mesmo que venha texto extra
            try {
                const match = conteudoGPT.match(/\[.*\]/s); // captura conteúdo entre colchetes
                if (match) {
                    pontosGPT = JSON.parse(match[0]).map(p => {
                        let preco = 0;
                        if (p.valor && p.valor !== "sem custo") {
                            const num = parseFloat(p.valor.replace(/[^\d.,-]/g, "").replace(",", "."));
                            preco = isNaN(num) ? 0 : num;
                        }
                        return { ...p, preco, valor: preco > 0 ? formatCurrency(preco) : "sem custo" };
                    });
                } else {
                    console.warn("Resposta GPT não contém JSON válido:", conteudoGPT);
                }
            } catch (e) {
                console.warn("Erro ao parsear JSON do GPT:", e, "\nConteúdo recebido:", conteudoGPT);
            }
        }

        if (valor) {
            let total = totalBanco;
            for (const p of pontosGPT) if ((total + p.preco) <= valor) pontos.push(p), total += p.preco;
        } else pontos.push(...pontosGPT);

        res.json({
            pontos: pontos.map(({ nome, cidade, descricao, categoria, valor }) => ({ nome, cidade, descricao, categoria, valor })),
            total: pontos.reduce((s, p) => s + (p.preco || 0), 0)
        });

    } catch (err) {
        console.error("Erro no /roteiro:", err);
        res.status(500).json({ erro: err.message });
    }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000 🚀"));
