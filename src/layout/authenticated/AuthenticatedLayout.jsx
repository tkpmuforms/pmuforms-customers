import React from "react";
import { Outlet } from "react-router-dom";
import AuthenticatedNavbar from "./AuthenticatedNavbar";

const AuthenticatedLayout = () => {
  return (
    <div>
      <AuthenticatedNavbar />
      <Outlet />
    </div>
  );
};

export default AuthenticatedLayout;
