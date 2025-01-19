import React from "react";
import { Outlet } from "react-router-dom";
import AuthenticatedNavbar from "./AuthenticatedNavbar";

const AuthenticatedLayout = ({ children, breadcrumb }) => {
  return (
    <div>
      <AuthenticatedNavbar />
      {children}
    </div>
  );
};

export default AuthenticatedLayout;
