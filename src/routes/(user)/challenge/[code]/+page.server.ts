import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { challengeFactory } from '@/lib/server/db/factories/challenge.factory';

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    // getting challenge
    const challenge = await challengeFactory.getByCode(params.code);
    console.log(JSON.stringify(challenge, null, 2));
    if (!challenge) {
        return fail(404, { message: 'Challenge not found' });
    }

    // checking authorization
    if (challenge.userId !== locals.user.id) {
        return fail(403, { message: 'Forbidden' });
    }

    return { user: locals.user, challenge: challenge };
};

export const actions: Actions = {
    submit: async ({ request, locals, params }) => {
        if (!locals.user) {
            return redirect(302, '/auth/login');
        }
        const formData = await request.formData();
        const content = formData.get('content');

        // validators
        if (!content || typeof content !== 'string' || content.length < 10) {
            return fail(400, { message: 'Content must be at least 10 characters long' });
        }

        console.log(content);
        return { message: 'success' };
    },
};
