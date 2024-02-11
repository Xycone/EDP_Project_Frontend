import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { format } from 'date-fns';
import global from '../global'; // Import the global file with datetimeFormat

function AddTickets() {
  const navigate = useNavigate();

  // Get current date and time
  const currentDate = new Date();
  // Format the current date and time using the global datetime format
  const currentDateTimeFormatted = format(currentDate, global.datetimeFormat2);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      date: currentDateTimeFormatted, // Set the default value of date field to current date and time
      issueType: '',
      complaint: '',
      contact: '',
    },
    validationSchema: yup.object({
      date: yup.date().required('Date is required'),
      issueType: yup.string().required('Issue type is required'),
      complaint: yup.string().required('Complaint is required'),
      contact: yup.string().email('Invalid email format').required('Contact is required'),
    }),
    onSubmit: (values) => {
      http.post('/ticket', values)
        .then((res) => {
          console.log(res.data);
          navigate('/ticketspage'); // Redirect to the tickets page after successfully adding a ticket
        })
        .catch((error) => {
          console.error('Error adding ticket:', error);
        });
    },
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Ticket
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Date"
          type="datetime-local"
          name="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          error={formik.touched.date && Boolean(formik.errors.date)}
          helperText={formik.touched.date && formik.errors.date}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Issue Type"
          name="issueType"
          value={formik.values.issueType}
          onChange={formik.handleChange}
          error={formik.touched.issueType && Boolean(formik.errors.issueType)}
          helperText={formik.touched.issueType && formik.errors.issueType}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          multiline
          minRows={2}
          label="Complaint"
          name="complaint"
          value={formik.values.complaint}
          onChange={formik.handleChange}
          error={formik.touched.complaint && Boolean(formik.errors.complaint)}
          helperText={formik.touched.complaint && formik.errors.complaint}
        />
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          label="Contact"
          name="contact"
          value={formik.values.contact}
          onChange={formik.handleChange}
          error={formik.touched.contact && Boolean(formik.errors.contact)}
          helperText={formik.touched.contact && formik.errors.contact}
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

export default AddTickets;
