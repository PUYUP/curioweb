import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient();

// signIn With Google
export const signInWithGoogle = async () => {
    await authClient.signIn.social({
        provider: "google",
        newUserCallbackURL: "/dashboard",
        callbackURL: "/dashboard",
    });
};

