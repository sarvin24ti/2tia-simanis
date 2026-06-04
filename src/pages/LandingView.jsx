import React from 'react';

export default function LandingView() {
  return (
    <main className="hero-section">
      <span className="katalog-badge">KATALOG RESMI</span>
      <h2 className="hero-title font-serif">
        <span>Nikmati Kelezatan Dodol Buah</span><br />
        <span>Asli Khas Siak Sri Indrapura</span>
      </h2>
      <p className="hero-desc">
        Dibuat dengan resep tradisional dan buah pilihan. Cek ketersediaan stok kami
        secara real-time sebelum anda memesan
      </p>
      <button className="btn-lihat-produk">
        Lihat Produk
      </button>

      <div className="stock-section">
        <h3 className="stock-title font-serif font-bold">Ketersediaan Stok</h3>
        <p className="stock-subtitle">Update otomatis dari pabrik produksi kami.</p>

        <div className="product-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="product-card">
              <div className="product-img-bg">
                 <svg className="product-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                    <path d="M12 3v6"></path>
                  </svg>
              </div>
              <div className="product-info">
                <h4 className="product-name">Dodol Buah Naga</h4>
                <p className="product-price">
                  <span className="price">Rp. 15.000</span> <span className="unit">/ kotak</span>
                </p>
                <p className="product-desc">Dodol manis dengan ekstrak buah naga asli</p>
                <button className="btn-wa">Hubungi via WA</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}