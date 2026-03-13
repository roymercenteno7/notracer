import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: ({ cookies }) => {
        // Clear the session cookie
        cookies.delete('session', { path: '/' });

        // Redirect to login or home
        throw redirect(302, '/login');
    }
};
