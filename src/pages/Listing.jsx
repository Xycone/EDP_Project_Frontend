import {
  Link,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import http from "../http";

function Listings() {
  const { id } = useParams();
  const navigate = useNavigate(); // Get navigate function from useNavigate
  const [user, setUser] = useState(null);
  const [listing, setListing] = useState(null);
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Initialize quantity state with a default value of 1
  const [cartItems, setCartItems] = useState([]);
  const handleChange = (event) => {
    // Retrieve the value from the event target and update the quantity state
    setQuantity(parseInt(event.target.value));
  };
  useEffect(() => {
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
        setActivityList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, []);
  const checkActivityId = (cartList, activityId) => {
    for (let i = 0; i < cartList.length; i++) {
      const item = cartList[i];
      console.log(item.activityId);
      console.log(activityId);
      // Check if current item's activityID matches the new activityID
      if (item.activityId === activityId) {
        console.log(item.activityId);
        return true; // Exit the loop as item found
      }
      console.log(item.activityId.activityId);
    }
    return false;
  };
  const handleAddToCart = (name, quantity, price, activityId, availspot) => {

    if (checkActivityId(cartItems, activityId)) {
      var updateid = 0
      var updatequantity = 0
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        // Check if current item's activityID matches the new activityID
        if (item.activityId === activityId) {
          updateid = item.id;
          updatequantity = item.quantity + quantity;
          if (updatequantity > availspot) {
            updatequantity = availspot
          }
        }
      }
      const data = { name, quantity : updatequantity, price};
      console.log(data);
      http.put(`/cartitem/${updateid}`, data)
        .then((res) => {
          console.log('Cart item updated successfully:', res.data);
          navigate('/testCart');
        })
        .catch((error) => {
          console.error('Error updating cart item:', error);
          // Handle error
        });
    } else {
      // If the activity is not in the cart, add it as a new cart item
      const data = { name, quantity, price, activityId }; // Create data object for POST request
      http
        .post("/cartitem/addcartitems", data)
        .then((res) => {
          console.log(res.data);
          navigate('/testCart'); // Navigate to the cart page after successful addition
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
                        <Link component={RouterLink} to="/adaddcartitem">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, height: 40 }}
                          >
                            <Typography sx={{ fontSize: 12 }}>
                              Add to Cart
                            </Typography>
                          </Button>
                        </Link>
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
