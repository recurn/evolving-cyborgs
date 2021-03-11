<template>
  <Toast position="top-center" />
  <Navbar />
  <div class="content">
    <router-view />
  </div>
  <BottomMenu />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import BottomMenu from "@/components/BottomMenu.vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { getCurrentInstance, onBeforeUnmount } from "vue";
import getUser from "@/composables/getUser";
import useDocument from "@/composables/useDocument";
import getDocument from "@/composables/getDocument";

export default {
  components: { Navbar, BottomMenu, Toast },
  setup() {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    const toast = useToast();

    const { user } = getUser();

    const { document: userInfo } = getDocument("users", user.value.uid);

    onBeforeUnmount(() => {
      emitter.off("addXp");
    });

    emitter.on("addXp", (info) => {
      if (info.xp > 0) {
        toast.add({
          severity: "success",
          summary: `You earned ${info.xp} xp`,
          detail: `${info.message}`,
          life: 3000,
        });
      }
      addXp(info.xp, userInfo.value);
    });

    const addXp = (newXp, userInfo) => {
      const { updateDoc } = useDocument("users", userInfo.id);
      //console.log(userInfo)
      const { xp, level, nextLevelXp } = levelUp(
        newXp,
        userInfo.xp,
        userInfo.level,
        userInfo.nextLevelXp
      );

      updateDoc({ xp, level, nextLevelXp });
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
        nextLevelXp = Math.round(level ** 1.5 + level * 9) * 10;
        gainLevel = true;
      }

      if (xp < 0 && level > 1) {
        level -= 1;
        nextLevelXp = Math.round(level ** 1.5 + level * 9) * 10;
        xp += nextLevelXp;
      }

      if (gainLevel) {
        alert(`Congratulations, you are now level ${level}`);
      }

      xp = Math.round(xp);

      return { xp, level, nextLevelXp };
    };
  },
  mounted() {
    // this.emitter.on("addXp", (xp, message) => {
    //   const toast = useToast();
    //   toast.add({severity: 'success', summary: `You earned ${xp} xp`, detail: `${message}`, life: 2000})
    //   console.log(message, xp);
    // })
    this.emitter.on("send-message", (message) => {
      this.$message({
        message: `Congrats, you earned ${message} xp.`,
        type: "success",
      });
    });
    this.emitter.on("level-up", (level) => {
      this.$alert(`You are now level ${level}`, "Congratulations!", {
        confirmButtonText: "OK",
      });
    });
  },
};
</script>

<style>
#app {
  min-width: 400px;
}

html,
body {
  height: 100%;
  background: #f6f7f2;
}

body {
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  padding-bottom: 80px;
  padding-top: 20px;
}

.footer {
  overflow: hidden;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
