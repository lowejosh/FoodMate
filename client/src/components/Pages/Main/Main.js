import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { mainListItems } from "./listItems";
import useStyles from "./useStyles";
import axios from "axios";
import { checkIfUserExists } from "../../../utilities/LocalStorage";
import { LinearProgress, CircularProgress, Box, Fade } from "@material-ui/core";

const Main = props => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const verifyRoom = useCallback(async () => {
    const roomID = props.match.params.roomID;
    const userID = checkIfUserExists();
    const verifyRoomAPIURL = `http://localhost:8001/verify-room/${roomID}/${userID}`;
    let res = await axios.get(verifyRoomAPIURL);
    let data = res.data;
    if (data.verified === false) {
      setVerified({ verified: false, message: data.message });
    } else {
      setVerified({ verified: true });
    }
    setVerifying(false);
  }, [props.match.params.roomID]);

  useEffect(() => {
    if (verifying) {
      verifyRoom();
    }
  }, [verifying, verifyRoom]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            FoodMate
          </Typography>
          {verified.verified ? (
            <IconButton color="inherit">
              <PersonAddIcon />
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          <Fade
            in={!verifying}
            style={{ transitionDelay: verifying ? "500ms" : "0ms" }}
            mountOnEnter
            unmountOnExit
          >
            {verified.verified ? (
              <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={8}>
                  <Paper className={fixedHeightPaper}>Map</Paper>
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={4} lg={4}>
                  <Paper className={fixedHeightPaper}>
                    Selected Location Info
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper className={fixedHeightPaper}>
                    Suggested Locations
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper className={fixedHeightPaper}>Chat</Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper className={fixedHeightPaper}>Preferences</Paper>
                </Grid>
              </Grid>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography component="h1" variant="h5">
                  {verified.message}
                </Typography>
              </Box>
            )}
          </Fade>
        </Container>
      </main>
      )}
    </div>
  );
};

export default Main;
