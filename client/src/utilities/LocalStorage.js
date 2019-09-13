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
  return newRoom;
};

const getRooms = () => {
  return localStorage.getItem("roomList");
};

const clearData = () => {
  localStorage.clear();
};

export {
  createShortID,
  createID,
  createUser,
  checkIfUserExists,
  addRoom,
  getRooms,
  clearData
};
