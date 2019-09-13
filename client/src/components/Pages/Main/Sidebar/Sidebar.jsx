import React, { useState, useCallback, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChatIcon from "@material-ui/icons/Chat";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { checkIfUserExists } from "../../../../utilities/LocalStorage";
import useStyles from "../useStyles";

const Sidebar = () => {
  const [fetching, setFetching] = useState(true);
  const [listItems, setListItems] = useState();
  const classes = useStyles();

  const createListItems = data => {
    let res = [];
    if (data) {
      // add a button for every room
      for (let room in data) {
        res.push(
          <ListItem selected={true} button>
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
      <ListItem button>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Create a New Room" />
      </ListItem>
    );

    return res;
  };

  const fetchListData = async () => {
    const userID = checkIfUserExists();
    const getListDataAPIURL = `http://localhost:8001/list-data/${userID}`;
    let res = await axios.get(getListDataAPIURL);
    let data = res.data;
    setListItems(createListItems(data));
    setFetching(false);
  };

  useEffect(() => {
    if (fetching) {
      fetchListData();
    }
  }, [fetching]);

  return <List className={classes.sidebarList}>{listItems}</List>;
};

export default Sidebar;
