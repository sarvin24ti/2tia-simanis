import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { PackagePlus, Edit3, Trash2, Box, Image as ImageIcon, UploadCloud } from 'lucide-react';

export default function KelolaStok() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Form dengan tambahan image_url
  const [form, setForm] = useState({ id: null, name: '', stock_ready: 0, stock_minimum: 50, image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    loadData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async () => { 
    try { setProducts(await DataModel.getProducts()); } 
    catch (err) { alert(err.message); } 
    finally { setLoading(false); } 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      let finalImageUrl = form.image_url;

      // Logika Upload ke Supabase Storage jika ada file baru
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('products').upload(fileName, imageFile);
        if (uploadErr) throw uploadErr;
        
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      const payload = { 
        name: form.name, 
        stock_ready: form.stock_ready, 
        stock_minimum: form.stock_minimum,
        image_url: finalImageUrl // Simpan link gambar ke database
      };

      if (form.id) await DataModel.updateProduct(form.id, payload);
      else await DataModel.addProduct(payload);
      
      resetForm();
      loadData();
    } catch (err) { 
      alert("Gagal menyimpan: " + err.message); 
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => { 
    if(window.confirm('Hapus varian ini?')) { await DataModel.deleteProduct(id); loadData(); } 
  };

  const resetForm = () => {
    setForm({ id: null, name: '', stock_ready: 0, stock_minimum: 50, image_url: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const editProduct = (p) => {
    setForm(p);
    setImageFile(null);
    setImagePreview(p.image_url || '');
  };

  const premiumCardStyle = { background: '#ffffff', borderRadius: '24px', padding: isMobile ? '24px 20px' : '32px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(237, 242, 247, 0.8)' };
  const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC' };
  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase' };

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '24px' : '32px', alignItems: 'start' }}>
        
        {/* PANEL KIRI: FORMULIR PRODUK */}
        <div style={premiumCardStyle}>
          <h4 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '800', color: '#2D3748', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#FDF2F2', padding: '10px', borderRadius: '12px', color: '#681E1E' }}><PackagePlus size={20}/></div> 
            {form.id ? 'Edit Varian' : 'Tambah Varian'}
          </h4>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Input Gambar (Custom File Upload) */}
            <div>
              <label style={labelStyle}>Foto Produk (Opsional)</label>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', border: '2px dashed #CBD5E0', borderRadius: '16px', background: '#F8FAFC', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#681E1E'} onMouseOut={e=>e.currentTarget.style.borderColor='#CBD5E0'}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <UploadCloud size={32} color="#A0AEC0" style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>Klik untuk unggah gambar</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>

            <div><label style={labelStyle}>NAMA VARIAN</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} placeholder="Contoh: Dodol Nanas" /></div>
            
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'row' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>STOK AWAL</label><input type="number" required value={form.stock_ready} onChange={e => setForm({...form, stock_ready: e.target.value})} style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>MINIMUM</label><input type="number" required value={form.stock_minimum} onChange={e => setForm({...form, stock_minimum: e.target.value})} style={inputStyle} /></div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexDirection: isMobile ? 'column' : 'row' }}>
              {form.id && <button type="button" onClick={resetForm} style={{ padding: '14px', flex: 1, borderRadius: '12px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontWeight: '700', color: '#4A5568' }}>Batal</button>}
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: '#681E1E', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(104,30,30,0.2)' }}>
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </div>
          </form>
        </div>

        {/* PANEL KANAN: TABEL PRODUK */}
        <div style={{ ...premiumCardStyle, width: '100%', overflow: 'hidden' }}>
          <h4 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800', color: '#2D3748' }}>Daftar Produk Aktif</h4>
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '450px', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EDF2F7' }}>
                  <th style={{ padding: '12px 16px 12px 0', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>VARIAN PRODUK</th>
                  <th style={{ padding: '12px 16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>STOK SIAP</th>
                  <th style={{ padding: '12px 16px', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>MINIMUM</th>
                  <th style={{ padding: '12px 0 12px 16px', textAlign: 'right', color: '#718096', fontWeight: '800', fontSize: '11px', whiteSpace: 'nowrap' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F7FAFC' }}>
                    <td style={{ padding: '16px 16px 16px 0', fontWeight: '700', color: '#2D3748', display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
                      {/* Thumbnail Gambar Produk */}
                      <div style={{ background: '#EDF2F7', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0AEC0', flexShrink: 0, overflow: 'hidden' }}>
                        {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={18} />}
                      </div>
                      {p.name}
                    </td>
                    <td style={{ padding: '16px', color: p.stock_ready <= p.stock_minimum ? '#E53E3E' : '#059669', fontWeight: '800', fontSize: '14px' }}>{p.stock_ready}</td>
                    <td style={{ padding: '16px', color: '#A0AEC0', fontWeight: '600' }}>{p.stock_minimum}</td>
                    <td style={{ padding: '16px 0 16px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => editProduct(p)} style={{ background: '#EBF8FF', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#2B6CB0', marginRight: '8px' }}><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: '#FFF5F5', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#E53E3E' }}><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#A0AEC0' }}>Belum ada produk.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}