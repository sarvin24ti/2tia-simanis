import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { CheckCircle, Camera, UserCircle, Lock, Mail } from 'lucide-react';

export default function ProfileEdit({ profile, onRefresh }) {
  const [name, setName] = useState(profile?.name || '');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState(profile?.profile_photo || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.profile_photo || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhotoUrl(profile.profile_photo || '');
      setPhotoPreview(profile.profile_photo || '');
    }
  }, [profile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess(false); setErrorMsg('');
    try {
      let finalPhotoUrl = photoUrl;
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('avatars').upload(fileName, photoFile);
        if (uploadErr) throw new Error('Gagal unggah foto');
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalPhotoUrl = urlData.publicUrl;
      }
      await DataModel.updateProfile(profile.id, { name, profile_photo: finalPhotoUrl });
      if (password.trim().length >= 6) await supabase.auth.updateUser({ password: password.trim() });
      setSuccess(true); setPassword(''); setPhotoFile(null);
      if (onRefresh) onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setErrorMsg(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '40px 20px', background: '#FBF9F6', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      
      <style>{`
        .premium-card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(54, 28, 20, 0.03);
          border: 1px solid rgba(237, 242, 247, 0.8);
          width: 100%;
          max-width: 480px;
          padding: 40px;
        }
        .input-modern {
          width: 100%; padding: 14px 16px 14px 44px; border-radius: 12px; border: 1px solid #E2E8F0;
          outline: none; font-size: 14px; background: #F8FAFC; color: #1E293B;
          transition: all 0.2s; box-sizing: border-box; font-weight: 500;
        }
        .input-modern:focus { border-color: #681E1E !important; background: #ffffff !important; box-shadow: 0 0 0 3px rgba(104, 30, 30, 0.1) !important; }
        .avatar-upload {
          position: relative; width: 110px; height: 110px; border-radius: 50%;
          margin: 0 auto 32px; background: #F1F5F9; border: 4px solid #fff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); cursor: pointer;
          display: flex; alignItems: center; justifyContent: center; overflow: hidden;
        }
      `}</style>

      <div className="premium-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 8px', fontWeight: '800', color: '#1E293B', fontFamily: 'Playfair Display, serif', fontSize: '24px' }}>Pengaturan Akun</h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '13px' }}>Update identitas profil Anda.</p>
        </div>

        {success && (
          <div style={{ padding: '12px', background: '#ECFDF5', color: '#059669', borderRadius: '12px', fontSize: '13px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> Berhasil diperbarui!
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <label className="avatar-upload">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ 
                fontSize: '40px', 
                fontWeight: '900', 
                color: '#CBD5E0',
                display: 'flex',           // Force centering
                alignItems: 'center',      // Vertical center
                justifyContent: 'center',  // Horizontal center
                width: '100%',
                height: '100%' 
              }}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
            
            <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0}>
              <Camera color="#fff" />
            </div>
            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </label>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Nama Lengkap</label>
            <div style={{ position: 'relative' }}>
              <UserCircle size={20} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" className="input-modern" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="#CBD5E0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" className="input-modern" value="owner@simanis.com" readOnly style={{ background: '#F1F5F9', color: '#94A3B8' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase' }}>Ganti Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="password" className="input-modern" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ 
            marginTop: '12px', padding: '16px', borderRadius: '14px', background: '#681E1E', color: '#fff', border: 'none', 
            fontWeight: '800', cursor: 'pointer', transition: '0.3s' 
          }}
          onMouseOver={e=>e.currentTarget.style.background='#4A1515'}
          onMouseOut={e=>e.currentTarget.style.background='#681E1E'}
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}