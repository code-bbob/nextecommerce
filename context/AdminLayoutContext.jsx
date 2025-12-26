'use client';

import { createContext, useContext } from 'react';

const AdminLayoutContext = createContext(undefined);

export function AdminLayoutProvider({ children }) {
  return (
    <AdminLayoutContext.Provider value={{}}>
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (context === undefined) {
    throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  }
  return context;
}
