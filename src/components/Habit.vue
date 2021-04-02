<template>
  <div class="card single-habit">
    <div class="card-top">
      <h3 class="habit-name">{{ habit.name }}</h3>
      <EditMenu @delete="$emit('delete')" />
    </div>
    <div class="habit-content">
      <div class="habit-icons">
        <div class="habit-info">
          <i class="material-icons">fast_forward</i>
          <p>{{ habit.stats.streak }}</p>
        </div>
        <div class="habit-info">
          <i class="material-icons">insights</i>
          <p>{{ habit.stats.score }}%</p>
        </div>
      </div>
      <div class="habit-checkoff">
        <transition name="bounce">
          <Button
            v-if="habit.status == 1"
            icon="pi pi-check"
            @click="$emit('checkoff')"
          />
        </transition>
        <Button
          v-if="habit.status == 0"
          icon="pi pi-minus"
          @click="$emit('checkoff')"
          class="p-button-outlined p-button-plain"
        />
      </div>
    </div>
    <!-- <div class="habit-bottom">
      <i
            v-if="habit.status == 1"
            class="material-icons habit-checkbox"
            @click="$emit('checkoff')"
            >check_box</i
          > -->
    <!-- <i
            v-if="habit.status == 0"
            class="material-icons habit-checkbox"
            @click="$emit('checkoff')"
            >check_box_outline_blank</i
          > 
    </div> -->
  </div>
</template>



<script>
import EditMenu from "@/components/EditMenu.vue";
import Button from "primevue/button";
export default {
  emits: ["delete"],
  components: { EditMenu, Button },
  props: ["habit"],
};
</script>

<style>
.card-top {
  display: flex;
  align-items: center;
}
.habit-info {
  padding: 10px 0px;
  display: flex;
  align-items: center;
}
.habit-info p {
  padding: 0px 5px;
}
.habit-checkoff {
  margin-top: auto;
  margin-bottom: 10px;
}
.edit-menu {
  display: flex !important;
  align-items: center;
  margin-left: auto !important;
  position: relative !important;
  font-size: 20px;
}
.habit-icons {
  display: flex;
  flex-direction: column;
}
.habit-content {
  height: 100%;
  margin-bottom: 0px;
  padding-bottom: 0px;
  margin-top: auto !important;
  padding-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}
</style>