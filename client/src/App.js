import React, { useState } from "react";
import "typeface-roboto";
import "./App.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import EnterRoom from "./components/Pages/EnterRoom";
import Main from "./components/Pages/Main";
import "./App.scss";
import {
  checkIfUserExists,
  getRooms,
  clearData
} from "./utilities/LocalStorage";
import { ContextProvider } from "./Context";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#871812" },
    secondary: { main: "#ab5d59" }
  }
});

const App = () => {
  const InitComponent = () => {
    let redirectPath;
    let rooms = getRooms();

    if (checkIfUserExists()) {
      if (rooms) {
        redirectPath = "/home";
      } else {
        clearData();
        redirectPath = "/welcome";
      }
    } else {
      redirectPath = "/welcome";
    }

    return (
      <Route>
        <Redirect to={redirectPath} />
      </Route>
    );
  };

  const FirstRoomComponent = () => {
    return (
      <EnterRoom
        initialTitle="Welcome"
        initialSubtitle="Let's create your first room"
        type="create"
      />
    );
  };

  const CreateRoomComponent = () => {
    return (
      <EnterRoom
        initialTitle="Create a new room"
        initialSubtitle="Please enter your room details"
        type="create"
      />
    );
  };

  const JoinRoomComponent = props => {
    return (
      <EnterRoom
        initialTitle="Join a room"
        initialSubtitle="Please enter your details"
        type="join"
        inviteID={props.match.params.inviteID}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <ContextProvider>
        <Router>
          <Route exact path="/" component={InitComponent} />
          <Route path="/home" component={Main} />
          <Route exact path="/welcome" component={FirstRoomComponent} />
          <Route exact path="/create" component={CreateRoomComponent} />
          <Route exact path="/invite/:inviteID" component={JoinRoomComponent} />
        </Router>
      </ContextProvider>
    </ThemeProvider>
  );
};

export default App;
