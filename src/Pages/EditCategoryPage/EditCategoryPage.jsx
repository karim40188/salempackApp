import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  TextField, 
  Button, 
  CircularProgress, 
  Box, 
  Typography, 
  Paper, 
  Container,
  Divider,
  Snackbar,
  Alert,
  Avatar
} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import useImageUploader from "../../hooks/useImageUploader";
import { Context } from "../../context/AuthContext";

const EditCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { baseUrl, token } = useContext(Context);
    const uploadImage = useImageUploader(baseUrl, token);

    const [name, setName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${baseUrl}/dashboard/categories/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const category = res.data;
                setName(category.categoriesName || "");
                setExistingPhoto(category.categoriesPhoto || "");
            } catch (err) {
                console.error("Error fetching category:", err);
                setAlert({
                    open: true,
                    message: "Failed to load category information",
                    severity: "error"
                });
                navigate("/categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [baseUrl, token, id, navigate]);

    // Create preview URL when a new photo is selected
    useEffect(() => {
        if (photo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(photo);
        } else {
            setPreviewUrl(null);
        }
    }, [photo]);

    const handleUpdate = async () => {
        if (!name.trim()) {
            setAlert({
                open: true,
                message: "Category name cannot be empty",
                severity: "error"
            });
            return;
        }

        setUpdating(true);

        let imageFilename = existingPhoto;
        if (photo) {
            try {
                const uploaded = await uploadImage(photo);
                if (uploaded) imageFilename = uploaded;
            } catch (err) {
                setAlert({
                    open: true,
                    message: "Failed to upload image",
                    severity: "error"
                });
                setUpdating(false);
                return;
            }
        }

        const updatedCategory = {
            categoriesName: name,
            categoriesPhoto: imageFilename,
        };

        try {
            await axios.patch(`${baseUrl}/dashboard/categories/${id}`, updatedCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAlert({
                open: true,
                message: "Category updated successfully!",
                severity: "success"
            });
            
            // Navigate after a brief delay so the user can see the success message
            setTimeout(() => navigate("/categories"), 1500);
        } catch (err) {
            console.error("Error updating category:", err);
            setAlert({
                open: true,
                message: "Failed to update category",
                severity: "error"
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                <CircularProgress size={60} thickness={4} />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ bgcolor: "primary.main", py: 2, px: 3 }}>
                    <Typography variant="h5" color="white" fontWeight="500">
                        Edit Category
                    </Typography>
                </Box>
                
                <Box sx={{ p: 3 }}>
                    <TextField
                        label="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                        InputProps={{
                            sx: { borderRadius: 1.5 }
                        }}
                    />

                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 500 }}>
                        Category Image
                    </Typography>
                    
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                        <Box 
                            sx={{ 
                                width: "100%", 
                                height: 200, 
                                borderRadius: 2,
                                border: "1px dashed",
                                borderColor: "grey.400",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                overflow: "hidden",
                                mb: 2
                            }}
                        >
                            {(previewUrl || existingPhoto) ? (
                                <img
                                    src={previewUrl || `${baseUrl}/public/uploads/${existingPhoto}`}
                                    alt="Category"
                                    style={{ 
                                        width: "100%", 
                                        height: "100%", 
                                        objectFit: "contain"
                                    }}
                                />
                            ) : (
                                <PhotoCameraIcon sx={{ fontSize: 60, color: "grey.500" }} />
                            )}
                        </Box>

                        <Button 
                            variant="outlined" 
                            component="label" 
                            startIcon={<PhotoCameraIcon />}
                            sx={{ borderRadius: 1.5 }}
                        >
                            {existingPhoto ? "Change Image" : "Upload Image"}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                            />
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate("/categories")}
                            sx={{ borderRadius: 1.5 }}
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleUpdate}
                            disabled={updating}
                            sx={{ borderRadius: 1.5 }}
                        >
                            {updating ? "Updating..." : "Save Changes"}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Snackbar 
                open={alert.open} 
                autoHideDuration={6000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseAlert} 
                    severity={alert.severity} 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>    
    );
};

export default EditCategoryPage;