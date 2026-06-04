import React from 'react';
import { LogIn } from 'lucide-react';

export default function MainLayout({ children, onNavigate }) {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-brand">
          <div className="brand-logo">PM</div>
          <div className="brand-text font-serif">
            <h1>UD Putra Mandiri</h1>
            <p>Oleh-Oleh Khas Siak</p>
          </div>
        </div>
        <div className="nav-links">
          <a href="#">Beranda</a>
          <a href="#">Tentang Kami</a>
          <a href="#">Kontak</a>
        </div>
        <button className="btn-login-nav" onClick={() => onNavigate('login')}>
          <LogIn size={18} />
          Login Pegawai
        </button>
      </nav>
      {children}
      <footer className="footer">
        © 2026 UD Putra Mandiri
      </footer>
    </div>
  );
}
