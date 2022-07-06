import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
import { Section1 } from './Section1';
import { Section2 } from './Section2';
import { useSelector, useDispatch } from 'react-redux';
import { getBandForFilters, getHZForFilters } from '../store/slices/filters';
import * as seisplotjs from 'seisplotjs';
import { setSeismogramDataForFilters } from '../store/slices/graphics';
import _ from 'lodash'

const drawerWidth = 240;
const bandTypes = ['BAND_PASS', 'LOW_PASS', 'HIGH_PASS'];
const typesFilterHz = ['Normal', '0.7 - 2Hz', '1 - 3Hz', '2 - 4Hz', '4 - 8Hz'];

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export const Template = () => {

    //Redux
    const { filterBand, filterHz } = useSelector((state) => state.filter)
    const { seismogramData } = useSelector((state) => state.graphic)
    const dispatch = useDispatch()

    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const [indexBand, setIndexBand] = useState(null);
    const [indexHz, setindexHz] = useState(0)

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        filterBand !== '' && Object.keys(filterHz).length
            ? applyFilters()
            : dispatch(setSeismogramDataForFilters({ seismogramDataForFilters: seismogramData }))
    }, [filterBand, filterHz])

    const handleStateOfFiltersBand = (text, index) => {
        dispatch(getBandForFilters({ band: text }))
        setIndexBand(index)
        indexHz === 0 && setindexHz(null)
    }

    const handleStateOfFiltersHZ = (index) => {
        dispatch(getHZForFilters({ filterHz: index }))
        index === 0 && dispatch(getBandForFilters({ band: '' }))
        index === 0 && setIndexBand(null)
        setindexHz(index)
    }


    const applyFilters = () => {
        const arrayFilteredSeismograms = _.cloneDeep(seismogramData)
        const typeFilter =
            filterBand === 'BAND_PASS' ? seisplotjs.filter.BAND_PASS
                : filterBand === 'LOW_PASS' ? seisplotjs.filter.LOW_PASS
                    : filterBand === 'HIGH_PASS' && seisplotjs.filter.HIGH_PASS
        arrayFilteredSeismograms.forEach(sdd => {
            let butterworth = null;
            butterworth = seisplotjs.filter.createButterworth(
                2, // poles
                typeFilter,
                filterHz.lowCorner,
                filterHz.highCorner,
                1 / sdd.seismogram.sampleRate // delta (period)
            );
            let rmeanSeis = seisplotjs.filter.rMean(sdd.seismogram);
            let filteredSeis = seisplotjs.filter.applyFilter(butterworth, rmeanSeis);
            let taperSeis = seisplotjs.taper.taper(filteredSeis);
            let correctedSeis = seisplotjs.transfer.transfer(taperSeis,
                sdd.channel.response, .001, .02, 250, 500);
            sdd.seismogram = correctedSeis;
        })
        dispatch(setSeismogramDataForFilters({ seismogramDataForFilters: arrayFilteredSeismograms }))
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Gráficas de estaciones
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Typography variant="h6" noWrap component="div">
                        Aplicar filtros
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {typesFilterHz.map((text, index) => (
                        <ListItem key={text} disablePadding sx={{
                            display: 'flex',
                            listStyle: 'none',
                            position: 'relative',
                            width: '100%',
                            height: '60px',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: '0 10px',
                            cursor: 'pointer',
                            transition: '0.5s',
                            textDecoration: 'none',
                            textAlign: 'center',
                            transform: `${index === indexHz ? 'translateX(10px)' : 'none'}`,
                        }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}

                                onClick={() => handleStateOfFiltersHZ(index)}
                            >
                                <ListItemIcon
                                    sx={{
                                        mr: open ? 3 : 'auto',
                                        position: 'relative',
                                        justifyContent: 'center',
                                        display: 'block',
                                        minWidth: '30px',
                                        height: '35px',
                                        lineHeight: '30px',
                                        padding: '5px',
                                        color: 'black',
                                        borderRadius: '10px',
                                        fontSize: ' 1.75em',
                                        transition: '0.5s',
                                        backgroundColor: `${index === indexHz ? text === 'Normal' ? '#0fc70f' : '#ffa117' : 'white'}`,
                                        opacity: `${index === indexHz ? 'none' : '0.5'}`,
                                    }}
                                >
                                    {index === 0 && <ion-icon name="repeat"></ion-icon>}
                                    {index === 1 && <ion-icon name="pulse"></ion-icon>}
                                    {index === 2 && <ion-icon name="thermometer"></ion-icon>}
                                    {index === 3 && <ion-icon name="subway"></ion-icon>}
                                    {index === 4 && <ion-icon name="thunderstorm"></ion-icon>}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{
                                    opacity: open ? 1 : 0,
                                    color: `${index === indexHz ? text === 'Normal' ? '#0fc70f' : '#ffa117' : 'black'}`
                                }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {bandTypes.map((text, index) => (
                        <ListItem key={text} disablePadding sx={{
                            display: 'block',
                            listStyle: 'none',
                            position: 'relative',
                            width: '100%',
                            height: '60px',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: '0 10px',
                            cursor: 'pointer',
                            transition: '0.5s',
                            transform: `${index === indexBand ? 'translateX(10px)' : 'none'}`,
                        }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}

                                onClick={() => handleStateOfFiltersBand(text, index)}
                            >
                                <ListItemIcon
                                    sx={{
                                        mr: open ? 3 : 'auto',
                                        position: 'relative',
                                        justifyContent: 'center',
                                        display: 'block',
                                        minWidth: '30px',
                                        height: '35px',
                                        lineHeight: '30px',
                                        padding: '5px',
                                        color: 'black',
                                        borderRadius: '10px',
                                        fontSize: ' 1.75em',
                                        transition: '0.5s',
                                        backgroundColor: `${index === indexBand ? '#2196f3' : 'white'}`,
                                        opacity: `${index === indexBand ? 'none' : '0.5'}`,
                                    }}
                                >
                                    {text === 'BAND_PASS' && <ion-icon name="earth"></ion-icon>}
                                    {text === 'LOW_PASS' && <ion-icon name="flame"></ion-icon>}
                                    {text === 'HIGH_PASS' && <ion-icon name="flask"></ion-icon>}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{
                                    opacity: open ? 1 : 0,
                                    color: `${index === indexBand ? '#2196f3' : 'black'}`
                                }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />

                <Section1 />
                <br />
                <Section2 />
            </Box>
        </Box >
    );
}

