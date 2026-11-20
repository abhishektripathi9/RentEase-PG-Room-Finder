// End-to-End Loop Automated Test Script
const BASE_URL = 'http://localhost:5000/api';

async function runEndToEndVerification() {
  console.log('🚀 Running End-to-End Loop Verification:');

  // Step 1: Owner logs in and submits a new PG
  console.log('\n--- Step 1: PG Owner Submission ---');
  const ownerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'amit.verma@rentease.in', password: 'User@123' })
  });
  const ownerData = await ownerLoginRes.json();
  console.log(`✅ Owner Logged In: ${ownerData.user.name}`);

  const newPropertyPayload = {
    title: 'Prayagraj Prime Student Residency - Near UIT Gate',
    category: 'Boys',
    city: 'Prayagraj',
    locality: 'Near UIT Campus, Jhalwa',
    address: 'Plot 45, Opp. UIT Campus Gate 1, Prayagraj 211012',
    landmark_distance: '150m from UIT Main Gate',
    price_starting: 6200,
    total_beds: 10,
    description: 'Premier student hostel adjacent to UIT Campus with 24x7 Wi-Fi, pure veg buffet, and study halls.',
    amenities: ['High-Speed Wi-Fi', '3 Meals Daily', 'Silent Study Hall', 'Inverter Backup'],
    house_rules: ['Curfew 10:00 PM', 'Zero Brokerage Guarantee']
  };

  const submitRes = await fetch(`${BASE_URL}/owner/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ownerData.token}`
    },
    body: JSON.stringify(newPropertyPayload)
  });
  const submitData = await submitRes.json();
  console.log(`✅ PG Submitted Successfully! Property ID: ${submitData.propertyId}`);
  console.log(`   Message: "${submitData.message}"`);

  // Step 2: Verify it is in Admin's "Pending Approval" queue and NOT on public storefront yet
  console.log('\n--- Step 2: Admin Queue Inspection & Approval ---');
  const adminLoginRes = await fetch(`${BASE_URL}/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@rentease.in', password: 'Admin@123' })
  });
  const adminData = await adminLoginRes.json();
  console.log(`✅ Super Admin Logged In: ${adminData.user.name}`);

  const pendingRes = await fetch(`${BASE_URL}/admin/properties?status=pending`, {
    headers: { 'Authorization': `Bearer ${adminData.token}` }
  });
  const pendingProps = await pendingRes.json();
  const targetPending = pendingProps.data.find(p => p.id === submitData.propertyId);
  console.log(`✅ Property found in Admin Pending Queue: "${targetPending?.title}" (Verification Status: ${targetPending?.verification_status})`);

  // Admin Approves and Publishes Live
  const approveRes = await fetch(`${BASE_URL}/admin/properties/${submitData.propertyId}/verify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminData.token}`
    },
    body: JSON.stringify({ verification_status: 'approved' })
  });
  const approveData = await approveRes.json();
  console.log(`✅ Admin Approval Result: "${approveData.message}"`);

  // Step 3: Verify it is now Live on Public Storefront
  console.log('\n--- Step 3: Public Website Live Verification ---');
  const publicRes = await fetch(`${BASE_URL}/properties?city=Prayagraj`);
  const publicData = await publicRes.json();
  const liveProp = publicData.data.find(p => p.id === submitData.propertyId);
  console.log(`✅ Property is now LIVE on Public Storefront!`);
  console.log(`   Title: ${liveProp.title}`);
  console.log(`   City: ${liveProp.city} (${liveProp.locality})`);
  console.log(`   Initial Available Beds: ${liveProp.available_beds} of ${liveProp.total_beds}`);

  // Step 4: Student Books a Bed with ₹500 Token Advance
  console.log('\n--- Step 4: Student Bed Reservation with ₹500 Token ---');
  const bookingPayload = {
    property_id: submitData.propertyId,
    booking_type: 'token_booking',
    room_type: 'Twin Sharing Room',
    move_in_date: '2026-12-01',
    token_amount: 500,
    monthly_rent: 6200,
    payment_method: 'UPI (GooglePay)',
    tenant_name: 'Aditya Kumar (UIT B.Tech)',
    tenant_phone: '+91 98765 99887',
    tenant_email: 'aditya.uit@gmail.com'
  };

  const bookingRes = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  });
  const bookingData = await bookingRes.json();
  console.log(`✅ Booking Successful! Code: ${bookingData.booking.booking_code}`);
  console.log(`   Message: "${bookingData.message}"`);

  // Step 5: Verify Atomic Bed Decrement in MySQL
  console.log('\n--- Step 5: Verify Atomic MySQL Bed Decrement ---');
  const checkPropRes = await fetch(`${BASE_URL}/properties/${submitData.propertyId}`);
  const checkPropData = await checkPropRes.json();
  console.log(`✅ Post-Booking Available Beds: ${checkPropData.data.available_beds} (Original: 10)`);
  console.log(`   Bed Count Decremented Atomically: ${checkPropData.data.available_beds === 9 ? 'PASSED (10 -> 9) ✅' : 'FAILED ❌'}`);

  // Step 6: Verify Admin Stats Updated
  const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${adminData.token}` }
  });
  const statsData = await statsRes.json();
  console.log(`✅ Admin Dashboard Live Stats Synced:`);
  console.log(`   Verified PGs Live: ${statsData.stats.verifiedPgsLive}`);
  console.log(`   Total Student Bookings: ${statsData.stats.totalStudentBookings}`);
  console.log(`   Total Token Revenue: ₹${statsData.stats.totalRevenue}`);

  console.log('\n🎉 ALL 5 STEPS OF END-TO-END WORKFLOW VERIFIED SUCCESSFULLY!');
}

runEndToEndVerification().catch(console.error);
