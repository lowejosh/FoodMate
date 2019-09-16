import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  CircularProgress,
  Chip,
  useTheme,
  Fade
} from "@material-ui/core";

const Preferences = ({ roomID }) => {
  const [fetching, setFetching] = useState(true);
  const [cuisineData, setCuisineData] = useState();
  const theme = useTheme();

  const fetchCuisineList = async () => {
    const cuisineListAPIURL = `http://localhost:8001/room-cuisines/${roomID}`;
    let res = await axios.get(cuisineListAPIURL);
    let data = res.data;
    if (data) {
      setCuisineData(data);
    } else {
      //stuff
      setCuisineData(false);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (fetching) {
      fetchCuisineList();
    }
  }, [roomID]);

  return !fetching && cuisineData ? (
    <Fade in={!fetching} timeout={500} mountOnEnter unmountOnExit>
      <Box display="flex" alignItems="center" flexDirection="column">
        <br />
        <Typography align="center" variant="h6" color="primary">
          Preferences
        </Typography>
        <br />
        {cuisineData.map((user, index) => (
          <Box key={index}>
            <Typography align="center" color="primary" variant="subtitle1">
              <i>{user.user}</i>
            </Typography>
            <Box display="flex" justifyContent="center" flexDirection="row">
              {user.cuisine.map(cuisine => (
                <>
                  {cuisine && (
                    <Chip
                      key={cuisine}
                      label={cuisine}
                      color="primary"
                      style={{ margin: theme.spacing(1) }}
                    />
                  )}
                </>
              ))}
            </Box>
            <br />
          </Box>
        ))}
      </Box>
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

export default Preferences;
