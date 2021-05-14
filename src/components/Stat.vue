<template>
  <div>
    <el-progress
      type="dashboard"
      :percentage="(stat.xp / stat.nextLevelXp) * 100"
    >
      <template #default="">
        <img :src="'img/icons/stats/' + name + '.svg'" :alt="name" />
        <div class="stats-info">
          <h1 class="stat-level">{{ stat.level }}</h1>
          <h3 class="stat-label">{{ name }}</h3>
          <span class="percentage-label"
            >xp: {{ stat.xp }}/{{ stat.nextLevelXp }}</span
          >
        </div>
      </template>
    </el-progress>
    <div>
      <Button @click="addXp"> Add XP </Button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import Button from "primevue/button"
export default {
  props: ["stat", "name"],
  components: {Button},
  setup(props) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    const addXp = () => {
      emitter.emit("addStatXp", {xp: 100, stat: props.stat});
    };

    return {addXp}
  },
};
</script>

<style>
</style>