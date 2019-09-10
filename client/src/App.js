import React from 'react';
import 'typeface-roboto';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import WelcomePage from './components/Pages/WelcomePage';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#871812' },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path="/" component={WelcomePage} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
