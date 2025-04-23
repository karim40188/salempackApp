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

import DashboardLayout from '../Layout/Layout.jsx';

const AppRoutes = () => (
  <Routes>
    {/* No layout for login */}
    <Route path="/" element={<Login />} />

    {/* Dashboard layout routes */}
    <Route path="/home" element={<DashboardLayout><Home /></DashboardLayout>} />
    <Route path="/banners" element={<DashboardLayout><Banners /></DashboardLayout>} />
    <Route path="/orders" element={<DashboardLayout><Orders /></DashboardLayout>} />
    <Route path="/clients" element={<DashboardLayout><Clients /></DashboardLayout>} />
    <Route path="/select-clients" element={<DashboardLayout><SelectClients /></DashboardLayout>} />
    <Route path="/add-clients" element={<DashboardLayout><AddClients /></DashboardLayout>} />
    <Route path="/select-product" element={<DashboardLayout><SelectProduct /></DashboardLayout>} />
  </Routes>
);

export default AppRoutes;
