// src/App.tsx
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from './lib/i18n'; // Импортируем i18next для переводов
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import './App.css';

// Pages
import HomePage from "./pages/Index";
import CTFPlatform from "./pages/ctf/index";
import ChallengePage from "./pages/ctf/ChallengePage";
import CategoryChallenges from "./pages/ctf/CategoryChallenges";
import AddChallenge from "./pages/ctf/AddChallenge"; // Предполагаем, что страница добавления кейсов существует
import KnowledgeBase from "./pages/knowledge/index";
import ArticlePage from "./pages/knowledge/ArticlePage";
import ReferenceGuide from "./pages/knowledge/reference-guide";
import AIAssistant from "./pages/ai-assistant/index";
import Community from "./pages/community/index";
import Products from "./pages/products/index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import EmailConfirm from "./pages/auth/EmailConfirm";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Profile from "./pages/profile/index";
import Settings from "./pages/settings/index";
import AdminPanel from "./pages/admin/FinalAdminPanel";
import NotFound from "./pages/NotFound";

// Admin Pages (заглушки, которые можно реализовать позже)
const AdminSettings = () => <div>Настройки админ-панели (в разработке)</div>;
const AdminUsers = () => <div>Управление пользователями (в разработке)</div>;
const AdminNewChallenge = () => <div>Создание нового кейса (в разработке)</div>;
const AdminEditChallenge = () => <div>Редактирование кейса (в разработке)</div>;

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthModalWrapper } from "./components/layout/AuthModalWrapper";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.log("App component mounted");
    document.body.style.backgroundColor = "#111827";
    document.body.style.color = "#e5e7eb";
    return () => {
      console.log("App component unmounted");
    };
  }, []);

  return (
    <I18nextProvider i18n={i18next}> {/* Возвращаем поддержку переводов */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AuthModalWrapper />
              <Navbar />
              <div className="content-wrapper">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  {/* CTF Platform Routes */}
                  <Route path="/ctf" element={<CTFPlatform />} />
                  <Route path="/ctf/challenge/:id" element={<ChallengePage />} />
                  <Route path="/ctf/category/:category" element={<CategoryChallenges />} />
                  <Route path="/ctf/add-challenge" element={<AddChallenge />} />
                  {/* Knowledge Base Routes */}
                  <Route path="/knowledge" element={<KnowledgeBase />} />
                  <Route path="/knowledge/article/:id" element={<ArticlePage />} />
                  <Route path="/knowledge/reference-guide" element={<ReferenceGuide />} />
                  {/* AI Assistant Routes */}
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  {/* Community Routes */}
                  <Route path="/community" element={<Community />} />
                  {/* Products Routes */}
                  <Route path="/products" element={<Products />} />
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/auth/confirm" element={<EmailConfirm />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  {/* User Routes */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/challenges/new" element={<AdminNewChallenge />} />
                  <Route path="/admin/challenges/edit/:id" element={<AdminEditChallenge />} />
                  {/* Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;