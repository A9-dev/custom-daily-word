import { createClient } from "@/utils/supabase/server";
import { WordOfTheDay } from "@/utils/types";
import { getWordOfTheDay } from "@/utils/word_of_the_day";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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

  const cardStyles =
    "bg-[rgba(255,255,255,0.2)] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.3)]";

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Display the word of the day information */}
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle>Word of the Day</CardTitle>
            <CardDescription>
              Expand your vocabulary with a new word every day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <InfoIcon className="text-primary h-5 w-5 mt-0.5" />
              <div className="space-y-1">
                {word ? (
                  <>
                    <p className="font-semibold text-xl">{word.word}</p>
                    <p className="text-muted-foreground">{word.definition}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">
                    No word of the day available.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Profile Form */}
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself to improve word generation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-4">
              <Textarea
                name="content"
                defaultValue={profile?.content || ""}
                placeholder="Tell us about yourself..."
                className="min-h-[120px] resize-none bg-transparent"
              />
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
