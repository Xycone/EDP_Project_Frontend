import {
  Link,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import http from "../http";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartList, setCartList] = useState([]);
  const [activity, setActivity] = useState({
    date: "",
    availSpots: "",
  });
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    http
      .get(`/activity/${id}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setActivity(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
    http.get("/cartitem/getallcartitems").then((res) => {
      setCartList(res.data);
    });
  }, []);

  useEffect(() => {
    if (activity.activityListingId) {
      http.get(`/activitylisting/${activity.activityListingId}`)
        .then((res) => {
          setListing(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [activity.activityListingId]);

  const formik = useFormik({
    initialValues: activity,
    enableReinitialize: true,
    validationSchema: yup.object({
      date: yup.date().required("Date is required"),
      availSpots: yup
        .number()
        .min(0, "Slots must be at least 0")
        .max(500, "Slots must be at most 500")
        .test(
          "availSpots-check",
          "Available slots cannot exceed the capacity set for activities under this listing.",
          function (value) {
            const defaultValue = listing.capacity; // Get the default value
            return value <= defaultValue; // Check if the entered value is less than or equal to the default value
          }
        )
        .required("Slots is required"),
    }),
    onSubmit: (data) => {
      data.date = data.date;
      data.availSpots = data.availSpots;
      http
        .put(`/activity/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate(-1);
          toast.success("Activity updated successfully");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to update activity"); // Error notification
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

  const deleteActivity = () => {
    http
      .delete(`/activity/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate(-1);
        toast.success("Activity deleted successfully"); // Success notification
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete activity"); // Error notification
      });

    for (let i = 0; i < cartList.length; i++) {
      var item = cartList[i];
      if (item.activityId === id) {
        http.delete(`/cartitem/${item.Id}`);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Activity
      </Typography>
      {!loading && (
        <Box component="form" onSubmit={formik.handleSubmit}>
          <div>
            <TextField
              fullWidth
              margin="dense"
              label="Date"
              type="datetime-local" // Use "datetime-local" for date and time input
              name="date"
              value={formik.values.date} // Format the value for "datetime-local"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
            />
          </div>
          <div>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Available Slots"
              type="number"
              name= "availSpots"
              value={formik.values.availSpots}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.availSpots && Boolean(formik.errors.availSpots)
              }
              helperText={formik.touched.availSpots && formik.errors.availSpots}
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
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Activity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this activity?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteActivity}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default EditActivity;
