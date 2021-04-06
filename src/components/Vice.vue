<template>
  <div class="card single-vice">
    <div class="card-top">
      <h3>{{ vice.name }}</h3>
      <EditMenu @delete="$emit('delete', vice)" />
    </div>

    <p>
      <i class="pi pi-clock" />
      {{ vice.stats.timeSinceLast.days }}d {{ vice.stats.timeSinceLast.hours }}h
      {{ vice.stats.timeSinceLast.minutes }}m
    </p>
    <p>
      <img src="trophy.svg" alt="" style="width: 20px; height: 20px" />
      {{ vice.best.days }}d {{ vice.best.hours }}h {{ vice.best.minutes }}m
    </p>

    <p><i class="pi pi-replay"></i>{{ vice.stats.history.length }}</p>
    <Button
      label="Reset"
      class="p-button-rounded"
      icon="pi pi-replay"
      @click="$emit('reset', vice)"
    ></Button>
  </div>
</template>

<script>
import Button from "primevue/button";
import EditMenu from "@/components/EditMenu.vue";
import useDocument from "@/composables/useDocument";
import { getCurrentInstance, onBeforeMount } from "vue";

export default {
  components: {
    Button,
    EditMenu,
  },
  props: ["vice", "user"],
  setup(props) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    onBeforeMount(() => {
      let vice = props.vice;
      let shouldUpdate = false;
      let now = new Date();

      let lastTimeNum = Date.parse(vice.stats.history[0].time);

      let diff = now - lastTimeNum;

      if (diff > vice.best.time) {
        vice.best.time = diff;
        shouldUpdate = true;
      }

     

      const { updateDoc } = useDocument(
        "users/" + props.user.uid + "/vices",
        props.vice.id
      );

      let days = vice.stats.timeSinceLast.days;
      if (vice.lastAward == null) {
        vice.lastAward = 0;
      }

      if (vice.lastAward < days) {
        shouldUpdate = true;
        let xp = 0;
        for (let i = vice.lastAward + 1; i <= days; i++) {
          //maximum extra 200% reward after 20 days
          xp += Math.round(25 * Math.min(15, 1 + i * 0.5));
        }
        emitter.emit("addXp", {
          xp: xp,
          message: `For abstaining from ${vice.name} for ${days} days`,
        });
      }

      if (shouldUpdate) {
        updateDoc({
          lastAward: days,
          best: {
            time: vice.best.time,
          },
        });
      }
    });
  },
};
</script>

<style scoped>
.p-button-rounded {
  margin-top: auto;
}
img {
  margin: 5px;
}
i {
  font-size: 20px;
  margin: 5px;
}
</style>