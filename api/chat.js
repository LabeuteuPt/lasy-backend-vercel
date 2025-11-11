import OpenAI from "openai";

export default async function handler(req, res) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { prompt, type } = req.body;

  try {
    if (type === "chat") {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      return res.json({ response: completion.choices[0].message.content });
    }

    if (type === "image") {
      const image = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      });
      return res.json({ image_url: image.data[0].url });
    }

    return res.status(400).json({ error: "Tipo inválido" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
