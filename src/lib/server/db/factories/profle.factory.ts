import type { ProfileData } from "@/lib/types/models";
import { db } from "../index";
import { profile } from "../schemas/schema";
import { eq } from "drizzle-orm/sql";

// --------
// getting user profile
// --------

export const getProfileByUserId = async (userId: string) => {
    const res = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);
    return res.length > 0 ? res[0] : null;
}

// --------
// upserting user profile
// --------

export const upsertProfile = async (userId: string, profileData: ProfileData) => {
    const existingProfile = await getProfileByUserId(userId);
    if (existingProfile) {
        const result = await db.update(profile).set(profileData).where(eq(profile.userId, userId));
        return result;
    } else {
        const result = await db.insert(profile).values({ ...profileData, userId });
        return result;
    }
}