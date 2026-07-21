import { createAuthClient } from "better-auth/client";
import { polarClient } from "@polar-sh/better-auth/client";
import { env } from "process";

export const authClient = createAuthClient({
    plugins: [polarClient()],
});

// signIn With Google
export const signInWithGoogle = async () => {
    const result = await authClient.signIn.social({
        provider: "google",
        newUserCallbackURL: "/dashboard",
        callbackURL: "/dashboard",
    });

    console.log("result", result);
};

// checkout
export const checkout = async () => {
    const checkoutResult = await authClient.checkout();
    console.log("checkoutResult", checkoutResult);
}