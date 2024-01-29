import React from 'react'
import { Box, Typography, TextField, Button, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { format } from 'date-fns';
import global from "C:/Users/wwwwa/Desktop/Edp/src/global.js"

function AddReviews() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
        activityid: 0,
        starRating: 0,
        desc: "",

    },
    validationSchema: yup.object({
      // starRating: yup
      // .number()
      // .integer('Star Rating must be an integer')
      // .min(1, 'Star Rating must be at least 1')
      // .max(5, 'Star Rating must be at most 5')
      // .required('Star Rating is required'),
      desc: yup.string()
        .trim()
        .min(3, 'Description must be at least 3 characters')
        .max(500, 'Description must be at most 500 characters')
        .required('Description is required'),
    }),

    onSubmit: (data) => {
      //data.starRating = parseInt(data.starRating, 10);
      data.desc = data.desc.trim();
      data.userId = 1
      data.userName = "Admin"
      const currentDate = new Date();
      data.date = format(currentDate, global.datetimeFormat2);
      console.log("this happend")
      http.post("/review", data)
        .then((res) => {
          console.log(res.data);
          navigate("/reviews");  
        });
    }
  });
  
  
  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Reviews
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box sx={{ my: 2 }}>
          {/* Use Rating component for starRating */}
          <Rating
            name="starRating"
            value={formik.values.starRating}
            onChange={(event, newValue) => {
              formik.setFieldValue('starRating', newValue);
            }}
            className={formik.touched.starRating && formik.errors.starRating ? 'error' : ''}
          />



        </Box>

        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          multiline
          minRows={2}
          label="Description"
          name="desc"
          value={formik.values.des}
          onChange={formik.handleChange}
          error={formik.touched.des && Boolean(formik.errors.des)}
          helperText={formik.touched.des && formik.errors.des}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AddReviews;