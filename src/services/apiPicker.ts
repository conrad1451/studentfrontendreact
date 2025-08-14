export const apiPicker = (theChoice: number) => {
  const choice1 = import.meta.env.VITE_API_PY_URL;
  const choice2 = import.meta.env.VITE_API_GO_URL;

  if (theChoice === 1) {
    return choice1;
  } else {
    // return String(choice2 + "?teacherID=" + theToken);
    return choice2;
  }
};
