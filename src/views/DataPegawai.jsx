import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { supabaseAdmin } from '../config/supabaseAdmin';
import { UserPlus, ShieldCheck, X } from 'lucide-react';

export default function DataPegawai() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    DataModel.getEmployees().then(setEmployees).catch(console.error).finally(() => setLoading(false));
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoadingAdd(true);
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({ email: form.email, password: form.password, email_confirm: true });
      if (error) throw error;
      await supabase.from('profiles').insert([{ id: data.user.id, name: form.name, role: 'employee' }]);
      setForm({ name: '', email: '', password: '' }); setShowModal(false);
      DataModel.getEmployees().then(setEmployees);
    } catch (err) { alert("Gagal: " + err.message); } finally { setLoadingAdd(false); }
  };

  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC', color: '#1E293B', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' };

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
        .input-modern:focus {
          border-color: #681E1E !important; background: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(104, 30, 30, 0.1) !important;
        }
        .table-row { transition: all 0.2s ease; }
        .table-row:hover { background-color: #F8FAFC; }
        .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '20px' }}>
          <div className="premium-card fade-in-up" style={{ width: '100%', maxWidth: '420px', position: 'relative', padding: '32px' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', transition: 'all 0.2s' }} onMouseOver={e => {e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#1E293B'}} onMouseOut={e => {e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'}}>
              <X size={18} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ background: '#FDF2F2', padding: '12px', borderRadius: '12px', color: '#681E1E' }}><UserPlus size={24}/></div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '22px', color: '#1E293B', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>Registrasi Pegawai</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>Tambahkan akun untuk akses sistem.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>NAMA LENGKAP</label>
                <input type="text" required className="input-modern" placeholder="Masukkan nama..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>EMAIL AKUN</label>
                <input type="email" required className="input-modern" placeholder="contoh@putramandiri.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>KATA SANDI</label>
                <input type="password" required className="input-modern" placeholder="Minimal 6 karakter" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
              </div>
              <button type="submit" disabled={loadingAdd} style={{ 
                padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', 
                color: '#fff', border: 'none', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginTop: '12px',
                boxShadow: '0 10px 25px rgba(104,30,30,0.2)', transition: 'all 0.3s', display: 'flex', justifyContent: 'center'
              }}
              onMouseOver={e => { if(!loadingAdd) {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(104,30,30,0.3)';} }}
              onMouseOut={e => { if(!loadingAdd) {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(104,30,30,0.2)';} }}
              >
                {loadingAdd ? 'Menyimpan...' : 'Simpan Kredensial'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="fade-in-up" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '32px', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '28px' : '36px', fontWeight: '800', margin: '0 0 8px' }}>
            Data Pegawai
          </h1>
          <p style={{ color: '#718096', fontSize: '15px', margin: 0, fontWeight: '500' }}>Kelola akses dan profil karyawan UD Putra Mandiri.</p>
        </div>
        
        <button onClick={() => setShowModal(true)} style={{ 
          width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', 
          background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', color: '#fff', padding: '14px 24px', 
          borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', 
          boxShadow: '0 10px 25px rgba(104,30,30,0.2)', transition: 'all 0.3s' 
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(104,30,30,0.3)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(104,30,30,0.2)'; }}
        >
          <UserPlus size={18}/> Tambah Pegawai Baru
        </button>
      </div>

      {/* TABEL PEGAWAI */}
      <div className="premium-card fade-in-up" style={{ width: '100%', overflow: 'hidden', animationDelay: '0.1s', padding: isMobile ? '24px 16px' : '32px' }}>
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0', fontWeight: '500' }}>Memuat data pegawai...</div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '650px', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                  <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profil Pegawai</th>
                  <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Peran Sistem</th>
                  <th style={{ padding: '0 16px 16px', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tanggal Bergabung</th>
                  <th style={{ padding: '0 16px 16px', textAlign: 'right', color: '#64748B', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Keamanan</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #FDF2F2 0%, #FEE2E2 100%)', color: '#681E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0, boxShadow: '0 4px 10px rgba(104,30,30,0.1)' }}>
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span style={{ fontWeight: '700', color: '#1E293B', fontSize: '15px', display: 'block', marginBottom: '2px' }}>{emp.name}</span>
                        <span style={{ color: '#94A3B8', fontSize: '12px' }}>Akses Sistem Terverifikasi</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                      <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                        Karyawan
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#64748B', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {new Date(emp.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid #D1FAE5' }}>
                        <ShieldCheck size={14} /> Terenkripsi
                      </div>
                    </td>
                  </tr>
                ))}
                
                {!loading && employees.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>
                      Belum ada data pegawai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}