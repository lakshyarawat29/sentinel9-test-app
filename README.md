# Sentinel9 Test Application

A simple Node.js + Express + PostgreSQL application for testing Sentinel-9 SRE Detective.

## Setup

\`\`\`bash
npm install
npm start
\`\`\`

## Endpoints

- \`GET /health\` - Health check with database connectivity test
- \`GET /api/users\` - Fetch users from database
```

**File: `.gitignore`**

```
node_modules/
.env
*.log
.DS_Store
```

### Step 1.4: Commit Initial Working Code

```bash
git add .
git commit -m "Initial commit: Working app with healthy database pool config"
git push origin main