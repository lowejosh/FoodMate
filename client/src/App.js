import React from "react";
import "typeface-roboto";
import "./App.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import WelcomePage from "./components/Pages/WelcomePage";
import Main from "./components/Pages/Main";
import "./App.scss";
import {
  checkIfUserExists,
  getRooms,
  clearData
} from "./utilities/LocalStorage";

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
        let firstRoom = rooms.split(",")[0];
        redirectPath = `/room/${firstRoom}`;
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

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path="/" component={InitComponent} />
        <Route path="/room/:roomID" component={Main} />
        <Route exact path="/welcome" component={WelcomePage} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
