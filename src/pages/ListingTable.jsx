import React, { useEffect, useState } from "react";
import {
  Link,
  IconButton,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  TextField,
  Input,
  MenuItem,
  Select,
  Avatar
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import http from "../http";
import UserContext from "../contexts/UserContext";

function ListingTable() {
  const [user, setUser] = useState(null);
  const [listingList, setListingList] = useState([]);
  const [filteredListingList, setFilteredListingList] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterNPrice, setFilterNPrice] = useState("");
  const [isNotAdminView, setIsNotAdminView] = useState(
    localStorage.getItem("isAdminView") === "true"
  );
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setCategories([
      { value: "Wine & Dine", label: "Wine & Dine" },
      { value: "Family Bonding", label: "Family Bonding" },
      { value: "Hobbies & Wellness", label: "Hobbies & Wellness" },
      { value: "Sports & Adventure", label: "Sports & Adventure" },
      { value: "Travel", label: "Travel" },
    ]);
    setFilterCategory("");
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
        setListingList(res.data);
        setFilteredListingList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, []);

  const handleFilter = () => {
    let filteredListings = listingList;

    if (filterName) {
      filteredListings = filteredListings.filter((listing) =>
        listing.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterCategory) {
      filteredListings = filteredListings.filter((listing) =>
        listing.category.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              <MenuItem value="lowest">Lowest to Highest</MenuItem>
              <MenuItem value="highest">Highest to Lowest</MenuItem>
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
        <Table sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Image</TableCell> {/* Add table cell for the image */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredListingList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((listing, i) => (
                <TableRow key={listing.id}>
                  <TableCell>{listing.id}</TableCell>
                  <TableCell>{listing.name}</TableCell>
                  <TableCell>{listing.category}</TableCell>
                  <TableCell>${listing.nprice}</TableCell>
                  <TableCell>
                    <Avatar
                      alt={listing.name}
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${
                        listing.imageFile
                      }`}
                    />{" "}
                    {/* Render the image using Avatar component */}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredListingList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </UserContext.Provider>
  );
}

export default ListingTable;
