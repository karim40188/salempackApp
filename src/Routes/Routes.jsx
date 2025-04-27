// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import  from "../pages/Orders/OrderPage/OrdersPage.jsx"
import SelectClients from '../pages/Orders/SelectClientPage/SelectCleintPage.jsx';
import AddClients from '../pages/Clients/AddClients/AddClients.jsx';
import SelectProduct from '../pages/Orders/SelectProduct/SelectProductPage.jsx';
import AddProduct from '../pages/AddProduct/AddProduct.jsx';
import AddCategory from '../pages/AddCategory/AddCategoryPage.jsx';
import AddBanner from '../pages/AddBanner/AddBanner.jsx';
import DashboardLayout from '../Layout/Layout.jsx';


import  Orders from "../pages/Orders/OrderPage/OrdersPage.jsx"
import Login from '../pages/LoginPage/LoginPage.jsx'
import Home from '../pages/HomePage/HomePage.jsx';
import BannerImages from '../pages/BannersPage/Banners.jsx';
import ProductListPage from '../pages/Products/ProductListPage.jsx';
import EditClient from '../pages/EditClient/EditClient.jsx';
import EditBanner from '../pages/EditBanner/EditBanner.jsx';
import EditOrderPage from '../pages/EditOrderPage/EditOrderPage.jsx';
import ClientsPage from '../pages/Clients/ClientsPage/ClientPage.jsx';
import EditCategoryPage from '../pages/EditCategoryPage/EditCategoryPage.jsx';
import CategoriesPage from '../pages/CategoriesPage/CategoriesPage.jsx';
import EditProductPage from '../Pages/EditProductPage/EditProductPage.jsx';
import PublicRoute from './PublicRoute.jsx';
import PrivateRoute from "./PrivateRoute.jsx"


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
          <DashboardLayout><SelectProduct /></DashboardLayout>
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
