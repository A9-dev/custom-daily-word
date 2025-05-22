import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center justify-center gap-2 p-4 max-w-sm mx-auto bg-card border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex-1 flex flex-col min-w-64 max-w-sm mx-auto bg-card border-4 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2 rotate-1">Sign up</h1>
        <p className="text-lg font-medium">
          Already have an account?{" "}
          <Link className="text-primary hover:text-primary/80 transition-colors font-black uppercase" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-4 mt-8">
          <Label htmlFor="email" className="text-lg font-bold uppercase rotate-1">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password" className="text-lg font-bold uppercase rotate-1">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
