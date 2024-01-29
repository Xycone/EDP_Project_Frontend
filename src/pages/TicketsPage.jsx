import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function TicketsPage() {
    const [ticketList, setTicketList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getTickets = () => {
        http.get('/ticket').then((res) => {
            setTicketList(res.data);
        });
    };

    const searchTickets = () => {
        http.get(`/ticket?search=${search}`).then((res) => {
            setTicketList(res.data);
        });
    };

    useEffect(() => {
        getTickets();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchTickets();
        }
    };

    const onClickSearch = () => {
        searchTickets();
    }

    const onClickClear = () => {
        setSearch('');
        getTickets();
    };
    const deleteTicket = (id) => {
        http.delete(`/ticket/${id}`).then(() => {
            // Remove the deleted ticket from the list
            setTicketList(ticketList.filter(ticket => ticket.id !== id));
        });
    };


    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Tickets
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
            </Box>

            <Grid container spacing={2}>
                {
                    ticketList.map((ticket, i) => {
                        const parsedDate = dayjs(ticket.date, global.datetimeFormat);

                        return (
                            <Grid item xs={12} md={6} lg={4} key={ticket.id}>
                                <Card>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                Issue Type: {ticket.issueType}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Date: {parsedDate.format(global.datetimeFormat)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Contact: {ticket.contact}
                                            </Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                                Complaint: {ticket.complaint}
                                            </Typography>
                                        </Box>
                                        <Button onClick={() => deleteTicket(ticket.id)} variant="contained" color="error">
                                            Delete
                                        </Button>
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

export default TicketsPage;
