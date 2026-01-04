import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/auth/Login";
import AdminLayout from "./layout/AdminLayout";

// Admin pages
import Dashboard from "./pages/dashboard/Dashboard";
import BlogsPage from "./pages/blogs/BlogList";
import BlogForm from "./pages/blogs/BlogForm";
import OpportunityList from "./pages/opportunities/OpportunityList";
import OpportunityForm from "./pages/opportunities/OpportunityForm";
import FellowshipList from "./pages/fellowships/FellowshipList";
import FellowshipForm from "./pages/fellowships/FellowshipForm";
import FellowshipApplications from "./pages/fellowships/FellowshipApplications";

import { Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Default route when visiting /admin */}
            <Route index element={<Dashboard />} />

            {/* Nested admin pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/create" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />

            <Route path="opportunities" element={<OpportunityList />} />
            <Route path="opportunities/create" element={<OpportunityForm />} />
            <Route
              path="opportunities/edit/:id"
              element={<OpportunityForm />}
            />
            <Route path="fellowships" element={<FellowshipList />} />
            <Route path="fellowships/create" element={<FellowshipForm />} />
            <Route path="fellowships/edit/:id" element={<FellowshipForm />} />
            <Route
              path="fellowships/:id/applications"
              element={<FellowshipApplications />}
            />

            {/* Optional: Catch-all for unknown admin sub-routes */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Optional: Redirect root to login or admin */}
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
