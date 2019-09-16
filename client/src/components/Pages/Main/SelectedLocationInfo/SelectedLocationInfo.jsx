import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Chip,
  useTheme,
  Typography,
  Fade,
  CircularProgress,
  Link,
  Button
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { Context } from "../../../../Context";
import Axios from "axios";

const SelectedLocationInfo = ({ setSelectedLocation, selectedLocation }) => {
  const [update, setUpdate] = useState(true);
  const { roomID } = useContext(Context);

  useEffect(() => {
    setUpdate(false);
    setTimeout(() => {
      setUpdate(true);
    });
  }, [selectedLocation]);

  const sendPayload = async () => {
    let payload = {
      id: selectedLocation.id,
      roomID: roomID,
      name: selectedLocation.name,
      cuisines: selectedLocation.cuisines,
      establishment: selectedLocation.establishment
    };

    // send the payload to the server
    const APIURL = "http://localhost:8001/suggest-location";
    let res = await Axios.post(APIURL, payload);
    console.log(res.data.message);
  };

  const handleSuggest = () => {
    sendPayload();
  };

  const theme = useTheme();
  return selectedLocation && update ? (
    <Fade in={update} timeout={500} mountOnEnter unmountOnExit>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <Typography variant="h6" style={{ color: theme.palette.primary.main }}>
          {selectedLocation.name}
        </Typography>
        <Typography
          variant="subtitle1"
          style={{
            color: theme.palette.text.secondary
          }}
        >
          {selectedLocation.establishment[0]}
        </Typography>
        <Box>
          {selectedLocation.cuisines.map(cuisine => (
            <Chip
              key={cuisine}
              label={cuisine}
              color="primary"
              style={{ margin: theme.spacing(1) }}
            />
          ))}
          <Typography
            variant="subtitle1"
            style={{ color: theme.palette.text.secondary }}
          >
            <Box
              style={{
                margin: theme.spacing(1)
              }}
            >
              {selectedLocation.address}
            </Box>
          </Typography>
        </Box>
        {selectedLocation.rating ? (
          <>
            <div style={{ margin: "0.2rem" }}>
              <Rating
                value={parseFloat(selectedLocation.rating)}
                precision={0.5}
                readOnly
              />
            </div>
            <Typography
              variant="subtitle1"
              style={{ color: theme.palette.text.secondary }}
            >
              {`${selectedLocation.rating}/5`}
            </Typography>
            <Typography
              variant="subtitle1"
              style={{ color: theme.palette.text.secondary }}
            >
              {`${selectedLocation.ratingCount} ratings`}
            </Typography>
          </>
        ) : (
          <Typography
            variant="subtitle1"
            style={{ color: theme.palette.text.secondary }}
          >
            No ratings available
          </Typography>
        )}
        <Typography variant="subtitle1">
          <Link href={selectedLocation.url}>Read more</Link>
        </Typography>
        <br />
        <Button
          variant="contained"
          color="primary"
          style={{ width: "60%" }}
          onClick={handleSuggest}
        >
          Suggest
        </Button>
      </div>
    </Fade>
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{ width: "100%", height: "100%" }}
    >
      <CircularProgress />
    </Box>
  );
};

export default SelectedLocationInfo;
