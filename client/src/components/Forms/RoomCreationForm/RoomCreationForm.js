import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import GeoSuggest from "react-geosuggest";
import axios from 'axios';
import "./RoomCreationForm.scss";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  typography: {
    margin: theme.spacing(2)
  }

}));

const RoomCreationForm = () => {
  const classes = useStyles();
  const [nickname, setNickname] = useState();
  const [latLng, setLatLng] = useState();
  const [radius, setRadius] = useState(5);
  const [, setLocationDescription] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasValues, setHasValues] = useState(false);
  const [cuisineInfo, setCuisineInfo] = useState();

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const handleSuggestSelect = (data) => {
    setLocationDescription(data.description);
    setLatLng(data.location);
  }

  const marks = [
    {
      value: 1,
      label: '0km',
    },
    {
      value: 5,
      label: '5km',
    },
    {
      value: 10,
      label: '10km',
    },
    {
      value: 15,
      label: '15km',
    },
    {
      value: 20,
      label: '20km',
    },
    {
      value: 25,
      label: '25km',
    },
    {
      value: 30,
      label: '30km',
    },
  ];

  const fetchCuisineInfo = async (latLng) => {
    console.log(latLng);
    const cuisineAPIURL = `http://localhost:8001/cuisines/${latLng.lat}/${latLng.lng}`;
    console.log(cuisineAPIURL);
    let res = await axios.get(cuisineAPIURL);
    let data = res.data;
    console.log(data);
  }

  function valuetext(value) {
    return `${value}km`;
  }

  const handleSubmit = (event) => {
    if (nickname && nickname.length > 0 && latLng && radius) {
      // continue to cuisine stuff
      setHasValues(true);
      fetchCuisineInfo(latLng);
    } else {
      // show popup error
      setAnchorEl(event.currentTarget);
    }
  }

  const handleNickChange = (el) => {
    setNickname(el.target.value);
  }

  const handleRadiusChange = (event, value) => {
    setRadius(value);
  }

  return (
    <div className="fixed-width">
      <Fade in={!hasValues} style={{ transitionDelay: !hasValues ? '500ms:' : '0ms' }} mountOnEnter unmountOnExit>
        <form className={classes.form} noValidate>
          <br />
          <Typography gutterBottom>
            What would you like to be known as?
      </Typography>
          <div className="input-wrap">
            <input onChange={handleNickChange} className="input" placeholder="Nickname*" name="nickname" />
          </div>
          <br />
          <Typography gutterBottom>
            Where would you like to eat?
      </Typography>
          <GeoSuggest placeholder="Location*" onSuggestSelect={handleSuggestSelect} />
          <br />
          <Typography gutterBottom>
            How far would you travel?
      </Typography>
          <Slider
            onChange={handleRadiusChange}
            defaultValue={5}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-custom"
            valueLabelDisplay="auto"
            step={1}
            marks={marks}
            min={1}
            max={30}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className={classes.submit}
          >
            Continue
      </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography className={classes.typography}>Please fill out all the fields before continuing.</Typography>
          </Popover>
        </form>
      </Fade>

      <Fade in={hasValues} style={{ transitionDelay: hasValues ? '500ms:' : '0ms' }} mountOnEnter unmountOnExit>
        <div>
          cuisine stuff
        </div>
      </Fade>
    </div>
  );
};

export default RoomCreationForm;
