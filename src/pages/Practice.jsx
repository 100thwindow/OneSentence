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
    <div className="practice-page">
      <div className="practice-page__bg" aria-hidden="true">
        <span className="practice-page__blob practice-page__blob--1" />
        <span className="practice-page__blob practice-page__blob--2" />
        <span className="practice-page__blob practice-page__blob--3" />
      </div>

      <main className="app-layout practice-layout">
        <header className="practice-header">
          <p className="prompt-text practice-header__prompt">
            <strong>Type something and send AI to fix it</strong>
          </p>
        </header>

        <div className="practice-page__columns">
          <section className="practice-page__input-col">
            <textarea
              rows={8}
              className="textarea textarea--practice"
              placeholder="Write your answer here..."
              value={text}
              onChange={handleChange}
            />
            <div className="word-counter">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </div>
          </section>

          <div
            className={`edited-panel ${loading ? "edited-panel--loading" : ""} ${aiResponse?.refined ? "edited-panel--has-result" : ""}`}
          >
            <div className="edited-panel__header">
              <span className="edited-panel__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 32 32"
                  width="36"
                  height="36"
                  xmlns="http://www.w3.org/2000/svg"
                  className="edited-panel__icon-svg"
                >
                  {/* Renk: üstteki prompt ile aynı (currentColor) */}
                  <g
                    className="edited-panel__icon-mark"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="16" cy="16" r="10.5" />
                    <path strokeWidth="3.25" d="M10 16.5l3.2 3.2L22 11" />
                  </g>
                </svg>
              </span>
              <span className="edited-panel__label">Edited version</span>
            </div>
          <div className="edited-panel__body">
            {aiResponse?.refined ? (
              <p className="edited-panel__text" key={aiResponse.refined}>
                {aiResponse.refined}
              </p>
            ) : loading ? (
              <p className="edited-panel__placeholder edited-panel__placeholder--pulse">
                Refining your sentence…
              </p>
            ) : (
              <p className="edited-panel__placeholder edited-panel__placeholder--idle">
                Send to see your refined sentence here.
              </p>
            )}
          </div>
        </div>
        </div>

        <div className="practice-footer">
          <button
            type="button"
            className="save-button save-button--practice"
            onClick={handleSend}
            disabled={loading || !text.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
          <Link to="/" className="practice-back-link">
            ← Back home
          </Link>
        </div>

        {error && (
          <div className="practice-error" role="alert">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}

export default Practice;