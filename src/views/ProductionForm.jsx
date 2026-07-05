import React, { useState } from 'react';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ProductionForm({ products, attendance, userId, onRefreshStock }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const isLocked = !attendance || attendance.check_out;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    
    if (!isLocked) {
      setSuccess(true);
      setProductId('');
      setQuantity('');
      setNotes('');
      if (onRefreshStock) onRefreshStock();
    }
  };

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontWeight: '700', color: '#2D3748', marginBottom: '20px' }}>Input Hasil Produksi</h3>
      
      {success && <div style={{ color: '#38A169', background: '#C6F6D5', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}><CheckCircle size={16} /> Data produksi berhasil disimpan ke gudang!</div>}

      {isLocked ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#F7FAFC', borderRadius: '12px' }}>
          <Lock size={40} color="#A0AEC0" style={{ marginBottom: '12px' }} />
          <h5 style={{ fontWeight: '600', color: '#4A5568' }}>Form Terkunci</h5>
          <p style={{ fontSize: '13px', color: '#718096' }}>Hanya dapat diinput saat Anda berstatus aktif bekerja.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#718096' }}>Varian Dodol</label>
            <select value={productId} onChange={e => setProductId(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '5px' }}>
              <option value="">Pilih Varian...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#718096' }}>Jumlah (Kotak)</label>
            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '5px' }} />
          </div>

          <button type="submit" style={{ width: '100%', background: '#681E1E', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Simpan ke Stok Gudang
          </button>
        </form>
      )}
    </div>
  );
}