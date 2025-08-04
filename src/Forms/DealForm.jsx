import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../services/firebase";

const DealForm = ({ initialData, onComplete, user }) => {
  const [formData, setFormData] = useState({
    dealname: "",
    dealid: "",
    oneveryhowmanyscan: "",
    priceoff: "",
    validuntil: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        dealname: initialData.dealname || "",
        dealid: initialData.dealid || "",
        oneveryhowmanyscan: initialData.oneveryhowmanyscan || "",
        priceoff: initialData.priceoff || "",
        validuntil: initialData.validuntil || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    const storeId = user.uid;
    const docId = initialData?.dealid || formData.dealid.toLowerCase().replace(/\s+/g, "_");
    const ref = doc(db, `stores/${storeId}/deals/${docId}`);

    try {
      await updateDoc(ref, { ...formData });
    } catch {
      await addDoc(collection(db, `stores/${storeId}/deals`), { ...formData });
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Deal ID"
            name="dealid"
            value={formData.dealid}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Deal Name"
            name="dealname"
            value={formData.dealname}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="How Many Scans"
            name="oneveryhowmanyscan"
            type="number"
            value={formData.oneveryhowmanyscan}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Price Off"
            name="priceoff"
            type="number"
            value={formData.priceoff}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Valid Until"
            name="validuntil"
            type="date"
            value={formData.validuntil}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button type="submit" variant="contained" color="success">
          {initialData ? "Update" : "Add"} Deal
        </Button>
      </Box>
    </form>
  );
};

export default DealForm;
