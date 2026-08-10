import { db } from "../index";
import { user } from "../auth.schema";
import { eq } from "drizzle-orm/sql";

// --------
// get user by email
// --------

export const getUserByEmail = async (email: string) => {
    const res = await db.select().from(user).where(eq(user.email, email)).limit(1);
    return res.length > 0 ? res[0] : null;
}
