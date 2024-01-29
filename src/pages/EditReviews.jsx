import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { format } from 'date-fns';
import global from "C:/Users/wwwwa/Desktop/Edp/src/global.js"

function EditReviews() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    // Fetch the review data based on the id from the URL params
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
    initialValues: review,
    enableReinitialize: true,
    validationSchema: yup.object({
      desc: yup.string()
        .trim()
        .min(3, 'Description must be at least 3 characters')
        .max(500, 'Description must be at most 500 characters')
        .required('Description is required'),
    }),

    onSubmit: (data) => {
      data.starRating = parseInt(data.starRating, 10);
      data.desc = data.desc.trim();
      
      // Fetch current date and time
      const currentDate = new Date();
      
      // Format the date according to the global datetime format
      data.date = format(currentDate, global.datetimeFormat);

      http.put(`/review/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/reviews");  
        })
        .catch((error) => {
          console.error('Error updating review:', error);
        });
    }

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
      <Rating
            name="starRating"
            value={formik.values.starRating}
            onChange={(event, newValue) => {
              formik.setFieldValue('starRating', newValue);
            }}
            className={formik.touched.starRating && formik.errors.starRating ? 'error' : ''}
          />


        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          multiline
          minRows={2}
          label="Description"
          name="desc"
          value={formik.values?.desc}
          onChange={formik.handleChange}
          error={formik.touched.desc && Boolean(formik.errors.desc)}
          helperText={formik.touched.desc && formik.errors.desc}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default EditReviews;
