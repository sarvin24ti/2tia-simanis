import React, { useState, useEffect } from 'react';
import { Users, Plus, AlertTriangle, ChevronRight } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function OwnerDashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [data, setData] = useState({ totalStock: 0, totalHadir: 0, totalProduksi: 0, kritisCount: 0, products: [], attendances: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    fetchDashboardData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (loading) return <div style={{ padding: '20px', color: '#718096' }}>Memuat data analitik...</div>;

  const chartData = data.products.map(p => ({ name: p.name.replace('Dodol ', ''), Stok: p.stock_ready, fillColor: p.stock_ready <= p.stock_minimum ? '#E53E3E' : '#681E1E' }));
  const premiumCardStyle = { background: '#ffffff', borderRadius: '20px', padding: isMobile ? '16px' : '28px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(237, 242, 247, 0.8)', width: '100%', overflow: 'hidden' };

  return (
    <div style={{ maxWidth: '1200px', width: '100%' }}>
      <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
        <p style={{ color: '#718096', fontSize: '12px', margin: '0 0 4px', fontWeight: '700', textTransform: 'uppercase' }}>Total Stok Siap Jual</p>
        <h1 style={{ fontSize: isMobile ? '32px' : '48px', color: '#2D3748', margin: 0, fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>{data.totalStock} <span style={{ fontSize: isMobile ? '16px' : '18px', color: '#A0AEC0', fontFamily: 'Inter' }}>Box</span></h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '24px', marginBottom: isMobile ? '20px' : '32px' }}>
        <div style={premiumCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div><p style={{ margin: '0 0 8px', fontSize: '11px', color: '#718096', fontWeight: '700' }}>HADIR HARI INI</p><h3 style={{ margin: 0, color: '#2D3748', fontSize: isMobile ? '24px' : '32px', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>{data.totalHadir}</h3></div>
            <div style={{ background: 'linear-gradient(135deg, #E6FFFA 0%, #81E6D9 100%)', padding: isMobile ? '10px' : '12px', borderRadius: '16px', color: '#234E52' }}><Users size={isMobile ? 20 : 24} /></div>
          </div>
        </div>
        <div style={premiumCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div><p style={{ margin: '0 0 8px', fontSize: '11px', color: '#718096', fontWeight: '700' }}>PRODUKSI HARI INI</p><h3 style={{ margin: 0, color: '#2D3748', fontSize: isMobile ? '24px' : '32px', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>+{data.totalProduksi}</h3></div>
            <div style={{ background: 'linear-gradient(135deg, #F0F4F8 0%, #D9E2EC 100%)', padding: isMobile ? '10px' : '12px', borderRadius: '16px', color: '#486581' }}><Plus size={isMobile ? 20 : 24} /></div>
          </div>
        </div>
        <div style={premiumCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div><p style={{ margin: '0 0 8px', fontSize: '11px', color: '#E53E3E', fontWeight: '700' }}>STOK MENIPIS</p><h3 style={{ margin: 0, color: '#E53E3E', fontSize: isMobile ? '24px' : '32px', fontFamily: 'Playfair Display, serif', fontWeight: '800' }}>{data.kritisCount}</h3></div>
            <div style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FEB2B2 100%)', padding: isMobile ? '10px' : '12px', borderRadius: '16px', color: '#9B2C2C' }}><AlertTriangle size={isMobile ? 20 : 24} /></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '16px' : '24px', alignItems: 'start' }}>
        <div style={premiumCardStyle}>
          <h4 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '800', color: '#2D3748' }}>Analisis Stok Varian</h4>
          <div style={{ height: '220px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={isMobile ? 20 : 36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#718096' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0AEC0' }} />
                <Tooltip cursor={{ fill: '#F7FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: '700' }} />
                <Bar dataKey="Stok" radius={[6, 6, 6, 6]}><Cell fill="#681E1E" /></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={premiumCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#2D3748' }}>Log Kehadiran</h4>
            <span style={{ color: '#681E1E', fontSize: '12px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center' }}>Semua <ChevronRight size={14} /></span>
          </div>
          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '400px', textAlign: 'left', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EDF2F7' }}>
                  <th style={{ paddingBottom: '12px', color: '#718096', fontWeight: '700', fontSize: '10px', whiteSpace: 'nowrap' }}>KARYAWAN</th>
                  <th style={{ paddingBottom: '12px', color: '#718096', fontWeight: '700', fontSize: '10px', whiteSpace: 'nowrap' }}>JAM MASUK</th>
                  <th style={{ paddingBottom: '12px', color: '#718096', fontWeight: '700', fontSize: '10px', whiteSpace: 'nowrap' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.attendances.map(att => (
                  <tr key={att.id} style={{ borderBottom: '1px solid #F7FAFC' }}>
                    <td style={{ padding: '12px 0', fontWeight: '700', color: '#2D3748', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', paddingRight: '16px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#EDF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568', fontSize: '11px' }}>{att.profiles?.name?.charAt(0)}</div>
                      {att.profiles?.name || 'Anonim'}
                    </td>
                    <td style={{ padding: '12px 0', color: '#4A5568', fontWeight: '600', whiteSpace: 'nowrap', paddingRight: '16px' }}>{att.check_in ? att.check_in.slice(0, 5) : '-'}</td>
                    <td style={{ padding: '12px 0', whiteSpace: 'nowrap' }}><span style={{ background: '#E6FFFA', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' }}>Hadir</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}