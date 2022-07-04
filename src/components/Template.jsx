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

    const handleStateOfFilters = (index) => {
        dispatch(getHZForFilters({ filterHz: index }))
        index === 0 && dispatch(getBandForFilters({ band: '' }))
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
                filterHz.lowCorner, // low corner
                filterHz.highCorner, // high corner
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
                    {bandTypes.map((text) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}

                                onClick={() => dispatch(getBandForFilters({ band: text }))}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {text === 'BAND_PASS' && <div>BP</div>}
                                    {text === 'LOW_PASS' && <div>LP</div>}
                                    {text === 'HIGH_PASS' && <div>HP</div>}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {typesFilterHz.map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}

                                onClick={() => handleStateOfFilters(index)}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: 'black'
                                    }}
                                >
                                    <ListItemText primary={text} />
                                </ListItemIcon>
                                {/* <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} /> */}
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
        </Box>
    );
}
