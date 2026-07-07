import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { Save, Settings, UploadCloud } from 'lucide-react';

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

  const premiumCardStyle = { background: '#ffffff', borderRadius: '24px', padding: isMobile ? '24px 20px' : '40px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(237, 242, 247, 0.8)', width: '100%' };
  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC' };
  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase' };

  return (
    <div style={{ maxWidth: '900px', width: '100%' }}>
      <div style={premiumCardStyle}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #F1F5F9' }}>
          <div style={{ background: '#FDF2F2', padding: '14px', borderRadius: '16px', color: '#681E1E' }}><Settings size={28}/></div>
          <div>
            <h4 style={{ margin: '0 0 6px', fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: '#1E293B', fontFamily: 'Playfair Display, serif' }}>Konfigurasi Identitas & Sistem</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>Pengaturan ini akan langsung memengaruhi seluruh tampilan aplikasi.</p>
          </div>
        </div>

        {msg && (
          <div style={{ background: msg.includes('Gagal') ? '#FFF5F5' : '#ECFDF5', border: `1px solid ${msg.includes('Gagal') ? '#FEB2B2' : '#A7F3D0'}`, color: msg.includes('Gagal') ? '#C53030' : '#065F46', padding: '16px', borderRadius: '12px', fontWeight: '700', marginBottom: '24px', fontSize: '13px' }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
            <div><label style={labelStyle}>Nama Usaha (Site Title)</label><input type="text" required value={form.site_title} onChange={e => setForm({...form, site_title: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Slogan (Site Subtitle)</label><input type="text" value={form.site_subtitle} onChange={e => setForm({...form, site_subtitle: e.target.value})} style={inputStyle} /></div>
          </div>
          
          {/* AREA UPLOAD LOGO BARU */}
          <div>
            <label style={labelStyle}>Logo Usaha</label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', border: '2px dashed #CBD5E0', borderRadius: '16px', background: '#F8FAFC', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#681E1E'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E0'}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }} />
              ) : (
                <>
                  <UploadCloud size={32} color="#A0AEC0" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '13px', color: '#4A5568', fontWeight: '700' }}>Klik untuk unggah logo baru</span>
                  <span style={{ fontSize: '11px', color: '#A0AEC0', marginTop: '4px' }}>Format disarankan: PNG (Transparan)</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            </label>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
            <div><label style={labelStyle}>Batas Masuk Sif (Time In)</label><input type="time" required step="1" value={form.time_in} onChange={e => setForm({...form, time_in: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>Mulai Pulang (Time Out)</label><input type="time" required step="1" value={form.time_out} onChange={e => setForm({...form, time_out: e.target.value})} style={inputStyle} /></div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', marginTop: '16px' }}>
            <button type="submit" disabled={loading} style={{ width: isMobile ? '100%' : 'auto', background: '#681E1E', color: '#fff', padding: '16px 32px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', boxShadow: '0 4px 15px rgba(104,30,30,0.2)' }}>
              <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Konfigurasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}