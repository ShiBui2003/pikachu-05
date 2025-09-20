import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { title, category, description, imageBase64 } = await req.json()

    // Create comprehensive prompt for Gemini
    let prompt = `You are verifying a civic issue report. Analyze if this is a legitimate civic issue that requires municipal attention.

Issue Title: "${title}"
Category: "${category}"
Description: "${description}"

Check if:
1. The issue is a genuine civic problem (potholes, streetlights, garbage, water leakage, traffic signals, road damage, etc.)
2. The description matches the selected category
3. The description is reasonable and not spam/fake
4. If an image is provided, it should match the description

Only respond with exactly "Yes" or "No".
- "Yes" if it's a legitimate civic issue
- "No" if it's spam, fake, irrelevant, or doesn't match the category`

    const requestBody: any = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 10
      }
    }

    // Add image if provided
    if (imageBase64) {
      // Extract the actual base64 data (remove data:image/jpeg;base64, prefix)
      const base64Data = imageBase64.split(',')[1] || imageBase64
      
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: "image/jpeg", // Assume JPEG, could be made dynamic
          data: base64Data
        }
      } as any)
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }
    )

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text())
      return NextResponse.json({ decision: "No" })
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No"

    // Ensure only "Yes" or "No"
    const decision = text.trim().toLowerCase().includes("yes") ? "Yes" : "No"

    console.log("=== GEMINI VERIFICATION RESULT ===")
    console.log("Title:", title)
    console.log("Category:", category)
    console.log("Description:", description)
    console.log("Has Image:", !!imageBase64)
    console.log("Gemini Response:", text.trim())
    console.log("Final Decision:", decision)
    console.log("=====================================")

    return NextResponse.json({ decision })
  } catch (error) {
    console.error("Gemini verification error:", error)
    return NextResponse.json({ decision: "No" })
  }
}