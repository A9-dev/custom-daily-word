"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  const [word, setWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userContent, setUserContent] = useState<string>("");

  const handleGenerateWordOfTheDay = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generateWord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userContent,
          previousWords: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate word");
      }

      const newWord = await response.json();
      if (newWord) {
        setWord(newWord.word);
        setDefinition(newWord.definition);
      } else {
        setWord("No word generated");
        setDefinition("No definition available");
      }
    } catch (error) {
      console.error("Error generating word of the day:", error);
      setWord("Error generating word");
      setDefinition("Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-4xl space-y-12">
      <Card className="bg-card border-4 border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="text-5xl font-black uppercase tracking-tight text-primary mb-6">
            Word of the Day Tester!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col gap-4">
            <Label
              htmlFor="user-content-input"
              className="text-xl font-bold italic tracking-wide"
            >
              Tell me about yourself!
            </Label>
            <textarea
              id="user-content-input"
              value={userContent}
              onChange={(e) => setUserContent(e.target.value)}
              placeholder="Write something about yourself or your interests..."
              className="text-lg resize-none border border-gray-300 rounded-md p-2"
            />
          </div>

          <Button
            onClick={handleGenerateWordOfTheDay}
            disabled={loading}
            className="bg-accent text-accent-foreground text-xl py-4 w-full"
          >
            {loading ? "Thinking..." : "Gimme a word"}
          </Button>
        </CardContent>
      </Card>
      {word && (
        <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto">
          <Card className="bg-card border-4 border-black p-8 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
            <CardTitle className="text-5xl font-black uppercase tracking-tight text-primary mb-6">
              Word of the Day
            </CardTitle>
            <CardDescription className="text-2xl font-black tracking-wide">
              {word}
            </CardDescription>
            <CardContent className="p-0 mt-6">
              <p className="text-xl font-medium">
                {definition || "No description found"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      <div>
        <p className="mt-20 font-black text-lg uppercase tracking-wide bg-white border-4 border-black rounded-3xl px-3 py-1 rotate-1 text-secondary text-center shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          Sign up to save your profile, and get a new word every day!
        </p>
      </div>
    </div>
  );
}
