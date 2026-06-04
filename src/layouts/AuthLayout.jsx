import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-top-border"></div>
        {children}
      </div>
    </div>
  );
}