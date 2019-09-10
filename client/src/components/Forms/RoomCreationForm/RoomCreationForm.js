import React, { useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import GeoSuggest from "react-geosuggest";
import "./RoomCreationForm.css";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const RoomCreationForm = props => {
  const classes = useStyles();
  const geoRef = useRef();

  const handleSuggestSelect = (data) => {
    console.log(data);
  }

  const handleBlur = (d) => {
    console.log('reached');
    console.log(geoRef);
  }

  return (
    <form className={classes.form} noValidate>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="nickname"
        label="Your nickname"
        type="text"
        id="nickname"
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="location"
        label="Where you would like to eat"
        type="text"
        id="location"
      />
      <GeoSuggest ref={geoRef} onBlur={handleBlur} onSuggestSelect={handleSuggestSelect} className="test" />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Continue
      </Button>
    </form>
  );
};

export default RoomCreationForm;
