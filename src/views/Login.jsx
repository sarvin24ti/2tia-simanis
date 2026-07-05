import React, { useState, useEffect } from 'react';
import { Lock, User, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../config/supabaseClient';

export default function Login() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Deteksi layar untuk responsifitas
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    // Fitur "Ingat Saya"
    const savedEmail = localStorage.getItem('simanis_remembered_email');
    if (savedEmail) { 
      setEmail(savedEmail); 
      setRememberMe(true); 
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    setMsg({ type: '', text: '' });
    
    try {
      if (rememberMe) localStorage.setItem('simanis_remembered_email', email);
      else localStorage.removeItem('simanis_remembered_email');
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error('Email atau kata sandi tidak sesuai!');
    } catch (err) { 
      setMsg({ type: 'error', text: err.message }); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      // Latar belakang gradasi lembut yang premium
      background: 'linear-gradient(135deg, #FBF9F6 0%, #F0EAE1 100%)', 
      // Memberikan jarak aman di HP agar tidak tertabrak tombol "Kembali ke Beranda"
      padding: isMobile ? '100px 20px 40px' : '40px' 
    }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        background: '#fff', 
        borderRadius: '24px', 
        boxShadow: '0 20px 50px rgba(54, 28, 20, 0.08)', 
        overflow: 'hidden', 
        position: 'relative' 
      }}>
        
        {/* Garis Aksen Gradasi Emas-Marun di bagian atas */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg, #681E1E, #D4AF37)' }}></div>
        
        <div style={{ padding: isMobile ? '32px 24px' : '48px 40px' }}>
          
          {/* Header Form */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ 
              background: '#FDF2F2', 
              width: isMobile ? '56px' : '64px', 
              height: isMobile ? '56px' : '64px', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: '#681E1E', marginBottom: '20px', 
              boxShadow: '0 10px 20px rgba(104,30,30,0.05)' 
            }}>
              <Lock size={isMobile ? 24 : 28} strokeWidth={2} />
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: isMobile ? '28px' : '32px', color: '#361C14', fontFamily: 'Playfair Display, serif', fontWeight: '800', textAlign: 'center' }}>
              Portal Pegawai
            </h1>
            <p style={{ margin: 0, color: '#718096', fontSize: isMobile ? '13px' : '14px', textAlign: 'center' }}>
              Silakan masuk untuk absen & input produksi
            </p>
          </div>

          {/* Alert Pesan Error */}
          {msg.text && (
            <div style={{ padding: '14px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', background: msg.type === 'success' ? '#ECFDF5' : '#FFF5F5', color: msg.type === 'success' ? '#059669' : '#E53E3E' }}>
              {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {msg.text}
            </div>
          )}

          <form onSubmit={handleAuth}>
            
            {/* Input Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#4A5568', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email Akun
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 16px' }}>
                <User size={18} color="#A0AEC0" style={{ marginRight: '12px', flexShrink: 0 }} />
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                  placeholder="nama@simanis.com" 
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: isMobile ? '14px 0' : '16px 0', outline: 'none', fontSize: '15px', color: '#2D3748', fontWeight: '600', width: '100%' }} 
                />
              </div>
            </div>

            {/* Input Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#4A5568', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Kata Sandi
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0 16px' }}>
                <Lock size={18} color="#A0AEC0" style={{ marginRight: '12px', flexShrink: 0 }} />
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••••••" 
                  style={{ flex: 1, border: 'none', background: 'transparent', padding: isMobile ? '14px 0' : '16px 0', outline: 'none', fontSize: '15px', color: '#2D3748', fontWeight: '600', width: '100%', letterSpacing: '2px' }} 
                />
              </div>
            </div>

            {/* Ingat Saya */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#4A5568', fontWeight: '500' }}>
                <input 
                  type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} 
                  style={{ width: '16px', height: '16px', accentColor: '#681E1E', cursor: 'pointer', margin: 0 }} 
                />
                Ingat data login saya
              </label>
            </div>

            {/* Tombol Login */}
            <button 
              type="submit" disabled={loading} 
              style={{ 
                width: '100%', 
                background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', 
                color: '#fff', 
                padding: isMobile ? '16px' : '18px', 
                borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '15px', 
                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', 
                boxShadow: '0 10px 25px rgba(104,30,30,0.25)', transition: 'transform 0.2s',
                opacity: loading ? 0.7 : 1 
              }}
            >
              {loading ? 'Memeriksa Kredensial...' : (
                <>Masuk ke Sistem <ArrowRight size={18} /></>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}