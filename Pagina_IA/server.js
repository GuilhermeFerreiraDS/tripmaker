import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MySQL
const db = await mysql.createPool({
  host: "localhost",
  user: "root",        // altere para seu usuário
  password: "",        // altere para sua senha
  database: "seubanco" // altere para seu banco
});

// Configuração do OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/roteiro", async (req, res) => {
  const { cidade, categoria, valor } = req.body;

  try {
    // 1. Busca no BD
    let query = "SELECT * FROM pontos_turisticos WHERE 1=1";
    let params = [];

    if (cidade) {
      query += " AND LOWER(cidade) = ?";
      params.push(cidade.toLowerCase());
    }

    if (categoria) {
      query += " AND LOWER(categoria) = ?";
      params.push(categoria.toLowerCase());
    }

    if (valor) {
      query += " AND preco_estimado <= ?";
      params.push(parseFloat(valor));
    }

    const [rows] = await db.query(query, params);

    let pontosBD = rows.map(r => ({
      nome: r.nome,
      cidade: r.cidade,
      descricao: r.descricao,
      categoria: r.categoria,
      valor: r.preco_estimado ? `R$ ${r.preco_estimado}` : "Gratuito"
    }));

    // 2. Se não achou nada no BD, consulta ChatGPT
    let pontosAI = [];
    if (pontosBD.length === 0) {
      const prompt = `Liste pontos turísticos em ${cidade || "uma cidade genérica"} 
        com categoria ${categoria || "qualquer"} 
        e valor até ${valor || "qualquer"}.
        Responda em formato JSON no seguinte formato:
        {
          "pontos": [
            { "nome": "...", "cidade": "...", "descricao": "...", "categoria": "...", "valor": "..." }
          ]
        }`;

      const resposta = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      });

      try {
        const conteudo = resposta.choices[0].message.content;
        const parsed = JSON.parse(conteudo);
        pontosAI = parsed.pontos || [];
      } catch (err) {
        console.error("⚠️ Erro ao parsear resposta do ChatGPT:", err.message);
      }
    }

    // 3. Junta resultados do BD + ChatGPT
    const pontos = [...pontosBD, ...pontosAI];

    // 4. Calcula custo total
    const total = pontos.reduce((acc, p) => {
      if (p.valor && p.valor.startsWith("R$")) {
        const num = parseFloat(p.valor.replace("R$", "").replace(",", "."));
        return acc + (isNaN(num) ? 0 : num);
      }
      return acc;
    }, 0);

    // 5. Retorna para o front
    res.json({ pontos, total });

  } catch (err) {
    console.error("❌ Erro no servidor:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
