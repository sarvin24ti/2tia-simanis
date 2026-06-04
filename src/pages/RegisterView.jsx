import React from 'react';
import { UserPlus, User, Key } from 'lucide-react';

export default function RegisterView({ onNavigate }) {
  return (
    <div className="auth-content">
      <div className="auth-icon-wrapper">
         <UserPlus size={20} />
      </div>
      
      <h2 className="auth-title font-serif" style={{color: '#333'}}>Daftar Akun Baru</h2>
      <p className="auth-subtitle">Buat kredensial pegawai sistem</p>

      <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onNavigate('login'); }}>
        <div className="input-group">
          <label className="input-label">Nama Lengkap</label>
          <div className="input-wrapper">
            <User size={16} className="input-icon" />
            <input type="text" placeholder="Masukkan nama Anda" className="auth-input" />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Username</label>
          <div className="input-wrapper">
            <User size={16} className="input-icon" />
            <input type="text" placeholder="Buat username" className="auth-input" />
          </div>
        </div>
        
        <div className="input-group">
          <label className="input-label">Password</label>
          <div className="input-wrapper">
            <Key size={16} className="input-icon" style={{transform: 'rotate(135deg)'}} />
            <input type="password" placeholder="Buat password" className="auth-input" />
          </div>
        </div>

        <button type="submit" className="btn-auth-submit">
          Daftar Sekarang
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-switch" onClick={() => onNavigate('login')}>
          Sudah memiliki akun? <span>Masuk di sini</span>
        </p>
      </div>
    </div>
  );
}