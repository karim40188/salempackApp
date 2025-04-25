import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, CircularProgress, Box, Typography } from "@mui/material";
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

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${baseUrl}/dashboard/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { id },
                });

                const category = res.data;
                setName(category.categoriesName || "");
                setExistingPhoto(category.categoriesPhoto || "");
            } catch (err) {
                console.error("Error fetching category:", err);
                alert("Failed to load category");
                navigate("/categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [baseUrl, token, id, navigate]);

    const handleUpdate = async () => {
        setUpdating(true);

        let imageFilename = existingPhoto;
        if (photo) {
            const uploaded = await uploadImage(photo);
            if (uploaded) imageFilename = uploaded;
        }

        const updatedCategory = {
            categoriesName: name,
            categoriesPhoto: imageFilename,
        };

        try {
            await axios.patch(`${baseUrl}/dashboard/categories/${id}`, updatedCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Category updated successfully!");
            navigate("/categories");
        } catch (err) {
            console.error("Error updating category:", err);
            alert("Failed to update category.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 500, margin: "0 auto", padding: 4 }}>
            <Typography variant="h4" gutterBottom>Edit Category</Typography>

            <TextField
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />

            <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                Upload New Photo
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                />
            </Button>

            {existingPhoto && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Current Photo:</Typography>
                    <img
                        src={`${baseUrl}/images/${existingPhoto}`}
                        alt="Current"
                        style={{ width: "100%", borderRadius: "8px" }}
                    />
                </Box>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                fullWidth
                disabled={updating}
            >
                {updating ? "Updating..." : "Update Category"}
            </Button>
        </Box>
    );
};

export default EditCategoryPage;
