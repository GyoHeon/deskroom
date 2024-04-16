import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (!error) {
    redirect('/v1/login')
  }

  return (
    <></>
  )
}

export default Logout;
