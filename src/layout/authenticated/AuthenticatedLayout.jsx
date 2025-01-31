import React from "react";
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
