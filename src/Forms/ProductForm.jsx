// src/Forms/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, MenuItem, Box } from "@mui/material";
import { addDoc, updateDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const ProductForm = ({ initialData, onComplete, user }) => {
 const [formData, setFormData] = useState({
  name: "",
  barcode: "",
  price: "",
  baseamount: "",
  qty: "",
  section: "",
  category: "",
  subcategory: "",
  deal: "",
  taxable: "yes", // default value
});

  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [deals, setDeals] = useState([]);

useEffect(() => {
  if (initialData) {
    setFormData({
      ...initialData,
      section: initialData.section || "",
      category: initialData.category || "",
      subcategory: initialData.subcategory || "",
      deal: initialData.deal || "",
      taxable: initialData.taxable || "yes", // fallback to yes
    });
  }
}, [initialData]);


  useEffect(() => {
    const fetchOptions = async () => {
      if (!user?.uid) return;
      const storeId = user.uid;

      const getOptions = async (type) => {
        const snap = await getDocs(collection(db, `stores/${storeId}/${type}`));
        return snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || data.categoryname || data.sectionname || data.subcategoryname || data.dealname || doc.id,
          };
        });
      };

      setSections(await getOptions("sections"));
      setCategories(await getOptions("categories"));
      setSubcategories(await getOptions("subcategories"));
      setDeals(await getOptions("deals"));
    };

    fetchOptions();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

    const storeId = user.uid;
    const docId = formData.id || formData.name.toLowerCase().replace(/\s+/g, "_");
    const ref = doc(db, `stores/${storeId}/products/${docId}`);

    try {
      await updateDoc(ref, { ...formData });
    } catch {
      await addDoc(collection(db, `stores/${storeId}/products`), { ...formData });
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <Grid container spacing={2}>
        {[
          { label: "Name", name: "name" },
          { label: "Barcode", name: "barcode" },
          { label: "Price", name: "price" },
          { label: "Base Amount", name: "baseamount" },
          { label: "Quantity", name: "qty" },
        ].map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            <TextField
              fullWidth
              label={field.label}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required
            />
          </Grid>
        ))}

        {[
          { name: "section", options: sections },
          { name: "category", options: categories },
          { name: "subcategory", options: subcategories },
          { name: "deal", options: deals },
        ].map(({ name, options }) => (
          <Grid item xs={12} sm={6} key={name}>
            <TextField
              select
              fullWidth
              label={name.charAt(0).toUpperCase() + name.slice(1)}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              required
            >
              {options.map((opt) => (
                <MenuItem key={opt.id} value={opt.name}>
                  {opt.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}
      </Grid>

      <Grid item xs={12} sm={6}>
  <TextField
    select
    fullWidth
    label="Taxable"
    name="taxable"
    value={formData.taxable || "yes"}
    onChange={handleChange}
    required
  >
    <MenuItem value="yes">Yes</MenuItem>
    <MenuItem value="no">No</MenuItem>
  </TextField>
</Grid>


      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button type="submit" variant="contained" color="success">
          {initialData ? "Update" : "Add"} Product
        </Button>
      </Box>
    </form>
  );
};

export default ProductForm;
