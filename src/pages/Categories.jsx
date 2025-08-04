import React, { useEffect, useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import CategoryForm from "../Forms/CategoryForm";
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  DialogActions
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebase";

const Categories = () => {
  const [user] = useAuthState(auth);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const storeId = user?.uid;

  const fetchCategories = async () => {
    if (!storeId) return;
    const snap = await getDocs(collection(db, `stores/${storeId}/categories`));
    setCategories(
      snap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || doc.data().categoryname || doc.id,
        ...doc.data()
      }))
    );
  };

  useEffect(() => {
    fetchCategories();
  }, [storeId, refreshKey]);

  const reload = () => {
    setEditing(null);
    setRefreshKey(prev => prev + 1);
    setOpenForm(false);
  };

  const handleEdit = (category) => {
    setEditing(category);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteDoc(doc(db, `stores/${storeId}/categories/${deleteId}`));
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
              Manage Categories
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto" textAlign={isMobile ? "left" : "right"}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
              fullWidth={isMobile}
            >
              Add New Category
            </Button>
          </Grid>
        </Grid>

        <List>
          {categories.map((cat) => (
            <React.Fragment key={cat.id}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleEdit(cat)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setDeleteId(cat.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={cat.name} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogContent>
            <CategoryForm user={user} onComplete={reload} initialData={editing} />
          </DialogContent>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this category?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default Categories;
