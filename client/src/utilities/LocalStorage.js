const createShortID = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};

const createID = () => {
  return createShortID() + createShortID();
};

const createUser = () => {
  const id = createID();
  localStorage.setItem("userID", id);
  return id;
};

const checkIfUserExists = () => {
  return localStorage.getItem("userID");
};

const addRoom = () => {
  let roomList = localStorage.getItem("roomList"); // retrieve room list
  let newRoom = createID();
  if (!roomList) {
    roomList = newRoom + ",";
  } else {
    roomList += newRoom + ",";
  }
  localStorage.setItem("roomList", roomList);
  localStorage.setItem("redirectRoom", newRoom);
  return newRoom;
};

const joinRoom = roomID => {
  let roomList = localStorage.getItem("roomList"); // retrieve room list
  if (!roomList) {
    roomList = roomID + ",";
  } else {
    roomList += roomID + ",";
  }
  localStorage.setItem("roomList", roomList);
  localStorage.setItem("redirectRoom", roomID);
  return roomID;
};

const getRooms = () => {
  return localStorage.getItem("roomList");
};

const clearData = () => {
  localStorage.clear();
};

const getRedirectRoom = () => {
  return localStorage.getItem("redirectRoom");
};

const setRedirectRoom = roomID => {
  localStorage.setItem("redirectRoom", roomID);
};

export {
  setRedirectRoom,
  createShortID,
  createID,
  createUser,
  checkIfUserExists,
  addRoom,
  joinRoom,
  getRooms,
  clearData,
  getRedirectRoom
};
