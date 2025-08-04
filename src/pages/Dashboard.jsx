// src/pages/Dashboard.jsx
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../Layouts/Sidebar";
import Topbar from "../Layouts/Topbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Topbar />
        <Box sx={{ mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
