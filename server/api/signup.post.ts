import bcrypt from "bcrypt";
import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const { isValid, userId } = await validateUser(email, password);
  if (isValid) {
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

const validateUser = async (email: string, password: string) => {
  const user = await supabase
    .from("users")
    .select()
    .eq("email_address", email)
    .single();

  if (user.data !== null) {
    const dbPassword = user.data.password;
    const isValid = await bcrypt.compare(password, dbPassword);
    const userId = user.data.user_id;

    return { isValid, userId };
  }

  return { isValid: false, userId: null };
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
