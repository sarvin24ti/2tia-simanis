import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';

export default function Laporan() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tab, setTab] = useState('produksi');
  const [dataProd, setDataProd] = useState([]);
  const [dataAtt, setDataAtt] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    DataModel.getAllProductions().then(setDataProd).catch(console.error);
    DataModel.getAllAttendances().then(setDataAtt).catch(console.error);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const premiumCardStyle = { background: '#ffffff', borderRadius: '20px', padding: isMobile ? '20px' : '32px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(237, 242, 247, 0.8)' };

  const tabStyle = (isActive) => ({
    padding: isMobile ? '12px' : '14px 28px', 
    borderRadius: '30px', fontWeight: '800', fontSize: isMobile ? '13px' : '14px', 
    cursor: 'pointer', border: 'none', transition: 'all 0.3s', 
    flex: 1, textAlign: 'center',
    background: isActive ? '#681E1E' : 'transparent', 
    color: isActive ? '#fff' : '#718096',
    boxShadow: isActive ? '0 4px 15px rgba(104,30,30,0.2)' : 'none'
  });

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      <div style={{ ...premiumCardStyle, width: '100%', overflow: 'hidden' }}>
        
        {/* TAB BUNGKUSAN */}
        <div style={{ display: 'flex', width: '100%', background: '#F1F5F9', borderRadius: '40px', padding: '6px', marginBottom: '24px', flexDirection: 'row', gap: '4px' }}>
          <button onClick={() => setTab('produksi')} style={tabStyle(tab === 'produksi')}>Riwayat Produksi</button>
          <button onClick={() => setTab('kehadiran')} style={tabStyle(tab === 'kehadiran')}>Riwayat Kehadiran</button>
        </div>

        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '550px', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7' }}>
                <th style={{ padding: '16px 16px 16px 0', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>TANGGAL / WAKTU</th>
                <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>NAMA PEGAWAI</th>
                {tab === 'produksi' ? (
                  <>
                    <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>VARIAN PRODUK</th>
                    <th style={{ padding: '16px 0 16px 16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>JUMLAH JADI</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>JAM MASUK</th>
                    <th style={{ padding: '16px 0 16px 16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>JAM PULANG</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {tab === 'produksi' && dataProd.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F7FAFC' }}>
                  <td style={{ padding: '16px 16px 16px 0', color: '#718096', whiteSpace: 'nowrap' }}>{new Date(p.created_at).toLocaleString('id-ID', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                  <td style={{ padding: '16px', fontWeight: '800', color: '#2D3748', whiteSpace: 'nowrap' }}>{p.profiles?.name}</td>
                  <td style={{ padding: '16px', color: '#4A5568', fontWeight: '500', whiteSpace: 'nowrap' }}>{p.products?.name}</td>
                  <td style={{ padding: '16px 0 16px 16px', fontWeight: '800', color: '#059669', fontSize: '14px', whiteSpace: 'nowrap' }}>+{p.quantity} Box</td>
                </tr>
              ))}
              {tab === 'kehadiran' && dataAtt.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #F7FAFC' }}>
                  <td style={{ padding: '16px 16px 16px 0', color: '#718096', whiteSpace: 'nowrap' }}>{new Date(a.date).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric'})}</td>
                  <td style={{ padding: '16px', fontWeight: '800', color: '#2D3748', whiteSpace: 'nowrap' }}>{a.profiles?.name}</td>
                  <td style={{ padding: '16px', color: '#4A5568', fontWeight: '600', whiteSpace: 'nowrap' }}>{a.check_in ? a.check_in.slice(0,5) + ' WIB' : '-'}</td>
                  <td style={{ padding: '16px 0 16px 16px', color: '#4A5568', fontWeight: '600', whiteSpace: 'nowrap' }}>{a.check_out ? a.check_out.slice(0,5) + ' WIB' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}