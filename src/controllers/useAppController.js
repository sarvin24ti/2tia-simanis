import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { DataModel } from '../models/dataModel';

export function useAppController() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentView, setCurrentView] = useState('login'); 
  const [globalSettings, setGlobalSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil session aktif awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Dengarkan perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    // Ambil setelan website global
    DataModel.getSettings()
      .then(setGlobalSettings)
      .catch(err => console.error("Gagal memuat setelan website:", err.message))
      .finally(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session) => {
    if (session) {
      setUser(session.user);
      try {
        const prof = await DataModel.getProfile(session.user.id);
        setProfile(prof);
        setCurrentView(prof.role === 'owner' ? 'owner-dashboard' : 'employee-dashboard');
      } catch (err) {
        console.error("Gagal mengambil profil:", err.message);
      }
    } else {
      setUser(null);
      setProfile(null);
      setCurrentView('login');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentView('login');
  };

  const refreshProfile = async () => {
    if (user) {
      const prof = await DataModel.getProfile(user.id);
      setProfile(prof);
    }
  };

  const refreshSettings = async () => {
    const sets = await DataModel.getSettings();
    setGlobalSettings(sets);
  };

  return { user, profile, currentView, setCurrentView, globalSettings, loading, logout, refreshProfile, refreshSettings };
}