import React, { useState, useEffect, useContext, useCallback } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChatIcon from "@material-ui/icons/Chat";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import {
  checkIfUserExists,
  setRedirectRoom
} from "../../../../utilities/LocalStorage";
import useStyles from "../useStyles";
import { Context } from "../../../../Context";

const Sidebar = () => {
  const [fetching, setFetching] = useState(true);
  const [listItems, setListItems] = useState();
  const { roomID, setRoomID } = useContext(Context);
  const classes = useStyles();

  useEffect(() => {
    setFetching(true);
  }, [roomID]);

  const createListItems = useCallback(
    data => {
      let res = [];
      if (data) {
        // add a button for every room
        for (let room in data) {
          let isSelected = room === roomID;

          res.push(
            <ListItem
              key={room}
              onClick={() => {
                setRoomID(room);
                setRedirectRoom(room);
              }}
              selected={isSelected}
              button
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary={data[room]} />
            </ListItem>
          );
        }
      }

      // add the create button at the end
      res.push(
        <ListItem
          key={"create"}
          onClick={() => {
            window.location.href = "/create";
          }}
          button
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create a new room" />
        </ListItem>
      );

      return res;
    },
    [roomID, setRoomID]
  );

  const fetchListData = useCallback(async () => {
    const userID = checkIfUserExists();
    const getListDataAPIURL = `http://localhost:8001/list-data/${userID}`;
    let res = await axios.get(getListDataAPIURL);
    let data = res.data;
    setListItems(createListItems(data));
    setFetching(false);
  }, [createListItems]);

  useEffect(() => {
    if (fetching) {
      fetchListData();
    }
  }, [fetching, fetchListData]);

  return <List className={classes.sidebarList}>{listItems}</List>;
};

export default Sidebar;
