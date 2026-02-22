import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import Login from './pages/Login/Login';
import SetPassword from './pages/SetPassword/SetPassword';
import SuperAdminLayout from './pages/SuperAdmin/components/SuperAdminLayout';
import Dashboard from './pages/SuperAdmin/Dashboard/Dashboard';
import AdminManagement from './pages/SuperAdmin/AdminManagement/AdminManagement';
import AuditTrail from './pages/SuperAdmin/AuditTrail/AuditTrail';
import OrgAdminLayout from './pages/OrgAdmin/components/OrgAdminLayout';
import OrgAdminDashboard from './pages/OrgAdmin/Dashboard/OrgAdminDashboard';
import OrgUserManagement from './pages/OrgAdmin/UserManagement/UserManagement';
import UserLayout from './pages/User/components/UserLayout';
import UserDashboard from './pages/User/Dashboard/UserDashboard';
import UserSubmissions from './pages/User/Submissions/UserSubmissions';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* ── Super Admin Routes ── */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/super-admin" element={<SuperAdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin-management" element={<AdminManagement />} />
              <Route path="audit-trail" element={<AuditTrail />} />
              {/* Placeholder routes (pages to be built later) */}
              <Route path="workflows" element={<PlaceholderPage title="Workflows" />} />
              <Route path="organizations" element={<PlaceholderPage title="Organizations" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Route>

          {/* ── Org Admin Routes ── */}
          <Route element={<ProtectedRoute allowedRoles={['ORG_ADMIN']} />}>
            <Route path="/org-admin" element={<OrgAdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<OrgAdminDashboard />} />
              <Route path="hierarchy" element={<PlaceholderPage title="Hierarchy" />} />
              <Route path="user-management" element={<OrgUserManagement />} />
              <Route path="workflows" element={<PlaceholderPage title="Workflows" />} />
              <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
          </Route>

          {/* ── User Routes ── */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="submissions" element={<UserSubmissions />} />
              <Route path="approvals" element={<PlaceholderPage title="My Approvals" />} />
              <Route path="profile" element={<PlaceholderPage title="Profile" />} />
            </Route>
          </Route>

          {/* Redirect root to login for now */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        theme="system"
        richColors
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </ThemeProvider>
  );
};

/* Simple placeholder for pages not yet built */
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-1 items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">This page is under construction.</p>
    </div>
  </div>
);

export default App;
