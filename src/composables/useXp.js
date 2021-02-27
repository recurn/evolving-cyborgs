import useDocument from "./useDocument";

const addXp =  (userInfo, newXp, userID) => {
  const { updateDoc } = useDocument("users", userID);

  const { xp, level, nextLevelXp, gainLevel } = levelUp(
    newXp,
    userInfo.xp,
    userInfo.level,
    userInfo.nextLevelXp
  );

  updateDoc({ xp, level, nextLevelXp });

  return {gainLevel, level};
};

const levelUp = (newXp, xp, level, nextLevelXp) => {
  let gainLevel = false;

  if (!xp) {
    xp = 0;
    level = 1;
    nextLevelXp = 10;
  }
  xp += newXp;

  while (xp > nextLevelXp) {
    level += 1;
    xp -= nextLevelXp;
    nextLevelXp = Math.round(level ** 1.5 + level * 9);
    gainLevel = true;
  }

  if (xp < 0 && level > 1) {
    level -= 1;
    nextLevelXp = Math.round(level ** 1.5 + level * 9);
    xp += nextLevelXp;
  }

  xp = Math.round(xp * 100) / 100;

  return { xp, level, nextLevelXp, gainLevel };
};

export default addXp;
