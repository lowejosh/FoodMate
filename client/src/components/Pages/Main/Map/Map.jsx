import React, { useState, useEffect, useContext } from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  withScriptjs,
  Circle,
  InfoWindow
} from "react-google-maps";
import axios from "axios";
import { Context } from "../../../../Context";
import {
  CircularProgress,
  Box,
  Fade,
  useTheme,
  Typography
} from "@material-ui/core";

const MapWrapper = ({ setSelectedLocation, selectedLocation }) => {
  const [restaurants, setRestaurants] = useState();
  const [fetching, setFetching] = useState(true);
  const [latLng, setLatLng] = useState();
  const [radius, setRadius] = useState();
  const { roomID } = useContext(Context);

  const fetchRestaurants = async () => {
    const APIURL = `http://localhost:8001/restaurants/${roomID}`;
    let res = await axios.get(APIURL);
    let data = res.data;
    // if theres no restaurants
    if (data.message) {
      console.error(data.message);
      // error stuff
      setFetching(false);
    } else {
      setSelectedLocation(data.payload[0]);
      setLatLng({ lat: data.lat, lng: data.lng });
      setRadius(data.radius);
      setRestaurants(data.payload);
      setFetching(false);
    }
  };

  useEffect(() => {
    if (fetching) {
      setSelectedLocation(false);
      fetchRestaurants();
    }
  }, [roomID]);
  return !fetching ? (
    <Fade
      in={!fetching}
      style={{
        transitionDelay: !fetching ? "500ms" : "0ms"
      }}
      mountOnEnter
      unmountOnExit
    >
      <Map
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ width: "100%", height: "100%" }}
          >
            <CircularProgress />
          </Box>
        }
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        latLng={latLng}
        restaurants={restaurants}
        radius={radius}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        googleMapURL={"true"}
      />
    </Fade>
  ) : (
    <Fade
      in={fetching}
      style={{ transitionDelay: fetching ? "500ms" : "1000ms" }}
      mountOnEnter
      unmountOnExit
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ width: "100%", height: "100%" }}
      >
        <CircularProgress />
      </Box>
    </Fade>
  );
};

const Map = withScriptjs(
  withGoogleMap(
    ({
      latLng,
      restaurants,
      radius,
      setSelectedLocation,
      selectedLocation
    }) => {
      let firstLatLng = { lat: restaurants[0].lat, lng: restaurants[0].lng };
      const theme = useTheme();
      const circleOptions = {
        fillColor: theme.palette.primary.main,
        fillOpacity: 0.1,
        strokeColour: theme.palette.primary.main,
        strokeWeight: 0.5,
        strokeOpacity: 0.8,
        clickable: false
      };

      let markers = restaurants.map(el => {
        const handleMarkerClick = () => {
          setSelectedLocation(el);
        };

        return (
          <Marker
            clickable
            onClick={handleMarkerClick}
            key={el.id}
            position={{ lat: parseFloat(el.lat), lng: parseFloat(el.lng) }}
          >
            {selectedLocation.id === el.id && (
              <InfoWindow>
                <div style={{ margin: "auto", textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    style={{ color: theme.palette.primary.main }}
                  >
                    {el.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    {el.establishment[0]}
                  </Typography>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      });

      return (
        <GoogleMap
          defaultZoom={17}
          defaultCenter={{
            lat: parseFloat(firstLatLng.lat),
            lng: parseFloat(firstLatLng.lng)
          }}
        >
          <Circle
            options={circleOptions}
            defaultCenter={{
              lat: parseFloat(latLng.lat),
              lng: parseFloat(latLng.lng)
            }}
            radius={radius}
          />
          {markers}
        </GoogleMap>
      );
    }
  )
);

export default MapWrapper;
