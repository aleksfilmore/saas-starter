#!/usr/bin/env node
// End-to-end smoke test for wall functionality: login -> create post -> react -> comment -> fetch stats & preview
const assert = (cond, msg) => { if(!cond) { console.error('ASSERT FAIL:', msg); process.exit(1);} };

const BASE = 'http://localhost:3001';
const ADMIN_EMAIL = 'system_admin@ctrlaltblock.com';
const ADMIN_PASSWORD = 'SecureAdmin2024!';

async function main(){
  // Sign in
  const signinRes = await fetch(`${BASE}/api/auth/signin`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }) });
  const setCookie = signinRes.headers.get('set-cookie');
  assert(setCookie && setCookie.includes('auth_session='), 'No auth_session cookie returned');
  console.log('Login status:', signinRes.status);
  const cookie = setCookie.split(';')[0];

  // Create post
  // Avoid long numeric sequences (phone regex in moderation would flag). Use random base36.
  const content = 'Automated wall flow test post ' + Math.random().toString(36).slice(2,10);
  const postRes = await fetch(`${BASE}/api/wall/post`, { method:'POST', headers:{'content-type':'application/json', cookie}, body: JSON.stringify({ content, isAnonymous:true }) });
  const postJson = await postRes.json();
  console.log('Create post status:', postRes.status, 'response:', postJson.message);
  assert(postRes.status === 200 && postJson.post && postJson.post.id, 'Failed to create wall post');
  const postId = postJson.post.id;

  // React to post
  const reactRes = await fetch(`${BASE}/api/wall/react`, { method:'POST', headers:{'content-type':'application/json', cookie}, body: JSON.stringify({ postId, reactionType:'resonate' }) });
  const reactJson = await reactRes.json();
  console.log('React status:', reactRes.status, 'action:', reactJson.action);
  assert(reactRes.status === 200, 'Reaction failed');

  // Comment on post
  const commentRes = await fetch(`${BASE}/api/wall/comments`, { method:'POST', headers:{'content-type':'application/json', cookie}, body: JSON.stringify({ postId, content:'Test comment '+Date.now() }) });
  const commentJson = await commentRes.json();
  console.log('Comment status:', commentRes.status, 'commentId:', commentJson.comment?.id);
  assert(commentRes.status === 200, 'Comment failed');

  // Fetch stats
  const statsRes = await fetch(`${BASE}/api/wall/stats`, { headers:{ cookie } });
  const statsJson = await statsRes.json();
  console.log('Stats status:', statsRes.status, 'totalPosts:', statsJson.totalPosts);
  assert(statsRes.status === 200, 'Stats failed');

  // Fetch preview
  const previewRes = await fetch(`${BASE}/api/wall/preview?limit=3`, { headers:{ cookie } });
  const previewJson = await previewRes.json();
  console.log('Preview status:', previewRes.status, 'posts:', previewJson.posts?.length);
  assert(previewRes.status === 200, 'Preview failed');

  console.log('✅ Wall flow smoke test passed');
}

main().catch(e=>{ console.error('Test error:', e); process.exit(1); });
