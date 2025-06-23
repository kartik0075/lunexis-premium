import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function detectTextMood(text: string): Promise<string> {
  const res = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Classify this text's mood (e.g., happy, sad, excited, calm):" },
      { role: "user", content: text },
    ],
    model: "gpt-4o",
  });
  return res.choices[0].message.content.trim();
}
