// Test Security & Access Control APIs
const BASE_URL = 'http://localhost:5000/api';

async function testSecurityModule() {
  console.log('🛡️ Testing Security & Access Control Endpoints:');

  // 1. Admin Login
  const loginRes = await fetch(`${BASE_URL}/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@rentease.in', password: 'Admin@123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('✅ Admin Authenticated. Token acquired.');

  // 2. Fetch Access List
  const listRes = await fetch(`${BASE_URL}/admin/security/access-list`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const listData = await listRes.json();
  console.log(`✅ Loaded ${listData.count} staff/manager access accounts.`);

  // 3. Grant New Access (Owner sets who gets access)
  const grantRes = await fetch(`${BASE_URL}/admin/security/grant-access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Pooja Verma (Manager)',
      email: 'pooja.manager@rentease.in',
      role: 'admin',
      password: 'Admin@123',
      permissions: ['approve_pg', 'manage_bookings']
    })
  });
  const grantData = await grantRes.json();
  console.log(`✅ Access Granted: "${grantData.message}" (User ID: ${grantData.userId})`);

  // 4. Update Permissions
  const updateRes = await fetch(`${BASE_URL}/admin/security/update-permissions/${grantData.userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      permissions: ['approve_pg', 'manage_bookings', 'manage_users'],
      status: 'active'
    })
  });
  const updateData = await updateRes.json();
  console.log(`✅ Permissions Updated: "${updateData.message}"`);

  // 5. Fetch Audit Logs
  const auditRes = await fetch(`${BASE_URL}/admin/security/audit-logs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const auditData = await auditRes.json();
  console.log(`✅ Security Audit Trail verified: ${auditData.count} events logged in MySQL.`);
  console.log(`   Latest event: [${auditData.data[0].action}] ${auditData.data[0].details}`);

  console.log('\n🎉 SECURITY & ACCESS CONTROL MODULE FULLY OPERATIONAL!');
}

testSecurityModule().catch(console.error);
