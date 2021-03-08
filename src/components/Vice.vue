<template>
  <div class="single-vice">
    <h3>{{ vice.name }}</h3>
    <p>
      {{ vice.stats.timeSinceLast.days }}d {{ vice.stats.timeSinceLast.hours }}h {{ vice.stats.timeSinceLast.minutes }}m
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

export default {
  components: {
    Button,
  },
  props: ["vice", "user"],
};
</script>

<style scoped>
.p-button-rounded{
    margin-top: auto;
}
</style>