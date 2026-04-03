import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Activity, Settings, LogOut,
  Bell, ChevronRight, Zap, Clock, Shield, Smartphone,
  Mail, Phone, Edit3, Save, X, CheckCircle2, AlertCircle,
  Monitor, Loader2
} from 'lucide-react';
import { clsx } from 'clsx';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, sub }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={clsx('p-3 rounded-2xl', color)}>
        <Icon size={22} className="text-white" />
      </div>
      {sub && <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">{sub}</span>}
    </div>
    <h3 className="text-gray-400 text-sm font-medium font-dm-sans">{title}</h3>
    <p className="text-2xl font-syne font-bold text-brand-black mt-1">{value}</p>
  </div>
);

// ── Overview Tab ───────────────────────────────────────────
const OverviewTab = ({ user, activityLogs }) => {
  const loginCount = activityLogs.filter(l => l.action === 'login').length;
  const lastLogin = activityLogs.find(l => l.action === 'login');

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Logins" value={String(loginCount).padStart(2, '0')} icon={Shield} color="bg-brand-accent" sub="All time" />
        <StatCard title="Account Type" value={user?.role === 'admin' ? 'Admin' : 'User'} icon={User} color="bg-blue-500" />
        <StatCard title="Auth Method" value={user?.email ? 'Email OTP' : 'Phone OTP'} icon={Smartphone} color="bg-emerald-500" />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-syne font-bold text-brand-black">Recent Activity</h3>
        </div>
        {activityLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Activity size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-dm-sans">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex gap-4 items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                <div className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  log.action === 'login' ? 'bg-green-50 text-green-500' :
                  log.action === 'logout' ? 'bg-red-50 text-red-400' :
                  'bg-blue-50 text-blue-500'
                )}>
                  {log.action === 'login' ? <CheckCircle2 size={18} /> :
                   log.action === 'logout' ? <LogOut size={18} /> :
                   <Edit3 size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-brand-black font-syne capitalize">{log.action.replace('_', ' ')}</h4>
                  <p className="text-xs text-gray-400 font-dm-sans truncate">{log.device_info || 'Unknown device'}</p>
                </div>
                <span className="text-xs text-gray-400 font-bold shrink-0">
                  {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Profile Tab ────────────────────────────────────────────
const ProfileTab = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: user?.name || '', phone: user?.phone || '' });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate({ full_name: form.full_name, phone: form.phone });
      setEditing(false);
      showToast('Profile updated successfully!');
    } catch {
      showToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={clsx('p-4 rounded-2xl text-sm font-bold font-dm-sans flex items-center gap-2',
            toast.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'
          )}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </motion.div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <h3 className="text-xl font-syne font-bold text-brand-black">Profile Information</h3>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-sm font-bold text-brand-accent hover:bg-brand-accent hover:text-white px-4 py-2 rounded-xl transition-all border-2 border-brand-accent">
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="p-2 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-gray-300 transition-all"><X size={16} /></button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-xl text-sm font-bold hover:bg-brand-accent/90 transition-all disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-50">
          <div className="w-20 h-20 bg-brand-accent rounded-2xl flex items-center justify-center text-white text-3xl font-bold font-syne shadow-lg shadow-brand-accent/20">
            {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <h4 className="text-xl font-syne font-bold text-brand-black">{user?.name || 'Your Name'}</h4>
            <p className="text-gray-400 font-dm-sans text-sm capitalize">{user?.role || 'user'} · DigitalCore</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Full Name', key: 'full_name', icon: User, value: form.full_name, type: 'text', placeholder: 'Enter your full name' },
            { label: 'Phone Number', key: 'phone', icon: Phone, value: form.phone, type: 'tel', placeholder: '+91 00000 00000' },
          ].map(field => (
            <div key={field.key} className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{field.label}</label>
              <div className="relative">
                <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  disabled={!editing}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-brand-accent focus:bg-white rounded-xl outline-none transition-all font-dm-sans text-brand-black disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          ))}

          {/* Email — read-only */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={user?.email || 'N/A'} disabled
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-dm-sans text-brand-black opacity-60 cursor-not-allowed" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Activity Tab ───────────────────────────────────────────
const ActivityTab = ({ logs, loading }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm animate-fade-up">
    <h3 className="text-xl font-syne font-bold text-brand-black mb-6">Full Activity Log</h3>
    {loading ? (
      <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-brand-accent" /></div>
    ) : logs.length === 0 ? (
      <div className="text-center py-16 text-gray-400">
        <Activity size={48} className="mx-auto mb-4 opacity-20" />
        <p className="font-dm-sans">No activity logs yet</p>
      </div>
    ) : (
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="flex gap-4 items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              log.action === 'login' ? 'bg-green-50 text-green-500' :
              log.action === 'logout' ? 'bg-red-50 text-red-400' : 'bg-blue-50 text-blue-500'
            )}>
              {log.action === 'login' ? <CheckCircle2 size={16} /> :
               log.action === 'logout' ? <LogOut size={16} /> : <Edit3 size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-black font-syne capitalize">{log.action.replace('_', ' ')}</p>
              <p className="text-xs text-gray-400 font-dm-sans flex items-center gap-1 mt-0.5 truncate">
                <Monitor size={10} /> {log.device_info || 'Unknown device'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-gray-500">
                {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── Settings Tab ───────────────────────────────────────────
const SettingsTab = ({ user, onLogout }) => (
  <div className="space-y-6 animate-fade-up">
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <h3 className="text-xl font-syne font-bold text-brand-black mb-6">Account Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-brand-accent" />
            <div>
              <p className="text-sm font-bold text-brand-black font-syne">Account ID</p>
              <p className="text-xs text-gray-400 font-dm-sans font-mono">{user?.id?.slice(0, 16)}...</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-blue-500" />
            <div>
              <p className="text-sm font-bold text-brand-black font-syne">Session Timeout</p>
              <p className="text-xs text-gray-400 font-dm-sans">Auto logout after 30 min of inactivity or 1hr session</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">Active</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-3xl border border-red-100 p-8 shadow-sm">
      <h3 className="text-xl font-syne font-bold text-red-500 mb-2">Danger Zone</h3>
      <p className="text-sm text-gray-400 font-dm-sans mb-6">This will end your current session immediately.</p>
      <button onClick={() => onLogout(true)}
        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-bold font-syne border-2 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
        <LogOut size={18} /> Logout from all devices
      </button>
    </div>
  </div>
);

// ── Main Dashboard ─────────────────────────────────────────
const Dashboard = () => {
  const { user, logout, fetchProfile, updateProfile, fetchActivity } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activityLogs, setActivityLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Profile', icon: User },
    { name: 'Activity', icon: Activity },
    { name: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    // Fetch profile + activity on mount
    fetchProfile();
    loadActivity();
  }, []);

  const loadActivity = async () => {
    setLogsLoading(true);
    const logs = await fetchActivity();
    setActivityLogs(logs);
    setLogsLoading(false);
  };

  const handleLogout = async () => {
    await logout(true);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-dm-sans">
      {/* Sidebar */}
      <aside className="bg-white border-r border-gray-100 flex flex-col fixed h-full z-40 w-72">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="font-syne font-bold text-lg text-brand-black tracking-tight">DIGITALCORE</span>
        </div>

        {/* User info in sidebar */}
        <div className="px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold font-syne text-sm shadow-sm">
              {(user?.name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-brand-black font-syne truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider truncate">{user?.role || 'user'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-2">
          {menuItems.map((item) => (
            <button key={item.name} onClick={() => setActiveTab(item.name)}
              className={clsx(
                'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group text-left',
                activeTab === item.name
                  ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20'
                  : 'text-gray-400 hover:text-brand-black hover:bg-gray-50'
              )}>
              <item.icon size={20} className={activeTab === item.name ? 'text-white' : 'group-hover:text-brand-accent transition-colors'} />
              <span className="font-bold text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group">
            <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 py-8 px-6 sm:px-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-syne font-bold text-brand-black">
              {activeTab === 'Overview' ? `Hello, ${user?.name?.split(' ')[0] || 'there'} 👋` : activeTab}
            </h2>
            <p className="text-sm text-gray-400 font-medium mt-1">
              {activeTab === 'Overview' ? 'Here\'s your dashboard summary.' :
               activeTab === 'Profile' ? 'Manage your personal information.' :
               activeTab === 'Activity' ? 'Your login and activity history.' :
               'Account preferences and security.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-gray-400 hover:text-brand-black transition-colors rounded-xl hover:bg-gray-100">
              <Bell size={22} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold font-syne shadow-md shadow-brand-accent/20">
                {(user?.name?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}>
            {activeTab === 'Overview' && <OverviewTab user={user} activityLogs={activityLogs} />}
            {activeTab === 'Profile' && <ProfileTab user={user} onUpdate={updateProfile} />}
            {activeTab === 'Activity' && <ActivityTab logs={activityLogs} loading={logsLoading} />}
            {activeTab === 'Settings' && <SettingsTab user={user} onLogout={handleLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
