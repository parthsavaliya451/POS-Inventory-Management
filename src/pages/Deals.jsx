import React, { useEffect, useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import DealForm from "../Forms/DealForm";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
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

const Deals = () => {
  const [user] = useAuthState(auth);
  const [deals, setDeals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const storeId = user?.uid;

  const fetchDeals = async () => {
    if (!storeId) return;
    const snap = await getDocs(collection(db, `stores/${storeId}/deals`));
    setDeals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchDeals();
  }, [storeId, refreshKey]);

  const reload = () => {
    setEditing(null);
    setRefreshKey((prev) => prev + 1);
    setOpenForm(false);
  };

  const handleEdit = (deal) => {
    setEditing(deal);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteDoc(doc(db, `stores/${storeId}/deals/${deleteId}`));
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
              Manage Deals
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto" textAlign={isMobile ? "left" : "right"}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              fullWidth={isMobile}
            >
              Add New Deal
            </Button>
          </Grid>
        </Grid>

        <List>
          {deals.map((deal) => (
            <React.Fragment key={deal.id}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleEdit(deal)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      setDeleteId(deal.id);
                      setConfirmOpen(true);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={deal.dealname || deal.name}
                  secondary={`ID: ${deal.dealid} | Off: $${deal.priceoff} on every ${deal.oneveryhowmanyscan} | Valid: ${deal.validuntil || 'N/A'}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? "Edit Deal" : "Add New Deal"}</DialogTitle>
          <DialogContent>
            <DealForm user={user} onComplete={reload} initialData={editing} />
          </DialogContent>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this deal?
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

export default Deals;
