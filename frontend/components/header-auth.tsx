import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <p className="font-black text-lg uppercase tracking-wide">
        Hey <span className="text-secondary">{user.email}</span>!
      </p>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link
          href="/sign-in"
          className="text-foreground font-black uppercase tracking-wide hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link
          href="/sign-up"
          className="text-foreground font-black uppercase tracking-wide hover:text-primary transition-colors"
        >
          Sign up
        </Link>
      </Button>
    </div>
  );
}
