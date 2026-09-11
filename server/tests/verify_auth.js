const http = require('http');
const app = require('../src/server');

/**
 * Lightweight Standalone Test Suite for CivicPulse Auth API
 */
async function runTests() {
  console.log('🧪 Starting CivicPulse API Verification Tests...');

  // Start HTTP server on temporary port
  const PORT = 5099;
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);

    try {
      // Test 1: Health Check Endpoint
      const healthRes = await makeRequest('/api/health', 'GET');
      if (healthRes.status === 200 && healthRes.data.status === 'ok') {
        console.log('✅ PASS: /api/health endpoint is working');
      } else {
        throw new Error(`Health check failed with status ${healthRes.status}`);
      }

      // Test 2: Auth ME route requires token
      const meRes = await makeRequest('/api/auth/me', 'GET');
      if (meRes.status === 401) {
        console.log('✅ PASS: /api/auth/me rejects unauthenticated requests (401)');
      } else {
        throw new Error(`/api/auth/me returned status ${meRes.status} instead of 401`);
      }

      // Test 3: Logout endpoint
      const logoutRes = await makeRequest('/api/auth/logout', 'POST');
      if (logoutRes.status === 200 && logoutRes.data.success === true) {
        console.log('✅ PASS: /api/auth/logout endpoint working');
      } else {
        throw new Error(`Logout failed with status ${logoutRes.status}`);
      }

      console.log('🎉 All verification tests PASSED successfully!');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('❌ FAIL: Test failed:', err.message);
      server.close(() => process.exit(1));
    }
  });
}

function makeRequest(path, method, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5099,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = rawData ? JSON.parse(rawData) : {};
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, data: rawData });
          }
        });
      }
    );

    req.on('error', (e) => reject(e));
    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

runTests();
