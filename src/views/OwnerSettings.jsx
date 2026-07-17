import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { Save, Settings, UploadCloud } from 'lucide-react';
import { LoadingSpinner } from "./SharedComponents";

export default function OwnerSettings({ globalSettings, onRefresh }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [form, setForm] = useState({ site_title: '', site_subtitle: '', site_logo: '', time_in: '', time_out: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // State khusus untuk upload logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    if (globalSettings) {
      setForm({
        site_title: globalSettings.site_title || '', 
        site_subtitle: globalSettings.site_subtitle || '',
        site_logo: globalSettings.site_logo || '', 
        time_in: globalSettings.time_in || '', 
        time_out: globalSettings.time_out || ''
      });
      // Set preview gambar jika sudah ada logo tersimpan
      setLogoPreview(globalSettings.site_logo || '');
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [globalSettings]);

  // Fungsi untuk menangkap file yang dipilih dari device
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    setMsg('');
    
    try {
      let finalLogoUrl = form.site_logo;

      // Jika user mengunggah file baru, proses ke Supabase Storage (bucket 'assets')
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('assets').upload(fileName, logoFile);
        
        if (uploadErr) throw uploadErr;
        
        const { data: urlData } = supabase.storage.from('assets').getPublicUrl(fileName);
        finalLogoUrl = urlData.publicUrl;
      }

      const payload = { ...form, site_logo: finalLogoUrl };
      await DataModel.updateSettings(payload);
      
      setMsg('Konfigurasi berhasil diperbarui!');
      if (onRefresh) onRefresh();
      setTimeout(() => setMsg(''), 3000);
      
    } catch (err) { 
      setMsg('Gagal: ' + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px', background: '#FBF9F6', minHeight: '100vh', maxWidth: '100vw', overflowX: 'hidden' }}>
      
      <style>{`
        .premium-card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(54, 28, 20, 0.03);
          border: 1px solid rgba(237, 242, 247, 0.8);
          transition: all 0.3s ease;
        }
        .premium-card:hover { box-shadow: 0 15px 50px rgba(54, 28, 20, 0.06); }
        .input-modern {
          width: 100%; padding: 16px 18px; border-radius: 12px; border: 1px solid #E2E8F0;
          outline: none; font-size: 14px; background: #F8FAFC; color: #1E293B;
          transition: all 0.2s; box-sizing: border-box; font-weight: 500;
        }
        .input-modern:focus {
          border-color: #681E1E !important; background: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(104, 30, 30, 0.1) !important;
        }
        .upload-area { border: 2px dashed #CBD5E0; background: #F8FAFC; transition: all 0.3s; }
        .upload-area:hover { border-color: #681E1E; background: #FDF2F2; }
        .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER PAGE */}
      <div className="fade-in-up" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '28px' : '36px', fontWeight: '800', margin: '0 0 8px' }}>
          Pengaturan Website
        </h1>
        <p style={{ color: '#718096', fontSize: '15px', margin: 0, fontWeight: '500' }}>Sesuaikan identitas bisnis dan jam operasional sistem.</p>
      </div>

      <div className="premium-card fade-in-up" style={{ maxWidth: '900px', width: '100%', padding: isMobile ? '24px 20px' : '40px', animationDelay: '0.1s' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #F1F5F9' }}>
          <div style={{ background: '#FDF2F2', padding: '14px', borderRadius: '16px', color: '#681E1E' }}><Settings size={28}/></div>
          <div>
            <h4 style={{ margin: '0 0 6px', fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: '#1E293B', fontFamily: 'Playfair Display, serif' }}>Konfigurasi Identitas & Sistem</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>Pengaturan ini akan langsung memengaruhi seluruh tampilan aplikasi.</p>
          </div>
        </div>

        {msg && (
          <div style={{ background: msg.includes('Gagal') ? '#FFF5F5' : '#ECFDF5', border: `1px solid ${msg.includes('Gagal') ? '#FEB2B2' : '#A7F3D0'}`, color: msg.includes('Gagal') ? '#C53030' : '#065F46', padding: '16px', borderRadius: '12px', fontWeight: '700', marginBottom: '24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{width: '6px', height: '6px', borderRadius: '50%', background: msg.includes('Gagal') ? '#C53030' : '#065F46'}}></div>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <label style={labelStyle}>Nama Usaha (Site Title)</label>
              <input type="text" required className="input-modern" placeholder="Masukkan nama bisnis..." value={form.site_title} onChange={e => setForm({...form, site_title: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Slogan (Site Subtitle)</label>
              <input type="text" className="input-modern" placeholder="Masukkan slogan..." value={form.site_subtitle} onChange={e => setForm({...form, site_subtitle: e.target.value})} />
            </div>
          </div>
          
          {/* AREA UPLOAD LOGO BARU (Desain Lebih Interaktif) */}
          <div>
            <label style={labelStyle}>Logo Usaha</label>
            <label className="upload-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', borderRadius: '16px', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
              {logoPreview ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} />
                  {/* Overlay efek saat di-hover */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0}>
                    <UploadCloud size={32} color="#681E1E" style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '13px', color: '#681E1E', fontWeight: '800' }}>Ganti Logo</span>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ background: '#fff', padding: '16px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
                    <UploadCloud size={32} color="#A0AEC0" />
                  </div>
                  <span style={{ fontSize: '14px', color: '#4A5568', fontWeight: '800' }}>Klik untuk unggah logo baru</span>
                  <span style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '6px' }}>Format disarankan: PNG (Transparan) maks 2MB</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            </label>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <label style={labelStyle}>Batas Masuk Sif (Time In)</label>
              <input type="time" required step="1" className="input-modern" value={form.time_in} onChange={e => setForm({...form, time_in: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Mulai Pulang (Time Out)</label>
              <input type="time" required step="1" className="input-modern" value={form.time_out} onChange={e => setForm({...form, time_out: e.target.value})} />
            </div>
          </div>
          
          {/* TOMBOL SIMPAN KELAS ATAS */}
          <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', marginTop: '8px', borderTop: '2px solid #F1F5F9', paddingTop: '24px' }}>
            <button type="submit" disabled={loading} style={{ 
              width: isMobile ? '100%' : 'auto', 
              background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', 
              color: '#fff', padding: '16px 36px', borderRadius: '14px', border: 'none', 
              fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', gap: '10px', fontSize: '14px', 
              boxShadow: '0 10px 25px rgba(104,30,30,0.2)', transition: 'all 0.3s' 
            }}
            onMouseOver={e => { if(!loading) {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(104,30,30,0.3)';} }}
            onMouseOut={e => { if(!loading) {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(104,30,30,0.2)';} }}
            >
              <Save size={18} /> {loading ? 'Menyimpan Konfigurasi...' : 'Simpan Konfigurasi'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}