import { NextRequest } from "next/server";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {

    if (!GEMINI_API_KEY) {
  return new Response(JSON.stringify({ error: "Gemini API key is missing." }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

          let message;
  try {
    const body = await req.json();
    message = body.message;
    if (!message || typeof message !== "string") {
      throw new Error();
    }
  } catch {
    return new Response(JSON.stringify({ error: "No valid JSON body or 'message' provided." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }


        

        const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" + GEMINI_API_KEY;

        const geminiBody = {
            contents: [{
                parts: [{text: message }] 
            }]
        };

        const geminiRes = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json" },
            body: JSON.stringify(geminiBody)
        });

        if (!geminiRes.ok) {
             const errorText = await geminiRes.text();
  console.error("Gemini API error:", errorText);
            return new Response (JSON.stringify({ error: 'Failed to fetch response from Gemini AI' }), {
                status: 500,
            headers: {"content-Type": "application/json"}
            });
        }

        const geminiData = await geminiRes.json();
        const reply = geminiData.candidates[0].content?.parts?.[0].text || "Sorry, I didn't understand that.";
        return new Response(JSON.stringify({reply }), {
            status: 200,
            headers: {
                "content-Type": "application/json"
            }
        });
}