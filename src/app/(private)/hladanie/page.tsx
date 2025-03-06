//src/app/hladanie/page.tsx

"use client";

import { useState, useEffect } from "react";
import { 
    Container, 
    TextField, 
    Box, 
    Typography, 
    InputAdornment,
    IconButton,
    Paper,
    Avatar,
    Stack,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    alpha
} from "@mui/material";
import { Search, Clear, Person } from "@mui/icons-material";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function SearchPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            setIsLoadingUsers(true);
            try {
                const response = await fetch('/api/users/search?q=');
                const data = await response.json();
                setAllUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoadingUsers(false);
            }
        };
        fetchAllUsers();
    }, []);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleUserClick = (userId: string) => {
        router.push(`/profil/${userId}`);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card 
                elevation={3}
                sx={{ 
                    mb: 4,
                    borderRadius: 2
                }}
            >
                <CardContent>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'text.primary',
                            mb: 2
                        }}
                    >
                        Vyhľadávanie používateľov
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Zadajte meno používateľa..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                                '&:hover': {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'text.primary',
                                    },
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClear} size="small">
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </CardContent>
            </Card>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : searchQuery ? (
                <Stack spacing={2}>
                    {searchResults.map((user) => (
                        <Paper 
                            key={user.id} 
                            onClick={() => handleUserClick(user.id)}
                            elevation={3}
                            sx={{ 
                                p: 2, 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    cursor: 'pointer',
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4,
                                }
                            }}
                        >
                            <Avatar 
                                src={user.image || undefined} 
                                alt={user.name || 'User'} 
                                sx={{ 
                                    width: 56, 
                                    height: 56,
                                    border: '2px solid',
                                    borderColor: 'text.primary',
                                    bgcolor: 'grey.200',
                                    color: 'text.primary',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                {!user.image && <Person />}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                    {searchResults.length === 0 && (
                        <Typography 
                            color="text.secondary" 
                            textAlign="center"
                            sx={{ 
                                py: 4,
                                bgcolor: 'grey.100',
                                borderRadius: 2
                            }}
                        >
                            Žiadni používatelia neboli nájdení
                        </Typography>
                    )}
                </Stack>
            ) : (
                <Box>
                    <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                            mb: 3,
                            fontWeight: 'bold',
                            color: 'text.primary'
                        }}
                    >
                        Všetci používatelia
                    </Typography>
                    {isLoadingUsers ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {allUsers.map((user) => (
                                <Grid item xs={12} sm={6} md={4} key={user.id}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            height: '100%',
                                            p: 2,
                                            borderRadius: 2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                            }
                                        }}
                                    >
                                        <Box
                                            onClick={() => handleUserClick(user.id)}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                height: '100%',
                                                transition: 'all 0.2s ease-in-out',
                                            }}
                                        >
                                            <Avatar 
                                                src={user.image || undefined} 
                                                alt={user.name || 'User'} 
                                                sx={{ 
                                                    width: 100, 
                                                    height: 100,
                                                    mb: 2,
                                                    border: '3px solid',
                                                    borderColor: 'text.primary',
                                                    transition: 'all 0.3s ease-in-out',
                                                    bgcolor: 'grey.200',
                                                    color: 'text.primary',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                    }
                                                }}
                                            >
                                                {!user.image && <Person sx={{ fontSize: 45 }} />}
                                            </Avatar>
                                            <Typography 
                                                variant="subtitle1" 
                                                sx={{ 
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: 'text.primary',
                                                    transition: 'color 0.2s ease-in-out',
                                                    '&:hover': {
                                                        color: 'text.primary',
                                                    }
                                                }}
                                            >
                                                {user.name}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    textAlign: 'center',
                                                    mt: 0.5
                                                }}
                                            >
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}
        </Container>
    );
}