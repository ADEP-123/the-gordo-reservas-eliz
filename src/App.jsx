import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/panel-admin/AdminRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/panel-admin/AdminDashboard";
import AdminLogin from "./pages/panel-admin/AdminLogin";
import SalonView from "./pages/SalonView";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SalonView />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
