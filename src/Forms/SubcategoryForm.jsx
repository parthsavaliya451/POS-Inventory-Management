import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const SubcategoryForm = ({ initialData, onComplete, user }) => {
  const [formData, setFormData] = useState({
    subcategoryid: "",
    subcategoryname: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        subcategoryid: initialData.subcategoryid || initialData.id || "",
        subcategoryname: initialData.subcategoryname || initialData.name || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid || !formData.subcategoryid || !formData.subcategoryname) return;

    const storeId = user.uid;
    const ref = doc(db, `stores/${storeId}/subcategories/${formData.subcategoryid}`);

    await setDoc(ref, {
      subcategoryid: formData.subcategoryid,
      subcategoryname: formData.subcategoryname,
    });

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <TextField
        fullWidth
        label="Subcategory ID (slug)"
        name="subcategoryid"
        value={formData.subcategoryid}
        onChange={handleChange}
        margin="normal"
        required
        disabled={!!initialData}
      />
      <TextField
        fullWidth
        label="Subcategory Name"
        name="subcategoryname"
        value={formData.subcategoryname}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button type="submit" variant="contained" color="success">
          {initialData ? "Update Subcategory" : "Add Subcategory"}
        </Button>
      </Box>
    </form>
  );
};

export default SubcategoryForm;
