import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Skeleton,
  Input,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import http from "../http";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import placeholder from "../images/image_placeholder.jpg";

function AddListing() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null); // State to store the URL of the uploaded image
  const [isLoading, setIsLoading] = useState(true);

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  const [listing, setListing] = useState({
    name: "",
    address: "",
    category: "",
    description: "",
    nprice: "",
    capacity: "",
  });

  const categories = [
    { value: "Wine & Dine", label: "Wine & Dine" },
    { value: "Family Bonding", label: "Family Bonding" },
    { value: "Hobbies & Wellness", label: "Hobbies & Wellness" },
    { value: "Sports & Adventure", label: "Sports & Adventure" },
    { value: "Travel", label: "Travel" },
  ];

  const formik = useFormik({
    initialValues: listing,
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must be at most 100 characters")
        .required("Name is required"),
      address: yup
        .string()
        .trim()
        .min(3, "Address must be at least 3 characters")
        .max(100, "Address must be at most 100 characters")
        .required("Address is required"),
      category: yup
        .string()
        .trim()
        .min(3, "Category must be at least 3 characters")
        .max(20, "Category must be at most 20 characters")
        .required("Category is required"),
      description: yup
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters")
        .max(500, "Description must be at most 500 characters")
        .required("Description is required"),
      nprice: yup
        .number()
        .min(0, "Nprice must be at least 0")
        .max(500, "Nprice must be at most 500")
        .required("Nprice is required"),
      capacity: yup
        .number()
        .min(0, "Capacity must be at least 0")
        .max(500, "Capacity must be at most 500")
        .required("Capacity is required"),
    }),
    onSubmit: (data) => {
      data.name = data.name.trim();
      data.address = data.address.trim();
      data.category = data.category.trim();
      data.description = data.description.trim();
      data.nprice = data.nprice;
      data.capacity = data.capacity;
      data.imageFile = imageFile;
      if (imageFile == null){
        toast.error("Please upload an image")
      }
      else{
        http
        .post(`/activitylisting`, data)
        .then((res) => {
          console.log("Listing added:", res.data);
          toast.success("Listing added successfully.")
          navigate("/listingtable");
        })
        .catch((error) => {
          console.error("Error adding listing:", error);
          toast.error("Failed to add listing.")
        });
      }
    },
  });

  return (
    <Box sx={{ boxShadow: 4, mt: 2 }}>
      <Typography
        variant="h5"
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: 2,
        }}
      >
        Add Listing
      </Typography>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 3,
          }}
        >
          <Box>
            <div>
              <TextField
                margin="dense"
                autoComplete="off"
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ width: "300px" }}
              />
            </div>
            <div>
              <TextField
                margin="dense"
                autoComplete="off"
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                sx={{ width: "600px" }}
              />
            </div>
            <div>
              <TextField
                select
                margin="dense"
                autoComplete="off"
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
                sx={{ width: "300px" }}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div>
              <TextField
                margin="dense"
                autoComplete="off"
                multiline
                minRows={2}
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                sx={{ width: "600px" }}
              />
            </div>
            <div>
              <TextField
                margin="dense"
                autoComplete="off"
                type="number"
                label="Price"
                name="nprice"
                value={formik.values.nprice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nprice && Boolean(formik.errors.nprice)}
                helperText={formik.touched.nprice && formik.errors.nprice}
                sx={{ width: "300px" }}
              />
            </div>
            <div>
              <TextField
                margin="dense"
                autoComplete="off"
                type="number"
                label="Capacity"
                name="capacity"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.capacity && Boolean(formik.errors.capacity)
                }
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </div>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Add
              </Button>
            </Box>
          </Box>
          <Box sx={{ ml: 12, textAlign: "center" }}>
            {
              // User set profile picture
              imageFile && (
                <img
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                  alt="Your Image"
                  style={{ width: "360px", height: "200px", marginBottom: 2 }}
                />
              )
            }
            {
              // Default profile picture if user did not set anything
              !imageFile && (
                <img
                  alt="Placeholder"
                  src={placeholder}
                  style={{ width: "360px", height: "200px", marginBottom: 2 }}
                />
              )
            }
            <Button variant="contained" component="label">
              Upload Image
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={onFileChange}
              />
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default AddListing;
