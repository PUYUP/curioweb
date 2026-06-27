import { redirect, type Actions } from '@sveltejs/kit';
import { getProfileByUserId } from '@/lib/server/db/factories/profle.factory';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
    if (!locals.user) {
        return redirect(302, '/auth/login');
    }
    const profile = await getProfileByUserId(locals.user.id);

    const params = new URLSearchParams({
        limit: '5',
        offset: '0'
    });

    // getting challenges
    const challenges = await fetch(`/api/challenges?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return { user: locals.user, profile, challenges: await challenges.json() };
};
