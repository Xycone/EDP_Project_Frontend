import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import http from "../http";
import { useFormik } from "formik";
import * as yup from "yup";

function AddActivity() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    http.get(`/activitylisting/${id}`).then((res) => {
      setListing(res.data);
    });
  }, [id]);

  const formik = useFormik({
    initialValues: {
      date: "",
      availSpots: listing ? listing.capacity : "",
    },
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
      data.availSpots = data.availSpots || (listing ? listing.capacity : "");
      http.post(`/activity/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate(-1);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Activity
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <div>
          <TextField
            fullWidth
            margin="dense"
            label="Date"
            type="datetime-local"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div>
          <TextField
            fullWidth
            margin="dense"
            label="Available spots"
            type="number"
            name="availSpots"
            value={formik.values.availSpots}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.availSpots && Boolean(formik.errors.availSpots)}
            helperText={formik.touched.availSpots && formik.errors.availSpots}
          />
        </div>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddActivity;
