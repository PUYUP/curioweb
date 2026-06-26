import { redirect, type Actions } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { getProfileByUserId } from '@/lib/server/db/factories/profle.factory';

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }
    const profile = await getProfileByUserId(locals.user.id);
    return { user: locals.user, profile };
};

export const _actions: Actions = {
    signOut: async (event) => {
        await auth.api.signOut({
            headers: event.request.headers
        });
        return redirect(302, '/auth/login');
    }
};