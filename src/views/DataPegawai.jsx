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

  const premiumCardStyle = { background: '#ffffff', borderRadius: '20px', padding: isMobile ? '20px' : '32px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(237, 242, 247, 0.8)' };

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '20px' }}>
          <div style={{ ...premiumCardStyle, width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', color: '#1E293B', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>Registrasi Pegawai</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>NAMA LENGKAP</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>EMAIL AKUN</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC' }} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '6px' }}>KATA SANDI</label><input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC' }} /></div>
              <button type="submit" disabled={loadingAdd} style={{ padding: '14px', borderRadius: '10px', background: '#681E1E', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>Simpan Kredensial</button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px', gap: '16px' }}>
        <button onClick={() => setShowModal(true)} style={{ width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#681E1E', color: '#fff', padding: '14px 20px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(104,30,30,0.2)' }}><UserPlus size={18}/> Tambah Pegawai Baru</button>
      </div>

      <div style={{ ...premiumCardStyle, width: '100%', overflow: 'hidden' }}>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '600px', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #EDF2F7' }}>
                <th style={{ padding: '16px 16px 16px 0', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>PROFIL PEGAWAI</th>
                <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>PERAN SISTEM</th>
                <th style={{ padding: '16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>TANGGAL BERGABUNG</th>
                <th style={{ padding: '16px 0 16px 16px', textAlign: 'center', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>KEAMANAN</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #F7FAFC' }}>
                  <td style={{ padding: '16px 16px 16px 0', display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37 0%, #B8972E 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0, boxShadow: '0 4px 10px rgba(212,175,55,0.4)' }}>{emp.name.charAt(0).toUpperCase()}</div>
                    <span style={{ fontWeight: '800', color: '#2D3748', fontSize: '15px' }}>{emp.name}</span>
                  </td>
                  <td style={{ padding: '16px', whiteSpace: 'nowrap' }}><span style={{ background: '#E0E7FF', color: '#4338CA', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>KARYAWAN</span></td>
                  <td style={{ padding: '16px', color: '#718096', fontWeight: '500', whiteSpace: 'nowrap' }}>{new Date(emp.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                  <td style={{ padding: '16px 0 16px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}><div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}><ShieldCheck size={14} /> Terenkripsi</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}