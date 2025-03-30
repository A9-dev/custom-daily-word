import { SupabaseClient } from "@supabase/supabase-js";
import { WordOfTheDay } from "./types";

const getWordOfTheDay = async (
  supabase: SupabaseClient
): Promise<WordOfTheDay | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    const userId = user.id;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const { data: words, error } = await supabase
      .from("words")
      .select("*")
      .eq("user", userId)
      .gte("created_at", today)
      .limit(1);

    if (error) throw error;

    if (words.length > 0) {
      return words[0] as WordOfTheDay;
    }

    return {
      id: 0,
      created_at: today,
      user: userId,
      word: "TestWord",
      definition: "No word was found for today, this is the default.",
    };
  } catch (err: any) {
    console.error(err);
    return null;
  }
};

export { getWordOfTheDay };
