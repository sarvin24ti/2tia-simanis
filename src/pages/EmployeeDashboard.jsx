import React, { useState, useEffect } from 'react';
import { LogOut, CheckCircle, Fingerprint, ChevronDown, ArrowRight, Settings } from 'lucide-react';

export default function EmployeeDashboard({ onNavigate }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="emp-dashboard">
      <div className="emp-header">
        <div className="emp-greeting">
          <h1>Halo, Sarvin! <span style={{fontSize: '1.5rem'}}>👋</span></h1>
          <p>Semangat bekerja hari ini.</p>
        </div>
        <div>
          <button onClick={() => onNavigate('admin')} className="btn-icon">
            <LogOut size={20} style={{transform: 'rotate(180deg)'}} />
          </button>
        </div>
      </div>

      <div className="emp-grid">
        <div className="card attendance-card">
          <h2 className="card-title">Presensi Harian</h2>
          
          <div className="clock-display">
            <div className="clock-time">{formatTime(time)}</div>
            <div className="clock-date">{formatDate(time)}</div>
          </div>

          <button className="btn-hadir">
            <Fingerprint size={48} strokeWidth={1} />
            <span>HADIR</span>
          </button>

          <div className="status-badge">
            <CheckCircle size={14} />
            Anda belum absen hari ini
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
             <div style={{width: '20px', height: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px'}}>
                <div style={{width: '100%', height: '3px', backgroundColor: 'var(--primary)'}}></div>
                <div style={{width: '75%', height: '3px', backgroundColor: 'var(--primary)'}}></div>
             </div>
            Input Hasil Produksi
          </h2>

          <form className="production-form">
            <div className="input-group">
              <label className="input-label" style={{color: '#6B7280'}}>Varian Dodol</label>
              <div className="select-wrapper">
                <select className="form-control">
                  <option>Pilih Varian...</option>
                  <option>Dodol Buah Naga</option>
                  <option>Dodol Nangka</option>
                  <option>Dodol Durian</option>
                  <option>Dodol Original</option>
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{color: '#6B7280'}}>Jumlah Jadi (Kotak)</label>
              <input type="text" placeholder="Contoh: 50" className="form-control" />
            </div>

            <div className="input-group">
              <label className="input-label" style={{color: '#6B7280'}}>Keterangan (Opsional)</label>
              <textarea rows="3" placeholder="-" className="form-control" style={{resize: 'none'}}></textarea>
            </div>

            <button type="button" className="btn-submit-prod">
              Simpan ke Stok Gudang
            </button>
          </form>
        </div>
      </div>

      <div className="card activity-section">
        <h2 className="card-title" style={{marginBottom: '1rem'}}>Aktivitas Terakhir Saya</h2>
        
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon-green">
                <div style={{display: 'flex', gap: '2px'}}>
                  <div style={{width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%'}}></div>
                  <div style={{width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%'}}></div>
                  <div style={{width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%'}}></div>
                </div>
              </div>
              <div>
                <p className="activity-title">Input Produksi: Dodol Naga</p>
                <p className="activity-time">Kemarin, 16:30</p>
              </div>
            </div>
            <span className="activity-val-bold">+40 Kotak</span>
          </div>

          <div className="activity-item">
            <div className="activity-left">
              <div className="activity-icon-blue">
                <ArrowRight size={16} />
              </div>
              <div>
                <p className="activity-title">Absen Pulang</p>
                <p className="activity-time">Kemarin, 17:05</p>
              </div>
            </div>
            <span className="activity-val-italic">Selesai</span>
          </div>
        </div>

        <div className="fab-menu">
          <button><Settings size={20} /></button>
          <button onClick={() => onNavigate('landing')}><LogOut size={20} /></button>
        </div>
      </div>
    </div>
  );
}