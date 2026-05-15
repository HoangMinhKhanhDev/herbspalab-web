import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Globe, Palette, Database, Save, Loader2, ChevronRight, Zap, RefreshCcw } from 'lucide-react';
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
    setLoading(true);
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
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="w-12 h-12 border-4 border-sage/10 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Đang đồng bộ cấu hình hệ thống...</p>
    </div>
  );

  const sections = [
    { 
      id: 'general', 
      label: 'Cấu hình Định danh', 
      icon: Globe, 
      desc: 'Quản lý thông tin cốt lõi của website, ngôn ngữ và hiển thị cơ bản.',
      fields: [
        { key: 'siteName', label: 'Tên Website', type: 'text', placeholder: 'HerbSpaLab - Organic Luxury' },
        { key: 'contactEmail', label: 'Email liên hệ hệ thống', type: 'email', placeholder: 'admin@herbspalab.com' },
      ]
    },
    { 
      id: 'branding', 
      label: 'Ngôn ngữ Thiết kế', 
      icon: Palette, 
      desc: 'Tùy chỉnh các yếu tố nhận diện thương hiệu và màu sắc chủ đạo.',
      fields: [
        { key: 'brandColor', label: 'Màu sắc chủ đạo (Primary)', type: 'color' },
        { key: 'accentColor', label: 'Màu sắc nhấn mạnh (Accent)', type: 'color' },
      ]
    },
    { 
      id: 'security', 
      label: 'Bảo mật & Phân cấp', 
      icon: Shield, 
      desc: 'Thiết lập các tiêu chuẩn an toàn dữ liệu và quản lý phiên làm việc.',
      fields: [
        { key: 'enable2FA', label: 'Xác thực 2 lớp (Two-Factor Auth)', type: 'toggle' },
        { key: 'sessionTimeout', label: 'Phiên làm việc (phút)', type: 'number' },
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a2420] tracking-tight">Cài đặt Hệ thống</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Cấu hình vận hành, bảo mật và trải nghiệm quản trị viên.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-[#1a2420] text-white rounded-[1.5rem] flex items-center gap-2 font-black text-sm hover:bg-[#2c3b2e] transition-all shadow-xl shadow-[#1a2420]/10 disabled:opacity-50 group"
        >
          {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 transition-transform group-hover:scale-110" />}
          Lưu cấu hình ngay
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-8">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 lg:p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
              <div className="lg:w-1/3 space-y-4">
                <div className="w-14 h-14 bg-[#f8f9f8] border border-gray-100 rounded-2xl flex items-center justify-center text-sage shadow-inner group-hover:bg-sage group-hover:text-white transition-all duration-500">
                  <section.icon size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1a2420] tracking-tight">{section.label}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">{section.desc}</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                   <div className="w-8 h-1 bg-sage/20 rounded-full"></div>
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Configuration Phase</span>
                </div>
              </div>

              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-50 shadow-inner">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full">
                         <span className="text-xs font-bold text-gray-600 flex-1">{settings[field.key] === 'true' ? 'Đang kích hoạt' : 'Đã vô hiệu hóa'}</span>
                         <button 
                          onClick={() => handleChange(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ring-4 ring-white shadow-sm ${
                            settings[field.key] === 'true' ? 'bg-sage' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all shadow-md ${
                            settings[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative group/input">
                         <input 
                          type={field.type} 
                          value={settings[field.key]}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={(field as any).placeholder}
                          className={`w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-sage focus:ring-4 focus:ring-sage/5 outline-none font-bold text-gray-900 transition-all text-sm placeholder:text-gray-300 ${
                            field.type === 'color' ? 'h-14 p-2 cursor-pointer' : ''
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Maintenance Panel */}
      <div className="bg-[#1a2420] p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-[#1a2420]/20 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Database size={32} className="text-sage" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Khu vực Bảo trì Nâng cao</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Đồng bộ hóa cache, dọn dẹp cơ sở dữ liệu và tối ưu hóa hệ thống.</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-sage text-white rounded-[1.5rem] font-black text-sm hover:bg-white hover:text-sage transition-all relative z-10 flex items-center gap-2">
          <Zap size={18} strokeWidth={3} />
          Bắt đầu bảo trì
        </button>
      </div>
    </div>
  );
};

export default Settings;
