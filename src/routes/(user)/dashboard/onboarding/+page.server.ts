import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { upsertProfile } from '@/lib/server/db/factories/profle.factory';

export const load: PageServerLoad = async ({ locals }) => {

};

export const actions: Actions = {
    // update profile
    updateProfile: async ({ request, locals }) => {
        const data = await request.formData();
        const interest = data.get('interest')?.toString() ?? '';
        const languageCode = data.get('languageCode')?.toString() ?? '';

        if (!interest || interest.trim() === '') {
            return fail(400, { message: 'Interest is required' });
        }

        if (!languageCode || languageCode.trim() === '') {
            return fail(400, { message: 'Language is required' });
        }

        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        await upsertProfile(locals.user.id, { interest, languageCode });

        return redirect(302, '/dashboard');
    }
};