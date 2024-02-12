import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Rating } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function EditReviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await http.get(`/review/${id}`);
        setReview(response.data);
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };

    fetchReview();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      activityid: review?.activityid || 1,
      starRating: review?.starRating || 0,
      desc: review?.desc || "",
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
      
      const currentDate = dayjs(); // Get current date and time
      data.date = currentDate

      console.log("Review stuff is packaged", data);

      http.put(`/review/${id}`, data)
        .then((res) => {
          console.log("getting to backend...");
          console.log(res.data);
          console.log("on the way to backend");
          navigate("/reviews");
        });
    },
  });

  if (!review) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Review
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
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default EditReviews;
