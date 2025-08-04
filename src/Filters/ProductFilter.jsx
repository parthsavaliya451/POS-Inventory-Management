import React, { useEffect, useState } from "react";
import { Grid, TextField, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const ProductFilter = ({ filters, setFilters, user }) => {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      if (!user?.uid) return;
      const storeId = user.uid;

      const getOptions = async (type) => {
        const snap = await getDocs(collection(db, `stores/${storeId}/${type}`));
        return snap.docs.map((doc) => {
          const data = doc.data();

          if (type === "deals") {
            return {
              id: doc.id,
              value: data.dealname || doc.id, // use name
              label: data.dealname || "Unnamed Deal",
            };
          }

          if (type === "categories") {
            return {
              id: doc.id,
              value: data.categoryname || data.name || doc.id,
              label: data.categoryname || data.name || doc.id,
            };
          }

          if (type === "subcategories") {
            return {
              id: doc.id,
              value: data.subcategoryname || data.name || doc.id,
              label: data.subcategoryname || data.name || doc.id,
            };
          }

          if (type === "sections") {
            return {
              id: doc.id,
              value: data.sectionname || data.name || doc.id,
              label: data.sectionname || data.name || doc.id,
            };
          }

          return { id: doc.id, value: doc.id, label: doc.id };
        });
      };

      setSections(await getOptions("sections"));
      setCategories(await getOptions("categories"));
      setSubcategories(await getOptions("subcategories"));
      setDeals(await getOptions("deals"));
    };

    fetchFilterData();
  }, [user]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filterFields = [
    { label: "Section", name: "section", options: sections },
    { label: "Category", name: "category", options: categories },
    { label: "Subcategory", name: "subcategory", options: subcategories },
    { label: "Deal", name: "deal", options: deals },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="search"
          value={filters.search || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Search by name or barcode"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {filterFields.map((field) => (
        <Grid item xs={12} sm={2} key={field.name}>
          <TextField
            select
            name={field.name}
            value={filters[field.name] || ""}
            onChange={handleChange}
            label={field.label}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={`__no_${field.name}__`}>No {field.label}</MenuItem>
            {field.options.map((opt) => (
              <MenuItem key={opt.id} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductFilter;
