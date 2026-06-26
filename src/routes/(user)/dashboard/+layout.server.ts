import { redirect, type Actions } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: LayoutServerLoad = ({ locals }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }
    return { user: locals.user };
};

export const _actions: Actions = {
    signOut: async (event) => {
        await auth.api.signOut({
            headers: event.request.headers
        });
        return redirect(302, '/auth/login');
    }
};