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
    const cuisineListAPIURL = `http://54.174.106.98:8001/room-cuisines/${roomID}`;
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
      <Box
        style={{ padding: theme.spacing(1.5) }}
        display="flex"
        flexDirection="column"
      >
        <Typography variant="h5" color="primary">
          Preferences
        </Typography>
        <br />
        {cuisineData.map((user, index) => (
          <Box key={index}>
            <Typography variant="h6" color="primary">
              {user.user}
            </Typography>
            <Box display="flex" flexDirection="row">
              {user.cuisine.map(cuisine => (
                <>
                  {cuisine && (
                    <Chip
                      key={cuisine}
                      label={cuisine}
                      color="primary"
                      style={{
                        marginRight: theme.spacing(1),
                        marginTop: theme.spacing(1),
                        marginBottom: theme.spacing(1)
                      }}
                    />
                  )}
                </>
              ))}
            </Box>
            {index !== cuisineData.length - 1 && (
              <hr
                style={{
                  marginBottom: theme.spacing(1)
                }}
              ></hr>
            )}
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
