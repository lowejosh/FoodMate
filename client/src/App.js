import React from 'react';
import 'typeface-roboto';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import WelcomePage from './components/Pages/WelcomePage';
import Main from './components/Pages/Main';
import './App.scss';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#871812' },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path="/room" component={Main} />
        <Route exact path="/" component={WelcomePage} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
