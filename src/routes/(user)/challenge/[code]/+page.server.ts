import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { challengeFactory } from '@/lib/server/db/factories/challenge.factory';
import type { SaveAnswerInput, SaveDraftInput } from '@/lib/types/models';

const getChallenge = async (code: string, userId: string) => {
    // getting challenge
    const challenge = await challengeFactory.getByCode(code);
    if (!challenge) {
        throw fail(404, { message: 'Challenge not found' });
    }

    // checking authorization
    if (challenge.userId !== userId) {
        throw fail(403, { message: 'Forbidden' });
    }

    return challenge;
}

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }

    const challenge = await getChallenge(params.code, locals.user.id);
    const answer = await challengeFactory.getAnswerByCode(params.code, locals.user.id);

    return { user: locals.user, challenge: challenge, answer: answer };
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

        const challenge = await getChallenge(params.code, locals.user.id);
        const payload: SaveAnswerInput = {
            userId: locals.user.id,
            challengeId: challenge.id,
            content: content,
            status: 'submitted',
        };

        try {
            const answer = await challengeFactory.saveAnswer(payload);
            return { message: 'success', answer: answer };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Internal Server Error' });
        }
    },

    draft: async ({ request, params, locals }) => {
        if (!locals.user) {
            return redirect(302, '/auth/login');
        }

        const formData = await request.formData();
        const content = formData.get('content')?.toString() ?? '';

        const challenge = await getChallenge(params.code, locals.user.id);
        const payload: SaveAnswerInput = {
            userId: locals.user.id,
            challengeId: challenge.id,
            content: content,
            status: 'draft',
        };

        try {
            const answer = await challengeFactory.saveAnswer(payload);
            return { message: 'success', answer: answer };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Internal Server Error' });
        }
    }
};
