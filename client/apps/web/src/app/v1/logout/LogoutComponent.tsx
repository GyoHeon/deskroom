'use client';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export async function LogoutComponent() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  const router = useRouter();
  if (!error) {
    router.push('/v1/login')
  }
  return (<></>)
}
