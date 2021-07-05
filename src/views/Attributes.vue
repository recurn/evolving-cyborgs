<template>
  <div class="card" id="stats-card" v-if="userInfo">
    <div v-if="stats && stats.length > 0">
      <div v-for="stat in stats" :key="stat.id">
        <Stat :stat="stat" :name="stat.name" />
      </div>
    </div>
    <div id="stat-buttons" v-else-if="stats && stats.length == 0">
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
import useCollection from "@/composables/useCollection";
import getCollection from "@/composables/getCollection";
import Button from "primevue/button";
import Stat from "@/components/Stat.vue";

export default {
  components: { Stat, Button },
  setup() {
    const { user } = getUser();
    const { document: userInfo } = getDocument("users", user.value.uid);
    const { documents: stats, error: collectionError } = getCollection(
      "users/" + user.value.uid + "/attributes"
    );

    const { isPending, addDoc } = useCollection(
      "users/" + user.value.uid + "/attributes"
    );



    const initializeStats = () => {
      addDoc({ index: 0, name: "Strength", level: 1, xp: 0, nextLevelXp: 100 });
      addDoc({ index: 1, name: "Dexterity", level: 1, xp: 0, nextLevelXp: 100 });
      addDoc({
        index: 2,
        name: "Constitution",
        level: 1,
        xp: 0,
        nextLevelXp: 100,
      });
      addDoc({
        index: 3,
        name: "Intelligence",
        level: 1,
        xp: 0,
        nextLevelXp: 100,
      });
      addDoc({ index: 4, name: "Wisdom", level: 1, xp: 0, nextLevelXp: 100 });
      addDoc({ index: 5, name: "Charisma", level: 1, xp: 0, nextLevelXp: 100 });
    };

    return { isPending, userInfo, collectionError, initializeStats, stats };
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