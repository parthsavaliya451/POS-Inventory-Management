import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../services/firebase";

const CashierForm = ({ user, onComplete, initialData }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    pin: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        employeeId: initialData.employeeId || "",
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        pin: initialData.pin || "",
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
    const docId = initialData?.id || formData.employeeId.toLowerCase().replace(/\s+/g, "_");
    const ref = doc(db, `stores/${storeId}/cashiers/${docId}`);

    try {
      await updateDoc(ref, formData);
    } catch {
      await addDoc(collection(db, `stores/${storeId}/cashiers`), formData);
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            disabled={!!initialData}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="PIN"
            name="pin"
            type="password"
            value={formData.pin}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button type="submit" variant="contained" color="success">
          {initialData ? "Update" : "Add"} Cashier
        </Button>
      </Box>
    </form>
  );
};

export default CashierForm;
