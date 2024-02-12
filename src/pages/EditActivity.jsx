import {
  Link,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField
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


function EditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartList, setCartList] = useState([]);
  const [activity, setActivity] = useState({
    date: "",
     availSpots: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/activity/${id}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setActivity(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
      http.get('/cartitem/getallcartitems').then((res) => {
        setCartList(res.data);
      });
  }, []);

  const formik = useFormik({
    initialValues: activity,
    enableReinitialize: true,
    validationSchema: yup.object({
      date: yup.date().required("Date is required"),
       availSpots: yup
        .number()
        .min(0, "Capacity must be at least 0")
        .max(500, "Capacity must be at most 500")
        .required("Capacity is required"),
    }),
    onSubmit: (data) => {
      data.date = data.date;
      data. availSpots = data. availSpots;
      http.put(`/activity/${id}`, data).then((res) => {
        console.log(res.data);
        navigate(-1);
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
    http.delete(`/activity/${id}`).then((res) => {
      console.log(res.data);
      navigate(-1);
    });
    for (let i = 0; i < cartList.length; i++) {
      var item = cartList[i]
      if(item.activityId === id){
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
              value={formik.values.date } // Format the value for "datetime-local"
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
              label="Available Spots"
              type="number"
              name=" availSpots"
              value={formik.values. availSpots}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched. availSpots && Boolean(formik.errors. availSpots)}
              helperText={formik.touched. availSpots && formik.errors. availSpots}
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
    </Box>
  );
}

export default EditActivity;
