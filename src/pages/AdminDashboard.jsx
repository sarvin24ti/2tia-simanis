import React from 'react';
import { Store, Users, PieChart, FileText, LogOut, UserPlus, Bell, PlusCircle, AlertTriangle } from 'lucide-react';

const INVENTORY = [
  { id: 1, name: 'Dodol Naga', stock: 150, maxStock: 200, colorClass: 'bg-dark-red' },
  { id: 2, name: 'Dodol Nangka', stock: 12, maxStock: 100, colorClass: 'bg-yellow' },
  { id: 3, name: 'Dodol Durian', stock: 0, maxStock: 150, colorClass: 'bg-grey' },
  { id: 4, name: 'Dodol Original', stock: 85, maxStock: 150, colorClass: 'bg-dark-red' },
];

const TODAY_LOG = [
  { id: 1, name: 'M. Sarvin', time: '08:15 WIB', status: 'Tepat Waktu' },
  { id: 2, name: 'David Geraldo', time: '08:20 WIB', status: 'Tepat Waktu' },
  { id: 3, name: 'Rizkie Pratama', time: '08:45 WIB', status: 'Terlambat' },
];

export default function AdminDashboard({ onNavigate }) {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header font-serif">
          <h2 className="sidebar-title">Admin Panel</h2>
          <p className="sidebar-subtitle">UD Putra Mandiri</p>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <PieChart size={18} /> Ringkasan
          </a>
          <a href="#" className="nav-item">
            <Store size={18} /> Kelola Stok
          </a>
          <a href="#" className="nav-item">
            <Users size={18} /> Data Pegawai
          </a>
          <a href="#" className="nav-item">
            <FileText size={18} /> Laporan
          </a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => onNavigate('landing')} className="btn-logout-admin">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <h1>Dashboard Pemilik</h1>
          <div className="header-actions">
            <button className="btn-outline-primary">
              <UserPlus size={14} /> Tambah Pegawai
            </button>
            <button className="btn-notif">
              <Bell size={20} />
              <span className="notif-badge"></span>
            </button>
            <div className="admin-profile">
              <div className="profile-avatar">M</div>
              <span className="profile-name">Bang Muklis</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="summary-header">
            <p>Total Stok Siap</p>
            <h2>850</h2>
          </div>

          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-icon green"><Users size={24} /></div>
              <div className="stat-info">
                <p>Hadir Hari Ini</p>
                <div className="stat-value">
                  <span className="main">12</span>
                  <span className="sub">/15</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon grey"><PlusCircle size={24} /></div>
              <div className="stat-info">
                <p>Produksi Hari Ini</p>
                <div className="stat-value">
                  <span className="main">+120</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red"><AlertTriangle size={24} /></div>
              <div className="stat-info">
                <p>Stok Menipis</p>
                <div className="stat-value">
                  <span className="main">1</span>
                  <span className="sub red">(Durian)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="monitor-card">
              <h3 className="monitor-title">Monitoring Stok per Varian</h3>
              
              <div className="progress-list">
                {INVENTORY.map((item) => {
                  const percentage = Math.min(100, (item.stock / item.maxStock) * 100);
                  return (
                    <div key={item.id} className="progress-item">
                      <div className="progress-info">
                        <span className="progress-name">{item.name}</span>
                        <span className="progress-val">{item.stock} <span>/ {item.maxStock}</span></span>
                      </div>
                      <div className="progress-bg">
                        <div 
                          className={`progress-bar ${item.colorClass}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="monitor-card">
              <div className="log-header">
                <h3>Log Kehadiran Hari Ini</h3>
                <a href="#" className="log-link">Lihat Semua</a>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>NAMA KARYAWAN</th>
                      <th>JAM MASUK</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TODAY_LOG.map((log) => (
                      <tr key={log.id}>
                        <td className="td-name">{log.name}</td>
                        <td className="td-time">{log.time}</td>
                        <td>
                          <span className={`badge ${log.status === 'Tepat Waktu' ? 'success' : 'warning'}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}