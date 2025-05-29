import { NextResponse } from "next/server";
import { generateNewWord } from "@/utils/wordOfTheDay";

interface GenerateWordRequestBody {
  userContent: string;
  previousWords: string[];
}

interface GenerateWordResponse {
  word: string;
  definition: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: GenerateWordRequestBody = await request.json();
    const userContent = body.userContent || "";
    const previousWords = body.previousWords || [];

    // Generate a new word using the utility function
    const newWord: GenerateWordResponse = await generateNewWord(
      userContent,
      previousWords,
    );

    return NextResponse.json(newWord, { status: 200 });
  } catch (error) {
    console.error("Error generating word:", error);
    return NextResponse.json(
      { error: "Failed to generate word. Please try again later." },
      { status: 500 },
    );
  }
}
