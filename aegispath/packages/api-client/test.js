const { AegisPathClient, InMemoryTokenStore } = require('./index.js');
const assert = require('assert');

async function testClient() {
  const mockFetch = async (url, options) => {
    return {
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ status: 'ok', url, method: options.method })
    };
  };

  const client = new AegisPathClient({
    apiUrl: 'http://localhost:8000',
    fetch: mockFetch
  });

  assert(typeof client.login === 'function', 'login should be a function');
  assert(typeof client.getPolicy === 'function', 'getPolicy should be a function');
  assert(typeof client.approvePlan === 'function', 'approvePlan should be a function');
  assert(typeof client.verifyAudit === 'function', 'verifyAudit should be a function');
  assert(typeof client.getEvidence === 'function', 'getEvidence should be a function');
  assert(typeof client.getPlanner === 'function', 'getPlanner should be a function');
  assert(typeof client.replayAttack === 'function', 'replayAttack should be a function');

  const res = await client.getPolicy();
  assert(res.status === 'ok', 'mock request should return ok');

  console.log('[OK] @aegispath/api-client passed Node.js integration tests.');
}

testClient().catch(err => {
  console.error('[FAIL] api-client test failed:', err);
  process.exit(1);
});
