import { SupabaseClient } from "@supabase/supabase-js";
import { WordOfTheDay } from "./types";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Retrieves or generates the word of the day for the current user
 * @param supabase - Supabase client instance
 * @returns Promise resolving to the word of the day or null if an error occurs
 */
export async function getWordOfTheDay(
  supabase: SupabaseClient,
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
      previousWords?.map((item) => item.word) || [],
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
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Generates a new unique word using OpenAI with structured output
 */
async function generateNewWord(
  date: string,
  userContent: string,
  previousWords: string[],
): Promise<{ word: string; definition: string }> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not found in environment variables");
  }

  const previousWordsText = previousWords.length
    ? `Previous words: ${previousWords.join(", ")}.`
    : "No previous words.";

  const prompt = `Produce a unique 'word of the day' that would be interesting to this user, based on their profile. Do not repeat any previous words. Choose an uncommon but valuable word that would expand someone's vocabulary.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-0613", // or "gpt-3.5-turbo-0613"
    messages: [
      {
        role: "system",
        content:
          "You are a vocabulary expert. You are a helpful assistant that returns unique and interesting words of the day.",
      },
      {
        role: "user",
        content: `${prompt}\n\n${previousWordsText}\n\nUser content: ${userContent}`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "return_word",
          description: "Returns a word and its definition",
          parameters: {
            type: "object",
            properties: {
              word: {
                type: "string",
                description: "The unique word being presented",
              },
              definition: {
                type: "string",
                description: "The definition of the word",
              },
            },
            required: ["word", "definition"],
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "return_word" } },
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.function.name !== "return_word") {
    throw new Error("Failed to get structured function call from OpenAI");
  }

  const args = JSON.parse(toolCall.function.arguments);
  const { word, definition } = args;

  if (!word || !definition) {
    throw new Error("Missing word or definition in structured response");
  }

  return { word, definition };
}
