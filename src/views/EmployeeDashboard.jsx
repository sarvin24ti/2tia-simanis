import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { 
  Fingerprint, LogOut, PlusSquare, History, Activity, FileText, 
  CheckCircle, AlertCircle, ShoppingBag, UserCircle, Clock, Save, Box
} from 'lucide-react';

export default function EmployeeDashboard({ userId, activeTab }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [clock, setClock] = useState('00.00.00');
  const [dateStr, setDateStr] = useState('');
  const [attendance, setAttendance] = useState(null);
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // State untuk form produksi
  const [prodId, setProdId] = useState(''); 
  const [qty, setQty] = useState(''); 
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false); 
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    const interval = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString('id-ID', { hour12: false }).replace(/:/g, '.'));
      setDateStr(now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    }, 1000);
    
    loadData();
    return () => { window.removeEventListener('resize', handleResize); clearInterval(interval); }
  }, []);

  const loadData = async () => {
    try {
      setAttendance(await DataModel.getTodayAttendance(userId));
      setProducts(await DataModel.getProducts());
      setActivities(await DataModel.getTodayProductions(userId));
    } catch (err) { console.error(err.message); }
  };

  const handleAbsen = async () => {
    const timeNow = new Date().toTimeString().split(' ')[0];
    if (!attendance) await DataModel.insertAttendance({ user_id: userId, check_in: timeNow });
    else if (!attendance.check_out) await DataModel.updateAttendance(attendance.id, { check_out: timeNow });
    loadData();
  };

  const handleProduction = async (e) => {
    e.preventDefault(); setLoading(true); setMsg({ type: '', text: '' });
    try {
      if (!prodId || !qty) throw new Error('Harap lengkapi varian dan jumlah!');
      await DataModel.insertProduction({ user_id: userId, product_id: parseInt(prodId), quantity: parseInt(qty), notes });
      const selected = products.find(p => p.id === parseInt(prodId));
      await DataModel.updateProduct(parseInt(prodId), { stock_ready: (selected?.stock_ready || 0) + parseInt(qty) });
      setMsg({ type: 'success', text: 'Produksi berhasil disimpan ke gudang!' }); 
      setProdId(''); setQty(''); setNotes(''); loadData();
    } catch (err) { setMsg({ type: 'error', text: err.message }); } finally { setLoading(false); }
  };

  // Komponen Styling UI Premium
  const premiumCardStyle = { 
    background: '#ffffff', 
    borderRadius: '24px', 
    padding: isMobile ? '20px' : '36px', // Padding mobile lebih ringkas
    boxShadow: '0 10px 40px rgba(54, 28, 20, 0.04)', 
    border: '1px solid rgba(237, 242, 247, 0.8)', 
    width: '100%',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };
  
  const inputStyle = { 
    width: '100%', 
    padding: '16px 20px', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    outline: 'none', 
    fontSize: '14px', 
    background: '#F8FAFC',
    color: '#1E293B',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    fontWeight: '500'
  };
  
  const labelStyle = { 
    fontSize: '11px', 
    fontWeight: '800', 
    color: '#64748B', 
    marginBottom: '10px', 
    display: 'block', 
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '40px', background: '#FBF9F6', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        .input-modern {
          width: 100%; padding: 16px 20px; border-radius: 16px; border: 1px solid #E2E8F0;
          outline: none; font-size: 14px; background: #F8FAFC; color: #1E293B;
          box-sizing: border-box; transition: all 0.2s ease; font-weight: 500; font-family: inherit;
        }
        .input-modern:focus { border-color: #681E1E !important; background: #ffffff !important; box-shadow: 0 0 0 4px rgba(104, 30, 30, 0.1) !important; }
        .pulse-btn { animation: pulseAnim 2s infinite; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; } 
        .pulse-btn:hover { transform: scale(1.05); }
        @keyframes pulseAnim { 0% { box-shadow: 0 0 0 0 rgba(104,30,30,0.3); } 70% { box-shadow: 0 0 0 25px rgba(104,30,30,0); } 100% { box-shadow: 0 0 0 0 rgba(104,30,30,0); } }
        .table-row { transition: all 0.2s ease; }
        .table-row:hover { background-color: #F8FAFC; transform: scale(1.002); }
        .hover-card:hover { box-shadow: 0 15px 50px rgba(54, 28, 20, 0.08) !important; transform: translateY(-2px); }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* --- RINGKASAN --- */}
      {activeTab === 'ringkasan' && (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '16px' : '24px', marginBottom: '32px' }}>
            
            <div style={premiumCardStyle} className="hover-card">
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Presensi Sif</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: attendance ? (attendance.check_out ? '#94A3B8' : '#059669') : '#E53E3E', fontSize: isMobile ? '22px' : '28px', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>
                  {attendance ? (attendance.check_out ? 'Selesai Shift' : 'Sedang Bekerja') : 'Belum Hadir'}
                </h3>
                <div style={{ background: attendance ? (attendance.check_out ? '#F1F5F9' : '#ECFDF5') : '#FFF5F5', padding: '16px', borderRadius: '20px', color: attendance ? (attendance.check_out ? '#94A3B8' : '#059669') : '#E53E3E' }}>
                  <Fingerprint size={28} />
                </div>
              </div>
            </div>

            <div style={premiumCardStyle} className="hover-card">
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kontribusi Produksi Saya</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#1E293B', fontSize: isMobile ? '28px' : '32px', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>
                  +{activities.reduce((a, c) => a + c.quantity, 0)} <span style={{fontSize:'16px', color:'#94A3B8', fontFamily: 'Inter, sans-serif'}}>Box</span>
                </h3>
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '20px', color: '#3B82F6', border: '1px solid #E2E8F0' }}>
                  <PlusSquare size={28} />
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: '#1E293B', fontFamily: 'Playfair Display, serif' }}>Peta Stok Gudang</h4>
              <p style={{ margin: 0, fontSize: isMobile ? '13px' : '14px', color: '#64748B' }}>Pantau ketersediaan varian produk.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', color: '#1D4ED8', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.1)' }}>
              <Activity size={14} /> LIVE
            </div>
          </div>

          {/* PERBAIKAN: gridTemplateColumns diubah jadi 1fr untuk mobile agar tidak kegencet! */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '16px' : '24px' }}>
            {products.map(p => (
              <div key={p.id} className="hover-card" style={{ background: '#ffffff', borderRadius: '24px', padding: isMobile ? '20px' : '24px', border: '1px solid rgba(237, 242, 247, 0.8)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ background: '#F8FAFC', height: isMobile ? '160px' : '160px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                   {p.image_url ? (
                     <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                     <ShoppingBag color="#CBD5E0" size={48} strokeWidth={1.5} />
                   )}
                </div>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1E293B', fontWeight: '800', lineHeight: '1.4' }}>{p.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px' }}>
                  <span style={{ color: '#64748B', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>STOK GUDANG:</span>
                  <span style={{ color: p.stock_ready <= p.stock_minimum ? '#DC2626' : '#059669', fontWeight: '900', fontSize: '16px' }}>
                    {p.stock_ready}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PRESENSI --- */}
      {activeTab === 'presensi' && (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {/* PERBAIKAN: Padding dan ukuran font dikecilkan drastis buat layar mobile */}
          <div style={{ ...premiumCardStyle, textAlign: 'center', padding: isMobile ? '40px 20px' : '100px 40px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '24px' : '32px' }}>
              <div style={{ background: '#FDF2F2', padding: '16px', borderRadius: '50%', color: '#681E1E', boxShadow: '0 10px 25px rgba(104,30,30,0.1)' }}>
                <Fingerprint size={32} />
              </div>
            </div>
            
            <h1 style={{ fontSize: isMobile ? '46px' : '80px', fontWeight: '900', color: '#1E293B', margin: '0 0 8px', letterSpacing: '-1px', fontFamily: 'Playfair Display, serif' }}>
              {clock}
            </h1>
            <p style={{ color: '#64748B', fontSize: isMobile ? '14px' : '20px', margin: isMobile ? '0 0 40px' : '0 0 60px', fontWeight: '600' }}>
              {dateStr}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {!attendance ? (
                <div onClick={handleAbsen} className="pulse-btn" style={{ width: isMobile ? '160px' : '220px', height: isMobile ? '160px' : '220px', borderRadius: '50%', background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 20px 40px rgba(104,30,30,0.3)' }}>
                  <Fingerprint size={isMobile ? 40 : 64} strokeWidth={1.5} />
                  <span style={{ fontWeight: '800', marginTop: '12px', fontSize: isMobile ? '14px' : '18px', letterSpacing: '2px' }}>HADIR</span>
                </div>
              ) : !attendance.check_out ? (
                <div onClick={handleAbsen} className="pulse-btn" style={{ width: isMobile ? '160px' : '220px', height: isMobile ? '160px' : '220px', borderRadius: '50%', background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffffff', animation: 'none', boxShadow: '0 20px 40px rgba(220,38,38,0.3)' }}>
                  <LogOut size={isMobile ? 40 : 64} strokeWidth={1.5} />
                  <span style={{ fontWeight: '800', marginTop: '12px', fontSize: isMobile ? '14px' : '18px', letterSpacing: '2px' }}>PULANG</span>
                </div>
              ) : (
                <div style={{ width: isMobile ? '160px' : '220px', height: isMobile ? '160px' : '220px', borderRadius: '50%', background: '#F8FAFC', border: '4px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  <CheckCircle size={isMobile ? 40 : 64} strokeWidth={1.5} />
                  <span style={{ fontWeight: '800', marginTop: '12px', fontSize: isMobile ? '14px' : '18px', letterSpacing: '2px' }}>SELESAI</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PRODUKSI --- */}
      {activeTab === 'produksi' && (
        <div className="fade-in" style={{ maxWidth: '700px', width: '100%', margin: '0 auto' }}>
          <div style={premiumCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #F1F5F9' }}>
              <div style={{ background: '#FDF2F2', padding: '16px', borderRadius: '16px', color: '#681E1E' }}><PlusSquare size={28} /></div>
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: isMobile ? '20px' : '24px', fontWeight: '800', color: '#1E293B', fontFamily: 'Playfair Display, serif' }}>Formulir Input Produksi</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>Masukkan jumlah produk jadi dari shift Anda.</p>
              </div>
            </div>

            {msg.text && (
              <div style={{ padding: '16px 20px', borderRadius: '16px', marginBottom: '32px', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2', color: msg.type === 'success' ? '#059669' : '#DC2626', border: `1px solid ${msg.type === 'success' ? '#A7F3D0' : '#FECACA'}` }}>
                {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />} 
                {msg.text}
              </div>
            )}

            <form onSubmit={handleProduction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={labelStyle}>Varian Dodol</label>
                <select required value={prodId} onChange={e => setProdId(e.target.value)} className="input-modern" style={{ cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px top 50%', backgroundSize: '12px auto' }}>
                  <option value="">Pilih Varian...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div>
                <label style={labelStyle}>Jumlah Jadi (Box)</label>
                <input type="number" min="1" required value={qty} onChange={e => setQty(e.target.value)} className="input-modern" placeholder="Contoh: 50" />
              </div>

              <div>
                <label style={labelStyle}>Keterangan (Opsional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="4" className="input-modern" style={{ resize: 'none' }} placeholder="Tuliskan catatan produksi jika ada..."></textarea>
              </div>

              <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', color: '#fff', padding: '18px', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginTop: '16px', boxShadow: '0 10px 25px rgba(104,30,30,0.2)', transition: 'all 0.3s', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onMouseOver={e => { if(!loading) {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(104,30,30,0.3)';} }}
                onMouseOut={e => { if(!loading) {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(104,30,30,0.2)';} }}
              >
                {loading ? 'Menyimpan...' : 'Simpan ke Gudang'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- AKTIVITAS --- */}
      {activeTab === 'aktivitas' && (
        <div className="fade-in" style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
          <div style={{ ...premiumCardStyle, overflow: 'hidden', padding: isMobile ? '24px 16px' : '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', color: '#4A5568', border: '1px solid #E2E8F0' }}><History size={24}/></div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#1E293B', fontFamily: 'Playfair Display, serif' }}>Riwayat Aktivitas Anda</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>Daftar produksi yang telah Anda setor ke gudang hari ini.</p>
              </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
              <table style={{ width: '100%', minWidth: '700px', textAlign: 'left', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: '800', fontSize: '12px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Waktu Produksi</th>
                    <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: '800', fontSize: '12px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Varian Dodol</th>
                    <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: '800', fontSize: '12px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hasil</th>
                    <th style={{ padding: '16px 24px', color: '#64748B', fontWeight: '800', fontSize: '12px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a.id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '20px 24px', color: '#64748B', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: '800', color: '#1E293B' }}>{new Date(a.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')} WIB</div>
                      </td>
                      <td style={{ padding: '20px 24px', fontWeight: '700', color: '#4A5568', whiteSpace: 'nowrap' }}>{a.products?.name}</td>
                      <td style={{ padding: '20px 24px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', background: '#ECFDF5', color: '#059669', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '13px', border: '1px solid #D1FAE5' }}>+{a.quantity} Box</span>
                      </td>
                      <td style={{ padding: '20px 24px', color: '#64748B', fontStyle: 'italic', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.notes || '-'}</td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontWeight: '500', fontSize: '15px' }}>Belum ada aktivitas produksi yang tersimpan hari ini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}