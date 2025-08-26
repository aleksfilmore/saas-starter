/*
Post-deploy verification script.
Usage (PowerShell):
  $env:DEPLOY_URL="https://your-production-url.com"; node scripts\postdeploy-verify.js
Optional env:
  DEPLOY_URL - required, base URL of deployed site (no trailing slash)
  DEBUG_KEY - optional, if you added the debug endpoint
This script POSTs to /api/auth/signin and /api/login with the seeded admin credentials and reports results.
*/

const DEPLOY_URL = process.env.DEPLOY_URL;
if (!DEPLOY_URL) {
  console.error('DEPLOY_URL is required. Set it and re-run.');
  process.exit(2);
}

const creds = {
  email: 'system_admin@ctrlaltblock.com',
  password: 'Al3xandrescu1903?'
};

async function testEndpoint(path, includeCredentials = false) {
  const url = `${DEPLOY_URL}${path}`;
  console.log(`POST ${url}`);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds),
      redirect: 'manual'
    });

    const text = await res.text();
    const setCookie = res.headers.get('set-cookie') || res.headers.get('Set-Cookie') || null;

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      setCookie: !!setCookie,
      body: text
    };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

(async () => {
  console.log('Running post-deploy verification...');

  const routes = ['/api/auth/signin', '/api/login'];
  for (const r of routes) {
    const result = await testEndpoint(r);
    console.log(`Result for ${r}: ok=${result.ok} status=${result.status} setCookie=${result.setCookie}`);
    if (!result.ok) console.log('Response body / error:', result.body || result.error);
    // small delay
    await new Promise((res) => setTimeout(res, 500));
  }

  // optional: debug endpoint presence
  if (process.env.DEBUG_KEY) {
    const debugUrl = `${DEPLOY_URL}/api/debug/users`;
    console.log(`Checking debug endpoint: GET ${debugUrl}`);
    try {
      const res = await fetch(debugUrl, { headers: { 'X-Debug-Key': process.env.DEBUG_KEY } });
      console.log('Debug endpoint status:', res.status);
      const json = await res.json();
      console.log('Debug payload:', JSON.stringify(json));
    } catch (e) {
      console.log('Debug endpoint check failed:', String(e));
    }
  }

  console.log('Done. If sign-in endpoints returned ok and set-cookie=true for at least one, session cookies are being set by the server.');
})();
