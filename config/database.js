module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'myapp_dev',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',

      // Connection pool settings
      pool: {
        min: 1,
        max: 2, // Reduced from 20 for cost optimization
        acquireTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
      },
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,

      ssl: { rejectUnauthorized: false },

      pool: {
        min: 1,
        max: 2, // Reduced from 20 for cost optimization - CAUSES TIMEOUTS!
        acquireTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
      },
    },
  },
};
