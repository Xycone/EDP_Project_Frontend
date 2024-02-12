import React, { useEffect, useState } from "react";
import {
  Link,
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Add, Delete, Edit } from "@mui/icons-material"; // Import Edit icon
import http from "../http";
import UserContext from "../contexts/UserContext";

function Notices() {
  const [noticeList, setNoticeList] = useState([]);
  const { user } = React.useContext(UserContext); // Get user from context

  useEffect(() => {
    http
      .get("/notice")
      .then((res) => {
        setNoticeList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  const handleDeleteNotice = (id) => {
    // Implement the delete notice logic here
    http
      .delete(`/notice/${id}`)
      .then((res) => {
        console.log("Notice deleted successfully:", res.data);
        // Update noticeList by filtering out the deleted notice
        setNoticeList(noticeList.filter((notice) => notice.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting notice:", error);
      });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Notices
        </Typography>
        {user && user.isAdmin && (
          <Link component={RouterLink} to="/addnotice">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              sx={{ mb: 2 }}
            >
              Add Notice
            </Button>
          </Link>
        )}
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              {user && user.isAdmin && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {noticeList.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.name}</TableCell>
                <TableCell>{notice.description}</TableCell>
                <TableCell>
                  {user && user.isAdmin && (
                    <>
                      <Button
                        startIcon={<Edit />}
                        color="primary"
                        component={RouterLink}
                        to={`/editnotice/${notice.id}`}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<Delete />}
                        color="error"
                        onClick={() => handleDeleteNotice(notice.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Notices;
