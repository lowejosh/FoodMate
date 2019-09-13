import React, { useState } from "react";
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
    height: "100%"
  }
}));

const EnterRoom = ({
  initialTitle,
  initialSubtitle,
  type,
  inviteID,
  givenLatLng
}) => {
  const classes = useStyles();
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);

  return (
    <Box
      className={classes.wrap}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Fade in={true} mountOnEnter unmountOnExit>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <br />
            <Avatar className={classes.avatar}>
              <CreateIcon />
            </Avatar>
            <br />
            <Typography component="h1" variant="h4">
              {title}
            </Typography>
            <br />
            <Typography component="h1" variant="h5">
              {subtitle}
            </Typography>
            <RoomCreationForm
              changeTitleCallback={setTitle}
              changeSubtitleCallback={setSubtitle}
              type={type}
              givenLatLng={givenLatLng}
              inviteID={inviteID}
            />
          </div>
        </Container>
      </Fade>
    </Box>
  );
};

export default EnterRoom;
