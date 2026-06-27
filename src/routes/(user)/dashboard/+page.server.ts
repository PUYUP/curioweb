import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProfileByUserId } from '@/lib/server/db/factories/profle.factory';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, fetch }) => {
    if (locals.user?.id) {
        const profile = await getProfileByUserId(locals.user.id);

        if (profile && profile.interest.trim() == '') {
            return redirect(302, '/dashboard/onboarding');
        }
    }
};

export const actions: Actions = {
    // update profile
    updateProfile: async ({ request, locals }) => {
        const data = await request.formData();
        const interest = data.get('interest')?.toString() ?? '';

        if (!interest || interest.trim() === '') {
            return fail(400, { message: 'Interest is required' });
        }

        console.log(locals.user);
    },

    signOut: async (event) => {
        await auth.api.signOut({
            headers: event.request.headers
        });
        return redirect(302, '/auth/login');
    }
};