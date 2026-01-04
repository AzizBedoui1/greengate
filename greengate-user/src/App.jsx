import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTranslation } from "react-i18next";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

// Public Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyAndCookiesPolicyPage = lazy(() =>
  import("./pages/PrivacyAndCookiesPolicyPage")
);

const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetails = lazy(() => import("./pages/BlogPostPage"));
const OpportunityPage = lazy(() => import("./pages/Opportunities"));
const FellowshipsPage = lazy(() => import("./pages/FellowshipsPage"));
const FellowshipDetailPage = lazy(() => import("./pages/FellowshipDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProfileInfo = lazy(() => import("./pages/ProfileInfo"));
const MyApplications = lazy(() => import("./pages/MyApplications"));

// Auth Pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

// Redirect component
const RootRedirect = () => <Navigate to="/" replace />;

const theme = createTheme({
  palette: {
    primary: { main: "#4CAF50" },
    secondary: { main: "#ff4081" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Suspense
            fallback={
              <div style={{ padding: "2rem", textAlign: "center" }}>
                Loading…
              </div>
            }
          >
            <ScrollToTop />
            <Routes>
              {/* Public Routes - Accessible to everyone (guests & logged-in) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                  path="/privacy"
                  element={<PrivacyAndCookiesPolicyPage />}
                />

                {/* Blog Routes - Public */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogDetails />} />

                {/* Opportunities - Public */}
                <Route path="/opportunities" element={<OpportunityPage />} />

                {/* Fellowships - Public */}
                <Route path="/fellowships" element={<FellowshipsPage />} />
                <Route
                  path="/fellowships/:id"
                  element={<FellowshipDetailPage />}
                />
              </Route>

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route element={<ProfilePage />}>
                  <Route index element={<ProfileInfo />} />
                  <Route path="applications" element={<MyApplications />} />
                  {/* <Route path="edit" element={<EditProfile />} /> */}
                </Route>
              </Route>

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
