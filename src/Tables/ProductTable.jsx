import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../services/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const ProductTable = ({ filters, onEdit, refreshKey, user }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.uid) return;
      const snap = await getDocs(collection(db, `stores/${user.uid}/products`));
      const all = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(all);
    };

    fetchProducts();
  }, [refreshKey, user]);

  const handleDelete = async (id) => {
    if (!user?.uid) return;
    await deleteDoc(doc(db, `stores/${user.uid}/products/${id}`));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProducts = products.filter((product) => {
    const search = filters.search?.toLowerCase();

    const matchesSearch =
      !search ||
      product.name?.toLowerCase().includes(search) ||
      product.barcode?.toLowerCase().includes(search);

    const matchesSection =
      !filters.section ||
      (filters.section === "__no_section__" &&
        (!product.section || product.section === "")) ||
      product.section === filters.section;

    const matchesCategory =
      !filters.category ||
      (filters.category === "__no_category__" &&
        (!product.category || product.category === "")) ||
      product.category === filters.category;

    const matchesSubcategory =
      !filters.subcategory ||
      (filters.subcategory === "__no_subcategory__" &&
        (!product.subcategory || product.subcategory === "")) ||
      product.subcategory === filters.subcategory;

    const matchesDeal =
      !filters.deal ||
      (filters.deal === "__no_deal__" &&
        (!product.deal || product.deal === "")) ||
      product.deal === filters.deal;

    return (
      matchesSearch &&
      matchesSection &&
      matchesCategory &&
      matchesSubcategory &&
      matchesDeal
    );
  });

  if (!filteredProducts.length) {
    return (
      <Typography textAlign="center" mt={4} color="text.secondary">
        No products found.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
       <TableHead>
  <TableRow>
    <TableCell>Name</TableCell>
    <TableCell>Barcode</TableCell>
    <TableCell>Price</TableCell>
    <TableCell>Base Amount</TableCell>
    <TableCell>Quantity</TableCell>
    <TableCell>Section</TableCell>
    <TableCell>Category</TableCell>
    <TableCell>Subcategory</TableCell>
    <TableCell>Deal</TableCell>
    <TableCell>Taxable</TableCell> {/* ← Add this line */}
    <TableCell align="center">Actions</TableCell>
  </TableRow>
</TableHead>

       <TableBody>
  {filteredProducts.map((product) => (
    <TableRow key={product.id}>
      <TableCell>{product.name || "-"}</TableCell>
      <TableCell>{product.barcode || "-"}</TableCell>
      <TableCell>${Number(product.price || 0).toFixed(2)}</TableCell>
      <TableCell>{product.baseamount || "-"}</TableCell>
      <TableCell>{product.qty || 0}</TableCell>
      <TableCell>{product.section || "-"}</TableCell>
      <TableCell>{product.category || "-"}</TableCell>
      <TableCell>{product.subcategory || "-"}</TableCell>
      <TableCell>{product.deal || "-"}</TableCell>
      <TableCell>{product.taxable || "-"}</TableCell> {/* ← Add this line */}
      <TableCell align="center">
        <IconButton color="primary" onClick={() => onEdit(product)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => handleDelete(product.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </TableContainer>
  );
};

export default ProductTable;
