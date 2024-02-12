import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import http from '../http';

function DelReviews() {
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

  const handleDelete = async () => {
    try {
      await http.delete(`/review/${id}`);
      navigate("/reviews");
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!review) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Delete Review
      </Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        Are you sure you want to delete this review?
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        {`Review ID: ${review.id}`}
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        {`Activity ID: ${review.activityId}`}
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        {`User: ${review.userName}`}
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        {`Date: ${review.date}`}
      </Typography>
      <Typography variant="body2" sx={{ my: 2 }}>
        {`Description: ${review.desc}`}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Box>
  );
}

export default DelReviews;
