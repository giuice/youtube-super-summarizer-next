import { Pool, PoolClient } from 'pg';

// Environment variables should be set up for these values in production
const NEON_CONNECTION_STRING = process.env.NEON_CONNECTION_STRING || 'postgresql://user:password@your-neon-endpoint.neon.tech/neondb?sslmode=require';

// Create a connection pool
const pool = new Pool({
  connectionString: NEON_CONNECTION_STRING,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Log connection events for debugging
pool.on('error', (err) => {
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