import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

// Language mapping for better translations
const LANGUAGE_NAMES: Record<string, string> = {
  EN: "English",
  HI: "Hindi",
  MR: "Marathi",
  KN: "Kannada",
  TA: "Tamil",
  BN: "Bengali",
  TE: "Telugu",
};

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!apiKey || apiKey === "your-gemini-api-key-here") {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    if (targetLang === "EN") {
      return NextResponse.json({ translated: text });
    }

    const targetLanguage = LANGUAGE_NAMES[targetLang] || targetLang;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Enhanced prompt with financial context and specific instructions
    const prompt = `
You are a professional translator for a financial services platform. 

CONTEXT: This is for a financial application that includes:
- "Agents Hub" = Main dashboard for AI financial agents
- "SEBI Agent" = Securities and Exchange Board regulatory assistant
- "Tax Mitra" = Tax calculation and filing assistant  
- "Trader Agent" = Stock trading assistant
- "Debt Squasher" = Debt management assistant
- "Retirement Agent" = Retirement planning assistant

TASK: Translate the following text to ${targetLanguage}:
"${text}"

CRITICAL REQUIREMENTS:
1. Translate to authentic ${targetLanguage} using proper native script
2. For Tamil: Use தமிழ் script characters ONLY (த, ம, ி, ழ், etc.)
3. For financial terms, use commonly understood terms in ${targetLanguage}
4. Maintain professional tone suitable for financial services
5. Keep technical terms like "API", "URL" untranslated
6. Return ONLY the translated text, no explanations

RESPOND WITH ONLY THE TRANSLATED TEXT:`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let translatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || text;

    // Clean up the response - remove any English explanations or formatting
    translatedText = translatedText
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => {
        // Remove lines that are clearly English explanations
        if (
          line.toLowerCase().includes("translate") ||
          line.toLowerCase().includes("translation") ||
          line.toLowerCase().includes("here is") ||
          line.toLowerCase().includes("the text") ||
          line.startsWith("*") ||
          line.includes(":")
        ) {
          return false;
        }
        return line.length > 0;
      })
      .join(" ")
      .trim();

    // If we still have the original text or it's empty, return original
    if (!translatedText || translatedText === text) {
      translatedText = text;
    }

    return NextResponse.json({ translated: translatedText });
  } catch (error: any) {
    console.error("Translation error:", error.message);

    // Return original text instead of failing completely
    const { text } = await req
      .json()
      .catch(() => ({ text: "Translation failed" }));

    return NextResponse.json(
      {
        translated: text,
        error: "Translation service temporarily unavailable",
      },
      { status: 200 } // Return 200 so frontend doesn't break
    );
  }
}
