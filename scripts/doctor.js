/*
 Deployment Doctor
 - Validates required environment variables
 - Prints safe diagnostics (with secrets redacted)
 - Attempts MongoDB connection and reports detailed errors
 - Exits non‑zero on failure so Render logs capture the reason
*/

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load .env when running locally (Render injects envs by itself)
const envPath = process.env.DOTENV_PATH || path.resolve(process.cwd(), '.env');
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.log('No .env file loaded (this is OK on Render). Looking for file at:', envPath);
} else {
  console.log('Loaded .env from:', envPath);
}

function maskSecret(value, { keepStart = 2, keepEnd = 2 } = {}) {
  if (!value) return '<empty>';
  const str = String(value);
  if (str.length <= keepStart + keepEnd) return '*'.repeat(Math.max(4, str.length));
  return `${str.slice(0, keepStart)}${'*'.repeat(str.length - keepStart - keepEnd)}${str.slice(-keepEnd)}`;
}

function redactMongoURI(uri) {
  if (!uri) return '<missing>';
  try {
    // Replace credentials if present: mongodb+srv://user:pass@host/db?...
    return uri.replace(/(mongodb\+srv:\/\/)([^:@/]*)(?::([^@/]*))?@/i, (_, p1, user, pass) => {
      const u = user ? maskSecret(user, { keepStart: 1, keepEnd: 0 }) : '';
      const pw = pass ? ':' + maskSecret(pass, { keepStart: 1, keepEnd: 1 }) : '';
      return `${p1}${u}${pw}@`;
    });
  } catch {
    return '<unparsable-uri>';
  }
}

function heading(title) {
  console.log(`\n===== ${title} =====`);
}

async function main() {
  const start = Date.now();
  heading('Deployment Doctor');
  console.log('Node version:', process.version);
  console.log('Platform:', process.platform, process.arch);

  heading('Environment Variables (sanitized)');
  const required = ['MONGODB_URI', 'JWT_SECRET', 'SESSION_SECRET'];
  const optional = ['PORT', 'NODE_ENV', 'JWT_EXPIRES_IN'];

  const envReport = {};
  for (const key of [...required, ...optional]) {
    const val = process.env[key];
    envReport[key] = key === 'MONGODB_URI' ? redactMongoURI(val) : maskSecret(val);
  }
  console.table(envReport);

  // Validate required envs
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('❌ Missing required env vars:', missing.join(', '));
    process.exit(1);
  }

  // Quick checks
  const uri = process.env.MONGODB_URI;
  if (/^".*"$/.test(uri)) {
    console.warn('⚠️ MONGODB_URI appears to be wrapped in quotes. Remove the surrounding "" in your Render environment.');
  }
  if (/\s/.test(uri)) {
    console.warn('⚠️ MONGODB_URI contains whitespace. This may break the connection.');
  }
  if (/:(123)@/.test(uri)) {
    console.warn('⚠️ Using an extremely weak MongoDB password ("123"). Change it in Atlas immediately.');
  }

  heading('Testing MongoDB connectivity');
  console.log('Connecting to:', redactMongoURI(uri));

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connection OK');
    console.log('DB name:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection FAILED');
    console.error('Name   :', err.name);
    console.error('Message:', err.message);
    if (err.code) console.error('Code   :', err.code);
    if (err.reason) console.error('Reason :', err.reason);
    if (err.cause) console.error('Cause  :', err.cause);
    console.error('Hint   : Verify MONGODB_URI, Network Access (0.0.0.0/0) and database user/password.');
    process.exit(1);
  } finally {
    try { await mongoose.connection.close(); } catch {}
  }

  heading('Doctor result');
  console.log('✅ All checks passed in', (Date.now() - start) + 'ms');
  process.exit(0);
}

main();
