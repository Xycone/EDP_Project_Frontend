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

function Listings() {
  const [listingList, setListingList] = useState([]);

  useEffect(() => {
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
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Link to="/addlisting" component={RouterLink} style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Add Listing
          </Button>
        </Link>
      </Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Listings
      </Typography>
      <Grid container spacing={2}>
        {listingList.map((listing, i) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={listing.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {listing.name}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {listing.category}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {listing.description}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {listing.gprice}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {listing.uprice}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {listing.nprice}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={`/editlisting/${listing.id}`}
                    onClick={() => console.log(`Editing ${listing.id}`)}
                  >
                    <IconButton color="primary" sx={{ padding: "4px" }}>
                      <Edit />
                    </IconButton>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Listings;
