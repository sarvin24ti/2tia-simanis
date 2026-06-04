import React, { useState, Suspense, lazy } from 'react';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Implementasi Lazy Loading (Hanya meload file saat dibutuhkan)
const Landing = lazy(() => import('./pages/LandingView'));
const Login = lazy(() => import('./pages/LoginView'));
const Register = lazy(() => import('./pages/RegisterView'));
const Employee = lazy(() => import('./pages/EmployeeDashboard'));
const Admin = lazy(() => import('./pages/AdminDashboard'));

// Komponen Loading saat menunggu file terdownload
const LoadingSpinner = () => (
  <div style={{ height: '100%', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
    <div style={{ 
      width: '40px', height: '40px', 
      border: '4px solid #f3f3f3', 
      borderTop: '4px solid #712625', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite' 
    }}></div>
    <p style={{ color: '#888888', fontSize: '0.875rem', fontWeight: 500 }}>Memuat halaman...</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  const renderView = () => {
    switch(currentView) {
      case 'landing': 
        return (
          <MainLayout onNavigate={setCurrentView}>
            <Suspense fallback={<LoadingSpinner />}>
              <Landing />
            </Suspense>
          </MainLayout>
        );
      case 'login': 
        return (
          <AuthLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Login onNavigate={setCurrentView} />
            </Suspense>
          </AuthLayout>
        );
      case 'register': 
        return (
          <AuthLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Register onNavigate={setCurrentView} />
            </Suspense>
          </AuthLayout>
        );
      case 'employee': 
        return (
          <Suspense fallback={<div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner /></div>}>
            <Employee onNavigate={setCurrentView} />
          </Suspense>
        );
      case 'admin': 
        return (
          <Suspense fallback={<div style={{height: '100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner /></div>}>
            <Admin onNavigate={setCurrentView} />
          </Suspense>
        );
      default: 
        return (
          <MainLayout onNavigate={setCurrentView}>
            <Suspense fallback={<LoadingSpinner />}>
              <Landing />
            </Suspense>
          </MainLayout>
        );
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: currentView.includes('landing') ? 'var(--bg-main)' : 'var(--bg-admin)' }}>
      {renderView()}
    </div>
  );
}