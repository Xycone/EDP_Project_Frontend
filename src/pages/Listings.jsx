import React, { useEffect, useState } from "react";
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
  Input,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import http from "../http";
import UserContext from "../contexts/UserContext";
import backgroundImage from '../images/lazy.jpg'; //Happy family on outdoor picnic with ukulele by David Pereiras

function Listings() {
  const [user, setUser] = useState(null);
  const [listingList, setListingList] = useState([]);
  const [filteredListingList, setFilteredListingList] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterNPrice, setFilterNPrice] = useState("");
  const [isNotAdminView, setIsNotAdminView] = useState(
    localStorage.getItem("isAdminView") === "true" // Read from local storage
  );
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories([
      { value: "Wine & Dine", label: "Wine & Dine" },
      { value: "Family Bonding", label: "Family Bonding" },
      { value: "Hobbies & Wellness", label: "Hobbies & Wellness" },
      { value: "Sports & Adventure", label: "Sports & Adventure" },
      { value: "Travel", label: "Travel" },
    ]);
    setFilterCategory(""); // Set default category filter to ""
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
      });
    }
    http
      .get("/activitylisting/listings")
      .then((res) => {
        console.log("Response data:", res.data);
        setListingList(res.data);
        setFilteredListingList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, []);

  const handleFilter = () => {
    let filteredListings = listingList;

    // Filter by name
    if (filterName) {
      filteredListings = filteredListings.filter((listing) =>
        listing.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory) {
      filteredListings = filteredListings.filter((listing) =>
        listing.category.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    // Sort by nprice
    if (filterNPrice === "lowest") {
      filteredListings.sort((a, b) => a.nprice - b.nprice);
    } else if (filterNPrice === "highest") {
      filteredListings.sort((a, b) => b.nprice - a.nprice);
    }

    setFilteredListingList(filteredListings);
  };

  const resetFilters = () => {
    setFilterName("");
    setFilterCategory("");
    setFilterNPrice("");
    setFilteredListingList(listingList);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Box>
        <div style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '50vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white', // Adjust text color to ensure readability
          textAlign: 'center',
        }}>
          <div>
            <h1 style={{
              WebkitTextStroke: '1px black', // Apply text stroke for WebKit browsers
              color: 'white', // Specify text color
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: '3rem' // Add a shadow for better visibility

            }}>
              You Play, We'll Do The Rest
            </h1>
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Input
              variant="outlined"
              placeholder="Filter by name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              fullWidth
              sx={{ mb: 2, mr: 1, width: 200, height: 40 }}
            />
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              fullWidth
              displayEmpty
              inputProps={{ "aria-label": "Select category" }}
              sx={{ mb: 2, mr: 1, width: 200, height: 40 }}
              renderValue={(selected) =>
                selected === "" ? "Filter by Categories" : selected
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={filterNPrice}
              onChange={(e) => setFilterNPrice(e.target.value)}
              fullWidth
              displayEmpty
              inputProps={{ "aria-label": "Select price filter" }}
              sx={{ mb: 2, width: 200, height: 40 }}
              renderValue={(selected) =>
                selected === "" ? "Filter by Price" : selected
              }
            >
              <MenuItem value="Lowest">Lowest to Highest</MenuItem>
              <MenuItem value="Highest">Highest to Lowest</MenuItem>
            </Select>

            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              sx={{ mb: 2, mr: 2, ml: 2, height: 40 }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={resetFilters}
              sx={{ mb: 2, height: 40 }}
            >
              Reset
            </Button>
          </Box>
          {user && user.isAdmin && !isNotAdminView && (
            <Link component={RouterLink} to="/addlisting">
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2, height: 40 }}
              >
                <Typography>Add Listings</Typography>
              </Button>
            </Link>
          )}
        </Box>
        <Grid container spacing={2}>
          {filteredListingList.map((listing, i) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={listing.id}>
                <Link
                  component={RouterLink}
                  to={`/listing/${listing.id}`}
                  onClick={() =>
                    console.log(`Redirecting to /listing/${listing.id}`)
                  }
                >
                  <Card sx={{ position: 'relative', borderRadius: 5 }}>
                    <CardContent>
                      <img
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${
                          listing.imageFile
                        }`}
                        alt="Your Image"
                        style={{
                          width: '100%',
                          height: '200px',
                          borderRadius: 10,
                        }}
                      />
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
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
