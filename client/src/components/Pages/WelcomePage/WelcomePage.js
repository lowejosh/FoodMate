import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import RoomCreationForm from "../../Forms/RoomCreationForm/RoomCreationForm";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
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
  );
}
