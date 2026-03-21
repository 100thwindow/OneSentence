import { useState } from "react";
import { Link } from "react-router-dom";

function Practice() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setText(event.target.value);
    if (aiResponse || error) {
      setAiResponse(null);
      setError(null);
    }
  };

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const handleSend = async () => {
    if (!text.trim()) {
      setError("Please write something first.");
      return;
    }

    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      setAiResponse(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Could not connect to AI. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-layout practice-layout">
      <header className="practice-header">
        {/* <h1 className="app-title">Practice</h1> */}
        <p className="prompt-text"><strong>Type something and send AI to fix it</strong></p>
      </header>

      <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "nowrap" }}>
        <section style={{ flex: "0 1 50%", minWidth: 0, marginRight: "1.5rem" }}>
          <textarea
            rows={8}
            className="textarea"
            placeholder="Write your answer here..."
            value={text}
            onChange={handleChange}
          />
          <div className="word-counter">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </div>
        </section>

        <div
          style={{
            flex: "0 1 50%",
            minWidth: 0,
            minHeight: "8rem",
            marginLeft: "1.5rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "#f3f4f6",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "#4b5563", marginBottom: "0.25rem" }}>
            Edited version:
          </div>
          <div style={{ fontStyle: "italic" }}>
            {aiResponse?.refined || (loading ? "..." : "Send to see the refined sentence here.")}
          </div>
        </div>
      </div>

      <div className="practice-footer">
        <button
          type="button"
          className="save-button"
          onClick={handleSend}
          disabled={loading || !text.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <Link to="/">← Back home</Link>
      </div>

      {error && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "#fef2f2",
            border: "1px solid #dc2626",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}
    </main>
  );
}

export default Practice;