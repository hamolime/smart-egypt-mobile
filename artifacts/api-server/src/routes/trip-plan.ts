import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();

interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tip: string;
}

router.post("/trip-plan", async (req, res) => {
  const { destination, days, budget, interests, language } = req.body as {
    destination: string;
    days: number;
    budget: string;
    interests: string[];
    language: string;
  };

  if (!destination) {
    res.status(400).json({ error: "destination is required" });
    return;
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_KEY ?? process.env.GROQ_API_KEY,
  });

  const interestsList =
    interests && interests.length > 0 ? interests.join(", ") : "general sightseeing";

  const lang = language || "English";
  const numDays = Math.min(Math.max(Number(days) || 5, 1), 14);

  const prompt = `Create a detailed ${numDays}-day travel itinerary for visiting ${destination} in Egypt.
Budget level: ${budget || "Mid-range"}.
Traveler interests: ${interestsList}.

Respond ONLY with a valid JSON array. Each element must have these exact fields:
- "day": number (1 to ${numDays})
- "title": string (catchy theme for that day)
- "morning": string (morning activity, 1-2 sentences)
- "afternoon": string (afternoon activity, 1-2 sentences)
- "evening": string (evening activity, 1-2 sentences)
- "tip": string (practical local tip, 1 sentence)

Respond in ${lang}. Return ONLY the JSON array starting with [ and ending with ]. No other text, no markdown, no code blocks.`;

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content ?? "[]";

    // Extract JSON array from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      req.log.error({ content }, "No JSON array found in Groq response");
      res.status(500).json({ error: "Failed to parse itinerary" });
      return;
    }

    const itinerary: DayPlan[] = JSON.parse(jsonMatch[0]);
    res.json({ itinerary });
  } catch (err) {
    req.log.error(err, "Groq trip-plan error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

export default router;
