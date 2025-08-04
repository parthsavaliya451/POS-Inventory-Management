import React, { useEffect, useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import CashierForm from "../Forms/CashierForm";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebase";

const Cashiers = () => {
  const [user] = useAuthState(auth);
  const [cashiers, setCashiers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const storeId = user?.uid;

  const fetchCashiers = async () => {
    if (!storeId) return;
    const snap = await getDocs(collection(db, `stores/${storeId}/cashiers`));
    setCashiers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCashiers();
  }, [storeId, refreshKey]);

  const reload = () => {
    setEditing(null);
    setRefreshKey((prev) => prev + 1);
    setOpenForm(false);
  };

  const handleEdit = (cashier) => {
    setEditing(cashier);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteDoc(doc(db, `stores/${storeId}/cashiers/${deleteId}`));
      setDeleteId(null);
      setConfirmOpen(false);
      reload();
    }
  };

  return (
    <AdminLayout>
      <Box className="container py-3">
        <Grid container justifyContent="space-between" alignItems="center" spacing={2} className="mb-3">
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Manage Cashiers
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto" textAlign={{ xs: "left", sm: "right" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              fullWidth={false}
            >
              Add New Cashier
            </Button>
          </Grid>
        </Grid>

        <List>
          {cashiers.map((cashier) => (
            <React.Fragment key={cashier.id}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleEdit(cashier)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      setDeleteId(cashier.id);
                      setConfirmOpen(true);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={`${cashier.employeeId || cashier.id} - ${cashier.name}`}
                  secondary={`Email: ${cashier.email} | Phone: ${cashier.phone} | PIN: ${cashier.pin || "N/A"}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? "Edit Cashier" : "Add New Cashier"}</DialogTitle>
          <DialogContent>
            <CashierForm user={user} onComplete={reload} initialData={editing} />
          </DialogContent>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this cashier?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default Cashiers;
