const express = require('express');
const { Pool } = require('pg');
const dbConfig = require('../config/database');
const cache = require('./cache');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database pool
const env = process.env.NODE_ENV || 'development';
const pool = new Pool(dbConfig[env].connection.pool);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    // Add cache stats
    res.json({ 
      status: 'healthy', 
      timestamp: new Date(),
      cacheSize: cache.size()
    });
  } catch (err) {
    console.error('Database health check failed:', err);
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

// API endpoint with caching
app.get('/api/users', async (req, res) => {
  const cacheKey = 'users:all';
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ users: cached, cached: true });
  }
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users LIMIT 10');
    client.release();
    
    // Cache the result (with memory leak bug - no cleanup!)
    cache.set(cacheKey, result.rows, 60000); // 1 minute TTL
    
    res.json({ users: result.rows, cached: false });
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Environment: \${env}\`);
  console.log(\`Database pool configured: min=\${pool.options.min}, max=\${pool.options.max}\`);
});

module.exports = app;
