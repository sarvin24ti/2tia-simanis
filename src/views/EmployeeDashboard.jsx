import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
// PERBAIKAN: CheckCircle dan AlertCircle sudah dimasukkan ke import!
import { Fingerprint, LogOut, PlusSquare, History, Activity, Plus, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
    
    return () => { 
      window.removeEventListener('resize', handleResize); 
      clearInterval(interval); 
    }
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
    e.preventDefault(); 
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      if (!prodId || !qty) throw new Error('Harap lengkapi varian dan jumlah!');
      
      await DataModel.insertProduction({ user_id: userId, product_id: parseInt(prodId), quantity: parseInt(qty), notes });
      const selected = products.find(p => p.id === parseInt(prodId));
      await DataModel.updateProduct(parseInt(prodId), { stock_ready: (selected?.stock_ready || 0) + parseInt(qty) });
      
      setMsg({ type: 'success', text: 'Produksi berhasil disimpan ke gudang!' }); 
      setProdId(''); setQty(''); setNotes(''); 
      loadData();
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) { 
      setMsg({ type: 'error', text: err.message }); 
    } finally { 
      setLoading(false); 
    }
  };

  // Komponen Styling UI
  const premiumCardStyle = { background: '#ffffff', borderRadius: '24px', padding: isMobile ? '24px' : '32px', boxShadow: '0 10px 40px rgba(54, 28, 20, 0.04)', border: '1px solid rgba(237, 242, 247, 0.8)', width: '100%' };
  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC' };
  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase' };

  // ==========================================
  // TAB 1: RINGKASAN
  // ==========================================
  if (activeTab === 'ringkasan') {
    const chartData = products.map(p => ({ name: p.name.replace('Dodol ', ''), Stok: p.stock_ready, fillColor: '#681E1E' }));
    return (
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '20px' : '24px', marginBottom: '24px' }}>
          <div style={premiumCardStyle}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#718096', fontWeight: '800', textTransform: 'uppercase' }}>Status Presensi Sif</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: attendance ? (attendance.check_out ? '#718096' : '#059669') : '#E53E3E', fontSize: isMobile ? '24px' : '28px', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>
                {attendance ? (attendance.check_out ? 'Selesai Shift' : 'Sedang Bekerja') : 'Belum Hadir'}
              </h3>
              <div style={{ background: attendance ? '#ECFDF5' : '#FFF5F5', padding: '14px', borderRadius: '16px', color: attendance ? '#059669' : '#E53E3E' }}><Fingerprint size={24} /></div>
            </div>
          </div>
          <div style={premiumCardStyle}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#718096', fontWeight: '800', textTransform: 'uppercase' }}>Kontribusi Produksi Saya</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#2D3748', fontSize: isMobile ? '28px' : '32px', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>
                +{activities.reduce((a, c) => a + c.quantity, 0)} <span style={{fontSize:'16px', color:'#A0AEC0', fontFamily: 'Inter'}}>Box</span>
              </h3>
              <div style={{ background: '#F0F4F8', padding: '14px', borderRadius: '16px', color: '#486581' }}><PlusSquare size={24} /></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', marginTop: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#2D3748', fontFamily: 'Playfair Display, serif' }}>Peta Stok Gudang</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>Pantau ketersediaan varian produk.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', border: '1px solid #EDF2F7', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', color: '#4A5568' }}>
            <Activity size={14} color="#0D6EFD" /> LIVE
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: isMobile ? '16px' : '24px' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: '20px', padding: isMobile ? '16px' : '20px', border: '1px solid #EDF2F7', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ background: '#F8FAFC', height: isMobile ? '100px' : '140px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', overflow: 'hidden' }}>
                 {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ShoppingBag color="#CBD5E0" size={40} />}
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: isMobile ? '14px' : '16px', color: '#2D3748', fontWeight: '800', lineHeight: '1.4' }}>{p.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#718096', fontSize: '11px', fontWeight: '700' }}>STOK:</span>
                <span style={{ color: p.stock_ready <= p.stock_minimum ? '#E53E3E' : '#059669', fontWeight: '800', fontSize: '14px' }}>{p.stock_ready}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // TAB 2: PRESENSI HARIAN
  // ==========================================
  if (activeTab === 'presensi') {
    const pulseSize = isMobile ? '160px' : '220px';
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <style>{`
          .pulse-btn { animation: pulseAnim 2s infinite; cursor: pointer; transition: 0.2s; } 
          .pulse-btn:hover { transform: scale(1.05); }
          @keyframes pulseAnim { 0% { box-shadow: 0 0 0 0 rgba(104,30,30,0.4); } 70% { box-shadow: 0 0 0 20px rgba(104,30,30,0); } 100% { box-shadow: 0 0 0 0 rgba(104,30,30,0); } }
        `}</style>
        
        <div style={{ ...premiumCardStyle, textAlign: 'center', padding: isMobile ? '60px 20px' : '80px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ background: '#FDF2F2', padding: '16px', borderRadius: '50%', color: '#681E1E' }}><Fingerprint size={32} /></div>
          </div>
          
          <h1 style={{ fontSize: isMobile ? '48px' : '72px', fontWeight: '800', color: '#361C14', margin: '0 0 8px', letterSpacing: '-1px', fontFamily: 'Playfair Display, serif' }}>
            {clock}
          </h1>
          <p style={{ color: '#718096', fontSize: isMobile ? '16px' : '18px', margin: '0 0 60px', fontWeight: '600' }}>
            {dateStr}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {!attendance ? (
              <div onClick={handleAbsen} className="pulse-btn" style={{ width: pulseSize, height: pulseSize, borderRadius: '50%', border: '8px solid #681E1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#681E1E' }}>
                <Fingerprint size={isMobile ? 40 : 56} />
                <span style={{ fontWeight: '800', marginTop: '12px', fontSize: isMobile ? '14px' : '18px', letterSpacing: '1px' }}>HADIR</span>
              </div>
            ) : !attendance.check_out ? (
              <div onClick={handleAbsen} className="pulse-btn" style={{ width: pulseSize, height: pulseSize, borderRadius: '50%', border: '8px solid #E53E3E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#E53E3E', animation: 'none', boxShadow: '0 10px 30px rgba(229, 62, 62, 0.2)' }}>
                <LogOut size={isMobile ? 40 : 56} />
                <span style={{ fontWeight: '800', marginTop: '12px', fontSize: isMobile ? '14px' : '18px', letterSpacing: '1px' }}>PULANG</span>
              </div>
            ) : (
              <div style={{ width: pulseSize, height: pulseSize, borderRadius: '50%', border: '8px solid #CBD5E0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0', background: '#F8FAFC' }}>
                <CheckCircle size={isMobile ? 40 : 56} />
                <span style={{ fontWeight: '800', marginTop: '12px', fontSize: isMobile ? '14px' : '18px', letterSpacing: '1px' }}>SELESAI</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAB 3: INPUT PRODUKSI
  // ==========================================
  if (activeTab === 'produksi') {
    return (
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto' }}>
        <div style={premiumCardStyle}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #F1F5F9' }}>
            <div style={{ background: '#FDF2F2', padding: '12px', borderRadius: '12px', color: '#681E1E' }}><PlusSquare size={24}/></div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: isMobile ? '18px' : '20px', fontWeight: '800', color: '#1E293B' }}>Formulir Input Produksi</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Masukkan jumlah produk jadi dari shift Anda.</p>
            </div>
          </div>

          {msg.text && (
            <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', background: msg.type === 'success' ? '#ECFDF5' : '#FFF5F5', color: msg.type === 'success' ? '#059669' : '#E53E3E' }}>
              {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {msg.text}
            </div>
          )}

          <form onSubmit={handleProduction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Varian Dodol</label>
              <select required value={prodId} onChange={e => setProdId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '12px auto' }}>
                <option value="">Pilih Varian...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Jumlah Jadi (Box)</label>
              <input type="number" min="1" required value={qty} onChange={e => setQty(e.target.value)} style={inputStyle} placeholder="Contoh: 50" />
            </div>

            <div>
              <label style={labelStyle}>Keterangan (Opsional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" style={{ ...inputStyle, resize: 'none' }} placeholder="Tuliskan catatan jika ada..."></textarea>
            </div>

            <button type="submit" disabled={loading} style={{ background: '#681E1E', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginTop: '12px', boxShadow: '0 10px 25px rgba(104,30,30,0.2)', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Menyimpan...' : 'Simpan ke Gudang'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ==========================================
  // TAB 4: RIWAYAT AKTIVITAS
  // ==========================================
  if (activeTab === 'aktivitas') {
    return (
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <div style={{ ...premiumCardStyle, overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '12px', color: '#4A5568' }}><History size={20}/></div>
            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#2D3748' }}>Riwayat Aktivitas Anda</h4>
          </div>

          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '550px', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EDF2F7' }}>
                  <th style={{ padding: '16px 16px 16px 0', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>WAKTU PRODUKSI</th>
                  <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>VARIAN DODOL</th>
                  <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>HASIL</th>
                  <th style={{ padding: '16px 0 16px 16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>CATATAN</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #F7FAFC' }}>
                    <td style={{ padding: '16px 16px 16px 0', color: '#718096', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '700', color: '#4A5568' }}>{new Date(a.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')} WIB</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: '800', color: '#2D3748', whiteSpace: 'nowrap' }}>{a.products?.name}</td>
                    <td style={{ padding: '16px', fontWeight: '800', color: '#059669', fontSize: '15px', whiteSpace: 'nowrap' }}>+{a.quantity}</td>
                    <td style={{ padding: '16px 0 16px 16px', color: '#A0AEC0', fontStyle: 'italic', whiteSpace: 'nowrap' }}>{a.notes || '-'}</td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0' }}>Belum ada aktivitas produksi hari ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}