import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import RoomCreationForm from "../../Forms/RoomCreationForm/RoomCreationForm";
import { Box } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  wrap: {
    width: "100%",
    height: "100%",
  }

}));

var generateID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export default function WelcomePage() {
  const classes = useStyles();

  // entry point for users with no ID -- generate one
  let id = generateID()
  console.log(id);


  return (
    <Box className={classes.wrap} display="flex" justifyContent="center" alignItems="center">
    <Fade in={id} mountOnEnter unmountOnExit>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <br />
          <Avatar className={classes.avatar}>
            <CreateIcon />
          </Avatar>
          <br />
          <Typography component="h1" variant="h4">
            Welcome!
        </Typography>
          <br />
          <Typography component="h1" variant="h5">
            Let's create your first room
        </Typography>
          <RoomCreationForm />
        </div>
      </Container>
    </Fade>
    </Box>
  );
}
