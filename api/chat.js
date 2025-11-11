import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // Apenas permite POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    // Pega o prompt e o tipo do corpo da requisição
    const { prompt, type } = req.body || {};

    if (!prompt || !type) {
      return res.status(400).json({ error: "Faltando prompt ou tipo" });
    }

    // Configura o cliente OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // CHAT
    if (type === "chat") {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      return res.status(200).json({
        response: completion.choices[0].message.content,
      });
    }

    // IMAGEM
    if (type === "image") {
      const image = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });
      return res.status(200).json({
        image_url: image.data[0].url,
      });
    }

    // WEBSITE ou GAME
    if (type === "website" || type === "game") {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Crie o código HTML/CSS/JS para ${type}: ${prompt}`,
          },
        ],
      });
      return res.status(200).json({
        code: completion.choices[0].message.content,
      });
    }

    return res.status(400).json({ error: "Tipo inválido" });
  } catch (err) {
    console.error("ERRO NO BACKEND:", err);
    return res.status(500).json({ error: err.message });
  }
}
