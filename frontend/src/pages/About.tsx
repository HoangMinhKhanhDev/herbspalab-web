import SEO from '../components/common/SEO';
import LazyImage from '../components/common/LazyImage';
import { ShieldCheck, Leaf, FlaskConical, Handshake, Award, FileCheck, Factory } from 'lucide-react';

const About = () => {
  const coreValues = [
    { 
      icon: ShieldCheck,
      title: "An Toàn Cho Sức Khỏe", 
      desc: "Nguyên liệu có nguồn gốc rõ ràng, đầy đủ hồ sơ pháp lý (COA, MSDS, TDS), đảm bảo an toàn và phù hợp với tiêu chuẩn mỹ phẩm hiện hành." 
    },
    { 
      icon: FileCheck,
      title: "Minh Bạch Pháp Lý", 
      desc: "Cơ sở sản xuất được Sở Y tế cấp Giấy chứng nhận đủ điều kiện sản xuất, đáp ứng đầy đủ các quy định hiện hành của pháp luật Việt Nam." 
    },
    { 
      icon: Handshake,
      title: "Đồng Hành Thương Hiệu Việt", 
      desc: "Đặc biệt phù hợp với thương hiệu spa và các doanh nghiệp vừa & nhỏ, cam kết chất lượng ổn định – quy trình rõ ràng – hợp tác lâu dài." 
    }
  ];

  const services = [
    { icon: FlaskConical, title: "Tư vấn công thức", desc: "Tư vấn công thức theo định hướng thương hiệu, phù hợp với từng phân khúc thị trường." },
    { icon: Factory, title: "Gia công – Đóng gói", desc: "Gia công và đóng gói theo yêu cầu với dây chuyền sản xuất dạng ướt cùng hệ thống máy móc hiện đại." },
    { icon: FileCheck, title: "Hồ sơ công bố", desc: "Hỗ trợ toàn bộ hồ sơ công bố mỹ phẩm, đồng hành cùng khách hàng từ ý tưởng đến sản phẩm hoàn chỉnh." },
    { icon: Award, title: "Kiểm soát chất lượng", desc: "Kiểm soát chất lượng toàn bộ quy trình từ nghiên cứu công thức, lựa chọn nguyên liệu đến đóng gói thành phẩm." }
  ];

  const products = [
    "Kem nám da", "Kem dưỡng ẩm da", "Kem chống nắng", 
    "Sữa rửa mặt", "Serum", "Dầu gội", 
    "Sữa tắm", "Dung dịch vệ sinh phụ nữ"
  ];

  const missionPoints = [
    { icon: Leaf, text: "Lựa chọn nguyên liệu có nguồn gốc rõ ràng, được phép sử dụng trong mỹ phẩm theo quy định hiện hành." },
    { icon: ShieldCheck, text: "Kiểm soát chặt chẽ công thức, quy trình sản xuất và chỉ tiêu chất lượng, đảm bảo sản phẩm ổn định và an toàn khi lưu hành." },
    { icon: FileCheck, text: "Minh bạch trong hồ sơ công bố, nhãn mác và thông tin sản phẩm, giúp đối tác và người tiêu dùng an tâm khi sử dụng." },
    { icon: Handshake, text: "Đồng hành cùng đối tác và thương hiệu trong việc phát triển các dòng mỹ phẩm bền vững và có trách nhiệm với người tiêu dùng." }
  ];

  return (
    <div className="bg-white">
      <SEO 
        title="Về Chúng Tôi | HerbSpaLab" 
        description="HerbSpaLab – Đơn vị sản xuất và gia công Mỹ phẩm với định hướng An toàn cho sức khỏe, Minh bạch pháp lý, Đồng hành cùng thương hiệu Việt." 
      />

      {/* --- HERO SECTION --- */}
      <section className="py-20 md:py-32 border-b border-gray-50">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sage font-bold tracking-widest text-xs uppercase mb-4 block">GIỚI THIỆU</span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">HerbSpaLab</h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Chúng tôi là đơn vị sản xuất và gia công Mỹ phẩm với định hướng <strong className="text-gray-900">An toàn cho sức khỏe – Minh bạch pháp lý – Đồng hành cùng thương hiệu Việt</strong>.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Công ty sở hữu cơ sở sản xuất Mỹ phẩm được Sở Y tế cấp Giấy chứng nhận đủ điều kiện sản xuất, 
              đáp ứng đầy đủ các quy định hiện hành của pháp luật Việt Nam. Với dây chuyền sản xuất dạng ướt 
              cùng hệ thống máy móc, thiết bị hiện đại.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <LazyImage src="/assets/images/hero_bg.png" alt="Cơ sở sản xuất HerbSpaLab" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-2xl overflow-hidden border-8 border-white shadow-xl hidden md:block">
              <LazyImage src="/assets/images/promo_img.png" alt="HerbSpaLab" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-500">Ba trụ cột phát triển bền vững của chúng tôi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-sage/10 text-sage rounded-xl flex items-center justify-center mb-6">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gia Công Mỹ Phẩm Trọn Gói</h2>
            <p className="text-gray-500">Đồng hành cùng khách hàng từ ý tưởng đến sản phẩm hoàn chỉnh.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="p-8 rounded-xl border border-gray-100 bg-white">
                <div className="text-sage mb-4"><s.icon size={24} /></div>
                <h4 className="text-base font-bold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRODUCT RANGE --- */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-12">Danh Mục Sản Phẩm</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {products.map((p, i) => (
              <span key={i} className="px-6 py-3 bg-white/10 rounded-full text-sm font-medium border border-white/10">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sứ Mệnh & Tầm Nhìn</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Chúng tôi không chỉ tạo ra mỹ phẩm, mà còn góp phần xây dựng niềm tin 
                cho thị trường mỹ phẩm an toàn, hiệu quả và phù hợp với thể trạng người Việt.
              </p>
              <div className="space-y-4">
                {missionPoints.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 text-sage"><m.icon size={18} /></div>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl">
               <h3 className="text-xl font-bold text-gray-900 mb-8">Thông Tin Doanh Nghiệp</h3>
               <div className="space-y-6">
                {[
                  { label: "Thương hiệu", value: "HerbSpaLab" },
                  { label: "Tên quốc tế", value: "THU HUYEN SMILE SPA COMPANY LIMITED" },
                  { label: "Mã số thuế", value: "2500712979" },
                  { label: "Giám đốc", value: "Nguyễn Thị Thu Huyền" },
                  { label: "Hotline", value: "0972 245 219" },
                  { label: "Địa chỉ", value: "Vĩnh Yên, Vĩnh Phúc" },
                ].map((row, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:justify-between border-b border-gray-100 pb-4 gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{row.label}</span>
                    <span className="text-sm font-medium text-gray-700">{row.value}</span>
                  </div>
                ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CLOSING QUOTE --- */}
      <section className="py-24 container text-center">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800 max-w-4xl mx-auto italic leading-relaxed">
          "Một sản phẩm tốt không chỉ nằm ở công thức, mà còn ở sự nghiêm túc trong quy trình sản xuất và trách nhiệm với người tiêu dùng."
        </h2>
      </section>
    </div>
  );
};

export default About;
