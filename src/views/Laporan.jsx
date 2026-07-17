import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { Download, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function Laporan() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tab, setTab] = useState('produksi');
  const [dataProd, setDataProd] = useState([]);
  const [dataAtt, setDataAtt] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    // Fetch Data
    Promise.all([
      DataModel.getAllProductions(),
      DataModel.getAllAttendances()
    ]).then(([prod, att]) => {
      setDataProd(prod);
      setDataAtt(att);
    }).catch(console.error).finally(() => setLoading(false));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // FUNGSI BARU: GENERATOR CSV OTOMATIS
  const handleDownloadCSV = () => {
    let csvContent = "";
    let filename = "";

    if (tab === 'produksi') {
      filename = "Laporan_Produksi_SIMANIS.csv";
      // Header Kolom CSV Produksi
      const headers = ["Tanggal Produksi", "Waktu", "Nama Pegawai", "Varian Produk", "Jumlah Hasil (Box)"];
      
      // Mapping Data Produksi ke Baris CSV
      const rows = dataProd.map(p => {
        const date = new Date(p.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
        const time = new Date(p.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
        const name = p.profiles?.name || 'Anonim';
        const product = p.products?.name || 'Produk Dihapus';
        const qty = p.quantity;
        return `"${date}","${time}","${name}","${product}","${qty}"`;
      });
      
      csvContent = [headers.join(","), ...rows].join("\n");
    } else {
      filename = "Laporan_Kehadiran_SIMANIS.csv";
      // Header Kolom CSV Kehadiran
      const headers = ["Tanggal Shift", "Nama Pegawai", "Jam Masuk", "Jam Pulang"];
      
      // Mapping Data Kehadiran ke Baris CSV
      const rows = dataAtt.map(a => {
        const date = new Date(a.date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric'});
        const name = a.profiles?.name || 'Anonim';
        const inTime = a.check_in ? a.check_in.slice(0,5) : '-';
        const outTime = a.check_out ? a.check_out.slice(0,5) : '-';
        return `"${date}","${name}","${inTime}","${outTime}"`;
      });
      
      csvContent = [headers.join(","), ...rows].join("\n");
    }

    // Proses Download menggunakan Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabStyle = (isActive) => ({
    padding: isMobile ? '12px' : '14px 28px', 
    borderRadius: '30px', fontWeight: '800', fontSize: isMobile ? '13px' : '14px', 
    cursor: 'pointer', border: 'none', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
    flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    background: isActive ? 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)' : 'transparent', 
    color: isActive ? '#fff' : '#64748B',
    boxShadow: isActive ? '0 10px 25px rgba(104,30,30,0.2)' : 'none'
  });

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px', background: '#FBF9F6', minHeight: '100vh', maxWidth: '100vw', overflowX: 'hidden' }}>
      
      <style>{`
        .premium-card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(54, 28, 20, 0.03);
          border: 1px solid rgba(237, 242, 247, 0.8);
          transition: all 0.3s ease;
        }
        .premium-card:hover { box-shadow: 0 15px 50px rgba(54, 28, 20, 0.06); }
        .table-row { transition: all 0.2s ease; }
        .table-row:hover { background-color: #F8FAFC; transform: scale(1.002); }
        .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER */}
      <div className="fade-in-up" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '32px', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '28px' : '36px', fontWeight: '800', margin: '0 0 8px' }}>
            Laporan & Riwayat
          </h1>
          <p style={{ color: '#718096', fontSize: '15px', margin: 0, fontWeight: '500' }}>Rekam jejak produksi harian dan presensi karyawan.</p>
        </div>
        
        {/* TOMBOL DOWNLOAD YANG SUDAH AKTIF */}
        <button onClick={handleDownloadCSV} style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          background: '#F1F5F9', color: '#4A5568', padding: '12px 20px', 
          borderRadius: '12px', border: '1px solid #E2E8F0', fontWeight: '700', 
          fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' 
        }}
        onMouseOver={e => { e.currentTarget.style.background = '#E2E8F0'; }}
        onMouseOut={e => { e.currentTarget.style.background = '#F1F5F9'; }}
        >
          <Download size={16}/> Unduh Laporan (.csv)
        </button>
      </div>

      <div className="premium-card fade-in-up" style={{ width: '100%', overflow: 'hidden', animationDelay: '0.1s', padding: isMobile ? '24px 16px' : '32px' }}>
        
        {/* TAB SWITCHER MODERN */}
        <div style={{ display: 'flex', width: '100%', background: '#F8FAFC', borderRadius: '40px', padding: '6px', marginBottom: '32px', border: '1px solid #F1F5F9' }}>
          <button onClick={() => setTab('produksi')} style={tabStyle(tab === 'produksi')}>
            <FileText size={18} /> Riwayat Produksi
          </button>
          <button onClick={() => setTab('kehadiran')} style={tabStyle(tab === 'kehadiran')}>
            <Clock size={18} /> Riwayat Kehadiran
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#A0AEC0', fontWeight: '600', fontSize: '15px' }}>Menyusun data laporan...</div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '700px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                  <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {tab === 'produksi' ? 'Tanggal Produksi' : 'Tanggal Shift'}
                  </th>
                  <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Pegawai</th>
                  
                  {tab === 'produksi' ? (
                    <>
                      <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Varian Produk</th>
                      <th style={{ padding: '0 16px 16px', textAlign: 'right', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jumlah Hasil</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jam Masuk</th>
                      <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jam Pulang</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                
                {/* RENDER RIWAYAT PRODUKSI */}
                {tab === 'produksi' && dataProd.map(p => (
                  <tr key={p.id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '20px 16px', color: '#64748B', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: '#1E293B', fontSize: '14px' }}>{new Date(p.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</span>
                        <span>{new Date(p.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', color: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                          {p.profiles?.name ? p.profiles.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px' }}>{p.profiles?.name || 'Anonim'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 16px', color: '#4A5568', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {p.products?.name || 'Produk Dihapus'}
                    </td>
                    <td style={{ padding: '20px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#059669', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>
                        <CheckCircle2 size={14}/> +{p.quantity} Box
                      </span>
                    </td>
                  </tr>
                ))}

                {/* RENDER RIWAYAT KEHADIRAN */}
                {tab === 'kehadiran' && dataAtt.map(a => (
                  <tr key={a.id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '20px 16px', color: '#1E293B', fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {new Date(a.date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric'})}
                    </td>
                    <td style={{ padding: '20px 16px', whiteSpace: 'nowrap' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', color: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                          {a.profiles?.name ? a.profiles.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px' }}>{a.profiles?.name || 'Anonim'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 16px', whiteSpace: 'nowrap' }}>
                      {a.check_in ? (
                        <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                          {a.check_in.slice(0,5)} WIB
                        </span>
                      ) : <span style={{ color: '#CBD5E0', fontWeight: '600' }}>-</span>}
                    </td>
                    <td style={{ padding: '20px 16px', whiteSpace: 'nowrap' }}>
                      {a.check_out ? (
                        <span style={{ background: '#FDF2F8', color: '#DB2777', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                          {a.check_out.slice(0,5)} WIB
                        </span>
                      ) : <span style={{ color: '#CBD5E0', fontWeight: '600' }}>-</span>}
                    </td>
                  </tr>
                ))}

                {/* EMPTY STATES */}
                {!loading && tab === 'produksi' && dataProd.length === 0 && (
                  <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#A0AEC0', fontWeight: '500' }}>Belum ada aktivitas produksi tercatat.</td></tr>
                )}
                {!loading && tab === 'kehadiran' && dataAtt.length === 0 && (
                  <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#A0AEC0', fontWeight: '500' }}>Belum ada log kehadiran tercatat.</td></tr>
                )}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}