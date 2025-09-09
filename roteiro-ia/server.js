require("dotenv").config(); // carrega variáveis do .env
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Configuração OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Conexão com o banco
const dbPromise = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "turismo"
});

// Rota inicial -> carrega index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint de roteiro
app.post("/roteiro", async (req, res) => {
    console.log("📩 Chegou requisição em /roteiro:", req.body); 
    let { cidade, categoria } = req.body;
    cidade = cidade.trim();
    categoria = (categoria || "").trim();

    try {
        const db = await dbPromise;

        // 1. Buscar no banco local
        const [rows] = await db.execute(
            "SELECT * FROM pontos_turisticos WHERE cidade = ? AND (categoria LIKE ? OR ? = '')",
            [cidade, `%${categoria || ""}%`, categoria || ""]
        );

        let pontosBanco = rows.map(p => ({
            nome: p.nome,
            cidade: p.cidade,
            descricao: p.descricao,
            categoria: p.categoria
        }));

        console.log("🔎 Pontos encontrados no banco:", pontosBanco);

        // 2. Buscar no ChatGPT
        const resposta = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Você é um guia turístico especializado." },
                {
                    role: "user",
                    content: `Liste pontos turísticos de ${cidade} na categoria ${categoria}.
Responda SOMENTE em JSON válido no formato:
[
  { "nome": "...", "cidade": "...", "descricao": "...", "categoria": "..." }
]`
                }
            ],
            temperature: 0,
            max_tokens: 1500
        });

        console.log("🟢 Resposta bruta do GPT:", JSON.stringify(resposta, null, 2));

        let pontosGPT = [];
        try {
            let content = resposta.choices[0].message.content.trim();
            console.log("📩 Conteúdo do GPT antes da limpeza:", content);

            // 🔥 Remove blocos de markdown ```json ... ```
            content = content.replace(/```json/gi, "").replace(/```/g, "").trim();
            console.log("✅ Conteúdo do GPT limpo:", content);

            pontosGPT = JSON.parse(content);
        } catch (e) {
            console.error("❌ Erro ao parsear JSON do ChatGPT:", e);
        }

        // 3. Unir banco + GPT
        const pontos = [...pontosBanco, ...pontosGPT];

        if (pontos.length === 0) {
            return res.json({ pontos: [], aviso: "Nenhum ponto encontrado." });
        }

        res.json({ pontos });

    } catch (err) {
        console.error("🔥 Erro no /roteiro:", err);
        res.status(500).json({ erro: err.message });
    }
});

// Iniciar servidor
app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000 🚀"));
