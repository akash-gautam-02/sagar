const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/user/profile
 * Returns the logged-in user's profile
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', req.user.userId)
      .single();

    if (error) throw error;

    res.json({ success: true, profile: data });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

/**
 * PUT /api/user/profile
 * Update the logged-in user's profile
 */
router.put('/profile', verifyToken, async (req, res) => {
  const { full_name, avatar_url, phone } = req.body;

  try {
    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (full_name !== undefined) updates.full_name = full_name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (phone !== undefined) updates.phone = phone;

    const { data, error } = await supabase
      .from('users_profile')
      .update(updates)
      .eq('id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    // Log the activity
    await supabase.from('activity_logs').insert({
      user_id: req.user.userId,
      action: 'profile_update',
      ip_address: req.ip,
      device_info: req.headers['user-agent'] || 'Unknown',
    });

    res.json({ success: true, profile: data });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

/**
 * GET /api/user/activity
 * Returns the logged-in user's activity log
 */
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ success: true, logs: data });
  } catch (err) {
    console.error('Activity log error:', err);
    res.status(500).json({ error: 'Failed to fetch activity logs.' });
  }
});

/**
 * POST /api/user/logout
 * Logs the logout action and clears server-side session if needed
 */
router.post('/logout', verifyToken, async (req, res) => {
  try {
    await supabase.from('activity_logs').insert({
      user_id: req.user.userId,
      action: 'logout',
      ip_address: req.ip,
      device_info: req.headers['user-agent'] || 'Unknown',
    });

    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout log error:', err);
    res.json({ success: true }); // Still succeed even if logging fails
  }
});

module.exports = router;
