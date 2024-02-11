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
    <div>
      <Typography variant="h5" gutterBottom>
        {listing && listing.title}
      </Typography>
      <Typography gutterBottom>{listing && listing.category}</Typography>
      <Typography gutterBottom>{listing && `$${listing.nprice}`}</Typography>
      <Typography gutterBottom>
        Description: {listing && listing.description}
      </Typography>
      <Typography gutterBottom>
        Address: {listing && listing.address}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Available Booking Dates:
      </Typography>
      <Grid container spacing={2}>
        {activityList.map((activity) => (
          <Grid item xs={12} md={6} lg={4} key={activity.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Date: {activity.date}
                </Typography>
                <Typography gutterBottom>
                  Available spots left: {activity.availSpots}
                </Typography>
                <TextField
                  type="number"
                  label="Quantity"
                  inputProps={{
                    min: 1,
                    max: activity.availSpots, // Maximum value based on activity.availSpots
                    step: 1, // Only allow integer values
                  }}
                  value={quantity} // Set the value of the TextField to the quantity state
                  onChange={handleChange} // Call the handleChange function when the value changes
                  sx={{ marginBottom: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(listing.name + " " + activity.date, quantity, listing.nprice, activity.id, activity.availSpots)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Listings;
