import { createClient } from '@libsql/client';

const url = import.meta.env.VITE_TURSO_DB_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

export const turso = url ? createClient({
    url,
    authToken,
}) : null;
