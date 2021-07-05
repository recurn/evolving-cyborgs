import { forEach } from "core-js/core/array";
import useDocument from "./useDocument";

const addXp =  (userInfo, newXp, userID, stats) => {
  const { updateDoc } = useDocument("users", userID);

  const { xp, level, nextLevelXp, gainLevel } = levelUp(
    newXp,
    userInfo.xp,
    userInfo.level,
    userInfo.nextLevelXp
  );

  if (stats.length){
    let statsUpdate = userInfo.stats;
    stats.forEach(habitStat => {
      stat = userInfo.stats
      const {xp: statXp, level: statLevel, nextLevelXp: statNextLevelXp, gainLevel: statGainLevel} =
         levelUp(newXp * stat.percent, stat.xp, stat.level, stat.nextLevelXp);
      statsUpdate[stat.index] = {index: stat.index, name: stat.name, level: statLevel, xp: statXp, nextLevelXp: statNextLevelXp}
      console.log(statGainLevel);
    })
    updateDoc({stats: statsUpdate})
  }

  updateDoc({ xp, level, nextLevelXp });

  return {gainLevel, level};
};

const levelUp = (newXp, xp, level, nextLevelXp) => {
  let gainLevel = false;

  if (!xp) {
    xp = 0;
    level = 1;
    nextLevelXp = 100;
  }
  xp += newXp;

  while (xp > nextLevelXp) {
    level += 1;
    xp -= nextLevelXp;
    nextLevelXp = Math.round(level ** 1.5 + level * 9)*10;
    gainLevel = true;
  }

  if (xp < 0 && level > 1) {
    level -= 1;
    nextLevelXp = Math.round(level ** 1.5 + level * 9)*10;
    xp += nextLevelXp;
  }

  xp = Math.round(xp);

  return { xp, level, nextLevelXp, gainLevel };
};

export default addXp;
