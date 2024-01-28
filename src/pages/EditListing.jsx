import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
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

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState({
    name: "",
    address: "",
    category: "",
    description: "",
    gprice: "",
    uprice: "",
    nprice: "",
    capacity: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/activitylisting/${id}`).then((res) => {
      setListing(res.data);
      setLoading(false);
    });
  }, []);

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
      gprice: yup
        .number()
        .min(0, "Gprice must be at least 0")
        .max(500, "Gprice must be at most 500")
        .required("Gprice is required"),
      uprice: yup
        .number()
        .min(0, "Uprice must be at least 0")
        .max(500, "Uprice must be at most 500")
        .required("Uprice is required"),
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
      data.gprice = data.gprice;
      data.uprice = data.uprice;
      data.nprice = data.nprice;
      data.capacity = data.capacity;
      http.put(`/activitylisting/${id}`, data).then((res) => {
        console.log(res.data);
        navigate("/listings");
      });
    },
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteListing = () => {
    http.delete(`/activitylisting/${id}`).then((res) => {
      console.log(res.data);
      navigate("/listings");
    });
  };

  const viewActivities = () => {
    navigate(`/activities/${id}`);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Listing
      </Typography>
      {!loading && (
        <Box component="form" onSubmit={formik.handleSubmit}>
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
              margin="dense"
              autoComplete="off"
              label="Category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
              sx={{ width: "300px" }}
            />
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
                formik.touched.description && Boolean(formik.errors.description)
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
              label="Gprice"
              name="gprice"
              value={formik.values.gprice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.gprice && Boolean(formik.errors.gprice)}
              helperText={formik.touched.gprice && formik.errors.gprice}
              sx={{ width: "300px" }}
            />
          </div>
          <div>
            <TextField
              margin="dense"
              autoComplete="off"
              type="number"
              label="Uprice"
              name="uprice"
              value={formik.values.uprice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.uprice && Boolean(formik.errors.uprice)}
              helperText={formik.touched.uprice && formik.errors.uprice}
              sx={{ width: "300px" }}
            />
          </div>
          <div>
            <TextField
              margin="dense"
              autoComplete="off"
              type="number"
              label="Nprice"
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
              error={formik.touched.capacity && Boolean(formik.errors.capacity)}
              helperText={formik.touched.capacity && formik.errors.capacity}
            />
          </div>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              onClick={handleOpen}
            >
              Delete
            </Button>
            <Button variant="contained" sx={{ ml: 2 }} onClick={viewActivities}>
            Activities
          </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this listing?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteListing}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EditListing;
