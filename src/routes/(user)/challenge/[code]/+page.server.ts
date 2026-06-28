import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }
    return { user: locals.user };
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
