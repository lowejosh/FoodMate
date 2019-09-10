  
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChatIcon from '@material-ui/icons/Chat';
import AddIcon from '@material-ui/icons/Add';
import { Badge } from '@material-ui/core';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <Badge badgeContent={4} color="secondary">
        <ChatIcon />
        </Badge>
      </ListItemIcon>
      <ListItemText primary="You, Mollie" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ChatIcon />
      </ListItemIcon>
      <ListItemText primary="You, Joshua" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="Create a New Room" />
    </ListItem>
   </div>
);
