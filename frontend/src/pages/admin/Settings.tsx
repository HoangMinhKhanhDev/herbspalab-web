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
    <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-mint animate-spin" />
      <p className="font-bold text-sage/40 uppercase tracking-[0.2em] text-[10px]">Đang tải cấu hình hệ thống...</p>
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
        { key: 'brandColor', label: 'Màu thương hiệu (Sage)', type: 'color' },
        { key: 'accentColor', label: 'Màu nhấn (Gold)', type: 'color' },
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-7xl pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-4">
        <div>
          <div className="flex items-center gap-3 text-gold font-bold text-[11px] uppercase tracking-[0.3em] mb-2">
            <SettingsIcon className="w-4 h-4" />
            Core System Infrastructure
          </div>
          <h1 className="text-5xl font-display italic text-sage leading-tight tracking-tight">Cài đặt Hệ thống</h1>
          <p className="text-sage/40 text-[12px] font-bold uppercase tracking-[0.2em] mt-2">Cấu hình vận hành, bảo mật & Bản sắc thương hiệu HerbSpaLab</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-4 bg-ink text-white rounded-2xl flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-mint transition-all shadow-xl disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Lưu tất cả cấu hình
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-[3rem] border border-black/5 p-12 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col lg:flex-row gap-12 relative">
              <div className="lg:w-1/3 space-y-6">
                <div className="w-16 h-16 bg-mint/10 text-mint rounded-2xl flex items-center justify-center border border-mint/10 shadow-sm">
                  <section.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-sage tracking-tight">{section.label}</h3>
                  <p className="text-sage/40 text-sm mt-3 leading-relaxed font-medium">{section.desc}</p>
                </div>
              </div>
              <div className="lg:w-2/3 grid grid-cols-1 gap-8">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-3">
                    <label className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] ml-1">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <div 
                        onClick={() => handleChange(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                        className="flex items-center gap-5 bg-gray-50 p-5 px-8 rounded-2xl border border-black/5 w-fit shadow-inner cursor-pointer"
                      >
                        <div className={`w-14 h-7 rounded-full relative transition-all ${settings[field.key] === 'true' ? 'bg-mint' : 'bg-gray-300'}`}>
                          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${settings[field.key] === 'true' ? 'right-1' : 'left-1'}`} />
                        </div>
                        <span className="text-[11px] font-bold text-sage uppercase tracking-[0.2em]">{settings[field.key] === 'true' ? 'Kích hoạt' : 'Vô hiệu hóa'}</span>
                      </div>
                    ) : (
                      <input 
                        type={field.type} 
                        value={settings[field.key]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-6 py-4.5 rounded-2xl bg-gray-50 border border-black/5 focus:border-gold outline-none font-bold text-sage text-lg transition-all shadow-sm" 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enlarged Advanced Maintenance */}
      <div className="bg-ink p-12 rounded-[3rem] text-white flex flex-col xl:flex-row items-center justify-between gap-10 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="relative flex items-center gap-8">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
            <Database className="w-10 h-10 text-gold" />
          </div>
          <div>
            <h3 className="text-3xl font-bold uppercase tracking-[0.1em]">Bảo trì hệ thống chuyên sâu</h3>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Đồng bộ hóa kho dữ liệu, tối ưu hóa database & Làm sạch bộ nhớ đệm</p>
          </div>
        </div>
        <button className="px-12 py-5 bg-mint text-white rounded-2xl font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-white hover:text-ink transition-all shadow-xl active:scale-95">
          Khởi chạy bảo trì
        </button>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-mint/5 blur-3xl rounded-full" />
      </div>
    </div>
  );
};

export default Settings;
