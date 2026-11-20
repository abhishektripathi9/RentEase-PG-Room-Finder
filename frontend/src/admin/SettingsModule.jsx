import React, { useEffect, useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  Save,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function SettingsModule() {
  const [settings, setSettings] = useState({
    token_amount: 500,
    zero_brokerage_text: '100% Zero Brokerage Guarantee on all Verified PGs',
    featured_cities: ['Bangalore', 'Prayagraj', 'Delhi NCR', 'Banda'],
    platform_name: 'RentEase PRO',
    support_phone: '+91 98765 43210',
    support_email: 'support@rentease.in'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [newCityInput, setNewCityInput] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminSettings();
      if (data) {
        setSettings({
          ...data,
          featured_cities: Array.isArray(data.featured_cities) ? data.featured_cities : ['Bangalore', 'Prayagraj', 'Delhi NCR', 'Banda']
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateAdminSettings(settings);
      setToast('Platform trust banner and promo settings updated in MySQL!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCity = () => {
    if (!newCityInput.trim()) return;
    if (!settings.featured_cities.includes(newCityInput.trim())) {
      setSettings({
        ...settings,
        featured_cities: [...settings.featured_cities, newCityInput.trim()]
      });
    }
    setNewCityInput('');
  };

  const handleRemoveCity = (cityToRemove) => {
    setSettings({
      ...settings,
      featured_cities: settings.featured_cities.filter(c => c !== cityToRemove)
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Platform Token Advance Settings */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign size={20} className="text-emerald-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Token Advance &amp; Zero-Brokerage Trust Banner
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Token Bed Hold Amount (₹ INR)
              </label>
              <input
                type="number"
                required
                min={0}
                value={settings.token_amount}
                onChange={(e) => setSettings({ ...settings, token_amount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-bold tabular-nums focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Standard refundable advance required from students to instantly lock a bed.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                required
                value={settings.platform_name}
                onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Zero-Brokerage Guarantee Banner Text
            </label>
            <input
              type="text"
              required
              value={settings.zero_brokerage_text}
              onChange={(e) => setSettings({ ...settings, zero_brokerage_text: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Displayed prominently on the live public website hero section and property cards.
            </p>
          </div>
        </div>

        {/* Section 2: Featured Indian Cities */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 size={20} className="text-emerald-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Featured Cities on Public Website
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Cities shown in the top navigation selector and quick search pills across the portal.
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {settings.featured_cities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200"
              >
                <span>{city}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCity(city)}
                  className="text-slate-400 hover:text-rose-500 font-black ml-1 text-sm cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add another city (e.g. Pune, Lucknow)..."
              value={newCityInput}
              onChange={(e) => setNewCityInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddCity}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Add City
            </button>
          </div>
        </div>

        {/* Section 3: Platform Support & KYC Contacts */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck size={20} className="text-emerald-600" />
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Platform Support &amp; Audit Contacts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Support Helpline Phone
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={settings.support_phone}
                  onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Support &amp; Verification Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={settings.support_email}
                  onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} className="text-emerald-400" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
