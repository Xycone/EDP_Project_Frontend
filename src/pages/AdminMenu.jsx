import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, List, ListItem, useTheme, useMediaQuery } from '@mui/material';
import ManageLoyaltyDiscount from './ManageLoyaltyDiscount';
import ManageUsers from './ManageUsers';
import Orders from './Orders';

function AdminMenu() {
    const adminFunctions = [
        { id: 1, title: 'Manage Users', content: <ManageUsers /> },
        { id: 2, title: 'Manage Loyalty Program', content: <ManageLoyaltyDiscount /> },
        { id: 3, title: 'Manage Orders', content: <Orders /> },

    ];
    const [selectedOption, setSelectedOption] = useState(() => {
        // Get the selected option from localStorage or use a default value
        return parseInt(localStorage.getItem('selectedOption'), 10) || null;
    });
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Save the selected submenu option to localStorage
    // Everytime selected option changes aka using handleOptionClick function, the useEffect will trigger
    useEffect(() => {
        if (selectedOption !== null) {
            localStorage.setItem('selectedOption', selectedOption.toString());
        }
    }, [selectedOption]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const renderAdminFunctions = () => (
        <List>
            {adminFunctions.map((card) => (
                <ListItem
                    key={card.id}
                    button
                    selected={selectedOption === card.id}
                    onClick={() => handleOptionClick(card.id)}
                >
                    <Typography variant='body1' style={{ fontSize: '0.8rem' }}>
                        {card.title}
                    </Typography>
                </ListItem>
            ))}
        </List>
    );

    return (
        <Grid container spacing={0} style={{ flexGrow: 1 }}>
            {/* Sidebar */}
            <Grid item xs={12} sm={isSmallScreen ? 12 : 2} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                <Box style={{ flex: 1, overflowY: 'auto' }}>{renderAdminFunctions()}</Box>
            </Grid>

            {/* Main Content Section */}
            <Grid item xs={12} sm={9} style={{ padding: '1.5rem', overflowY: 'auto', backgroundColor: '#f4f4f4' }}>
                {selectedOption !== null && (
                    <Box style={{ fontSize: '1rem' }}>
                        {adminFunctions
                            .filter((card) => card.id === selectedOption)
                            .map((card) => (
                                <React.Fragment key={card.id}>{card.content}</React.Fragment>
                            ))}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}

export default AdminMenu;