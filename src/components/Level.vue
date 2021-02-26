<template>
  <div v-if="userInfo" class="level">
    <p>Level: {{ userInfo.level }}</p>
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

    const color = ref("white");

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
  text-align: center;
  left: 50%;
  margin-left: -100px;
  width: 200px;
  position: absolute;
}
.el-progress-bar__innerText span {
  color: #000;
}
</style>