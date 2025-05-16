import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import Meetings from '../pages/Meetings';
import Whiteboards from '../pages/Whiteboards';
import Whiteboard from '../pages/Whiteboard';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        }
      />
      <Route
        path="/meetings"
        element={
          <MainLayout>
            <Meetings />
          </MainLayout>
        }
      />
      <Route
        path="/whiteboards"
        element={
          <MainLayout>
            <Whiteboards />
          </MainLayout>
        }
      />
      <Route
        path="/whiteboard/:id"
        element={
          <MainLayout>
            <Whiteboard />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;