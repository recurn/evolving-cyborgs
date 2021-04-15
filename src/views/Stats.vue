<template>
  <div class="card" id="stats-card" v-if="userInfo">
    <div v-if="userInfo.stats">
      <div v-for="stat in userInfo.stats" :key="stat">
        <Stat :stat="stat" :name="stat.name" />
      </div>
    </div>
    <div id="stat-buttons" v-else>
      <Button @click="initializeStats">Add Default</Button>
      <br />
      <!-- Feature not yet added
        <Button>Create New</Button> -->
    </div>
  </div>
</template>

<script>
import getUser from "@/composables/getUser";
import getDocument from "@/composables/getDocument";
import useDocument from "@/composables/useDocument";
import Button from "primevue/button";
import Stat from "@/components/Stat.vue";

export default {
  components: { Stat, Button },
  setup() {
    const { user } = getUser();
    const { document: userInfo } = getDocument("users", user.value.uid);

    const { updateDoc, isPending, error: useError } = useDocument(
      "users",
      user.value.uid
    );

    const initializeStats = () => {
      updateDoc({
        stats: [
          { name: "Strength", level: 1, xp: 0, nextLvlXp: 10 },
          { name: "Dexterity", level: 1, xp: 0, nextLvlXp: 10 },
          { name: "Constitution", level: 1, xp: 0, nextLvlXp: 10 },
          { name: "Intelligence", level: 1, xp: 0, nextLvlXp: 10 },
          { name: "Wisdom", level: 1, xp: 0, nextLvlXp: 10 },
          { name: "Charisma", level: 1, xp: 0, nextLvlXp: 10 },
        ],
      });
    };

    return { isPending, userInfo, useError, initializeStats };
  },
};
</script>

<style>
#stat-buttons button {
  margin: 10px 0px;
}
#stats-card {
  display: flex;
  align-items: center;
}
#stats-card img {
  text-align: center;
  margin: auto 10px;
  width: 50px;
  height: 50px;
  position: absolute;
  left: 50%;
  transform: translateX(-70%);
  opacity: 0.25;
  z-index: -1;
}
.stats-info {
  text-align: center;
  color: black;
}

.el-progress.el-progress--dashboard {
  padding: 0px;
}
</style>