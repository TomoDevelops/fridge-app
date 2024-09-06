import bcrypt from "bcrypt";
import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const userId = await createUser(email, password);

  if (userId) {
    const sessionId = await createSession(userId);
    return {
      status: 200,
      sessionId,
    };
  }

  return {
    status: 401,
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
  console.log(userId);

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
