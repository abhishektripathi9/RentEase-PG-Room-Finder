import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Lock,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserX,
  History,
  Users,
  Building2,
  Sliders,
  Check,
  X,
  Trash2,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export default function SecurityModule() {
  const [accessList, setAccessList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('access'); // 'access' or 'audit'

  // Modals
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [editPermissionsUser, setEditPermissionsUser] = useState(null);
  const [revokeUserId, setRevokeUserId] = useState(null);
  const [toast, setToast] = useState('');

  // Form State
  const [grantEmail, setGrantEmail] = useState('');
  const [grantName, setGrantName] = useState('');
  const [grantRole, setGrantRole] = useState('admin');
  const [grantPassword, setGrantPassword] = useState('Admin@123');
  const [grantPerms, setGrantPerms] = useState(['approve_pg', 'manage_bookings']);

  const allAvailablePermissions = [
    { id: 'approve_pg', label: 'Approve & Publish PG Listings', desc: 'Can verify PG submissions and make them live on website' },
    { id: 'manage_bookings', label: 'Manage Bookings & Physical Visits', desc: 'Can view student token holds and update booking statuses' },
    { id: 'manage_users', label: 'Manage User Accounts & Badges', desc: 'Can verify host KYC badges and suspend suspicious users' },
    { id: 'manage_settings', label: 'Platform Settings & Trust Charters', desc: 'Can update token deposit amount and featured cities' },
    { id: 'all', label: 'Full Root Administrative Access', desc: 'Complete unrestricted access across all systems' }
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4500);
  };

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [users, logs] = await Promise.all([
        api.getSecurityAccessList(),
        api.getSecurityAuditLogs()
      ]);
      setAccessList(users || []);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const toggleGrantPerm = (permId) => {
    if (grantPerms.includes(permId)) {
      setGrantPerms(grantPerms.filter(p => p !== permId));
    } else {
      setGrantPerms([...grantPerms, permId]);
    }
  };

  const handleGrantAccessSubmit = async (e) => {
    e.preventDefault();
    if (!grantEmail) return;

    try {
      const res = await api.grantSecurityAccess({
        name: grantName,
        email: grantEmail,
        role: grantRole,
        password: grantPassword,
        permissions: grantPerms.length > 0 ? grantPerms : ['approve_pg']
      });

      showToast(res.message);
      setGrantModalOpen(false);
      setGrantEmail('');
      setGrantName('');
      loadSecurityData();
    } catch (err) {
      alert(err.message || 'Failed to grant access');
    }
  };

  const handleSaveEditedPermissions = async (e) => {
    e.preventDefault();
    if (!editPermissionsUser) return;

    try {
      await api.updateSecurityPermissions(editPermissionsUser.id, {
        permissions: editPermissionsUser.permissions,
        role: editPermissionsUser.role,
        status: editPermissionsUser.status
      });

      showToast(`Permissions updated for ${editPermissionsUser.name}!`);
      setEditPermissionsUser(null);
      loadSecurityData();
    } catch (err) {
      alert(err.message || 'Failed to update permissions');
    }
  };

  const handleRevoke = async () => {
    if (!revokeUserId) return;
    try {
      await api.revokeSecurityAccess(revokeUserId);
      showToast('Administrative access revoked permanently.');
      setRevokeUserId(null);
      loadSecurityData();
    } catch (err) {
      alert(err.message || 'Failed to revoke access');
    }
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Toast Alert */}
      {toast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck size={18} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-black font-heading text-slate-900">
              Security &amp; Access Control Gateway
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Owner-controlled authorization: specify exact staff, manager, or owner permissions with real-time audit tracking.
          </p>
        </div>

        <button
          onClick={() => setGrantModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={15} className="text-emerald-400" />
          <span>+ Grant New Access</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('access')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'access' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={14} className={activeTab === 'access' ? 'text-emerald-400' : 'text-slate-400'} />
          <span>Active Authorized Staff ({accessList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History size={14} className={activeTab === 'audit' ? 'text-emerald-400' : 'text-slate-400'} />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: AUTHORIZED USERS & PERMISSIONS TABLE
          ======================================================== */}
      {activeTab === 'access' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Authorized User</th>
                  <th className="py-3 px-4">Role Assigned</th>
                  <th className="py-3 px-4">Granted Permissions</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">Loading access list...</td>
                  </tr>
                ) : accessList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* User profile */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.id === 1
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : user.role === 'admin'
                          ? 'bg-slate-900 text-white'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {user.id === 1 ? 'Super Admin (Root)' : user.role}
                      </span>
                    </td>

                    {/* Permissions Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {user.permissions && user.permissions.includes('all') ? (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            All Permissions Granted
                          </span>
                        ) : user.permissions && user.permissions.length > 0 ? (
                          user.permissions.map((p, i) => (
                            <span key={i} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              {p.replace('_', ' ')}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">Default Owner Scope</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {user.status === 'active' ? 'Authorized' : 'Suspended'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {user.id !== 1 && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditPermissionsUser({ ...user })}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold cursor-pointer"
                          >
                            Edit Permissions
                          </button>
                          <button
                            onClick={() => setRevokeUserId(user.id)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title="Revoke Admin Access"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: SECURITY AUDIT TRAIL LOGS
          ======================================================== */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-heading font-black text-sm text-slate-900">
              Real-Time Security Event Audit Trail
            </h3>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Live Audit Log
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 font-mono">[{log.action}]</span>
                    <span className="text-xs text-slate-600 font-medium">{log.details}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Actor: <strong className="text-slate-700">{log.actor_name}</strong> ({log.actor_email})
                    {log.target_user_email && (
                      <span> • Target: <strong className="text-slate-700">{log.target_user_email}</strong></span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: GRANT NEW ACCESS
          ======================================================== */}
      {grantModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleGrantAccessSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" />
                <h3 className="font-heading font-black text-base text-slate-900">
                  Grant Access &amp; Set Permissions
                </h3>
              </div>
              <button type="button" onClick={() => setGrantModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Staff / Manager Name</label>
              <input
                type="text"
                required
                value={grantName}
                onChange={(e) => setGrantName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  placeholder="manager@rentease.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={grantRole}
                  onChange={(e) => setGrantRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="admin">Administrator / Manager</option>
                  <option value="owner">PG Owner / Host</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password</label>
              <input
                type="text"
                value={grantPassword}
                onChange={(e) => setGrantPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            {/* Permissions Selector Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Granular Permissions Assigned:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {allAvailablePermissions.map((perm) => {
                  const isChecked = grantPerms.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      onClick={() => toggleGrantPerm(perm.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                        isChecked ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div>
                        <div>{perm.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{perm.desc}</div>
                      </div>
                      {isChecked && <Check size={16} className="text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGrantModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Authorize &amp; Set Access
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT PERMISSIONS
          ======================================================== */}
      {editPermissionsUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveEditedPermissions} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-black text-base text-slate-900">
                Edit Permissions: {editPermissionsUser.name}
              </h3>
              <button type="button" onClick={() => setEditPermissionsUser(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select
                  value={editPermissionsUser.role}
                  onChange={(e) => setEditPermissionsUser({ ...editPermissionsUser, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="admin">Administrator</option>
                  <option value="owner">PG Owner</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                <select
                  value={editPermissionsUser.status}
                  onChange={(e) => setEditPermissionsUser({ ...editPermissionsUser, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Permissions:</label>
              {allAvailablePermissions.map((perm) => {
                const currentPerms = editPermissionsUser.permissions || [];
                const isChecked = currentPerms.includes(perm.id);
                return (
                  <div
                    key={perm.id}
                    onClick={() => {
                      const newPerms = isChecked
                        ? currentPerms.filter(p => p !== perm.id)
                        : [...currentPerms, perm.id];
                      setEditPermissionsUser({ ...editPermissionsUser, permissions: newPerms });
                    }}
                    className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      isChecked ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{perm.label}</span>
                    {isChecked && <Check size={14} className="text-emerald-600" />}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditPermissionsUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Save Permissions
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          MODAL: REVOKE ACCESS
          ======================================================== */}
      {revokeUserId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <UserX size={36} className="mx-auto text-rose-500 mb-3" />
            <h3 className="font-heading font-black text-base text-slate-900 mb-1">
              Revoke Administrative Access?
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              This user will be demoted to student role and will lose all administrative panel access immediately.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setRevokeUserId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
