import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditNotice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/notice/${id}`).then((res) => {
      setNotice(res.data);
      setLoading(false);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: notice.name,
      description: notice.description,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      name: yup.string().required('Name is required'), // Add validation for name
      description: yup.string()
        .min(3, 'Description must be at least 3 characters')
        .required('Description is required'),
    }),
    onSubmit: (data) => {
        console.log(data);
        console.log(id);
      http.put(`/notice/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/notices");
        });
    }
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteNotice = () => {
    http.delete(`/notice/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/notices");
      });
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Edit Notice
      </Typography>
      {
        !loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px', position: 'relative' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Notice Info
              </Typography>

              {/* Text field for editing name */}
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              {/* Text field for editing description */}
              <TextField
                sx={{ my: 1, fontSize: '1rem' }}
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Update
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                Delete
              </Button>
            </Box>
          </Box>
        )
      }

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Notice
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteNotice}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EditNotice;
