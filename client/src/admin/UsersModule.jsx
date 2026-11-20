import React, { useEffect, useState } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Ban,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export default function UsersModule() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'student', 'owner'
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminUsers(roleFilter);
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  // Toggle Verified Host Badge
  const handleToggleVerifiedHost = async (user) => {
    try {
      const newStatus = !user.is_verified_host;
      await api.updateAdminUserStatus(user.id, { is_verified_host: newStatus });
      showToast(newStatus ? `Verified Host badge granted to ${user.name}!` : `Verified Host badge revoked from ${user.name}.`);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update badge');
    }
  };

  // Toggle Active / Suspended
  const handleToggleSuspend = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      await api.updateAdminUserStatus(user.id, { status: newStatus });
      showToast(newStatus === 'suspended' ? `Account for ${user.name} has been suspended.` : `Account for ${user.name} activated.`);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update account status');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
          
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Accounts' },
              { id: 'student', label: 'Students / Tenants' },
              { id: 'owner', label: 'PG Owners / Landlords' }
            ].map((tab) => {
              const isActive = roleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total registered users: <strong className="text-slate-900 tabular-nums">{filteredUsers.length}</strong>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-4">User Profile</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Verified Host Badge</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4 text-right">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading users directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          user.role === 'admin'
                            ? 'bg-emerald-100 text-emerald-800'
                            : user.role === 'owner'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.is_verified_host && (
                              <ShieldCheck size={13} className="text-emerald-500" title="Verified Host" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">ID: #{user.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{user.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{user.phone || 'No phone'}</div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : user.role === 'owner'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Verified Host Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      {user.role === 'owner' ? (
                        <button
                          onClick={() => handleToggleVerifiedHost(user)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 mx-auto transition-all cursor-pointer ${
                            user.is_verified_host
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <ShieldCheck size={12} className={user.is_verified_host ? 'text-emerald-600' : 'text-slate-400'} />
                          <span>{user.is_verified_host ? 'Verified Host' : 'Not Verified'}</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-right text-[11px] text-slate-500 tabular-nums">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    {/* Suspend / Activate Action */}
                    <td className="py-3.5 px-4 text-right">
                      {user.id !== 1 && (
                        <button
                          onClick={() => handleToggleSuspend(user)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
