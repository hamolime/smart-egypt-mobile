import { Router } from "express";
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const router = Router();

router.post("/chat", async (req, res) => {
  const { messages } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_KEY ?? process.env.GROQ_API_KEY,
  });

  const history: ChatCompletionMessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are Smart Egypt AI Guide — a knowledgeable, friendly travel assistant specializing in Egypt. You help tourists discover historical sites, local food, culture, transportation, accommodation, and activities across Egypt (Cairo, Luxor, Aswan, Hurghada, Sharm El-Sheikh, Alexandria, etc.). Keep answers concise, engaging, and practical. Respond in the same language the user writes in.",
        },
        ...history,
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err) {
    req.log.error(err, "Groq API error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

export default router;
