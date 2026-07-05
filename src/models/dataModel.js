import { supabase } from '../config/supabaseClient';

export const DataModel = {
  // === AUTH & PROFILE ===
  async getProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  },
  async updateProfile(userId, updateData) {
    const { data, error } = await supabase.from('profiles').update(updateData).eq('id', userId);
    if (error) throw error;
    return data;
  },

  // === KEHADIRAN ===
  async getTodayAttendance(userId) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('attendances').select('*').eq('user_id', userId).eq('date', today).maybeSingle();
    if (error) throw error;
    return data;
  },
  async insertAttendance(attendanceData) {
    const { data, error } = await supabase.from('attendances').insert([attendanceData]).select();
    if (error) throw error;
    return data[0];
  },
  async updateAttendance(id, updateData) {
    const { data, error } = await supabase.from('attendances').update(updateData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // === PRODUCTS ===
  async getProducts() {
    const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  // === PRODUCTIONS ===
  async getTodayProductions(userId) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('productions')
      .select('*, products(name)')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00Z`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async insertProduction(productionData) {
    const { data, error } = await supabase.from('productions').insert([productionData]).select();
    if (error) throw error;
    return data[0];
  },

  // === SETTINGS ===
  async getSettings() {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) throw error;
    return data;
  },
  async updateSettings(updateData) {
    const { data, error } = await supabase.from('settings').update(updateData).eq('id', 1);
    if (error) throw error;
    return data;
  },

  // === MESSAGES ===
  async getMessages() {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async markMessageRead(id) {
    const { data, error } = await supabase.from('messages').update({ is_read: true }).eq('id', id);
    if (error) throw error;
    return data;
  },

  // === KARYAWAN ===
  async getEmployees() {
    const { data, error } = await supabase.from('profiles').select('*').eq('role', 'employee').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // === KELOLA PRODUK ===
  async addProduct(productData) {
    const { data, error } = await supabase.from('products').insert([productData]).select();
    if (error) throw error;
    return data[0];
  },
  async updateProduct(id, updateData) {
    const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  async deleteProduct(id) {
    const { data, error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return data;
  },

  // === LAPORAN ===
  async getAllAttendances() {
    const { data, error } = await supabase.from('attendances').select('*, profiles(name)').order('date', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getAllProductions() {
    const { data, error } = await supabase.from('productions').select('*, profiles(name), products(name)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // === KOTAK MASUK ===
  async deleteMessage(id) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async markMessageAsRead(id) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};