<template>
  <div v-if="userInfo" class="level">
    <div class="level-display">
      <p id="level-text">Lvl: {{ userInfo.level }}</p></div>

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
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';


export default {
  setup() {
    const { user } = getUser();
    const { document: userInfo } = getDocument("users", user.value.uid);

    const style = ref({ width: "0px" });

    const width = ref(0);

    const color = ref("#ffd75d");

    const toast = useToast();
    const toastMessage = () => {
        toast.add({severity:'info', summary: 'Info Message', detail:'Message Content', life: 3000});
    }

    watchEffect(() => {
      if (userInfo.value) {
        let xp = userInfo.value.xp;
        let next = userInfo.value.nextLevelXp;
        let percent = (xp / next) * 100;
        width.value = percent;
      }
    });

    return { userInfo, user, style, width, color, toastMessage, Toast };
  },
};
</script>

<style>
.level {
  display: flex;
  background-color: var(--primary);
  color: white;
  margin: 0 auto;
  padding: 10px 20px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  justify-content: center;
  max-width: 1200px;
  min-width: 300px;
}
#level-text{
  padding: 12px;
  padding-left: 2%;
  padding-right: 2%;
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