// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from "../Layout/Layout.jsx"
import Login from '../Pages/LoginPage/LoginPage.jsx';
import Home from '../Pages/HomePage/HomePage.jsx';
import AddClientPage from "../Pages/Clients/AddClients/AddClients.jsx"
import BannerImages from '../Pages/BannersPage/Banners.jsx';
import ProductListPage from '../Pages/Products/ProductListPage.jsx';
import EditClient from '../Pages/EditClient/EditClient.jsx';
import EditBanner from '../Pages/EditBanner/EditBanner.jsx';
import EditOrderPage from '../Pages/EditOrderPage/EditOrderPage.jsx';
import ClientsPage from '../Pages/Clients/ClientsPage/ClientPage.jsx';
import EditCategoryPage from '../Pages/EditCategoryPage/EditCategoryPage.jsx';
import CategoriesPage from '../Pages/CategoriesPage/CategoriesPage.jsx';
import EditProductPage from '../Pages/EditProductPage/EditProductPage.jsx';
import PublicRoute from './PublicRoute.jsx';
import PrivateRoute from "./PrivateRoute.jsx"
import SelectProductPage from '../Pages/Orders/SelectProduct/SelectProductPage.jsx';
import AddProduct from '../Pages/AddProduct/AddProduct.jsx';
import AddCategory from '../Pages/AddCategory/AddCategoryPage.jsx';
import AddBanner from '../Pages/AddBanner/AddBannerPage.jsx';
import SelectClient from '../Pages/Orders/SelectClientPage/SelectCleint.jsx';
import Orders from '../Pages/Orders/OrderPage/Orders.jsx';
import Admins from '../Pages/Admins/Admins.jsx';
import SendCodePage from '../Pages/Admins/SendCodePage.jsx';
// import CheckCodePage from '../Pages/Admins/CheckCodePage.jsx';

import ResetPasswordPage from '../Pages/Admins/ResetPasswordPage.jsx';
import CheckCodePage from '../Pages/Admins/CheckCodePage.jsx';
import ClientsSMSDashboard from '../Pages/ClientsSMSDashboard/ClientsSMSDashboard.jsx';


const AppRoutes = () => (
  <Routes>
    {/* Public Route (Login) */}
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />


    {/* Private Routes with Layout */}
    <Route
      path="/"
      element={
        <PrivateRoute>
          <DashboardLayout><Home /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/send-sms"
      element={
        <PrivateRoute>
          <DashboardLayout><ClientsSMSDashboard /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/admins"
      element={
        <PrivateRoute>
          <DashboardLayout><Admins /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/reset-password"
      element={
        <PublicRoute>

          <SendCodePage />
        </PublicRoute>

      }
    />
    <Route
      path="/check-code"
      element={
        <PublicRoute>
          <CheckCodePage />
        </PublicRoute>
      }
    />
    <Route
      path="/reset-password/new"
      element={
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      }
    />













    <Route
      path="/banners"
      element={
        <PrivateRoute>
          <DashboardLayout><BannerImages /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <PrivateRoute>
          <DashboardLayout><Orders /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/edit-order/:id"
      element={
        <PrivateRoute>
          <DashboardLayout><EditOrderPage /></DashboardLayout>
        </PrivateRoute>
      }
    />


    <Route
      path="/clients"
      element={
        <PrivateRoute>
          <DashboardLayout><ClientsPage /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/select-clients"
      element={
        <PrivateRoute>
          <DashboardLayout><SelectClient /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/add-clients"
      element={
        <PrivateRoute>
          <DashboardLayout><AddClientPage /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/edit-client/:id"
      element={
        <PrivateRoute>
          <DashboardLayout><EditClient /></DashboardLayout>
        </PrivateRoute>
      }
    />

    <Route
      path="/select-product"
      element={
        <PrivateRoute>
          <DashboardLayout><SelectProductPage /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/products"
      element={
        <PrivateRoute>
          <DashboardLayout><ProductListPage /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/add-product"
      element={
        <PrivateRoute>
          <DashboardLayout><AddProduct /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/add-category"
      element={
        <PrivateRoute>
          <DashboardLayout><AddCategory /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/categories"
      element={
        <PrivateRoute>
          <DashboardLayout><CategoriesPage /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/edit-category/:id"
      element={
        <PrivateRoute>
          <DashboardLayout><EditCategoryPage /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/add-banner"
      element={
        <PrivateRoute>
          <DashboardLayout><AddBanner /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/edit-banner/:id"
      element={
        <PrivateRoute>
          <DashboardLayout><EditBanner /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/edit-product/:id"
      element={
        <PrivateRoute>
          <DashboardLayout><EditProductPage /></DashboardLayout>
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
