import {
  Link,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import http from "../http";


function Activities() {
  const [activityList, setActivityList] = useState([]);
  const { id } = useParams();

  useEffect(() => {
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
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Link
          to={`/addactivity/${id}`}
          style={{ textDecoration: "none" }}
          component={RouterLink}
        >
          <Button variant="contained" color="primary">
            Add Activity
          </Button>
        </Link>
      </Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Activities
      </Typography>
      <Grid container spacing={2}>
        {activityList.map((activity, i) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={activity.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {activity.date}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {activity. availSpots}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={`/editactivity/${activity.id}`}
                    onClick={() => console.log(`Editing ${activity.id}`)}
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

export default Activities;
