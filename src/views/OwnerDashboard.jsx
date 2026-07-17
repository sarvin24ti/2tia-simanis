import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, Box, Clock, ChevronRight, Activity, AlertTriangle } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from "./SharedComponents";

export default function OwnerDashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [clock, setClock] = useState('');
  
  // State untuk menyimpan data real dari database
  const [data, setData] = useState({ totalStock: 0, totalHadir: 0, totalProduksi: 0, kritisCount: 0, products: [], attendances: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    // Jam Real-time
    const interval = setInterval(() => {
      setClock(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '.'));
    }, 1000);
    
    // Tarik data dari Supabase
    fetchDashboardData();
    
    return () => { 
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  // Fungsi Fetching Database Bawaan Anda
  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: prods } = await supabase.from('products').select('*').order('name');
      const { data: atts } = await supabase.from('attendances').select('*, profiles(name)').eq('date', today);
      const { data: prodsToday } = await supabase.from('productions').select('quantity').gte('created_at', `${today}T00:00:00Z`);

      setData({
        totalStock: prods?.reduce((acc, curr) => acc + (curr.stock_ready || 0), 0) || 0,
        totalHadir: atts?.length || 0,
        totalProduksi: prodsToday?.reduce((acc, curr) => acc + curr.quantity, 0) || 0,
        kritisCount: prods?.filter(p => p.stock_ready <= p.stock_minimum).length || 0,
        products: prods || [], attendances: atts || []
      });
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner />;

  // Format data untuk Chart
  const chartData = data.products.map(p => ({ 
    name: p.name.replace('Dodol ', ''), 
    Stok: p.stock_ready 
  }));

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px', background: '#FBF9F6', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* INJEKSI CSS UNTUK ANIMASI & GLASSMORPHISM */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 10px 40px rgba(104, 30, 30, 0.04);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(104, 30, 30, 0.1);
          border-color: rgba(212, 175, 55, 0.4);
        }
        .fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
      `}</style>

      {/* HEADER DASHBOARD */}
      <div className="fade-in-up" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '40px', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#361C14', fontSize: isMobile ? '28px' : '36px', fontWeight: '800', margin: '0 0 8px' }}>
            Overview Bisnis
          </h1>
          <p style={{ color: '#718096', fontSize: '15px', margin: 0, fontWeight: '500' }}>Pantau performa produksi dan staf UD Putra Mandiri secara real-time.</p>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '30px', border: '1px solid #EDF2F7', background: '#fff' }}>
          <Clock size={20} color="#681E1E" />
          <span style={{ fontWeight: '800', color: '#2D3748', fontSize: '15px', letterSpacing: '1px' }}>{clock || '00.00.00'} WIB</span>
        </div>
      </div>

      {/* STATISTIK UTAMA (GRID 4 KOLOM) */}
      <div className="fade-in-up delay-1" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        
        {/* Card 1 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ background: '#FDF2F2', padding: '12px', borderRadius: '16px', color: '#681E1E' }}><Package size={24} /></div>
            <span style={{ background: '#ECFDF5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>Live</span>
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Total Stok Tersedia</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#2D3748', fontWeight: '900', fontFamily: 'Playfair Display, serif' }}>{data.totalStock} <span style={{fontSize: '14px', color: '#A0AEC0', fontFamily: 'Inter'}}>Box</span></h2>
        </div>

        {/* Card 2 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '12px', borderRadius: '16px', color: '#B7942D' }}><TrendingUp size={24} /></div>
            <span style={{ background: '#ECFDF5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>Hari Ini</span>
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Produksi Sif Ini</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#2D3748', fontWeight: '900', fontFamily: 'Playfair Display, serif' }}>{data.totalProduksi} <span style={{fontSize: '14px', color: '#A0AEC0', fontFamily: 'Inter'}}>Box</span></h2>
        </div>

        {/* Card 3 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ background: '#F0F4F8', padding: '12px', borderRadius: '16px', color: '#4A5568' }}><Box size={24} /></div>
             {data.kritisCount > 0 && <span style={{ background: '#FFF5F5', color: '#E53E3E', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12}/> {data.kritisCount} Menipis</span>}
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Varian Aktif</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#2D3748', fontWeight: '900', fontFamily: 'Playfair Display, serif' }}>{data.products.length} <span style={{fontSize: '14px', color: '#A0AEC0', fontFamily: 'Inter'}}>Varian</span></h2>
        </div>

        {/* Card 4 */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ background: '#E6FFFA', padding: '12px', borderRadius: '16px', color: '#047857' }}><Users size={24} /></div>
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#718096', fontWeight: '700', textTransform: 'uppercase' }}>Pegawai Hadir</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#2D3748', fontWeight: '900', fontFamily: 'Playfair Display, serif' }}>{data.totalHadir} <span style={{fontSize: '14px', color: '#A0AEC0', fontFamily: 'Inter'}}>Orang</span></h2>
        </div>

      </div>

      {/* GRAFIK & AKTIVITAS (GRID 2 KOLOM) */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '24px' }}>
        
        {/* CHART SECTION */}
        <div className="glass-card fade-in-up delay-2" style={{ padding: isMobile ? '24px 16px' : '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '20px', color: '#2D3748', fontWeight: '800' }}>Analisis Stok Varian</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>Peta ketersediaan produk di gudang secara aktual</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '8px 16px', borderRadius: '20px', border: '1px solid #EDF2F7' }}>
              <Activity size={14} color="#681E1E" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#4A5568' }}>Live</span>
            </div>
          </div>
          
          <div style={{ width: '100%', height: '350px', minWidth: 0, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#681E1E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#681E1E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0AEC0' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#A0AEC0' }} />
                <Tooltip cursor={{ stroke: '#CBD5E0', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="Stok" stroke="#681E1E" strokeWidth={3} fillOpacity={1} fill="url(#colorStok)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITIES (LOG KEHADIRAN) */}
        <div className="glass-card fade-in-up delay-3" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#2D3748', fontWeight: '800' }}>Log Kehadiran</h3>
            <ChevronRight size={20} color="#A0AEC0" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '350px', paddingRight: '8px' }}>
            {data.attendances.map((att, idx) => (
              <div key={att.id || idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F0F4F8', color: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                  {att.profiles?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#2D3748', fontWeight: '700' }}>
                    {att.profiles?.name || 'Anonim'} <span style={{ color: '#718096', fontWeight: '500' }}>absen masuk</span>
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#A0AEC0' }}>Pukul {att.check_in ? att.check_in.slice(0, 5) : '-'} WIB</p>
                </div>
                <span style={{ background: '#E6FFFA', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '800' }}>Hadir</span>
              </div>
            ))}
            
            {data.attendances.length === 0 && (
              <div style={{ textAlign: 'center', color: '#A0AEC0', padding: '20px 0', fontSize: '13px' }}>Belum ada karyawan yang hadir.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}