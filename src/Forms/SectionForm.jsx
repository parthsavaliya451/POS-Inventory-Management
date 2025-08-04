import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

const SectionForm = ({ initialData, onComplete, user }) => {
  const [formData, setFormData] = useState({
    sectionid: "",
    sectionname: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        sectionid: initialData.sectionid || initialData.id || "",
        sectionname: initialData.sectionname || initialData.name || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid || !formData.sectionid || !formData.sectionname) return;

    const storeId = user.uid;
    const ref = doc(db, `stores/${storeId}/sections/${formData.sectionid}`);

    await setDoc(ref, {
      sectionid: formData.sectionid,
      sectionname: formData.sectionname,
    });

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <TextField
        fullWidth
        label="Section ID (slug)"
        name="sectionid"
        value={formData.sectionid}
        onChange={handleChange}
        margin="normal"
        required
        disabled={!!initialData} // disable editing ID during update
      />
      <TextField
        fullWidth
        label="Section Name"
        name="sectionname"
        value={formData.sectionname}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button type="submit" variant="contained" color="success">
          {initialData ? "Update Section" : "Add Section"}
        </Button>
      </Box>
    </form>
  );
};

export default SectionForm;
