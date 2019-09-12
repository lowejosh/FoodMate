import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Fade from "@material-ui/core/Fade";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import GeoSuggest from "react-geosuggest";
import axios from "axios";
import "./RoomCreationForm.scss";

// material ui styles
const useStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  typography: {
    margin: theme.spacing(2)
  }
}));

// marker bottom values for slide input
const marks = [
  {
    value: 1,
    label: "1km"
  },
  {
    value: 5,
    label: "5km"
  },
  {
    value: 10,
    label: "10km"
  },
  {
    value: 15,
    label: "15km"
  },
  {
    value: 20,
    label: "20km"
  },
  {
    value: 25,
    label: "25km"
  },
  {
    value: 30,
    label: "30km"
  }
];

const RoomCreationForm = ({ changeTitleCallback, changeSubtitleCallback }) => {
  // states
  const classes = useStyles();
  const [nickname, setNickname] = useState();
  const [latLng, setLatLng] = useState();
  const [radius, setRadius] = useState(5);
  const [, setLocationDescription] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasValues, setHasValues] = useState(false);
  const [popupMessage, setPopupMessage] = useState(
    "Please fill out all the fields before continuing."
  );
  const [open, setOpen] = useState(false);
  const [cuisineButtons, setCuisineButtons] = useState();
  const [cuisineStates] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });
  const [topCuisines, setTopCuisines] = useState();
  const [update, setUpdate] = useState(0);

  function handleClose() {
    setOpen(false);
  }

  const id = open ? "simple-popover" : undefined;

  const handleSuggestSelect = data => {
    try {
      setLocationDescription(data.description);
      setLatLng(data.location);
    } catch {
      // do nothing -- geosuggest bug
    }
  };

  const handleCuisineClick = (el, index) => {
    setUpdate(update + 1);
    cuisineStates[index]
      ? (cuisineStates[index] = false)
      : (cuisineStates[index] = el);
  };

  // update the button style when clicked
  useEffect(() => {
    if (topCuisines) {
      let res = [];
      topCuisines.map((el, index) => {
        res.push(
          <Button
            onClick={e => {
              handleCuisineClick(el, index);
            }}
            key={index}
            variant={cuisineStates[index] ? "contained" : "outlined"}
            color="secondary"
            className={classes.button}
          >
            {el}
          </Button>
        );
      });
      setCuisineButtons(res);
    }
  }, [update]);

  // create the initial cuisine buttons
  const createCuisineButtons = data => {
    // set the data
    setTopCuisines(data);
    let res = [];
    data.map((el, index) => {
      res.push(
        <Button
          onClick={e => {
            handleCuisineClick(el, index);
          }}
          key={index}
          variant={cuisineStates[index] ? "contained" : "outlined"}
          color="secondary"
          className={classes.button}
        >
          {el}
        </Button>
      );
    });
    return res;
  };

  // fetch the cuisine info for given lat/lng
  const fetchCuisineInfo = async (latLng, event) => {
    const cuisineAPIURL = `http://localhost:8001/top-cuisines/${latLng.lat}/${latLng.lng}`;
    let res = await axios.get(cuisineAPIURL);
    let data = res.data;
    // if theres no cuisines
    if (data.message) {
      setPopupMessage(
        "There doesn't seem to be any restaurants at that location, please try somewhere else."
      );
      setOpen(true);
    } else {
      setCuisineButtons(createCuisineButtons(data));
      if (changeSubtitleCallback) {
        changeSubtitleCallback(`What are your preferred cuisines?`);
      }
      if (changeTitleCallback) {
        changeTitleCallback(`Hi ${nickname},`);
      }
      setHasValues(true);
    }
  };

  // formats the marker distance slider
  function valuetext(value) {
    return `${value}km`;
  }

  // handles submit button for location/nickname
  const handleSubmit = event => {
    setAnchorEl(event.currentTarget);
    if (nickname && nickname.length > 0 && latLng && radius) {
      // continue to cuisine stuff
      fetchCuisineInfo(latLng, event);
    } else {
      // show popup error
      setPopupMessage("Please fill out all the fields before continuing.");
      setOpen(true);
    }
  };

  // handles nickname state on input change
  const handleNickChange = el => {
    setNickname(el.target.value);
  };

  // handles radius state on input change
  const handleRadiusChange = (event, value) => {
    setRadius(value);
  };

  return (
    <div className="fixed-width">
      <Fade
        in={!hasValues}
        style={{ transitionDelay: !hasValues ? "500ms:" : "0ms" }}
        mountOnEnter
        unmountOnExit
      >
        <form className={classes.form} noValidate>
          <br />
          <Typography gutterBottom>
            What would you like to be known as?
          </Typography>
          <div className="input-wrap">
            <input
              onChange={handleNickChange}
              className="input"
              placeholder="Nickname*"
              name="nickname"
            />
          </div>
          <br />
          <Typography gutterBottom>Where would you like to eat?</Typography>
          <GeoSuggest
            placeholder="Location*"
            onSuggestSelect={handleSuggestSelect}
          />
          <br />
          <Typography gutterBottom>
            How far from there would you travel?
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
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <Typography className={classes.typography}>
              {popupMessage}
            </Typography>
          </Popover>
        </form>
      </Fade>

      <Fade
        in={hasValues}
        style={{ transitionDelay: hasValues ? "500ms" : "0ms" }}
        mountOnEnter
        unmountOnExit
      >
        <Box display="flex" flexDirection="column" justifyContent="center">
          <br />
          {cuisineButtons}
          <Button
            key="submit"
            fullWidth
            variant="contained"
            color="primary"
            // onClick={handleSubmit}
            className={classes.submit}
          >
            Create
          </Button>
        </Box>
      </Fade>
    </div>
  );
};

export default RoomCreationForm;
