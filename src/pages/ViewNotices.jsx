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
import http from "../http";
import UserContext from "../contexts/UserContext";

function ViewNotices() {
  const [noticeList, setNoticeList] = useState([]);
  const { user } = React.useContext(UserContext); // Get user from context

  useEffect(() => {
    http
      .get("/notice")
      .then((res) => {
        // Sort notices in descending order by id
        const sortedNotices = res.data.sort((a, b) => b.id - a.id);
        setNoticeList(sortedNotices);
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

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
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noticeList.map((notice) => (
              <TableRow key={notice.id}>
                <TableCell>{notice.name}</TableCell>
                <TableCell>{notice.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ViewNotices;
