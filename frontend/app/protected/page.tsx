import { createClient } from "@/utils/supabase/server";
import { WordOfTheDay } from "@/utils/types";
import { getWordOfTheDay } from "@/utils/word_of_the_day";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { updateProfile } from "../actions/profile";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const word: WordOfTheDay | null = await getWordOfTheDay(supabase);

  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("content")
    .eq("user_id", user.id)
    .single();

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

      {/* Profile Form */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <form action={updateProfile} className="flex flex-col gap-4 max-w-md">
          <Input
            name="content"
            defaultValue={profile?.content || ""}
            placeholder="Enter your profile content"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
