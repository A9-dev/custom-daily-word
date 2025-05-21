import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64 max-w-sm mx-auto bg-card border-2 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] -rotate-1">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2 rotate-1">Sign in</h1>
      <p className="text-lg font-medium">
        Don't have an account?{" "}
        <Link className="text-primary hover:text-primary/80 transition-colors font-black uppercase" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-4 mt-8">
        <Label htmlFor="email" className="text-lg font-bold uppercase rotate-1">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-lg font-bold uppercase rotate-1">Password</Label>
          <Link
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors -rotate-1"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
