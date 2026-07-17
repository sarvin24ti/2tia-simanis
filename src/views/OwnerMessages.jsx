import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { Mail, MailOpen, Trash2, CheckCircle, ArrowUpDown, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from "./SharedComponents";

export default function OwnerMessages({ onRefreshNotif }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    loadMessages();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try { setMessages(await DataModel.getMessages() || []); } 
    catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Hapus permanen pesan ini?')) {
      await DataModel.deleteMessage(id); loadMessages();
      if (onRefreshNotif) onRefreshNotif();
    }
  };

  const handleRead = async (id) => {
    await DataModel.markMessageAsRead(id); loadMessages();
    if (onRefreshNotif) onRefreshNotif();
  };

  const handleMarkAllRead = async () => {
    const unreadMsgs = messages.filter(m => !m.is_read);
    await Promise.all(unreadMsgs.map(m => DataModel.markMessageAsRead(m.id)));
    loadMessages(); if (onRefreshNotif) onRefreshNotif();
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px', background: '#FBF9F6', minHeight: '100vh', maxWidth: '100vw', overflowX: 'hidden' }}>
      
      <style>{`
        .premium-card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(54, 28, 20, 0.03);
          border: 1px solid rgba(237, 242, 247, 0.8);
        }
        .msg-row {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 16px;
          border-bottom: 1px solid #F1F5F9;
        }
        .msg-row:last-child { border-bottom: none; }
        .msg-row:hover {
          background-color: #ffffff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          transform: scale(1.005);
          z-index: 10;
          position: relative;
        }
        .action-btn { transition: all 0.2s; }
        .action-btn.read:hover { background: #D1FAE5 !important; transform: scale(1.05); }
        .action-btn.del:hover { background: #FEE2E2 !important; transform: scale(1.05); }
        
        .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER PAGE - PERBAIKAN Z-INDEX DI SINI */}
      <div className="fade-in-up" style={{ position: 'relative', zIndex: 50, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '32px', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '28px' : '36px', fontWeight: '800', margin: '0 0 8px' }}>
            Kotak Masuk
          </h1>
          <p style={{ color: '#718096', fontSize: '15px', margin: 0, fontWeight: '500' }}>
            Anda memiliki <strong style={{ color: '#E53E3E' }}>{unreadCount} pesan baru</strong> yang belum dibaca.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: isMobile ? '100%' : 'auto', flexDirection: isMobile ? 'column' : 'row' }}>
          
          <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              style={{ width: '100%', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', fontWeight: '700', color: '#4A5568', fontSize: '13px', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#CBD5E0'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={16} color="#718096" />
                {sortOrder === 'desc' ? 'Terbaru ke Terlama' : 'Terlama ke Terbaru'}
              </div>
              <ChevronDown size={16} />
            </button>
            
            {showSortMenu && (
              <div style={{ position: 'absolute', top: '110%', right: 0, width: '100%', minWidth: '180px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', zIndex: 100, overflow: 'hidden' }}>
                <div onClick={() => {setSortOrder('desc'); setShowSortMenu(false)}} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: sortOrder === 'desc' ? '800' : '600', color: sortOrder === 'desc' ? '#681E1E' : '#4A5568', cursor: 'pointer', background: sortOrder === 'desc' ? '#FDF2F2' : 'transparent' }}>Terbaru ke Terlama</div>
                <div onClick={() => {setSortOrder('asc'); setShowSortMenu(false)}} style={{ padding: '12px 16px', fontSize: '13px', fontWeight: sortOrder === 'asc' ? '800' : '600', color: sortOrder === 'asc' ? '#681E1E' : '#4A5568', cursor: 'pointer', background: sortOrder === 'asc' ? '#FDF2F2' : 'transparent' }}>Terlama ke Terbaru</div>
              </div>
            )}
          </div>

          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} style={{ width: isMobile ? '100%' : 'auto', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '14px 20px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#D1FAE5'} onMouseOut={e=>e.currentTarget.style.background='#ECFDF5'}>
              <CheckCircle size={18} /> Tandai Semua Dibaca
            </button>
          )}
        </div>
      </div>

      {/* CONTAINER PESAN */}
      <div className="premium-card fade-in-up" style={{ padding: isMobile ? '16px' : '24px', animationDelay: '0.1s', position: 'relative', zIndex: 10 }}>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            
            {!isMobile && (
              <div style={{ display: 'grid', gridTemplateColumns: '50px 180px 1fr 100px', gap: '16px', padding: '0 16px 12px', borderBottom: '2px solid #F1F5F9', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
                <span style={{ color: '#94A3B8', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pengirim</span>
                <span style={{ color: '#94A3B8', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subjek & Isi Pesan</span>
                <span style={{ color: '#94A3B8', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Aksi</span>
              </div>
            )}

            {sortedMessages.map(m => {
              const dateObj = m.created_at ? new Date(m.created_at) : new Date();
              const dateStr = dateObj.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});
              const isUnread = !m.is_read;

              return (
                <div key={m.id} className="msg-row" style={{ 
                  display: isMobile ? 'flex' : 'grid', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gridTemplateColumns: '50px 180px 1fr 100px', 
                  gap: isMobile ? '12px' : '16px', 
                  padding: '16px', 
                  alignItems: isMobile ? 'flex-start' : 'center',
                  background: isUnread ? '#F8FAFC' : 'transparent'
                }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
                    <div style={{ position: 'relative' }}>
                      {isUnread ? <Mail size={22} color="#3B82F6" strokeWidth={2.5} /> : <MailOpen size={22} color="#CBD5E0" />}
                      {isUnread && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%', border: '2px solid #F8FAFC' }} />}
                    </div>
                    {isMobile && <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600' }}>{dateStr}</span>}
                  </div>

                  <div style={{ fontWeight: isUnread ? '800' : '600', color: isUnread ? '#1E293B' : '#64748B', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.name || m.sender_name || m.pengirim || 'Tanpa Nama'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden', width: '100%' }}>
                    <div style={{ fontWeight: isUnread ? '800' : '600', color: isUnread ? '#1E293B' : '#4A5568', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.subject}
                    </div>
                    <div style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {m.content || m.message}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-end', width: isMobile ? '100%' : 'auto', gap: '12px' }}>
                    {!isMobile && <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '600', marginRight: '8px' }}>{dateStr}</span>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isUnread && (
                        <button className="action-btn read" onClick={() => handleRead(m.id)} title="Tandai dibaca" style={{ background: '#ECFDF5', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={16}/>
                        </button>
                      )}
                      <button className="action-btn del" onClick={() => handleDelete(m.id)} title="Hapus pesan" style={{ background: '#FFF5F5', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#E53E3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
            
            {messages.length === 0 && !loading && (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ background: '#F8FAFC', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <MailOpen size={32} color="#CBD5E0" />
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#1E293B', fontWeight: '800' }}>Inbox Kosong</h3>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>Belum ada pesan dari pengunjung website.</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}