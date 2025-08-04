// src/pages/Signup.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
} from '@mui/material';
import { Store, Email, Lock, LocationCity, Public, Person, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, writeBatch, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const countries = ['Canada', 'United States', 'India', 'Australia'];
const steps = ['Store Info', 'Account Setup'];

const demoSections = [
  { sectionid: 'none', sectionname: 'No Section' },
  { sectionid: 'beer', sectionname: 'Beer' },
  { sectionid: 'noodles', sectionname: 'Noodles' },
  { sectionid: 'rtd', sectionname: 'RTD' },
  { sectionid: 'smoke', sectionname: 'Smoke' },
  { sectionid: 'snacks', sectionname: 'Snacks' },
];

const demoCategories = [
  { categoryid: 'none', categoryname: 'No Category' },
  { categoryid: 'busch', categoryname: 'Busch' },
  { categoryid: 'meggie', categoryname: 'Meggie' },
  { categoryid: 'twistedtea', categoryname: 'TwistedTea' },
  { categoryid: 'pallmallsmooth', categoryname: 'PallMallSmooth' },
  { categoryid: 'snacks_cat', categoryname: 'Snacks' },
];

const demoSubcategories = [
  { subcategoryid: 'none', subcategoryname: 'No Subcategory' },
  { subcategoryid: 'light', subcategoryname: 'Light' },
  { subcategoryid: 'smallpack', subcategoryname: 'Small Pack' },
  { subcategoryid: 'original', subcategoryname: 'Original' },
  { subcategoryid: 'ks25', subcategoryname: 'KS25' },
  { subcategoryid: 'regular', subcategoryname: 'Regular' },
];

const demoDeals = [
  {
    dealid: 'deal1',
    dealname: '2 for $4 710ml',
    priceoff: 1.98,
    oneveryhowmanyscan: 2,
    validuntil: null,
  },
  {
    dealid: 'deal2',
    dealname: 'Buy 3 Get 1 Free',
    priceoff: 2.99,
    oneveryhowmanyscan: 4,
    validuntil: null,
  },
  {
    dealid: 'deal3',
    dealname: '10% Off Bulk Buy',
    priceoff: 0.3,
    oneveryhowmanyscan: 5,
    validuntil: null,
  },
  {
    dealid: 'deal4',
    dealname: 'Buy 2 Save $1',
    priceoff: 1.0,
    oneveryhowmanyscan: 2,
    validuntil: null,
  },
  {
    dealid: 'deal5',
    dealname: 'No Deal',
    priceoff: 0,
    oneveryhowmanyscan: 1,
    validuntil: null,
  },
];

const demoProducts = [
  {
    id: 'none_none_none',
    name: 'Miscellaneous Product',
    price: 1.99,
    baseamount: 1.0,
    section: 'No Section',
    category: 'No Category',
    subcategory: 'No Subcategory',
    deal: 'No Deal',
    expiry: null,
    barcode: '000000000001',
    qty: 100,
    imgurl: null,
    taxable:"yes",
  },
  {
    id: 'beer_busch_light',
    name: 'Beer Busch Light',
    price: 3.99,
    baseamount: 2.5,
    section: 'Beer',
    category: 'Busch',
    subcategory: 'Light',
    deal: '2 for $4 710ml',
    expiry: null,
    barcode: '100000000001',
    qty: 200,
    imgurl: null,
    taxable:"yes",
  
  },
  {
    id: 'snacks_snacks_cat_regular',
    name: 'Snacks Snacks Regular',
    price: 2.5,
    baseamount: 1.5,
    section: 'Snacks',
    category: 'Snacks',
    subcategory: 'Regular',
    deal: 'Buy 2 Save $1',
    expiry: null,
    barcode: '200000000002',
    qty: 150,
    imgurl: null,
    taxable:"yes",

  },
  {
    id: 'noodles_meggie_smallpack',
    name: 'Noodles Meggie Small Pack',
    price: 1.25,
    baseamount: 1.0,
    section: 'Noodles',
    category: 'Meggie',
    subcategory: 'Small Pack',
    deal: 'Buy 3 Get 1 Free',
    expiry: null,
    barcode: '300000000003',
    qty: 300,
    imgurl: null,
    taxable:"no",

  },
  {
    id: 'rtd_twistedtea_original',
    name: 'RTD TwistedTea Original',
    price: 2.75,
    baseamount: 1.25,
    section: 'RTD',
    category: 'TwistedTea',
    subcategory: 'Original',
    deal: '10% Off Bulk Buy',
    expiry: null,
    barcode: '400000000004',
    qty: 250,
    imgurl: null,
    taxable:"yes",

  },
  {
    id: 'smoke_pallmallsmooth_ks25',
    name: 'Smoke PallMallSmooth KS25',
    price: 5.99,
    baseamount: 4.5,
    section: 'Smoke',
    category: 'PallMallSmooth',
    subcategory: 'KS25',
    deal: 'No Deal',
    expiry: null,
    barcode: '500000000005',
    qty: 120,
    imgurl: null,
    taxable:"yes",

  },
];

export default function Signup() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipcode: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setFirebaseError('');
  };

  const validateStep = () => {
    let tempErrors = {};
    if (activeStep === 0) {
      if (!formData.storeName.trim()) tempErrors.storeName = 'Store Name is required';
      if (!formData.ownerName.trim()) tempErrors.ownerName = 'Owner Name is required';
      if (!formData.country.trim()) tempErrors.country = 'Country is required';
      if (!formData.state.trim()) tempErrors.state = 'State is required';
      if (!formData.city.trim()) tempErrors.city = 'City is required';
      if (!formData.address.trim()) tempErrors.address = 'Address is required';
      if (!formData.zipcode.trim()) tempErrors.zipcode = 'Zipcode is required';
    } else {
      if (!formData.email.trim()) tempErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Email is invalid';
      if (!formData.password) tempErrors.password = 'Password is required';
      else if (formData.password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
      if (!formData.confirmPassword) tempErrors.confirmPassword = 'Confirm your password';
      else if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFirebaseError('');
    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Prepare batch write to Firestore for main store data and demo data
      const batch = writeBatch(db);

      // 3. Store main store data in `stores` collection (basic profile)
      const storeDocRef = doc(db, 'stores', user.uid);
      batch.set(storeDocRef, {
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        zipcode: formData.zipcode,
        email: formData.email,
        createdAt: serverTimestamp(),
      });

      // 4. Create subcollections for sections, categories, subcategories, deals, products
      demoSections.forEach((section) => {
        const docRef = doc(db, 'stores', user.uid, 'sections', section.sectionid);
        batch.set(docRef, section);
      });
      demoCategories.forEach((category) => {
        const docRef = doc(db, 'stores', user.uid, 'categories', category.categoryid);
        batch.set(docRef, category);
      });
      demoSubcategories.forEach((subcat) => {
        const docRef = doc(db, 'stores', user.uid, 'subcategories', subcat.subcategoryid);
        batch.set(docRef, subcat);
      });
      demoDeals.forEach((deal) => {
        const docRef = doc(db, 'stores', user.uid, 'deals', deal.dealid);
        batch.set(docRef, deal);
      });
      demoProducts.forEach((product) => {
        const docRef = doc(db, 'stores', user.uid, 'products', product.id);
        batch.set(docRef, product);
      });

      // 5. Commit batch writes
      await batch.commit();

      // 6. Now create separate storedetails document
      const storeDetailsDocRef = doc(db, 'storedetails', `${user.uid}-store`);
      await setDoc(storeDetailsDocRef, {
        storeName: formData.storeName,
        ownerName: formData.ownerName,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        zipcode: formData.zipcode,
        email: formData.email,
        createdAt: serverTimestamp(),
      });

      // 7. Show success and redirect
      setSuccessAlert(true);
      setTimeout(() => navigate('/login'), 3000);

    } catch (error) {
      setFirebaseError(error.code === 'auth/email-already-in-use' ? 'Email already in use.' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          🏪 Register Your Store
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {firebaseError && <Alert severity="error" sx={{ mb: 2 }}>{firebaseError}</Alert>}

        <Grid container spacing={2}>
          {activeStep === 0 && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Store Name"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  error={!!errors.storeName}
                  helperText={errors.storeName}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Store sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  error={!!errors.ownerName}
                  helperText={errors.ownerName}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Person sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  error={!!errors.country}
                  helperText={errors.country}
                  fullWidth
                  required
                >
                  <MenuItem value=""><em>Select Country</em></MenuItem>
                  {countries.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Public sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <LocationCity sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  error={!!errors.zipcode}
                  helperText={errors.zipcode}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                  multiline
                  rows={2}
                  required
                  InputProps={{ startAdornment: <Home sx={{ mr: 1 }} /> }}
                />
              </Grid>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Lock sx={{ mr: 1 }} /> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  fullWidth
                  required
                  InputProps={{ startAdornment: <Lock sx={{ mr: 1 }} /> }}
                />
              </Grid>
            </>
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {activeStep > 0 && <Button onClick={handleBack} disabled={isSubmitting}>Back</Button>}
          <Button variant="contained" onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Saving...
              </>
            ) : activeStep === steps.length - 1 ? 'Register' : 'Next'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={successAlert}
        autoHideDuration={3000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessAlert(false)} severity="success" sx={{ width: '100%' }}>
          🎉 Store registered successfully! Redirecting to login...
        </Alert>
      </Snackbar>
    </Container>
  );
}
