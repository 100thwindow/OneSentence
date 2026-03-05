import fetch from "node-fetch";

// Vercel serverless function: POST /api/validate
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "arcee-ai/trinity-large-preview:free",
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: `Change the input a sentence to make it more natural and correct.
             You MUST output a changed version—never the exact same thing. 
             Feel free to make changes to the sentence structure, but keep the meaning the same.
             Never give a description of the input.
             Don't do anyting else.

Examples:
- "i ate cheese" → "I had some cheese."
- "I wake up at 7" → "I wake up at 7 in the morning."
- "she go to work" → "She goes to work."
- "I like coffee" → "I really like coffee."

No quotes, no explanation.`,
          },
          {
            role: "user",
            content: text.trim(),
          },
        ],
      }),
    });

    const data = await response.json();
    const refined = (data.choices?.[0]?.message?.content || "").trim();
    let finalRefined = refined || text.trim();

    // If AI returned the same sentence, apply minimal fix (capitalize + period)
    const original = text.trim();
    if (finalRefined.toLowerCase() === original.toLowerCase()) {
      let t = original;
      t = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
      if (!t.endsWith(".")) t += ".";
      finalRefined = t;
    }

    return res.status(200).json({ refined: finalRefined });
  } catch (error) {
    console.error("OpenRouter error:", error);
    return res.status(500).json({ error: "Failed to get refined sentence" });
  }
}