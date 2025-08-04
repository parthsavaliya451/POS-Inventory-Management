import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const CategoryForm = ({ initialData, onComplete, user }) => {
  const [formData, setFormData] = useState({
    categoryid: "",
    categoryname: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        categoryid: initialData.categoryid || initialData.id || "",
        categoryname: initialData.categoryname || initialData.name || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid || !formData.categoryid || !formData.categoryname) return;

    const storeId = user.uid;
    const ref = doc(db, `stores/${storeId}/categories/${formData.categoryid}`);

    await setDoc(ref, {
      categoryid: formData.categoryid,
      categoryname: formData.categoryname,
    });

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <TextField
        fullWidth
        label="Category ID (slug)"
        name="categoryid"
        value={formData.categoryid}
        onChange={handleChange}
        margin="normal"
        required
        disabled={!!initialData}
      />
      <TextField
        fullWidth
        label="Category Name"
        name="categoryname"
        value={formData.categoryname}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button type="submit" variant="contained" color="success">
          {initialData ? "Update Category" : "Add Category"}
        </Button>
      </Box>
    </form>
  );
};

export default CategoryForm;
