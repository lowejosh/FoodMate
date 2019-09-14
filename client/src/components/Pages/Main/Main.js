import React, { useState, useEffect, useCallback, useContext } from "react";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import useStyles from "./useStyles";
import axios from "axios";
import { checkIfUserExists } from "../../../utilities/LocalStorage";
import { Box, Fade, Modal, Link, Button } from "@material-ui/core";
import Sidebar from "./Sidebar/Sidebar";
import { Context } from "../../../Context";
import Backdrop from "@material-ui/core/Backdrop";
import Map from "./Map/Map";
import MapWrapper from "./Map/Map";

const Main = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { roomID, setRoomID } = useContext(Context);
  const [inviteLink, setInviteLink] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  // redirect
  if (!roomID) {
    window.location.href = "/welcome";
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleInviteOpen = () => {
    setInviteOpen(true);
  };

  const handleInviteClose = () => {
    setInviteOpen(false);
  };

  const copyToClipboard = text => {
    let dummy = document.createElement("textarea");
    // dummy.style.display = "none";
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  const handleCopy = () => {
    copyToClipboard(inviteLink);
  };

  useEffect(() => {
    if (!verifying) {
      setVerifying(true);
    }
  }, [roomID]);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaperNoPadding = clsx(
    classes.paper,
    classes.fixedHeight,
    classes.noPadding
  );

  const verifyRoom = useCallback(async () => {
    // const roomID = props.match.params.roomID;
    const userID = checkIfUserExists();
    const verifyRoomAPIURL = `http://localhost:8001/verify-room/${roomID}/${userID}`;
    let res = await axios.get(verifyRoomAPIURL);
    let data = res.data;
    if (data.verified === false) {
      setVerified({ verified: false, message: data.message });
    } else {
      setInviteLink(`http://localhost:3000/invite/${data.inviteID}`);
      setVerified({ verified: true });
    }
    setVerifying(false);
  }, [roomID]);
  // }, [props.match.params.roomID]);

  useEffect(() => {
    if (verifying) {
      verifyRoom();
    }
  }, [verifying, verifyRoom]);

  return roomID ? (
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
            FoodMate - {roomID}
          </Typography>
          {verified.verified ? (
            <IconButton onClick={handleInviteOpen} color="inherit">
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
        <Sidebar roomID={roomID} setRoomID={setRoomID} />
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
                  <Paper className={fixedHeightPaperNoPadding}>
                    <MapWrapper
                      selectedLocation={selectedLocation}
                      setSelectedLocation={setSelectedLocation}
                    />
                  </Paper>
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={inviteOpen}
        onClose={handleInviteClose}
        closeAfterTransition
        disableAutoFocus={true}
        disableEnforceFocus={true}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={inviteOpen}>
          <div className={clsx(classes.paper, classes.modalPopup)}>
            {inviteLink ? (
              <Typography align="center" component="h1" variant="h5">
                Invite someone to your room with the following link
                <hr />
                <Link href={inviteLink}>{inviteLink}</Link>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleCopy}
                  className={classes.copy}
                >
                  Copy to clipboard
                </Button>
              </Typography>
            ) : (
              <Typography component="h1" variant="h5">
                There was an error in retrieving your invite link
              </Typography>
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  ) : null;
};

export default Main;
