import React from 'react';
import 'typeface-roboto';
import './App.css';
import SignIn from './components/SignIn/SignIn';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SignUp from './components/Pages/SignUp/SignUp';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#871812' }, // Purple and green play nicely together.
    // secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/" component={SignIn} />

      </Router>
    </ThemeProvider>
  );
}

export default App;
