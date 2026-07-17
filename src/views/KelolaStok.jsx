import React, { useState, useEffect } from 'react';
import { DataModel } from '../models/dataModel';
import { supabase } from '../config/supabaseClient';
import { PackagePlus, Edit3, Trash2, Box, Image as ImageIcon, UploadCloud, AlertCircle, Search, Flame, Tag, CheckCircle } from 'lucide-react';

export default function KelolaStok() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // STATE FORM: Ditambah price dan is_popular
  const [form, setForm] = useState({ 
    id: null, name: '', stock_ready: 0, stock_minimum: 50, image_url: '', price: '', is_popular: false 
  });
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

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage.from('products').upload(fileName, imageFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // PAYLOAD: Memasukkan price & is_popular ke database
      const payload = { 
        name: form.name, 
        stock_ready: form.stock_ready, 
        stock_minimum: form.stock_minimum,
        image_url: finalImageUrl,
        price: parseInt(form.price) || 0,
        is_popular: form.is_popular
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
    if(window.confirm('Hapus permanen varian ini?')) { await DataModel.deleteProduct(id); loadData(); } 
  };

  const resetForm = () => {
    setForm({ id: null, name: '', stock_ready: 0, stock_minimum: 50, image_url: '', price: '', is_popular: false });
    setImageFile(null);
    setImagePreview('');
  };

  const editProduct = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      stock_ready: p.stock_ready,
      stock_minimum: p.stock_minimum,
      image_url: p.image_url || '',
      price: p.price || '',
      is_popular: p.is_popular || false
    });
    setImageFile(null);
    setImagePreview(p.image_url || '');
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };

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
        .input-modern {
          width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid #E2E8F0;
          outline: none; font-size: 14px; background: #F8FAFC; color: #1E293B;
          transition: all 0.2s; box-sizing: border-box; font-weight: 500;
        }
        .input-modern:focus {
          border-color: #681E1E !important; background: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(104, 30, 30, 0.1) !important;
        }
        
        /* DESAIN LIST PRODUK YANG MEWAH & DINAMIS */
        .product-row {
          background: #ffffff; border-radius: 16px; border: 1px solid #EDF2F7;
          padding: 16px; display: flex; gap: 16px; align-items: center;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          margin-bottom: 12px; position: relative; overflow: hidden;
        }
        .product-row:hover {
          transform: translateX(4px) translateY(-2px);
          box-shadow: 0 12px 30px rgba(54, 28, 20, 0.06);
          border-color: #CBD5E0;
        }
        
        .action-btn { transition: all 0.2s; background: #F8FAFC; border: 1px solid #E2E8F0; }
        .action-btn.edit:hover { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; transform: scale(1.1); }
        .action-btn.delete:hover { background: #FEF2F2; color: #DC2626; border-color: #FECACA; transform: scale(1.1); }
        .upload-area { border: 2px dashed #CBD5E0; background: #F8FAFC; transition: all 0.3s; }
        .upload-area:hover { border-color: #681E1E; background: #FDF2F2; }
        .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
        
        /* CUSTOM CHECKBOX UNTUK PRODUK TERLARIS */
        .custom-checkbox input:checked + div { background: linear-gradient(135deg, #D4AF37 0%, #AA8222 100%); border-color: #D4AF37; }
        .custom-checkbox input:checked + div svg { opacity: 1; transform: scale(1); }
        
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="fade-in-up" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '28px' : '36px', fontWeight: '800', margin: '0 0 8px' }}>
          Manajemen Stok & Harga
        </h1>
        <p style={{ color: '#718096', fontSize: '15px', margin: 0, fontWeight: '500' }}>Kelola varian produk, harga jual, dan tandai produk terlaris Anda.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '400px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* ==========================================
            KOLOM KIRI: FORMULIR PRODUK
        ========================================== */}
        <div className="premium-card fade-in-up" style={{ padding: isMobile ? '24px 20px' : '32px', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ background: '#FDF2F2', padding: '10px', borderRadius: '12px', color: '#681E1E' }}><PackagePlus size={22}/></div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#1E293B', fontWeight: '800' }}>{form.id ? 'Edit Varian' : 'Tambah Varian Baru'}</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Foto Produk <span style={{ color: '#A0AEC0', fontWeight: '500', textTransform: 'none' }}>(Opsional)</span></label>
              <label className="upload-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', borderRadius: '16px', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '12px' }}>
                      <UploadCloud size={28} color="#94A3B8" />
                    </div>
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '700' }}>Klik untuk unggah gambar</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>PNG, JPG up to 2MB</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>

            <div>
              <label style={labelStyle}>NAMA VARIAN DODOL</label>
              <input type="text" required className="input-modern" placeholder="Contoh: Dodol Durian Premium" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>

            <div>
              <label style={labelStyle}>HARGA PER BOX (RP)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: '700', fontSize: '14px' }}>Rp</span>
                <input type="number" required className="input-modern" placeholder="35000" style={{ paddingLeft: '44px' }} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>STOK AWAL</label>
                <input type="number" required className="input-modern" placeholder="0" value={form.stock_ready} onChange={e => setForm({...form, stock_ready: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>BATAS MINIMUM</label>
                <input type="number" required className="input-modern" placeholder="50" value={form.stock_minimum} onChange={e => setForm({...form, stock_minimum: e.target.value})} />
              </div>
            </div>

            {/* TOGGLE TERLARIS YANG MEWAH */}
            <label className="custom-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: form.is_popular ? '#FEFCE8' : '#F8FAFC', border: `1px solid ${form.is_popular ? '#FEF08A' : '#E2E8F0'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <input type="checkbox" checked={form.is_popular} onChange={e => setForm({...form, is_popular: e.target.checked})} style={{ display: 'none' }} />
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: '2px solid #CBD5E0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <CheckCircle size={14} color="#fff" style={{ opacity: 0, transform: 'scale(0.5)', transition: 'all 0.2s' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={18} color={form.is_popular ? '#D97706' : '#94A3B8'} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: form.is_popular ? '#92400E' : '#475569' }}>Tandai sebagai Produk Terlaris</span>
              </div>
            </label>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexDirection: isMobile ? 'column' : 'row' }}>
              {form.id && (
                <button type="button" onClick={resetForm} style={{ padding: '16px', flex: 1, borderRadius: '14px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontWeight: '800', color: '#4A5568', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#F8FAFC'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                  Batal
                </button>
              )}
              <button type="submit" disabled={loading} style={{ 
                flex: 2, background: 'linear-gradient(135deg, #681E1E 0%, #4A1515 100%)', color: '#fff', 
                border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '800', 
                fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(104,30,30,0.2)', transition: 'all 0.3s' 
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(104,30,30,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(104,30,30,0.2)'; }}
              >
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </div>
          </form>
        </div>

        {/* ==========================================
            KOLOM KANAN: KATALOG ADMIN MODERN
        ========================================== */}
        <div className="premium-card fade-in-up" style={{ padding: isMobile ? '24px 16px' : '32px', animationDelay: '0.2s' }}>
          
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '24px', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '18px', color: '#1E293B', fontWeight: '800' }}>Katalog Produk Tersimpan</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Total: {filteredProducts.length} varian</p>
            </div>
            
            <div style={{ position: 'relative', width: isMobile ? '100%' : '220px' }}>
              <Search size={16} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" placeholder="Cari varian dodol..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '13px', background: '#F8FAFC', boxSizing: 'border-box', fontWeight: '500' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0', fontWeight: '600' }}>Menyinkronkan data katalog...</div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', border: '2px dashed #E2E8F0', borderRadius: '16px', background: '#F8FAFC' }}>
                <Box size={40} color="#CBD5E0" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: '0 0 8px', color: '#475569', fontSize: '16px', fontWeight: '800' }}>Produk Tidak Ditemukan</h3>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '13px' }}>{searchTerm ? `Tidak ada varian yang cocok dengan "${searchTerm}"` : 'Belum ada varian produk yang ditambahkan.'}</p>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isLowStock = parseInt(p.stock_ready) <= parseInt(p.stock_minimum);
                return (
                  <div key={p.id} className="product-row" style={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center' }}>
                    
                    {/* GAMBAR */}
                    <div style={{ width: isMobile ? '100%' : '85px', height: isMobile ? '160px' : '85px', borderRadius: '12px', background: '#F1F5F9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.image_url ? ( <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> ) : ( <ImageIcon size={28} color="#CBD5E0" /> )}
                    </div>
                    
                    {/* DETAIL PRODUK */}
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: '#1E293B', fontWeight: '800' }}>{p.name}</h4>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        {/* Lencana Harga Emas/Marun */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FDF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>
                          <Tag size={12} /> Rp {p.price ? p.price.toLocaleString('id-ID') : '0'}
                        </div>
                        
                        {/* Lencana Terlaris */}
                        {p.is_popular && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #D4AF37 0%, #AA8222 100%)', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }}>
                            <Flame size={12} /> Terlaris
                          </div>
                        )}
                        
                        {/* Lencana Stok Minimum (Peringatan) */}
                        {isLowStock && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEF2F2', color: '#DC2626', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                            <AlertCircle size={12} /> Stok Menipis
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* STATISTIK STOK & AKSI */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', borderTop: isMobile ? '1px solid #E2E8F0' : 'none', paddingTop: isMobile ? '16px' : '0' }}>
                      
                      <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Stok Gudang</div>
                        <div style={{ fontSize: '18px', fontWeight: '900', color: isLowStock ? '#DC2626' : '#059669' }}>
                          {p.stock_ready} <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>/ Min: {p.stock_minimum}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => editProduct(p)} className="action-btn edit" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="action-btn delete" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}