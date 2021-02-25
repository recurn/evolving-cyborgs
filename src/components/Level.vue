<template>
  <div v-if="userInfo" class="level">
    <p>Level: {{ userInfo.level }} </p>
     <p> XP: {{userInfo.xp}}/{{userInfo.nextLevelXp}}</p>
    <div class="myProgress">
      <div v-bind:style="style"
        id="myBar"
      ></div> 
    </div>
  </div>
</template>

<script>
import getDocument from "@/composables/getDocument";
import getUser from "@/composables/getUser";
import {ref, watchEffect} from 'vue';
export default {
  setup() {
    const { user } = getUser();
    const { document: userInfo } = getDocument("users", user.value.uid);

    const style = ref({width: "0px"});

    watchEffect(() =>{
        if (userInfo.value){
            let xp = userInfo.value.xp;
            let next = userInfo.value.nextLevelXp;
            let percent = xp/next*100;
            setWidth(percent);

        }
    });

    const setWidth = async (percent) => {
        
        let int = 2 * percent;
        
        let newWidth = parseInt(style.value.width.substring(0, style.value.width.length - 2));
        if (int < newWidth){
            style.value.width = int.toString() + "px";
        }
        else {
          let inc = 1;
          while (newWidth < int){
    
              newWidth += inc;
              style.value.width = newWidth.toString() + "px";
              await timeout(8);
          }
        }
        
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    }

    return { userInfo, user, style, setWidth};
  },
};
</script>

<style>
.level {
  text-align: center;
  margin: 0 auto;
  width: 202px;
}
.myProgress {
  height: 15px;
  border: 2px solid white;
  --width: 100%;
  width: var(--width)
}

#myBar {
  height:  12px;
  background-color: white;
}
</style>