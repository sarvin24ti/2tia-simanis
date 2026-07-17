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
    { id: 'owner-dashboard', label: 'Ringkasan', icon: <PieChart size={20} /> },
    { id: 'kelola-stok', label: 'Kelola Stok', icon: <Boxes size={20} /> },
    { id: 'data-pegawai', label: 'Data Pegawai', icon: <Users size={20} /> },
    { id: 'laporan', label: 'Laporan', icon: <FileText size={20} /> },
    { id: 'messages', label: 'Kotak Masuk', icon: <Mail size={20} /> },
    { id: 'settings', label: 'Pengaturan Website', icon: <Settings size={20} /> }
  ];

  const empMenus = [
    { id: 'employee-dashboard', label: 'Ringkasan', icon: <PieChart size={20} /> },
    { id: 'emp-presensi', label: 'Presensi Harian', icon: <Fingerprint size={20} /> },
    { id: 'emp-produksi', label: 'Input Produksi', icon: <PlusSquare size={20} /> },
    { id: 'emp-aktivitas', label: 'Riwayat Aktivitas', icon: <History size={20} /> }
  ];

  const menus = role === 'employee' ? empMenus : ownerMenus;

  return (
    <>
      <style>{`
        .sidebar-menu-clean {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 12px;
        }
        .sidebar-menu-clean:hover:not(.active) {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(6px);
        }
        .sidebar-menu-clean.active {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          color: #ffffff !important;
        }
        .sidebar-menu-clean .icon-wrapper {
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0.7;
        }
        .sidebar-menu-clean.active .icon-wrapper {
          opacity: 1;
          color: #D4AF37; 
        }
        .sidebar-menu-clean:hover .icon-wrapper {
          opacity: 1;
        }
        
        .batik-riau-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23D4AF37' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {isMobile && isOpen && (
        <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1040 }}></div>
      )}

      <aside style={{ 
        width: '280px', 
        background: 'linear-gradient(180deg, #8B2B2B 0%, #5A1818 100%)', 
        display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0,
        position: isMobile ? 'fixed' : 'sticky', 
        top: 0, 
        left: isMobile ? (isOpen ? 0 : '-280px') : 0, 
        zIndex: 1050, 
        transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
        boxShadow: isMobile && isOpen ? '15px 0 40px rgba(0,0,0,0.4)' : 'none',
        overflow: 'hidden'
      }}>
        
        <div className="batik-riau-overlay"></div>
        
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={{ padding: '32px 20px 24px', position: 'relative' }}>
            
            {/* PERBAIKAN TOMBOL CLOSE: Dikunci dimensinya agar bulat sempurna */}
            {isMobile && (
              <button 
                onClick={onClose} 
                style={{ 
                  position: 'absolute', 
                  top: '24px', 
                  right: '16px', 
                  width: '32px', 
                  height: '32px', 
                  minWidth: '32px', 
                  minHeight: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'rgba(255,255,255,0.15)', 
                  border: 'none', 
                  color: '#fff', 
                  padding: 0, // Padding dihapus agar tidak melar
                  borderRadius: '50%', 
                  cursor: 'pointer', 
                  backdropFilter: 'blur(4px)', 
                  zIndex: 10 
                }}
              >
                <X size={18} />
              </button>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', 
                borderRadius: '12px', background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A1818', 
                fontWeight: '900', fontSize: '20px', boxShadow: '0 4px 15px rgba(212,175,55,0.25)', 
                flexShrink: 0 
              }}>
                {globalSettings?.site_title ? globalSettings.site_title.charAt(0).toUpperCase() : 'P'}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: isMobile ? '36px' : '0' }}>
                <h2 style={{ color: '#F3E5AB', fontSize: '18px', margin: 0, fontWeight: '800', fontFamily: 'Playfair Display, serif', lineHeight: '1.2' }}>
                  {role === 'employee' ? 'Portal Pegawai' : 'Admin Panel'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0, fontWeight: '500', letterSpacing: '0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {globalSettings?.site_title || 'UD Putra Mandiri'}
                </p>
              </div>

            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: '0 16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
            {menus.map((m) => {
              const isActive = currentView === m.id;
              return (
                <li key={m.id}>
                  <button 
                    className={`sidebar-menu-clean ${isActive ? 'active' : ''}`}
                    onClick={() => { onNavigate(m.id); if(isMobile) onClose(); }} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '14px', 
                      width: '100%', padding: '14px 16px', 
                      background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent', 
                      border: 'none',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)', 
                      fontSize: '14px', fontWeight: isActive ? '700' : '500', 
                      cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    <div className="icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {m.icon}
                    </div>
                    {m.label}
                  </button>
                </li>
              );
            })}
          </ul>

        </div>
      </aside>
    </>
  );
}

export function LoadingSpinner() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '60vh',
      width: '100%', 
      flexDirection: 'column', 
      gap: '12px' 
    }}>
      <style>{`
        .simanis-spinner {
          width: 45px;
          height: 45px;
          border: 4px solid #F1F5F9;
          border-top: 4px solid #681E1E;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="simanis-spinner"></div>
      <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.5px' }}>Memuat data...</span>
    </div>
  );
}