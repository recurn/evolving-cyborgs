<template>
  <div v-if="userInfo" class="level">
    <div class="level-display"><p>Lvl: {{ userInfo.level }}</p></div>

      <el-progress
        :text-inside="true"
        :color="color"
        :stroke-width="20"
        :percentage="width"
        status="exception"
      >
        <span>{{ userInfo.xp }}/{{ userInfo.nextLevelXp }}</span>
      </el-progress>
  </div>
</template>

<script>
import getDocument from "@/composables/getDocument";
import getUser from "@/composables/getUser";
import { ref, watchEffect } from "vue";

export default {
  setup() {
    const { user } = getUser();
    const { document: userInfo } = getDocument("users", user.value.uid);

    const style = ref({ width: "0px" });

    const width = ref(0);

    const color = ref("#ffd75d");

    watchEffect(() => {
      if (userInfo.value) {
        let xp = userInfo.value.xp;
        let next = userInfo.value.nextLevelXp;
        let percent = (xp / next) * 100;
        width.value = percent;
      }
    });

    return { userInfo, user, style, width, color };
  },
};
</script>

<style scoped>
.level {
  display: flex;
  background: #ffd75d;
  background-color: var(--primary);
  color: white;
  margin: 0 auto;
  padding: 10px 20px;
  width: 80%;
  margin-bottom: 0px;
  padding-bottom: 10px;
  justify-content: center;
  max-width: 800px;
  min-width: 400px;
}
.level-display{
  margin-right: auto;
  white-space: nowrap;
  text-align: center;
  padding-top: 1px;
}
.el-progress {
  max-width: 100%;
  width: 100%;
  padding-bottom: 0px;
  padding-left: 10px;
}

.el-progress-bar__innerText span {
  color: #000;
}
</style>