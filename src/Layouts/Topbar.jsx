// src/Layout/Topbar.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [storeDetails, setStoreDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setStoreDetails(null);
          setLoading(false);
          return;
        }
        const docRef = doc(db, "stores", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStoreDetails(docSnap.data());
        } else {
          setStoreDetails(null);
        }
      } catch (err) {
        console.error("Failed to fetch store details:", err);
        setStoreDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreDetails();

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchStoreDetails();
    });

    return () => unsubscribe();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const userInitial =
    storeDetails && storeDetails.email
      ? storeDetails.email.charAt(0).toUpperCase()
      : "U";

  return (
    <AppBar
      position="fixed"
      elevation={1}
      color="primary"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#1976d2",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h6" noWrap>
            Store Admin Panel
          </Typography>
        </Box>

        {loading ? (
          <CircularProgress color="inherit" size={30} />
        ) : (
          <>
            <Tooltip title="Store Profile">
              <IconButton
                onClick={handleAvatarClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar>{userInitial}</Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: 280,
                  maxWidth: "90vw",
                  p: 2,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ mb: 1, textAlign: "center" }}>
                <Avatar
                  sx={{ width: 64, height: 64, margin: "0 auto", mb: 1 }}
                >
                  {userInitial}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {storeDetails?.storeName || "Store Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  Owner: {storeDetails?.ownerName || "-"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <MenuItem>
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                {storeDetails?.email || "-"}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <StoreIcon fontSize="small" />
                </ListItemIcon>
                {storeDetails?.storeName || "-"}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                {storeDetails?.address || "-"}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <LocationCityIcon fontSize="small" />
                </ListItemIcon>
                {storeDetails?.city || "-"}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <PublicIcon fontSize="small" />
                </ListItemIcon>
                {storeDetails?.country || "-"}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                {storeDetails?.ownerName || "-"}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Typography variant="caption" color="text.secondary">
                    State:
                  </Typography>
                </ListItemIcon>
                {storeDetails?.state || "-"}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Typography variant="caption" color="text.secondary">
                    Zipcode:
                  </Typography>
                </ListItemIcon>
                {storeDetails?.zipcode || "-"}
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
