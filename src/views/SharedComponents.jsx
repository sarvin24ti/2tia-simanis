import React, { useState, useEffect } from 'react';
import { 
  Bell, ChevronDown, UserCog, LogOut, 
  PieChart, Boxes, Users, FileText, Mail, Settings,
  Fingerprint, PlusSquare, History, X, Menu 
} from 'lucide-react';

export function Sidebar({ currentView, onNavigate, globalSettings, role = 'owner', isOpen, onClose }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ownerMenus = [
    { id: 'owner-dashboard', label: 'Ringkasan', icon: <PieChart size={18} /> },
    { id: 'kelola-stok', label: 'Kelola Stok', icon: <Boxes size={18} /> },
    { id: 'data-pegawai', label: 'Data Pegawai', icon: <Users size={18} /> },
    { id: 'laporan', label: 'Laporan', icon: <FileText size={18} /> },
    { id: 'messages', label: 'Kotak Masuk', icon: <Mail size={18} /> },
    { id: 'settings', label: 'Pengaturan Website', icon: <Settings size={18} /> }
  ];

  const empMenus = [
    { id: 'employee-dashboard', label: 'Ringkasan', icon: <PieChart size={18} /> },
    { id: 'emp-presensi', label: 'Presensi Harian', icon: <Fingerprint size={18} /> },
    { id: 'emp-produksi', label: 'Input Produksi', icon: <PlusSquare size={18} /> },
    { id: 'emp-aktivitas', label: 'Riwayat Aktivitas', icon: <History size={18} /> }
  ];

  const menus = role === 'employee' ? empMenus : ownerMenus;

  return (
    <>
      {/* Overlay Gelap Khusus Mobile */}
      {isMobile && isOpen && (
        <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1040 }}></div>
      )}

      <aside style={{ 
        width: '260px', background: '#681E1E', color: '#fff', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0,
        position: isMobile ? 'fixed' : 'sticky', top: 0, left: isMobile ? (isOpen ? 0 : '-260px') : 0, zIndex: 1050, transition: 'left 0.3s ease', boxShadow: isMobile && isOpen ? '10px 0 30px rgba(0,0,0,0.5)' : 'none'
      }}>
        <div style={{ padding: '32px 24px 40px', position: 'relative' }}>
          {isMobile && (
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
          )}
          <h2 style={{ color: '#D4AF37', fontSize: '20px', margin: '0 0 4px', fontWeight: '800', fontFamily: 'Playfair Display, serif' }}>
            {role === 'employee' ? 'Portal Pegawai' : 'Admin Panel'}
          </h2>
          <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{globalSettings?.site_title || 'UD Putra Mandiri'}</small>
        </div>
        <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
          {menus.map((m) => {
            const isActive = currentView === m.id;
            return (
              <li key={m.id}>
                <button onClick={() => { onNavigate(m.id); if(isMobile) onClose(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent', border: 'none', borderRadius: '8px', color: isActive ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: isActive ? '700' : '500', textAlign: 'left', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isActive ? 1 : 0.8 }}>{m.icon}</div>
                  {m.label}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}