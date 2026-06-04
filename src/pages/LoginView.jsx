import React from 'react';
import { User, Key } from 'lucide-react';

export default function LoginView({ onNavigate }) {
  return (
    <div className="auth-content">
      <div className="auth-icon-wrapper">
         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
        </svg>
      </div>
      
      <h2 className="auth-title font-serif">Portal Pegawai</h2>
      <p className="auth-subtitle">Silakan masuk untuk absen & input produksi</p>

      <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onNavigate('employee'); }}>
        <div className="input-group">
          <label className="input-label">Username</label>
          <div className="input-wrapper">
            <User size={16} className="input-icon" />
            <input type="text" defaultValue="karyawan_sarvin" className="auth-input" />
          </div>
        </div>
        
        <div className="input-group">
          <label className="input-label">Password</label>
          <div className="input-wrapper">
            <Key size={16} className="input-icon" style={{transform: 'rotate(135deg)'}} />
            <input type="password" defaultValue="............" className="auth-input" style={{letterSpacing: '2px'}} />
          </div>
        </div>

        <div className="auth-options">
          <label className="checkbox-label">
            <input type="checkbox" />
            Ingat saya
          </label>
          <a href="#" className="link-forgot">Lupa Password?</a>
        </div>

        <button type="submit" className="btn-auth-submit">
          Masuk ke Sistem
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">Sistem Internal UD Putra Mandiri</p>
        <p className="auth-switch" onClick={() => onNavigate('register')}>
          Belum memiliki akun? <span>Daftar di sini</span>
        </p>
      </div>
    </div>
  );
}