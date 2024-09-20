import bcrypt from "bcrypt";
import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const userId = await createUser(email, password);
  let status = 401;
  let sessionId = null;

  if (userId) {
    sessionId = await createSession(userId);
    status = 200;
  }

  return {
    status,
    sessionId,
  };
});

const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await supabase
    .from("users")
    .insert({
      email_address: email,
      password: hashedPassword,
    })
    .select("user_id")
    .single()
    .then((user) => user.data?.user_id);

  await supabase.from("generation_token_counts").insert({ user_id: userId });

  return userId;
};

const createSession = async (userId: number) => {
  const sessionId = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
    })
    .select("session_id")
    .single()
    .then((session) => session.data?.session_id);

  return sessionId;
};
