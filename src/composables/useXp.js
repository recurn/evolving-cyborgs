import getDocument from "./getDocument"
import useDocument from "./useDocument"

const addXp = (user, newXp) => {
    const {document: userInfo, error} =  getDocument("users", user.uid);
    const {updateDoc} = useDocument("users", user.uid)
    if(error.value){
        console.log("error" , error.value)
    }
    setTimeout(() => {

        
        let {xp, level, nextLevelXp} = levelUp(newXp, userInfo.value.xp, userInfo.value.level, userInfo.value.nextLevelXp);

       updateDoc({xp, level, nextLevelXp})
    }, 20)
}

const levelUp = (newXp, xp, level, nextLevelXp) => {
    if (!xp){
        xp = 0;
        level = 1;
        nextLevelXp = 10;
    }
    xp += newXp;

    while(xp > nextLevelXp){
        level += 1;
        xp -= nextLevelXp;
        nextLevelXp = Math.round(level ** 1.5 + level * 9);
    }

    if (xp < 0){
        xp = 0;
    }

    return {xp, level, nextLevelXp}
}

export default addXp