// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/LoginPage/Login.jsx';
import Home from '../Pages/HomePage/Home.jsx';
import Banners from '../Pages/BannersPage/Banners.jsx';
import Orders from '../pages/Orders/OrderPage/OrdersPage.jsx';
import Clients from '../Pages/Clients/ClientsPage/ClientPage.jsx';
import SelectClients from '../pages/Orders/SelectClientPage/SelectCleintPage.jsx';
import AddClients from '../pages/Clients/AddClients/AddClients.jsx';
import SelectProduct from '../pages/Orders/SelectProduct/SelectProductPage.jsx';
import AddProduct from '../Pages/AddProduct/AddProduct.jsx';
import AddCategory from '../Pages/AddCategory/AddCategoryPage.jsx';
import AddBanner from '../Pages/AddBanner/AddBanner.jsx';

import DashboardLayout from '../Layout/Layout.jsx';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import EditProductPage from '../Pages/EditProductPage/EditProductPage.jsx';
import CategoriesPage from '../Pages/CategoriesPage/CategoriesPage.jsx';
import EditCategoryPage from '../Pages/EditCategoryPage/EditCategoryPage.jsx';
import EditOrderPage from '../Pages/EditOrderPage/EditOrderPage.jsx';
import EditBanner from '../Pages/EditBanner/EditBanner.jsx';

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
      path="/banners"
      element={
        <PrivateRoute>
          <DashboardLayout><Banners /></DashboardLayout>
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
          <DashboardLayout><Clients /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/select-clients"
      element={
        <PrivateRoute>
          <DashboardLayout><SelectClients /></DashboardLayout>
        </PrivateRoute>
      }
    />
    <Route
      path="/add-clients"
      element={
        <PrivateRoute>
          <DashboardLayout><AddClients /></DashboardLayout>
        </PrivateRoute>
      }
    />
 
    <Route
      path="/select-product"
      element={
        <PrivateRoute>
          <DashboardLayout><SelectProduct /></DashboardLayout>
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
