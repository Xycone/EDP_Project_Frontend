import {
  Link,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import http from "../http";
import UserContext from '../contexts/UserContext';

function Listings() {
  const [user, setUser] = useState(null);
  const [listingList, setListingList] = useState([]);
  const [isNotAdminView, setIsNotAdminView] = useState(
    localStorage.getItem("isAdminView") === "true" // Read from local storage
  );

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
      });
    }
    http
      .get("/activitylisting/listings")
      .then((res) => {
        console.log("Response data:", res.data); // Log response data
        setListingList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error); // Log any errors
      });
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          {user && user.isAdmin && !isNotAdminView && (
            <Link
              to="/addlisting"
              component={RouterLink}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" color="primary">
                Add Listing
              </Button>
            </Link>
          )}
        </Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          All Activities
        </Typography>
        <Grid container spacing={2}>
          {listingList.map((listing, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={listing.id}>
                <Link
                  component={RouterLink}
                  to={`/listing/${listing.id}`}
                  onClick={() =>
                    console.log(`Redirecting to /listing/${listing.id}`)
                  }
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {listing.name}
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        ${listing.nprice}
                      </Typography>
                      {user && user.isAdmin && !isNotAdminView && (
                        <Link
                          component={RouterLink}
                          to={`/editlisting/${listing.id}`}
                          onClick={() => console.log(`Editing ${listing.id}`)}
                        >
                          <IconButton color="primary" sx={{ padding: "4px" }}>
                            <Edit />
                          </IconButton>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </UserContext.Provider>
  );
}

export default Listings;
