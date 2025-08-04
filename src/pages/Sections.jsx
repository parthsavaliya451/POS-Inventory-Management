import React, { useEffect, useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import SectionForm from "../Forms/SectionForm";
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

const Sections = () => {
  const [user] = useAuthState(auth);
  const [sections, setSections] = useState([]);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const storeId = user?.uid;

  const fetchSections = async () => {
    if (!storeId) return;
    const snap = await getDocs(collection(db, `stores/${storeId}/sections`));
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSections(data);
  };

  useEffect(() => {
    fetchSections();
  }, [storeId, refreshKey]);

  const reload = () => {
    setEditing(null);
    setRefreshKey((prev) => prev + 1);
    setOpenForm(false);
  };

  const handleEdit = (section) => {
    setEditing(section);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (deleteId && storeId) {
      await deleteDoc(doc(db, `stores/${storeId}/sections/${deleteId}`));
      setDeleteId(null);
      setConfirmOpen(false);
      reload();
    }
  };

  return (
    <AdminLayout>
      <Box className="container py-3">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          className="mb-3"
        >
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Manage Sections
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
              Add New Section
            </Button>
          </Grid>
        </Grid>

        <List>
          {sections.map((section) => (
            <React.Fragment key={section.id}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleEdit(section)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setDeleteId(section.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={section.sectionname || section.name} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        {/* Form Dialog */}
        <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? "Edit Section" : "Add New Section"}</DialogTitle>
          <DialogContent>
            <SectionForm
              user={user}
              onComplete={reload}
              initialData={editing}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this section?
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

export default Sections;
