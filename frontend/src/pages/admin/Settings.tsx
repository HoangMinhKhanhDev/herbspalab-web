import React from 'react';
import { Settings as SettingsIcon, Shield, Globe, Palette, Database, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const handleSave = () => {
    toast.success('Cấu hình hệ thống đã được cập nhật');
  };

  const sections = [
    { 
      id: 'general', 
      label: 'Cấu hình chung', 
      icon: Globe, 
      desc: 'Quản lý thông tin website, ngôn ngữ và khu vực.',
      fields: [
        { label: 'Tên Website', type: 'text', value: 'HerbSpaLab - Organic Luxury' },
        { label: 'Email liên hệ', type: 'email', value: 'contact@herbspalab.com' },
      ]
    },
    { 
      id: 'branding', 
      label: 'Thương hiệu & Giao diện', 
      icon: Palette, 
      desc: 'Tùy chỉnh logo, màu sắc chủ đạo và typography.',
      fields: [
        { label: 'Màu thương hiệu (Sage)', type: 'color', value: '#1a241b' },
        { label: 'Màu nhấn (Gold)', type: 'color', value: '#bca37f' },
      ]
    },
    { 
      id: 'security', 
      label: 'Bảo mật & Phân quyền', 
      icon: Shield, 
      desc: 'Thiết lập bảo mật, quản lý quyền truy cập của nhân viên.',
      fields: [
        { label: 'Yêu cầu 2FA cho Admin', type: 'toggle', value: true },
        { label: 'Tự động đăng xuất sau (phút)', type: 'number', value: 60 },
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <SettingsIcon className="w-4 h-4" />
            System Control
          </div>
          <h1 className="text-4xl font-display font-bold text-sage">Cài đặt hệ thống</h1>
          <p className="text-sage/60 text-lg italic mt-1">Cấu hình tham số vận hành và nhận diện thương hiệu HerbSpaLab.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-10 py-4 bg-sage text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-sage-dark shadow-xl shadow-sage/20 transition-all transform hover:-translate-y-1"
        >
          <Save className="w-5 h-5 text-gold" />
          Lưu cấu hình
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-[3rem] shadow-premium border border-sage/5 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/10 transition-all duration-700" />
            
            <div className="flex flex-col md:flex-row gap-10 relative">
              <div className="md:w-1/3 space-y-4">
                <div className="w-16 h-16 bg-sage/5 text-gold rounded-[1.5rem] flex items-center justify-center border border-sage/10 shadow-sm">
                  <section.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-sage">{section.label}</h3>
                  <p className="text-sage/40 text-sm mt-1 leading-relaxed">{section.desc}</p>
                </div>
              </div>

              <div className="md:w-2/3 grid grid-cols-1 gap-6">
                {section.fields.map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-[10px] font-black text-sage/40 uppercase tracking-[0.2em] ml-2">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl border border-sage/5 w-fit">
                        <div className={`w-12 h-6 rounded-full relative transition-all ${field.value ? 'bg-sage' : 'bg-sage/10'}`}>
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${field.value ? 'right-1' : 'left-1'}`} />
                        </div>
                        <span className="text-sm font-bold text-sage">{field.value ? 'Đang bật' : 'Đang tắt'}</span>
                      </div>
                    ) : (
                      <input 
                        type={field.type} 
                        defaultValue={field.value as string}
                        className="w-full px-6 py-4 rounded-2xl bg-cream border border-sage/5 focus:border-gold outline-none font-bold text-sage shadow-inner" 
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
      <div className="bg-sage p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/images/leaf_pattern.png')] opacity-5" />
        <div className="relative flex items-center gap-8">
          <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/10">
            <Database className="w-10 h-10 text-gold" />
          </div>
          <div>
            <h3 className="text-3xl font-display font-bold">Bảo trì cơ sở dữ liệu</h3>
            <p className="text-white/60 text-lg italic mt-1">Tối ưu hóa bảng, dọn dẹp cache và đồng bộ hóa lại các chỉ số kinh doanh.</p>
          </div>
        </div>
        <button className="px-10 py-5 bg-gold text-sage-dark rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-all shadow-xl shadow-gold/20 relative active:scale-95">
          Khởi chạy bảo trì
        </button>
      </div>
    </div>
  );
};

export default Settings;
