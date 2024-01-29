import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Rating } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Reviews() {
    const [reviewList, setReviewList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getReviews = () => {
        http.get('/review').then((res) => {
            setReviewList(res.data);
        });
    };

    const searchReviews = () => {
        http.get(`/review?search=${search}`).then((res) => {
            setReviewList(res.data);
        });
    };

    useEffect(() => {
        getReviews();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchReviews();
        }
    };

    const onClickSearch = () => {
        searchReviews();
    }

    const onClickClear = () => {
        setSearch('');
        getReviews();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Reviews
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                  //due to rush and not properly getting the user info and put in usercontext, user is null in all my stuff
                    user && (
                        <Link to="/addreview" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                      {
                        reviewList.map((review, i) => {
                          const parsedDate = dayjs(review.date, global.datetimeFormat);

                        

                          return (
                            <Grid item xs={12} md={6} lg={4} key={review.id}>
                              <Card>
                                <CardContent sx={{ height: '300px' }}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                                  <Rating value={review.starRating} readOnly />
                                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                      Activity ID: {review.activityId}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>
                                      {review.userName}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <Typography>
                                      {parsedDate.format(global.datetimeFormat)}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {review.desc}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })
                      }
                    </Grid>

        </Box>
    );
}

export default Reviews;
