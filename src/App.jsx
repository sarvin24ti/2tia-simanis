import React, { useEffect, useState } from 'react';
import { ChevronDown, UserCog, LogOut, Bell, ArrowLeft, Menu } from 'lucide-react';
import { useAppController } from './controllers/useAppController';
import { DataModel } from './models/dataModel';
import { Sidebar } from './views/SharedComponents';
import Login from './views/Login';
import OwnerDashboard from './views/OwnerDashboard';
import OwnerSettings from './views/OwnerSettings';
import OwnerMessages from './views/OwnerMessages';
import EmployeeDashboard from './views/EmployeeDashboard';
import ProfileEdit from './views/ProfileEdit';
import KelolaStok from './views/KelolaStok';
import DataPegawai from './views/DataPegawai';
import Laporan from './views/Laporan';
import { LoadingSpinner } from "./views/SharedComponents";
import { PublicNavbar, Home, About, Contact, Footer } from './views/PublicPages';

export default function App() {
  const controller = useAppController();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([]);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [guestView, setGuestView] = useState('home'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadUnreadNotif = async () => {
    if (controller.profile?.role === 'owner') {
      try {
        const msg = await DataModel.getMessages();
        const sortedMsg = [...(msg || [])].sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
          return timeB - timeA;
        });
        const unread = sortedMsg.filter(m => !m.is_read);
        setUnreadMessages(unread);
        setUnreadCount(unread.length);
      } catch (err) { console.error(err.message); }
    }
  };

  useEffect(() => { if (controller.profile?.role === 'owner') loadUnreadNotif(); }, [controller.profile]);

  if (controller.loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF9F6', color: '#681E1E', fontWeight: '700' }}><LoadingSpinner /></div>;

  if (!controller.profile) {
    if (guestView === 'login') {
      return (
        <div style={{ position: 'relative' }}>
          <button onClick={() => setGuestView('home')} style={{ position: 'absolute', top: isMobile ? '16px' : '32px', left: isMobile ? '16px' : '40px', background: '#fff', border: '1px solid #EDF2F7', padding: '10px 16px', borderRadius: '30px', fontWeight: '700', color: '#4A5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <ArrowLeft size={16} /> {!isMobile && 'Kembali ke Beranda'}
          </button>
          <Login />
        </div>
      );
    }
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <PublicNavbar onNavigate={setGuestView} />
        {guestView === 'home' && <Home />}
        {guestView === 'about' && <About />}
        {guestView === 'contact' && <Contact />}
        <Footer onNavigate={setGuestView} />
      </div>
    );
  }

  const isOwner = controller.profile?.role === 'owner';
  const isEmployee = controller.profile?.role === 'employee';

  const getPageTitle = () => {
    const v = controller.currentView;
    if (v === 'owner-dashboard' || v === 'employee-dashboard') return 'Ringkasan';
    if (v === 'settings') return 'Pengaturan Website';
    if (v === 'messages') return 'Kotak Masuk';
    if (v === 'kelola-stok') return 'Manajemen Stok';
    if (v === 'data-pegawai') return 'Database Pegawai';
    if (v === 'laporan') return 'Laporan';
    if (v === 'emp-presensi') return 'Presensi Harian';
    if (v === 'emp-produksi') return 'Input Produksi';
    if (v === 'emp-aktivitas') return 'Riwayat Aktivitas';
    if (v === 'profile') return 'Pengaturan Profil';
    return 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6F8', fontFamily: 'Inter, sans-serif' }}>
      
      <Sidebar role={controller.profile.role} currentView={controller.currentView} onNavigate={controller.setCurrentView} globalSettings={controller.globalSettings} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main style={{ flexGrow: 1, padding: isMobile ? '16px' : '32px 40px', overflowY: 'auto', height: '100vh', overflowX: 'hidden' }}>
        
        {/* HEADER DASHBOARD (DIPERBAIKI 100% UNTUK MOBILE & DESKTOP) */}
        <header style={{ 
          display: 'flex', 
          flexDirection: 'row', // SELALU SATU BARIS
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: isMobile ? '24px' : '40px',
          background: '#ffffff', // Header bergaya Card
          padding: isMobile ? '12px 16px' : '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}>
          
          {/* Bagian Kiri (Menu Hamburger + Judul) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} style={{ background: '#F8FAFC', border: '1px solid #EDF2F7', padding: '10px', borderRadius: '12px', color: '#2D3748', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Menu size={20} />
              </button>
            )}
            <h2 style={{ 
              fontSize: isMobile ? '20px' : '24px', color: '#2D3748', margin: 0, fontWeight: '800', fontFamily: 'Playfair Display, serif',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? '160px' : 'none'
            }}>
              {getPageTitle()}
            </h2>
          </div>
          
          {/* Bagian Kanan (Notifikasi + Profil) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}>
            
            {/* Ikon Lonceng Notifikasi */}
            {isOwner && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowDropdown(false); }} style={{ background: '#F8FAFC', border: '1px solid #EDF2F7', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={isMobile ? 20 : 22} color="#4A5568" />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#E53E3E', color: '#fff', fontSize: '10px', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid #fff' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div style={{ position: 'absolute', right: isMobile ? '-40px' : 0, marginTop: '12px', width: isMobile ? '300px' : '340px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #EDF2F7', zIndex: 110, overflow: 'hidden' }}>
                    <div style={{ padding: '16px', background: '#F8FAFC', borderBottom: '1px solid #EDF2F7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', color: '#2D3748', fontSize: '14px' }}>Notifikasi Pesan</span>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {unreadMessages.slice(0, 5).map(m => (
                        <div key={m.id} onClick={() => { controller.setCurrentView('messages'); setShowNotifDropdown(false); }} style={{ padding: '16px', borderBottom: '1px solid #EDF2F7', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontWeight: '800', fontSize: '13px', color: '#2D3748' }}>{m.name || m.sender_name || m.pengirim || 'Tanpa Nama'}</div>
                          <div style={{ fontSize: '12px', color: '#718096', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.subject}</div>
                        </div>
                      ))}
                      {unreadMessages.length === 0 && <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: '#A0AEC0' }}>Tidak ada pesan baru.</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Foto Profil / Avatar */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => { setShowDropdown(!showDropdown); setShowNotifDropdown(false); }} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: 0 }}>
                <div style={{ width: isMobile ? '38px' : '44px', height: isMobile ? '38px' : '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0D6EFD, #0043A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '16px', boxShadow: '0 4px 10px rgba(13, 110, 253, 0.3)' }}>
                  {controller.profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                {/* Nama hanya muncul di layar PC/Laptop */}
                {!isMobile && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: '#2D3748' }}>{controller.profile?.name?.split(' ')[0] || 'User'}</span>
                    <span style={{ fontSize: '11px', color: '#718096', fontWeight: '600' }}>{isOwner ? 'Pemilik' : 'Karyawan'}</span>
                  </div>
                )}
                {!isMobile && <ChevronDown size={16} color="#718096" strokeWidth={2.5} />}
              </button>

              {/* Menu Dropdown Profil */}
              {showDropdown && (
                <div style={{ position: 'absolute', right: 0, marginTop: '12px', width: '200px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #EDF2F7', padding: '8px', zIndex: 110 }}>
                  <button onClick={() => { controller.setCurrentView('profile'); setShowDropdown(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: '#4A5568', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#F8FAFC'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    <UserCog size={18} /> <span style={{ fontWeight: '600' }}>Pengaturan Akun</span>
                  </button>
                  <button onClick={() => { controller.logout(); setShowDropdown(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: '#E53E3E', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#FFF5F5'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    <LogOut size={18} /> <span style={{ fontWeight: '700' }}>Keluar Sistem</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* AREA KONTEN DASHBOARD */}
        <div style={{ width: '100%' }}>
          {isOwner && controller.currentView === 'owner-dashboard' && <OwnerDashboard />}
          {isOwner && controller.currentView === 'settings' && <OwnerSettings globalSettings={controller.globalSettings} onRefresh={controller.refreshSettings} />}
          {isOwner && controller.currentView === 'messages' && <OwnerMessages onRefreshNotif={loadUnreadNotif} />}
          {isOwner && controller.currentView === 'kelola-stok' && <KelolaStok />}
          {isOwner && controller.currentView === 'data-pegawai' && <DataPegawai />}
          {isOwner && controller.currentView === 'laporan' && <Laporan />}
          
          {isEmployee && controller.currentView === 'employee-dashboard' && <EmployeeDashboard userId={controller.user.id} activeTab="ringkasan" />}
          {isEmployee && controller.currentView === 'emp-presensi' && <EmployeeDashboard userId={controller.user.id} activeTab="presensi" />}
          {isEmployee && controller.currentView === 'emp-produksi' && <EmployeeDashboard userId={controller.user.id} activeTab="produksi" />}
          {isEmployee && controller.currentView === 'emp-aktivitas' && <EmployeeDashboard userId={controller.user.id} activeTab="aktivitas" />}

          {controller.currentView === 'profile' && <ProfileEdit profile={controller.profile} onRefresh={controller.refreshProfile} />}
        </div>
      </main>
    </div>
  );
}