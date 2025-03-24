import { Pool, PoolClient } from 'pg';

const NEON_CONNECTION_STRING ="postgresql://neondb_owner:npg_6RDoITvmCP8V@ep-quiet-tree-a5a8nlpk-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require" // process.env.NEON_CONNECTION_STRING;

if (!NEON_CONNECTION_STRING) {
  throw new Error('NEON_CONNECTION_STRING environment variable is not set');
}

// Create a connection pool
const pool = new Pool({
  connectionString: NEON_CONNECTION_STRING,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Log connection events for debugging
pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

// Helper function to get a client from the pool
export const getClient = async (): Promise<{ client: PoolClient, done: () => void }> => {
  const client = await pool.connect();
  const done = () => client.release();
  return { client, done };
};

// Helper function to run a query with automatic client handling
export const query = async (text: string, params: any[] = []): Promise<any> => {
  const { client, done } = await getClient();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    done();
  }
};

// Export the connection pool
const neon = {
  query,
  getClient
};

export default neon;
