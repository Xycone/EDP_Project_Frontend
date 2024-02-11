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
    // Fetch categories from API or use predefined categories
    // For example:
    // setCategories([
    //   { value: "category1", label: "Wine & Dine" },
    //   { value: "category2", label: "Family Bonding" },
    //   ...
    // ]);
    // For now, using the predefined categories directly
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
              placeholder="Filter by Categories"
              variant="outlined"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              fullWidth
              sx={{ mb: 2, mr: 1, width: 200, height: 40 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              label="Filter by nprice"
              variant="outlined"
              value={filterNPrice}
              onChange={(e) => setFilterNPrice(e.target.value)}
              fullWidth
              sx={{ mb: 2, mr: 1, width: 200, height: 40 }}
            >
              <MenuItem value="">All Prices</MenuItem>
              <MenuItem value="lowest">Lowest to Highest</MenuItem>
              <MenuItem value="highest">Highest to Lowest</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              sx={{ mb: 2, mr: 2, height: 40 }}
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
                sx={{ mb: 2, mr: 2, height: 40 }}
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
