import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = (event) => {
    if (!event.locals.user) {
        return redirect(302, '/auth/login');
    }
    return { user: event.locals.user };
};

export const actions: Actions = {
    signOut: async (event) => {
        await auth.api.signOut({
            headers: event.request.headers
        });
        return redirect(302, '/auth/login');
    }
};
