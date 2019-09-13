import React, { useState } from "react";
import { getRooms, getRedirectRoom } from "./utilities/LocalStorage";

export const Context = React.createContext();

export const ContextProvider = ({ children }) => {
  const rooms = getRooms();
  const redirectRoom = getRedirectRoom();
  const initRoom = redirectRoom
    ? redirectRoom
    : rooms
    ? rooms.split(",")[0]
    : null;
  const [roomID, setRoomID] = useState(initRoom);

  return (
    <Context.Provider value={{ roomID, setRoomID }}>
      {children}
    </Context.Provider>
  );
};
