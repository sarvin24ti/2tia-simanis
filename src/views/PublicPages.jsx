import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Send, ShoppingBag, CheckCircle, Award, Leaf, Menu, X, Mail, ShieldCheck } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div style={{ width: isMobile ? '36px' : '40px', height: isMobile ? '36px' : '40px', borderRadius: '50%', background: '#361C14', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: isMobile ? '14px' : '16px', flexShrink: 0 }}>PM</div>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', color: '#361C14', fontWeight: '800', whiteSpace: 'nowrap' }}>UD Putra Mandiri</h1>
          <span style={{ fontSize: '11px', color: '#A0AEC0', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>Oleh-Oleh Khas Siak</span>
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

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* HERO SECTION */}
      <div style={{ 
        position: 'relative', width: '100%', minHeight: isMobile ? '85vh' : '90vh',
        paddingTop: isMobile ? '120px' : '160px', paddingBottom: isMobile ? '100px' : '160px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #2A0808 0%, #4A1515 50%, #681E1E 100%)', overflow: 'hidden'
      }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.15) 2px, transparent 2px)', backgroundSize: '40px 40px', opacity: 0.5, zIndex: 1 }}></div>
        <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.25) 0%, transparent 60%)', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '900px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          
          <h4 style={{ color: '#D4AF37', letterSpacing: '3px', fontSize: isMobile ? '11px' : '13px', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase' }}>Katalog Resmi</h4>
          
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontSize: isMobile ? '36px' : '64px', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            Nikmati Kelezatan Dodol Buah Asli Khas Siak Sri Indrapura
          </h1>
          
          <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: '1.7', marginBottom: '40px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '750px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Dibuat dengan resep tradisional warisan kuliner yang legit dan buah pilihan segar. Pantau ketersediaan varian produk kami secara real-time langsung dari gudang penyimpanan.
          </p>
        </div>

        {/* LENGKUNGAN OMBAK */}
        <svg style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%', height: isMobile ? '60px' : '140px', zIndex: 2 }} preserveAspectRatio="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C320,120 420,0 720,0 C1020,0 1120,120 1440,60 L1440,120 L0,120 Z" fill="#FBF9F6" />
        </svg>
      </div>

      {/* SECTION KETERSEDIAAN STOK (DESAIN PREMIUM BARU) */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '40px 20px 80px' : '80px 20px 120px', position: 'relative', zIndex: 3 }}>
        
        <div style={{ marginBottom: '40px', textAlign: isMobile ? 'left' : 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '28px' : '36px', fontWeight: '800', margin: '0 0 12px' }}>Ketersediaan Stok</h2>
          <p style={{ color: '#718096', fontSize: '15px', margin: 0, fontWeight: '500' }}>Data terupdate secara otomatis dari setiap shift produksi karyawan.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
          {products.map((p, idx) => (
            <div key={idx} style={{ 
              background: '#fff', borderRadius: '24px', padding: '20px', 
              boxShadow: '0 10px 40px rgba(54, 28, 20, 0.05)', border: '1px solid rgba(237,242,247,0.8)', 
              transition: 'all 0.3s ease', cursor: 'pointer',
              display: 'flex', flexDirection: 'column'
            }} 
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'} 
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {/* Gambar Produk Real / Placeholder */}
              <div style={{ background: '#FAF5F2', height: '180px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden' }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ShoppingBag color="#B89B8E" size={60} strokeWidth={1.2} />
                )}
              </div>
              
              <h3 style={{ margin: '0 0 16px', fontSize: '20px', color: '#361C14', fontWeight: '800', fontFamily: 'Playfair Display, serif', flexGrow: 1 }}>
                {p.name}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px dashed #E2E8F0' }}>
                <span style={{ color: '#718096', fontSize: '13px', fontWeight: '600' }}>Siap Kirim:</span>
                <span style={{ 
                  background: p.stock_ready > p.stock_minimum ? '#E6FFFA' : '#FFF5F5', 
                  color: p.stock_ready > p.stock_minimum ? '#047857' : '#E53E3E', 
                  padding: '6px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '13px' 
                }}>
                  {p.stock_ready} Box
                </span>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: '#A0AEC0', fontWeight: '500', fontSize: '16px' }}>Menghubungkan ke database produk...</div>}
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
        <div style={{ width: '100%', background: '#D1B89E', height: isMobile ? '280px' : '450px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(104,30,30,0.1)' }}><ShoppingBag color="#fff" size={isMobile ? 64 : 100} opacity={0.6} strokeWidth={1} /></div>
        <div style={{ width: '100%' }}>
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
          <button style={{ width: '100%', background: '#681E1E', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><i className="fa-brands fa-whatsapp" style={{ fontSize: '18px' }}></i> Chat Admin</button>
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

  return (
    <footer style={{ background: '#361C14', color: '#FBF9F6', position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB, #D4AF37)' }}></div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: isMobile || isTablet ? 'none' : '1px solid rgba(212, 175, 55, 0.2)', paddingRight: isMobile || isTablet ? '0' : '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#D4AF37', color: '#361C14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px', flexShrink: 0 }}>PM</div>
              <div><h2 style={{ margin: 0, color: '#D4AF37', fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800' }}>SIMANIS</h2><span style={{ fontSize: '11px', color: 'rgba(251, 249, 246, 0.6)', letterSpacing: '0.5px' }}>UD Putra Mandiri</span></div>
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
        <span style={{ color: 'rgba(251, 249, 246, 0.5)', fontSize: '12px', letterSpacing: '0.5px' }}>&copy; {new Date().getFullYear()} Dinas Koperasi & UKM Kabupaten Siak. SIMANIS - UD Putra Mandiri. Hak Cipta Dilindungi Undang-Undang.</span>
      </div>
    </footer>
  );
}