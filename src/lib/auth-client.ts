import { createAuthClient } from "better-auth/client";
import { polarClient } from "@polar-sh/better-auth/client";

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
    const checkoutResult = await authClient.checkout({
        products: ["7582abd1-8946-43e3-bc5b-64e9bdd1392c"],
    });

    console.log("checkoutResult", checkoutResult);
}