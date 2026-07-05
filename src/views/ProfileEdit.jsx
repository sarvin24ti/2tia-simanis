import React, { useState } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { CheckCircle } from 'lucide-react';

export default function ProfileEdit({ profile, onRefresh }) {
  const [name, setName] = useState(profile?.name || '');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState(profile?.profile_photo || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // 1. Update nama asli di profiles
      await DataModel.updateProfile(profile.id, { name, profile_photo: photoUrl });

      // 2. Jika isi field password diubah, ganti di supabase auth service
      if (password.trim().length >= 6) {
        await supabase.auth.updateUser({ password: password.trim() });
      }

      setSuccess(true);
      setPassword('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: '#fff', padding: '36px', borderRadius: '20px', border: '1px solid #EDF2F7', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <h4 style={{ margin: '0 0 24px', fontWeight: '800', color: '#2D3748' }}>Pengaturan Akun</h4>
        
        {success && (
          <div style={{ padding: '10px 14px', background: '#E6FFFA', color: '#234E52', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> Konfigurasi profil berhasil diperbarui!
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#718096', display: 'block', marginBottom: '6px' }}>Nama Lengkap</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px' }} />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#718096', display: 'block', marginBottom: '6px' }}>Tautan Foto Profil (URL)</label>
            <input type="text" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://link-foto.com/gambar.png" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px' }} />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#718096', display: 'block', marginBottom: '6px' }}>Ganti Kata Sandi Baru</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kosongkan jika tidak ingin diubah" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px' }} />
          </div>

          <button type="submit" disabled={loading} style={{ padding: '12px', background: '#681E1E', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' }}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}