import { SupabaseClient } from "@supabase/supabase-js";
import { WordOfTheDay } from "./types";
import OpenAI from "openai";

/**
 * Retrieves or generates the word of the day for the current user
 * @param supabase - Supabase client instance
 * @returns Promise resolving to the word of the day or null if an error occurs
 */
export async function getWordOfTheDay(
  supabase: SupabaseClient
): Promise<WordOfTheDay | null> {
  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) return null;

    const userId = user.id;
    // Get today's date in YYYY-MM-DD format using UTC
    const today = new Date().toISOString().split("T")[0];

    // Check if we already have a word for today
    const { data: existingWords, error: fetchError } = await supabase
      .from("words")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", today)
      .limit(1);

    if (fetchError) throw fetchError;
    if (existingWords?.length > 0) {
      return existingWords[0] as WordOfTheDay;
    }

    // Get user content for word generation
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("content")
      .eq("user_id", userId)
      .single();

    if (profileError) throw profileError;
    if (!profile?.content) {
      throw new Error("User content not found or empty");
    }

    // Get all previous words for this user
    const { data: previousWords, error: wordsError } = await supabase
      .from("words")
      .select("word")
      .eq("user_id", userId);

    if (wordsError) throw wordsError;

    // Generate new word using OpenAI
    const word = await generateNewWord(
      today,
      profile.content,
      previousWords?.map((item) => item.word) || []
    );

    // Insert and return new word
    const { data: newWord, error: insertError } = await supabase
      .from("words")
      .insert([
        {
          user_id: userId,
          word: word.word,
          definition: word.definition,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    return newWord as WordOfTheDay;
  } catch (error) {
    console.error(
      "Error in getWordOfTheDay:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Generates a new unique word using OpenAI
 */
async function generateNewWord(
  date: string,
  userContent: string,
  previousWords: string[]
): Promise<{ word: string; definition: string }> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const previousWordsText = previousWords.length
    ? `Previous words: ${previousWords.join(", ")}.`
    : "No previous words.";

  const prompt = `Produce a word of the day style word that would be intereseting to a user of the following profile. Produce a word that is real and don't change the definition at all to suit the user. The word should naturally interest the user. Make the word uncommon and specific to the user profile and their interests.
${previousWordsText}
User content: ${userContent}
The word should be unique and not in the previous words list.
Return it in this exact format:
WORD: [the word]
DEFINITION: [the definition]`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: 100,
    temperature: 0.7,
  });

  const generatedContent = response.choices[0].message.content;
  if (!generatedContent) {
    throw new Error("OpenAI returned empty content");
  }

  // Parse response
  const wordMatch = generatedContent.match(/WORD:\s*(.*?)(?:\n|$)/i);
  const definitionMatch = generatedContent.match(
    /DEFINITION:\s*(.*?)(?:\n|$)/i
  );

  const word = wordMatch?.[1]?.trim();
  const definition = definitionMatch?.[1]?.trim();

  if (!word || !definition) {
    throw new Error(
      `Failed to parse word and definition from API response: ${generatedContent}`
    );
  }

  return { word, definition };
}
