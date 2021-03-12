<template>
  <div class="card single-vice">
    <h3>{{ vice.name }}</h3>
    <p>
      {{ vice.stats.timeSinceLast.days }}d {{ vice.stats.timeSinceLast.hours }}h
      {{ vice.stats.timeSinceLast.minutes }}m
    </p>
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
import useDocument from "@/composables/useDocument"
import { getCurrentInstance, onBeforeMount } from "vue";

export default {
  components: {
    Button,
  },
  props: ["vice", "user"],
  setup(props) {
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;

    onBeforeMount(() => {
      const {updateDoc} = useDocument('users/' + props.user.uid + '/vices', props.vice.id)
      let vice = props.vice;
      let days = vice.stats.timeSinceLast.days
      if (vice.lastAward == null) {
        vice.lastAward = 0;
      }
      if (vice.lastAward < days) {
        let xp = 0;
        for (let i = vice.lastAward + 1; i <= days; i++) {
          //maximum extra 200% reward after 20 days
          console.log(i);
          xp += Math.round(25 * Math.min(15,(1 + i * 0.5)));
        }
        emitter.emit("addXp", {xp: xp, message: `For abstaining from ${vice.name} for ${days} days`});
        updateDoc({
          lastAward: days
        })
      }
    });
  },
};
</script>

<style scoped>
.p-button-rounded {
  margin-top: auto;
}
</style>