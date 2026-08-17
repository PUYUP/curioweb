import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProfileByUserId } from '@/lib/server/db/factories/profle.factory';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        redirect(302, '/auth/login');
    }

    const profile = await getProfileByUserId(event.locals.user.id);

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

    return {
        user: event.locals.user,
        profile: profile,
        challenges: await challenges.json()
    };
};