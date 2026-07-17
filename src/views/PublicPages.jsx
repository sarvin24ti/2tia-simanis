import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Send, ShoppingBag, CheckCircle, Award, Leaf, Menu, X, Mail, ShieldCheck, Star, Quote, Flame, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '../config/supabaseClient';

// Hook kustom deteksi layar presisi
const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return { 
    isMobile: windowWidth <= 768,
    isTablet: windowWidth > 768 && windowWidth <= 1024 
  };
};

// ==========================================
// NAVBAR PUBLIK
// ==========================================
export function PublicNavbar({ onNavigate }) {
  const { isMobile } = useResponsive();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  const [settings, setSettings] = useState({ site_title: 'UD Putra Mandiri', site_subtitle: 'Oleh-Oleh Khas Siak', site_logo: '' });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const navLinks = ['Beranda', 'Tentang Kami', 'Kontak'];
  const navTargets = ['home', 'about', 'contact'];

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      background: scrolled || mobileMenu ? 'rgba(251, 249, 246, 0.98)' : '#FBF9F6',
      backdropFilter: scrolled || mobileMenu ? 'blur(12px)' : 'none',
      borderBottom: scrolled || mobileMenu ? '1px solid rgba(104, 30, 30, 0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease', padding: isMobile ? '16px 20px' : (scrolled ? '16px 60px' : '24px 60px'),
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', zIndex: 1001 }} onClick={() => { onNavigate('home'); setMobileMenu(false); }}>
        {settings.site_logo ? (
          <img src={settings.site_logo} alt="Logo" style={{ width: isMobile ? '36px' : '40px', height: isMobile ? '36px' : '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{ width: isMobile ? '36px' : '40px', height: isMobile ? '36px' : '40px', borderRadius: '50%', background: '#361C14', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px', flexShrink: 0 }}>
            {settings.site_title ? settings.site_title.charAt(0) : 'P'}
          </div>
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', color: '#361C14', fontWeight: '800', whiteSpace: 'nowrap' }}>{settings.site_title}</h1>
          <span style={{ fontSize: '11px', color: '#A0AEC0', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{settings.site_subtitle}</span>
        </div>
      </div>

      {!isMobile && (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {navLinks.map((menu, idx) => (
            <button key={idx} onClick={() => onNavigate(navTargets[idx])} style={{ background: 'none', border: 'none', color: '#4A5568', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s' }}>{menu}</button>
          ))}
          <button onClick={() => onNavigate('login')} style={{ background: '#681E1E', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(104,30,30,0.2)' }}>
            Login Pegawai
          </button>
        </div>
      )}

      {isMobile && (
        <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: 'none', border: 'none', color: '#681E1E', cursor: 'pointer', zIndex: 1001, padding: 0 }}>
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      )}

      {isMobile && mobileMenu && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FBF9F6', display: 'flex', flexDirection: 'column', padding: '16px 20px 32px', borderBottom: '1px solid rgba(104,30,30,0.1)', boxShadow: '0 20px 20px rgba(0,0,0,0.05)' }}>
          {navLinks.map((menu, idx) => (
            <button key={idx} onClick={() => { onNavigate(navTargets[idx]); setMobileMenu(false); }} style={{ background: 'none', border: 'none', color: '#4A5568', fontWeight: '700', fontSize: '16px', cursor: 'pointer', padding: '16px 0', textAlign: 'left', borderBottom: '1px solid #EDF2F7' }}>{menu}</button>
          ))}
          <button onClick={() => { onNavigate('login'); setMobileMenu(false); }} style={{ background: '#681E1E', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            Login Pegawai
          </button>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// HALAMAN BERANDA
// ==========================================
export function Home() {
  const { isMobile } = useResponsive();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    supabase.from('products').select('*').order('name').then(({ data }) => setProducts(data || []));
  }, []);

  const testimonials = [
    { name: "Rina Maharani", role: "Wisatawan", text: "Dodol nanasnya luar biasa! Manisnya pas, teksturnya lembut, dan rasanya autentik banget. Wajib beli kalau lagi mampir ke Siak.", rating: 5 },
    { name: "Budi Santoso", role: "Pelanggan Setia", text: "Pelayanan sangat ramah dan stok selalu update di website. Fitur tombol WhatsApp-nya sangat mempermudah proses pemesanan.", rating: 5 },
    { name: "Siti Aminah", role: "Reseller Mitra", text: "Kualitas dodol durian premium sangat konsisten. Pelanggan toko saya selalu puas dengan rasanya. Sukses terus UD Putra Mandiri!", rating: 5 }
  ];

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* CSS KHUSUS UNTUK ANIMASI KATALOG ULTRA-MODERN */}
      <style>{`
        .ultra-card {
          background: #ffffff;
          border-radius: 32px;
          padding: 16px;
          box-shadow: 0 12px 36px rgba(54, 28, 20, 0.04);
          border: 1px solid rgba(237, 242, 247, 0.9);
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .ultra-card:hover {
          transform: translateY(-16px);
          box-shadow: 0 30px 60px rgba(104, 30, 30, 0.1);
          border-color: rgba(212, 175, 55, 0.3);
        }
        .img-container {
          position: relative;
          height: 280px;
          border-radius: 24px;
          overflow: hidden;
          background: #F8FAFC;
        }
        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .ultra-card:hover .img-container img {
          transform: scale(1.1) rotate(1.5deg);
        }
        .gradient-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60%;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
          opacity: 0.7;
          transition: opacity 0.5s ease;
        }
        .ultra-card:hover .gradient-overlay {
          opacity: 0.9;
        }
        .badge-glass {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
        }
        .price-gradient {
          background: linear-gradient(135deg, #D4AF37 0%, #AA8222 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-buy {
          background: linear-gradient(135deg, #361C14 0%, #1E0F0A 100%);
          color: white;
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .btn-buy::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, #D4AF37 0%, #AA8222 100%);
          z-index: -1;
          transition: opacity 0.4s ease;
          opacity: 0;
        }
        .ultra-card:hover .btn-buy::before {
          opacity: 1;
        }
        .ultra-card:hover .btn-buy {
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
        }
        .icon-slide {
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .ultra-card:hover .icon-slide {
          transform: translateX(6px);
        }
        .stock-progress {
          transition: width 1s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
      `}</style>

      {/* HERO SECTION */}
      <div style={{ 
        position: 'relative', width: '100%', minHeight: isMobile ? '85vh' : '90vh', paddingTop: isMobile ? '120px' : '160px', paddingBottom: isMobile ? '100px' : '160px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#4A1515', backgroundImage: 'url(/istana-siak.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center bottom', backgroundAttachment: 'fixed', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(42,8,8,0.85) 0%, rgba(74,21,21,0.7) 50%, rgba(104,30,30,0.85) 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.3) 0%, transparent 60%)', zIndex: 2 }}></div>

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '900px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', padding: '8px 20px', borderRadius: '30px', marginBottom: '24px', backdropFilter: 'blur(8px)' }}>
            <h4 style={{ color: '#F3E5AB', letterSpacing: '3px', fontSize: isMobile ? '10px' : '12px', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>Katalog Resmi</h4>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontSize: isMobile ? '36px' : '64px', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            Nikmati Kelezatan Dodol Buah Asli Khas Siak Sri Indrapura
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: '1.7', marginBottom: '40px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '750px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Dibuat dengan resep tradisional warisan kuliner yang legit dan buah pilihan segar. Pantau ketersediaan varian produk kami secara real-time langsung dari gudang penyimpanan.
          </p>
          <button onClick={() => window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' })} style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #AA8222 100%)', color: '#FFFFFF', border: 'none', padding: isMobile ? '14px 28px' : '18px 36px', borderRadius: '30px', fontSize: isMobile ? '14px' : '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Lihat Ketersediaan Stok
          </button>
        </div>

        <svg style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%', height: isMobile ? '60px' : '140px', zIndex: 3 }} preserveAspectRatio="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C320,120 420,0 720,0 C1020,0 1120,120 1440,60 L1440,120 L0,120 Z" fill="#FBF9F6" />
        </svg>
      </div>

      {/* KETERSEDIAAN STOK (ULTRA-MODERN REDESIGN) */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '60px 20px' : '100px 20px', position: 'relative', zIndex: 4 }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '60px', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#D4AF37" />
              <h4 style={{ color: '#D4AF37', letterSpacing: '2px', fontSize: '12px', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>Produk Pilihan</h4>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '32px' : '46px', fontWeight: '800', margin: '0 0 12px', lineHeight: '1.1' }}>Cita Rasa Autentik</h2>
            <p style={{ color: '#718096', fontSize: '16px', margin: 0, fontWeight: '500', maxWidth: '500px', lineHeight: '1.6' }}>
              Dibuat sepenuh hati dengan bahan premium. Cek ketersediaan dan harga per kemasan eksklusif kami.
            </p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
          {products.map((p, idx) => {
            const stockPct = Math.min(100, Math.max(0, (p.stock_ready / (p.stock_minimum * 3)) * 100)); // Simulasi persentase
            const isLowStock = p.stock_ready <= p.stock_minimum;

            return (
            <div key={idx} className="ultra-card">
              
              {/* IMAGE CONTAINER DENGAN INNER PADDING */}
              <div className="img-container">
                {p.image_url ? ( 
                  <img src={p.image_url} alt={p.name} /> 
                ) : ( 
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <ShoppingBag color="#CBD5E0" size={64} />
                  </div> 
                )}
                
                {/* GRADIENT OVERLAY UNTUK KONTRAST BADGE */}
                <div className="gradient-overlay"></div>
                
                {/* LENCANA TERLARIS (Kiri Bawah di dalam foto) */}
                {(p.is_popular || idx === 0) && (
                  <div className="badge-glass" style={{ position: 'absolute', bottom: '16px', left: '16px', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                    <TrendingUp size={14} color="#FDE047" /> TERPOPULER
                  </div>
                )}

                {/* STATUS STOK MELAYANG (Kanan Atas) */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: isLowStock ? 'rgba(220, 38, 38, 0.9)' : 'rgba(5, 150, 105, 0.9)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', zIndex: 10 }}>
                  {isLowStock ? 'Sisa Sedikit' : 'Stok Tersedia'}
                </div>
              </div>
              
              {/* DETAIL PRODUK */}
              <div style={{ padding: '24px 8px 8px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '24px', color: '#1E293B', fontWeight: '800', fontFamily: 'Playfair Display, serif', lineHeight: '1.2', flex: 1, paddingRight: '16px' }}>
                    {p.name}
                  </h3>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>Harga Box</div>
                    <div className="price-gradient" style={{ fontSize: '22px', fontWeight: '900' }}>
                      {p.price ? (p.price / 1000) + 'k' : '35k'}
                    </div>
                  </div>
                </div>

                {/* PROGRESS BAR STOK (ESTETIK) */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748B', fontSize: '12px', fontWeight: '700' }}>Ketersediaan</span>
                    <span style={{ color: isLowStock ? '#DC2626' : '#059669', fontSize: '13px', fontWeight: '800' }}>
                      {p.stock_ready} Box
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div className="stock-progress" style={{ 
                      width: `${stockPct}%`, 
                      height: '100%', 
                      background: isLowStock ? '#DC2626' : 'linear-gradient(90deg, #10B981, #059669)',
                      borderRadius: '10px'
                    }}></div>
                  </div>
                </div>
                
                {/* TOMBOL PESAN SEKARANG - ANIMATED */}
                <button 
                  className="btn-buy"
                  onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/6281234567890?text=Halo%20Admin%20UD%20Putra%20Mandiri,%20saya%20tertarik%20memesan%20*${encodeURIComponent(p.name)}*.%20Apakah%20stoknya%20masih%20ada?`, '_blank'); }}
                  style={{ width: '100%', border: 'none', padding: '18px', borderRadius: '20px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: 'auto' }}
                >
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i> 
                  Beli Sekarang
                  <ArrowRight size={18} className="icon-slide" />
                </button>
              </div>

            </div>
          )})}
        </div>
        {products.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: '#A0AEC0', fontWeight: '500', fontSize: '16px' }}>Menghubungkan ke database produk...</div>}
      </div>

      {/* TESTIMONI PELANGGAN */}
      <div style={{ background: '#ffffff', padding: isMobile ? '80px 20px' : '120px 20px', borderTop: '1px solid #EDF2F7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '60px', textAlign: 'center' }}>
            <h4 style={{ color: '#D4AF37', letterSpacing: '2px', fontSize: '12px', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase' }}>Kata Mereka</h4>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '32px' : '42px', fontWeight: '800', margin: '0 0 16px' }}>Testimoni Pelanggan</h2>
            <p style={{ color: '#718096', fontSize: '15px', margin: '0 auto', fontWeight: '500', maxWidth: '600px', lineHeight: '1.6' }}>
              Kepercayaan dan kepuasan pelanggan adalah prioritas utama kami. Lihat apa kata mereka yang sudah mencicipi kelezatan produk UD Putra Mandiri.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
            {testimonials.map((t, index) => (
              <div key={index} style={{ 
                background: '#FBF9F6', borderRadius: '24px', padding: '32px', 
                boxShadow: '0 10px 30px rgba(54, 28, 20, 0.03)', border: '1px solid rgba(237,242,247,0.8)',
                position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'default'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Quote size={120} color="#681E1E" style={{ position: 'absolute', top: '-10px', right: '-20px', opacity: 0.05, transform: 'rotate(10deg)' }} />
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[...Array(t.rating)].map((_, i) => ( <Star key={i} size={18} fill="#D4AF37" color="#D4AF37" /> ))}
                </div>
                <p style={{ color: '#4A5568', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px', position: 'relative', zIndex: 2, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 2 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#1E293B', fontSize: '16px', fontWeight: '800' }}>{t.name}</h4>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HALAMAN TENTANG KAMI
// ==========================================
export function About() {
  const { isMobile } = useResponsive();
  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', maxWidth: '1100px', margin: '0 auto', gap: isMobile ? '32px' : '60px', alignItems: 'center', padding: isMobile ? '120px 20px 80px' : '160px 20px 80px' }}>
        <div style={{ flex: 1, width: '100%' }}>
          <img src="/istana-siak.jpeg" alt="Sejarah UD Putra Mandiri" style={{ width: '100%', height: isMobile ? '280px' : '450px', borderRadius: '30px', objectFit: 'cover', boxShadow: '0 20px 50px rgba(104,30,30,0.1)' }} />
        </div>
        <div style={{ flex: 1, width: '100%' }}>
          <h4 style={{ color: '#D4AF37', letterSpacing: '2px', fontSize: '12px', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase' }}>Sejarah Kami</h4>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '32px' : '42px', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px' }}>Cita Rasa Autentik dari Siak Sri Indrapura</h1>
          <p style={{ color: '#4A5568', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px' }}>UD Putra Mandiri berdiri dengan dedikasi untuk melestarikan resep leluhur. Kami mengolah hasil bumi terbaik menjadi hidangan dodol berkualitas premium yang manis, legit, dan higienis.</p>
          <p style={{ color: '#4A5568', fontSize: '15px', lineHeight: '1.8', marginBottom: '32px' }}>Setiap gigitan dodol kami adalah representasi dari kekayaan budaya dan keramahan masyarakat Siak. Melalui sistem manajemen modern dan kontrol kualitas yang ketat, kami memastikan setiap produk yang sampai ke tangan Anda adalah yang terbaik.</p>
          <div style={{ display: 'flex', gap: '40px' }}>
            <div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#681E1E', marginBottom: '8px' }}><Award size={24} /><h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>10+</h2></div><span style={{ color: '#718096', fontSize: '13px', fontWeight: '600' }}>Tahun Pengalaman</span></div>
            <div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#681E1E', marginBottom: '8px' }}><Leaf size={24} /><h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>100%</h2></div><span style={{ color: '#718096', fontSize: '13px', fontWeight: '600' }}>Bahan Alami</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HALAMAN KONTAK
// ==========================================
export function Contact() {
  const { isMobile } = useResponsive();
  const [form, setForm] = useState({ name: '', subject: '', content: '' });
  const [status, setStatus] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault(); setStatus('loading');
    try {
      let payload = { name: form.name, subject: form.subject, content: form.content, is_read: false };
      let { error } = await supabase.from('messages').insert([payload]);
      if (error) {
        payload = { sender_name: form.name, subject: form.subject, message: form.content, is_read: false };
        const fallback = await supabase.from('messages').insert([payload]);
        if (fallback.error) throw fallback.error;
      }
      setStatus('success'); setForm({ name: '', subject: '', content: '' }); setTimeout(() => setStatus(''), 5000);
    } catch (err) { setStatus('error'); }
  };

  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC', marginBottom: '20px' };

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ padding: isMobile ? '120px 20px 40px' : '160px 20px 40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '32px' : '42px', fontWeight: '800', marginBottom: '16px' }}>Hubungi Kami</h1>
        <p style={{ color: '#718096', fontSize: '15px' }}>Punya pertanyaan, kritik, atau saran? Kami siap melayani Anda.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', maxWidth: '1000px', margin: '0 auto', padding: '0 20px 80px', gap: '32px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: isMobile ? '24px' : '40px', boxShadow: '0 10px 40px rgba(104,30,30,0.04)' }}>
          <h3 style={{ fontSize: '20px', color: '#2D3748', fontWeight: '800', marginBottom: '32px' }}>Informasi Kontak</h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}><div style={{ background: '#FDF2F2', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#681E1E', flexShrink: 0 }}><MapPin size={20} /></div><div><h5 style={{ margin: '0 0 4px', fontSize: '14px', color: '#2D3748', fontWeight: '800' }}>Pusat Produksi</h5><p style={{ margin: 0, fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>Jl. Hang Tuah No. 12, Kampung Rempak, Siak</p></div></div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}><div style={{ background: '#FDF2F2', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#681E1E', flexShrink: 0 }}><Phone size={20} /></div><div><h5 style={{ margin: '0 0 4px', fontSize: '14px', color: '#2D3748', fontWeight: '800' }}>Telepon / WhatsApp</h5><p style={{ margin: 0, fontSize: '13px', color: '#718096', lineHeight: '1.6' }}>+62 812-3456-7890</p></div></div>
          <button onClick={() => window.open('https://wa.me/6281234567890?text=Halo%20Admin%20UD%20Putra%20Mandiri,%20saya%20butuh%20bantuan/informasi...', '_blank')} style={{ width: '100%', background: '#681E1E', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i> Chat Admin</button>
        </div>
        <div style={{ background: '#fff', borderRadius: '24px', padding: isMobile ? '24px' : '40px', boxShadow: '0 10px 40px rgba(104,30,30,0.04)' }}>
          <h3 style={{ fontSize: '20px', color: '#2D3748', fontWeight: '800', marginBottom: '32px' }}>Kirim Pesan</h3>
          {status === 'success' && <div style={{ background: '#ECFDF5', color: '#059669', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16}/> Pesan terkirim!</div>}
          <form onSubmit={handleSendMessage}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px', display: 'block' }}>NAMA ANDA</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} placeholder="John Doe" />
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px', display: 'block' }}>SUBJEK PESAN</label><input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} style={inputStyle} placeholder="Pesanan" />
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '8px', display: 'block' }}>PESAN</label><textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows="4" style={{...inputStyle, resize: 'none'}} placeholder="Tulis pesan..."></textarea>
            <button type="submit" disabled={status === 'loading'} style={{ background: '#D4AF37', color: '#fff', padding: '16px 32px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', boxShadow: '0 10px 25px rgba(212,175,55,0.3)', opacity: status === 'loading' ? 0.7 : 1 }}><Send size={16} /> {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FOOTER PREMIUM
// ==========================================
export function Footer({ onNavigate }) {
  const { isMobile, isTablet } = useResponsive();
  const gridTemplate = isMobile ? '1fr' : (isTablet ? '1fr 1fr' : '1.5fr 1fr 1fr 1.2fr 1fr');

  const [settings, setSettings] = useState({ site_title: 'UD Putra Mandiri', site_subtitle: 'Oleh-Oleh Khas Siak', site_logo: '' });

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <footer style={{ background: '#361C14', color: '#FBF9F6', position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB, #D4AF37)' }}></div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: isMobile || isTablet ? 'none' : '1px solid rgba(212, 175, 55, 0.2)', paddingRight: isMobile || isTablet ? '0' : '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {settings.site_logo ? (
                <img src={settings.site_logo} alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', background: '#fff', padding: '2px', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#D4AF37', color: '#361C14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px', flexShrink: 0 }}>
                  {settings.site_title ? settings.site_title.charAt(0) : 'P'}
                </div>
              )}
              <div>
                <h2 style={{ margin: 0, color: '#D4AF37', fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800' }}>SIMANIS</h2>
                <span style={{ fontSize: '11px', color: 'rgba(251, 249, 246, 0.6)', letterSpacing: '0.5px' }}>{settings.site_title}</span>
              </div>
            </div>
            <p style={{ margin: 0, color: 'rgba(251, 249, 246, 0.8)', fontSize: '13px', lineHeight: '1.6' }}>SIMANIS - Sistem Informasi Manajemen Dodol Khas Siak. Solusi digital untuk pengelolaan warisan kuliner Siak Sri Indrapura secara profesional dan terintegrasi.</p>
          </div>
          <div>
            <h3 style={{ color: '#D4AF37', fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderLeft: '3px solid #D4AF37', paddingLeft: '12px' }}>Tautan Cepat</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Beranda', 'Tentang Kami', 'Kontak', 'Login Pegawai'].map((item, i) => (
                <li key={i}><button onClick={() => onNavigate(['home', 'about', 'contact', 'login'][i])} style={{ background: 'none', border: 'none', color: 'rgba(251, 249, 246, 0.8)', padding: 0, cursor: 'pointer', fontSize: '13px', textAlign: 'left', transition: 'color 0.2s' }}>{item}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#D4AF37', fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderLeft: '3px solid #D4AF37', paddingLeft: '12px' }}>Hubungi Kami</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}><MapPin size={16} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} /><span style={{ color: 'rgba(251, 249, 246, 0.8)', fontSize: '13px', lineHeight: '1.6' }}>Jl. Hang Tuah No. 12, Kampung Rempak, Siak</span></div>
              <div style={{ display: 'flex', gap: '12px' }}><Phone size={16} color="#D4AF37" style={{ flexShrink: 0 }} /><span style={{ color: 'rgba(251, 249, 246, 0.8)', fontSize: '13px' }}>+62 812-3456-7890</span></div>
              <div style={{ display: 'flex', gap: '12px' }}><Mail size={16} color="#D4AF37" style={{ flexShrink: 0 }} /><span style={{ color: 'rgba(251, 249, 246, 0.8)', fontSize: '13px' }}>info@putramandiri.com</span></div>
            </div>
          </div>
          <div>
            <h3 style={{ color: '#D4AF37', fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderLeft: '3px solid #D4AF37', paddingLeft: '12px' }}>Dukungan Mitra</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '12px 8px', borderRadius: '8px' }}><ShieldCheck size={24} color="#D4AF37" /><span style={{ fontSize: '10px', color: 'rgba(251, 249, 246, 0.8)', textAlign: 'center', fontWeight: '600' }}>Dinas Koperasi & UKM</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '12px 8px', borderRadius: '8px' }}><Award size={24} color="#D4AF37" /><span style={{ fontSize: '10px', color: 'rgba(251, 249, 246, 0.8)', textAlign: 'center', fontWeight: '600' }}>Sertifikasi Halal & BPOM</span></div>
            </div>
          </div>
          <div>
            <h3 style={{ color: '#D4AF37', fontSize: '16px', fontWeight: '700', marginBottom: '20px', borderLeft: '3px solid #D4AF37', paddingLeft: '12px' }}>Ikuti Kami</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(251, 249, 246, 0.8)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}><i className="fa-brands fa-instagram" style={{ fontSize: '18px', color: '#D4AF37' }}></i> SIMANIS_Siak</a>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(251, 249, 246, 0.8)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}><i className="fa-brands fa-facebook" style={{ fontSize: '18px', color: '#D4AF37' }}></i> SIMANIS Siak</a>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(251, 249, 246, 0.8)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}><i className="fa-brands fa-linkedin" style={{ fontSize: '18px', color: '#D4AF37' }}></i> UD Putra Mandiri</a>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#26130E', padding: '20px', textAlign: 'center' }}>
        <span style={{ color: 'rgba(251, 249, 246, 0.5)', fontSize: '12px', letterSpacing: '0.5px' }}>&copy; {new Date().getFullYear()} Dinas Koperasi & UKM Kabupaten Siak. SIMANIS - {settings.site_title}. Hak Cipta Dilindungi Undang-Undang.</span>
      </div>
    </footer>
  );
}