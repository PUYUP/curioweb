import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { _actions } from './+layout.server';

export const load: PageServerLoad = async ({ locals }) => {
    console.log('loadd....')
};

export const actions: Actions = {
    signOut: async (event) => {
        await _actions.signOut(event);
        return redirect(302, '/auth/login');
    }
};