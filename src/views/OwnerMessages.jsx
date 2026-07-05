import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { Mail, MailOpen, Trash2, CheckCircle, ArrowUpDown } from 'lucide-react';

export default function OwnerMessages({ onRefreshNotif }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');

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
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: isMobile ? '100%' : 'auto', flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ width: isMobile ? '100%' : 'auto', background: '#fff', border: '1px solid #EDF2F7', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <ArrowUpDown size={16} color="#718096" />
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontWeight: '700', color: '#4A5568', cursor: 'pointer', fontSize: '13px' }}>
              <option value="desc">Terbaru ke Terlama</option>
              <option value="asc">Terlama ke Terbaru</option>
            </select>
          </div>
          {unreadCount > 1 && (
            <button onClick={handleMarkAllRead} style={{ width: isMobile ? '100%' : 'auto', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '14px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
              <CheckCircle size={18} /> Tandai Semua Dibaca
            </button>
          )}
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', padding: isMobile ? '20px' : '32px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(237, 242, 247, 0.8)', width: '100%', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '650px', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7' }}>
                <th style={{ padding: '16px 16px 16px 0', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>STATUS</th>
                <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>PENGIRIM</th>
                <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>SUBJEK & ISI PESAN</th>
                <th style={{ padding: '16px 0 16px 16px', textAlign: 'right', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {sortedMessages.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F7FAFC', background: m.is_read ? 'transparent' : '#F8FAFC' }}>
                  <td style={{ padding: '20px 16px 20px 0', width: '60px' }}>{m.is_read ? <MailOpen size={20} color="#A0AEC0" /> : <Mail size={20} color="#3B82F6" />}</td>
                  <td style={{ padding: '20px 16px', fontWeight: m.is_read ? '600' : '800', color: '#2D3748', width: '160px', whiteSpace: 'nowrap' }}>{m.name || m.sender_name || m.pengirim || 'Tanpa Nama'}</td>
                  <td style={{ padding: '20px 16px' }}>
                    <div style={{ fontWeight: m.is_read ? '600' : '800', color: '#2D3748', marginBottom: '6px', fontSize: '14px' }}>{m.subject}</div>
                    <div style={{ color: '#718096', fontSize: '13px', lineHeight: '1.5' }}>{m.content || m.message}</div>
                  </td>
                  <td style={{ padding: '20px 0 20px 16px', textAlign: 'right', width: '100px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {!m.is_read && <button onClick={() => handleRead(m.id)} style={{ background: '#ECFDF5', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#059669' }}><CheckCircle size={16}/></button>}
                      <button onClick={() => handleDelete(m.id)} style={{ background: '#FFF5F5', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#E53E3E' }}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.length === 0 && !loading && <div style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0', fontWeight: '500' }}>Belum ada pesan masuk.</div>}
        </div>
      </div>
    </div>
  );
}