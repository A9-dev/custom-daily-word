import { createClient } from "@/utils/supabase/server";
import { WordOfTheDay } from "@/utils/types";
import { getWordOfTheDay } from "@/utils/word_of_the_day";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    "bg-card border-4 border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)] -rotate-2 hover:rotate-0 transition-transform";

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <div className="space-y-12">
        {/* Display the word of the day information */}
        <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto">
          <Card className={cardStyles}>
            <CardTitle className="text-5xl font-black uppercase tracking-tight rotate-1 text-primary mb-6">
              Word of the Day
            </CardTitle>
            <CardDescription className="text-2xl font-black tracking-wide">
              {word?.word || "No word found"}
            </CardDescription>
            <CardContent className="p-0 mt-6">
              <p className="text-xl font-medium">
                {word?.definition || "No description found"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12 h-0.5 bg-black rotate-1" />

        {/* Profile Form */}
        <Card className={cardStyles}>
          <CardTitle className="text-5xl font-black uppercase tracking-tight rotate-1 text-secondary mb-6">
            Your Profile
          </CardTitle>
          <CardContent className="p-0 mt-6">
            <form action={updateProfile} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Label
                  htmlFor="content"
                  className="text-2xl font-black uppercase tracking-wide rotate-1"
                >
                  About You
                </Label>
                <Textarea
                  name="content"
                  placeholder="Write something awesome about yourself!"
                  defaultValue={profile?.content || ""}
                  className="text-lg"
                />
              </div>
              <Button
                type="submit"
                className="bg-accent text-accent-foreground text-xl py-6"
              >
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
