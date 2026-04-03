require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addTestUser() {
  const phone = '+91838490541';
  console.log('Adding test user:', phone);
  
  const { data, error } = await supabase
    .from('users')
    .upsert({
      phone: phone,
      auth_provider: 'phone',
      is_verified: true,
      last_login: new Date().toISOString(),
      role: 'admin' // Power user
    })
    .select();

  if (error) {
    console.error('Error adding user:', error.message);
  } else {
    console.log('User added successfully:', data);
  }
}

addTestUser();
