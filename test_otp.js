async function sendOtp() {
  try {
    console.log('Sending Email OTP to sagarakash60612@gmail.com on port 5001...');
    const emailRes = await fetch('http://localhost:5001/auth/email/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sagarakash60612@gmail.com' })
    });
    const emailData = await emailRes.json();
    console.log('Email Response:', emailData);

    console.log('\nSending Phone OTP to +918384090541 on port 5001...');
    const phoneRes = await fetch('http://localhost:5001/auth/phone/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+918384090541' })
    });
    const phoneData = await phoneRes.json();
    console.log('Phone Response:', phoneData);
  } catch (error) {
    console.error('Error sending OTP:', error.message);
  }
}

sendOtp();
