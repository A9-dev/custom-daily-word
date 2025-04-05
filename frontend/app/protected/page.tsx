import { createClient } from "@/utils/supabase/server";
import { WordOfTheDay } from "@/utils/types";
import { getWordOfTheDay } from "@/utils/word_of_the_day";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const word: WordOfTheDay | null = await getWordOfTheDay(supabase);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      {/* Display the word of the day information */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Word of the Day</h1>
        <div className="flex gap-4">
          <InfoIcon size={24} />
          <p>
            {word ? (
              <>
                <strong>{word.word}</strong>: {word.definition}
              </>
            ) : (
              "No word of the day available."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
