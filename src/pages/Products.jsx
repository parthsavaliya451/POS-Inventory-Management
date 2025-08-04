// src/pages/Products.jsx
import React, { useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import ProductForm from "../Forms/ProductForm";
import ProductFilter from "../Filters/ProductFilter";
import ProductTable from "../Tables/ProductTable";

import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
  const [user] = useAuthState(auth);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    section: "",
    category: "",
    subcategory: "",
    deal: "",
  });
  const [openForm, setOpenForm] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const reload = () => {
    setEditing(null);
    setRefreshKey((prev) => prev + 1);
    setOpenForm(false);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setOpenForm(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setOpenForm(true);
  };

  return (
    <AdminLayout>
      <Box className="container py-3">
        <Grid container justifyContent="space-between" alignItems="center" spacing={2} className="mb-3">
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Manage Products
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto" textAlign={isMobile ? "left" : "right"}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              fullWidth={isMobile}
            >
              Add New Product
            </Button>
          </Grid>
        </Grid>

        <Box className="mb-4">
          <ProductFilter filters={filters} setFilters={setFilters} user={user} />
        </Box>

        <ProductTable
          filters={filters}
          onEdit={handleEdit}
          refreshKey={refreshKey}
          user={user}
        />

        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogContent>
            <ProductForm initialData={editing} onComplete={reload} user={user} />
          </DialogContent>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default Products;
