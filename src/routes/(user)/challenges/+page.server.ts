import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        redirect(302, '/auth/login');
    }

    const params = new URLSearchParams({
        limit: '30',
        offset: '0'
    });

    // getting challenges
    const challenges = await event.fetch(`/api/challenges?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return { user: event.locals.user, challenges: await challenges.json() };
};