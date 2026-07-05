import React from 'react';
import { Store } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div>
      {/* NAVBAR */}
      <nav style={{ background: '#fff', padding: '16px 0', borderBottom: '1px solid #EDF2F7' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#681E1E', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>PM</div>
            <div>
              <h1 style={{ fontSize: '16px', margin: 0, color: '#681E1E' }}>UD Putra Mandiri</h1>
              <small style={{ color: '#718096', fontSize: '11px' }}>Oleh-Oleh Khas Siak</small>
            </div>
          </div>
          <div style={{ display: 'none', gap: '24px', fontWeight: '600', fontSize: '14px', color: '#4A5568' }} className="md:flex-row">
            <span style={{ color: '#681E1E', cursor: 'pointer' }}>Beranda</span>
            <span style={{ cursor: 'pointer' }}>Tentang Kami</span>
            <span style={{ cursor: 'pointer' }}>Kontak</span>
          </div>
          <button onClick={() => onNavigate('login')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-right-to-bracket"></i> Login Pegawai
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="container section-py" style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: '#C19A6B', fontWeight: '700', letterSpacing: '2px', fontSize: '12px', marginBottom: '16px' }}>KATALOG RESMI</p>
        <h1 style={{ fontSize: '2.5rem', maxWidth: '700px', margin: '0 auto 20px', lineHeight: '1.3' }}>Nikmati Kelezatan Dodol Buah Asli Khas Siak Sri Indrapura</h1>
        <p style={{ color: '#718096', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6' }}>Dibuat dengan resep tradisional dan buah pilihan. Cek ketersediaan stok kami secara real-time sebelum anda memesan.</p>
        <button style={{ background: '#D4AF37', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '30px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>Lihat Produk</button>
      </section>

      {/* STOK GRID */}
      <section className="container section-py">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Ketersediaan Stok</h2>
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '32px' }}>Update otomatis dari pabrik produksi kami.</p>
        
        <div className="grid md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: '#EADDD7', borderRadius: '16px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={64} color="#C4A49A" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}