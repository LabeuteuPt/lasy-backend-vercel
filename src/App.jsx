import React, { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("chat");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setResponse("Carregando...");

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, type }),
    });

    const data = await res.json();
    if (data.response) setResponse(data.response);
    else if (data.image_url) setResponse(data.image_url);
    else setResponse("Erro ao gerar resposta 😢");
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Lasy Caseira 🧠</h1>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="chat">Chat GPT</option>
        <option value="image">Criar Imagem</option>
      </select>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          style={{ width: "100%", marginTop: "1rem" }}
          placeholder="Escreve teu pedido..."
        />
        <button type="submit">Enviar</button>
      </form>
      <div style={{ marginTop: "2rem" }}>
        {response.startsWith("http") ? (
          <img src={response} alt="Imagem gerada" width="512" />
        ) : (
          <p>{response}</p>
        )}
      </div>
    </div>
  );
}
