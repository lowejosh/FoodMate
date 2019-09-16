import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../../../Context";
import Axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  Chip,
  Fade
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

const SuggestedLocations = ({
  fetchingSuggestedLocations,
  setFetchingSuggestedLocations
}) => {
  // const [fetchingSuggestedLocations, setFetchingSuggestedLocations] = useState(true);
  const [suggestedLocations, setSuggestedLocations] = useState();
  const { roomID } = useContext(Context);
  const theme = useTheme();

  const fetchSuggestedLocations = async () => {
    const APIURL = `http://localhost:8001/get-suggested-locations/${roomID}`;
    let res = await Axios.get(APIURL);
    let data = res.data;
    setSuggestedLocations(data);
    setFetchingSuggestedLocations(false);
  };

  useEffect(() => {
    if (fetchingSuggestedLocations) {
      fetchSuggestedLocations();
    }
  }, [fetchingSuggestedLocations, roomID]);

  return !fetchingSuggestedLocations ? (
    <Fade
      in={!fetchingSuggestedLocations}
      timeout={500}
      mountOnEnter
      unmountOnExit
    >
      <Box
        style={{ padding: theme.spacing(1.5) }}
        display="flex"
        flexDirection="column"
      >
        <Typography variant="h5" color="primary">
          Suggested Locations
        </Typography>
        <br />
        {suggestedLocations ? (
          <div>
            {Object.keys(suggestedLocations).map((location, index) => (
              <div>
                <Typography
                  variant="h6"
                  style={{ color: theme.palette.primary.main }}
                >
                  {suggestedLocations[location].name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: theme.palette.text.secondary
                  }}
                >
                  {suggestedLocations[location].establishment &&
                    suggestedLocations[location].establishment[0]}
                </Typography>
                <Box>
                  {suggestedLocations[location].cuisines.map(cuisine => (
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
                  ))}
                </Box>
                {Object.keys(suggestedLocations).length - 1 !== index && (
                  <hr
                    style={{
                      marginBottom: theme.spacing(1)
                    }}
                  ></hr>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Typography
            variant="subtitle1"
            style={{
              color: theme.palette.text.secondary
            }}
          >
            There are currently no suggested locations.
          </Typography>
        )}
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

export default SuggestedLocations;
