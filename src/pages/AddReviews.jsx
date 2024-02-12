import React from 'react';
import { Box, Typography, TextField, Button, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import UserContext from '../contexts/UserContext';
import * as yup from 'yup';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function AddReviews() {
  const navigate = useNavigate();
  const user = ''

  const formik = useFormik({
    initialValues: {
      activityid: 1,
      starRating: 0,
      desc: "",
    },
    validationSchema: yup.object({
      activityid: yup
        .number('Activity ID must be a number')
        .integer('Activity ID must be an integer')
        .required('Activity ID is required'),
      desc: yup
        .string()
        .trim()
        .min(3, 'Description must be at least 3 characters')
        .max(500, 'Description must be at most 500 characters')
        .required('Description is required'),
    }),
    onSubmit: (data) => {
      data.desc = data.desc.trim();
      // uses user stuff if there, if not default values
      data.userId = user?.id ?? 1;
      data.userName = user?.username ?? "testuser";
      
      const currentDate = dayjs(); // Get current date and time
      data.date = currentDate

      console.log("Review stuff is packaged", data);

      http.post("/review", data)
        .then((res) => {
          console.log("getting to backend...");
          console.log(res.data);
          console.log("on the way to backend");
          navigate("/reviews");
        });
    },
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Reviews
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          margin="normal"
          label="Which Activity Would you like to commend?"
          name="activityid"
          type="number"
          value={formik.values.activityid}
          onChange={formik.handleChange}
          error={formik.touched.activityid && Boolean(formik.errors.activityid)}
          helperText={formik.touched.activityid && formik.errors.activityid}
        />
        <Box sx={{ my: 2 }}>
          {/* Use Rating component for starRating */}
          <Typography variant="body1">how would you rate this activity?</Typography>
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
          label="Tell us more"
          name="desc"
          value={formik.values.desc}
          onChange={formik.handleChange}
          error={formik.touched.desc && Boolean(formik.errors.desc)}
          helperText={formik.touched.desc && formik.errors.desc}
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
