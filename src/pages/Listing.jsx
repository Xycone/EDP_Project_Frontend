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
import { useParams, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import http from "../http";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Listings() {
  const { id } = useParams();
  const navigate = useNavigate(); // Get navigate function from useNavigate
  const [user, setUser] = useState(null);
  const [listing, setListing] = useState(null);
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Initialize quantity state with a default value of 1
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const handleChange = (event) => {
    // Retrieve the value from the event target and update the quantity state
    setQuantity(parseInt(event.target.value));
  };
  useEffect(() => {
    http.get('/user/auth').then((res) => {
      setUserId(res.data.user);
    }); // Replace this with your actual code to get the current user ID
    http.get('/cartitem/getcartitems').then((res) => {
      setCartItems(res.data);
    });
    http.get(`/activitylisting/${id}`).then((res) => {
      setListing(res.data);
      setLoading(false);
    });
    http
      .get(`/activity/activities-by-listing/${id}`)
      .then((res) => {
        console.log("Response data:", res.data); // Log response data
        setActivityList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error); // Log any errors
      });
  }, []);
  const checkActivityId = (cartList, activityId, userId) => {
    for (let i = 0; i < cartList.length; i++) {
      const item = cartList[i];
      console.log(item.activityId);
      console.log(activityId);
      if (item.userId === userId) {
        if (item.activityId === activityId) {
          return true; // Exit the loop as item found
        }
      }
    }
    return false;
  };
  const handleAddToCart = (name, quantity, price, activityId, availspot, userId) => {
    if (checkActivityId(cartItems, activityId, userId)) {
      var updateid = 0
      var updatequantity = 0
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        // Check if current item's activityID matches the new activityID
        if (item.activityId === activityId && item.userId === userId) {
          updateid = item.id;
          updatequantity = item.quantity + quantity;
          if (updatequantity > availspot) {
            toast.error('Cannot add to cart more than available spots');
          }
          else if (quantity <= 0) {
            toast.error('Cannot add nothing and negative items to cart');
          }
          else {
            const data = { name, quantity: updatequantity, price };
            console.log(data);
            http.put(`/cartitem/${updateid}`, data)
              .then((res) => {
                console.log('Cart item updated successfully:', res.data);
                navigate('/Cart');
              })
              .catch((error) => {
                console.error('Error updating cart item:', error);
                // Handle error
              });
          }
        }
      }
    } else {
      // If the activity is not in the cart, add it as a new cart item
      const data = { name, quantity, price, activityId }; // Create data object for POST request
      http
        .post("/cartitem/addcartitems", data)
        .then((res) => {
          console.log(res.data);
          navigate('/Cart'); // Navigate to the cart page after successful addition
        })
        .catch((error) => {
          console.error("Error adding cart item:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
          }
        });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {!loading && (
        <Box
          sx={{
            flex: 1,
            my: 2,
            padding: "20px", // Optional: Add some padding to create space between the shadow and the content
            boxShadow: "1px 6px 12px -6px rgba(0, 0, 0, 0.2)", // Adjust the values as needed
            borderRadius: 10,
          }}
        >
          <img
            src={`${import.meta.env.VITE_FILE_BASE_URL}${listing.imageFile}`}
            alt="Your Image"
            style={{
              width: "100%",
              height: "250px",
              marginBottom: 2,
              borderRadius: 5,
              marginTop: 2,
            }}
          />
          <Typography
            variant="h5"
            sx={{ my: 2, fontSize: "2rem", fontWeight: "bold" }}
          >
            {listing.title}
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "1.5rem" }}>
            {listing.category}
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "1.5rem" }}>
            ${listing.nprice}
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "1.2rem" }}>
            Description: {listing.description}
          </Typography>
          <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "1.2rem" }}>
            Address: {listing.address}
          </Typography>
        </Box>
      )}
      <Box sx={{ flex: 1.5, marginLeft: 2 }}>
        <Typography variant="h5" sx={{ my: 2, mt: 4.5 }}>
          Available Booking Dates:
        </Typography>
        <Box sx={{ bgcolor: "#cccccc", padding: "25px", borderRadius: 5 }}>
          <Grid container spacing={2}>
            {activityList.map((activity, i) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={activity.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }).format(new Date(activity.date))}
                      </Typography>

                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        Available slots: {activity.availSpots}
                      </Typography>
                      <Box sx={{ textAlign: "center" }}>
                        <TextField
                          type="number"
                          label="Quantity"
                          inputProps={{
                            min: 1,
                            max: activity.availSpots,
                            step: 1,
                          }}
                          value={quantity}
                          onChange={handleChange}
                          sx={{ marginBottom: 1 }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToCart(listing.name + " \n" + activity.date, quantity, listing.nprice, activity.id, activity.availSpots, userId['id'])}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default Listings;
