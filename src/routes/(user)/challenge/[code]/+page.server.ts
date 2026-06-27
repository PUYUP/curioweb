import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }
    return { user: locals.user };
};

export const actions: Actions = {

};
