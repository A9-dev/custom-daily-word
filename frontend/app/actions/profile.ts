'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const content = formData.get('content') as string;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', user.id)
    .single();

  if (existingProfile) {
    // Update existing profile
    await supabase
      .from('profiles')
      .update({ content })
      .eq('user_id', user.id);
  } else {
    // Create new profile
    await supabase
      .from('profiles')
      .insert([{ user_id: user.id, content }]);
  }

  revalidatePath('/protected');
}
