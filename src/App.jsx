import React, { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("chat");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, type }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.response) setResponse(data.response);
    else if (data.image_url) setResponse(data.image_url);
    else if (data.code) setResponse(data.code);
    else setResponse("Erro ao gerar resposta 😢");
  }

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1>✨ Lasy Caseira IA ✨</h1>
      <p>Escolhe uma função abaixo e vê a magia acontecer 🚀</p>

      <div style={{ margin: "1rem 0" }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem" }}
        >
          <option value="chat">🧠 Chat GPT</option>
          <option value="image">🎨 Criar Imagem</option>
          <option value="website">🌐 Criar Website</option>
          <option value="game">🎮 Criar Jogo</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          style={{ width: "100%", marginTop: "1rem", padding: "0.5rem" }}
          placeholder="Escreve o que queres criar..."
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {loading ? "Gerando..." : "Enviar"}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        {type === "image" && response.startsWith("http") ? (
          <img src={response} alt="Imagem gerada" width="512" />
        ) : type === "website" || type === "game" ? (
          <iframe
            srcDoc={response}
            title="preview"
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #ccc",
              marginTop: "1rem",
            }}
          />
        ) : (
          <pre style={{ whiteSpace: "pre-wrap" }}>{response}</pre>
        )}
      </div>
    </div>
  );
}
