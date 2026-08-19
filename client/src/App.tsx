import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Analytics from "./pages/Analytics";
import Authors from "./pages/Authors";
import BlogDetails from "./pages/BlogDetails";
import BlogListing from "./pages/BlogListing";
import Bookmarks from "./pages/Bookmarks";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import EditPost from "./pages/EditPost";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ManageCategories from "./pages/ManageCategories";
import ManageComments from "./pages/ManageComments";
import ManagePosts from "./pages/ManagePosts";
import ManageUsers from "./pages/ManageUsers";
import MyPosts from "./pages/MyPosts";
import Notifications from "./pages/Notifications";
import PostForm from "./pages/PostForm";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import SearchResults from "./pages/SearchResults";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/blogs" element={<BlogListing />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-post" element={<PostForm />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<ProtectedRoute admin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/posts" element={<ManagePosts />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/comments" element={<ManageComments />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
