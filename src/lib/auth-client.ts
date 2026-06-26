import { createAuthClient } from "better-auth/client";
import type { ProfileData } from "./types/models";

export const authClient = createAuthClient();

// signIn With Google
export const signInWithGoogle = async () => {
    const result = await authClient.signIn.social({
        provider: "google",
        newUserCallbackURL: "/dashboard",
        callbackURL: "/dashboard",
    });

    console.log("result", result);

};

