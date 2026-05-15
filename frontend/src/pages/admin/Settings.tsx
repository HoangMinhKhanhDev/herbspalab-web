import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Globe, Palette, Database, Save, Loader2 } from 'lucide-react';
import { adminFetchSettings, adminUpdateSettings } from '../../api/adminApi';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    siteName: 'HerbSpaLab - Organic Luxury',
    contactEmail: 'contact@herbspalab.com',
    brandColor: '#1a241b',
    accentColor: '#bca37f',
    enable2FA: 'false',
    sessionTimeout: '60'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminFetchSettings();
      if (Object.keys(data).length > 0) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateSettings(settings);
      toast.success('Cấu hình hệ thống đã được cập nhật');
    } catch (error) {
      toast.error('Lỗi khi cập nhật cấu hình');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
      <p className="text-gray-500 text-sm">Đang tải cấu hình hệ thống...</p>
    </div>
  );

  const sections = [
    { 
      id: 'general', 
      label: 'Cấu hình chung', 
      icon: Globe, 
      desc: 'Quản lý thông tin website, ngôn ngữ và khu vực.',
      fields: [
        { key: 'siteName', label: 'Tên Website', type: 'text' },
        { key: 'contactEmail', label: 'Email liên hệ', type: 'email' },
      ]
    },
    { 
      id: 'branding', 
      label: 'Thương hiệu & Giao diện', 
      icon: Palette, 
      desc: 'Tùy chỉnh logo, màu sắc chủ đạo và typography.',
      fields: [
        { key: 'brandColor', label: 'Màu thương hiệu', type: 'color' },
        { key: 'accentColor', label: 'Màu nhấn', type: 'color' },
      ]
    },
    { 
      id: 'security', 
      label: 'Bảo mật & Phân quyền', 
      icon: Shield, 
      desc: 'Thiết lập bảo mật, quản lý quyền truy cập của nhân viên.',
      fields: [
        { key: 'enable2FA', label: 'Yêu cầu 2FA cho Admin', type: 'toggle' },
        { key: 'sessionTimeout', label: 'Tự động đăng xuất sau (phút)', type: 'number' },
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt Hệ thống</h1>
          <p className="text-sm text-gray-500">Cấu hình vận hành, bảo mật và giao diện website</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-sage text-white rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-sage/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu thay đổi
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <div className="flex items-center gap-3 mb-2">
                  <section.icon className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900">{section.label}</h3>
                </div>
                <p className="text-gray-500 text-sm">{section.desc}</p>
              </div>
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 block">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <button 
                        onClick={() => handleChange(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[field.key] === 'true' ? 'bg-sage' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    ) : (
                      <input 
                        type={field.type} 
                        value={settings[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage outline-none text-sm transition-all ${
                          field.type === 'color' ? 'h-10 p-1 cursor-pointer' : ''
                        }`} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Maintenance */}
      <div className="bg-gray-900 p-6 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Bảo trì hệ thống</h3>
            <p className="text-gray-400 text-sm">Đồng bộ hóa dữ liệu và làm sạch bộ nhớ đệm</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-bold transition-colors">
          Chạy bảo trì
        </button>
      </div>
    </div>
  );
};

export default Settings;
