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
  return getItem("userID");
};

const addRoom = () => {};

export { createShortID, createID, createUser, checkIfUserExists, addRoom };
