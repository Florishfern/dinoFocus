import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // เช็คว่ามี token ใน localStorage ไหม
  const token = localStorage.getItem('token');

  if (!token) {
    // ถ้าไม่มี token ให้ส่งกลับไปหน้า login
    return <Navigate to="/login" replace />;
  }

  // ถ้ามี token ให้แสดงผลหน้าที่ต้องการเข้าได้ปกติ
  return children;
};

export default ProtectedRoute;