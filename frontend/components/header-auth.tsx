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
    <div className="flex w-full justify-between items-center">
      <p className="font-black text-lg uppercase tracking-wide bg-white border-4 border-black rounded-3xl px-3 py-1 rotate-1">
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
        <Link href="/sign-in" className="link-button">
          Sign in
        </Link>
      </Button>
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-up" className="link-button">
          Sign up
        </Link>
      </Button>
    </div>
  );
}
