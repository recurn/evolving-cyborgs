<template>
  <div class="card single-habit">
        <div class="card-top">
          <h3 class="habit-name">{{ habit.name }}</h3>
          <EditMenu @delete="$emit('delete')"/>
          <!-- <i
            v-if="!habit.showEditButtons"
            @click="$emit('toggle')"
            class="material-icons edit-habit"
            >more_vert</i
          >

         <i
            v-if="habit.showEditButtons"
            @click="$emit('delete')"
            class="material-icons edit-habit delete"
            >delete_forever</i
          > -->
        </div>

        <div class="habit-info">
          <i class="material-icons">fast_forward</i>
          <p>{{habit.stats.streak}}</p>
        </div>
        <div class="habit-info">
          <i class="material-icons">insights</i>
          <p>{{habit.stats.score}}%</p>
        </div>

        <div class="habit-bottom">
          <i
            v-if="habit.status == 1"
            class="material-icons habit-checkbox"
            @click="$emit('checkoff')"
            >check_box</i
          >
          <i
            v-if="habit.status == 0"
            class="material-icons habit-checkbox"
            @click="$emit('checkoff')"
            >check_box_outline_blank</i
          > 
        </div>
      </div>
</template>



<script>
import EditMenu from "@/components/EditMenu.vue"
export default {
    emits: ["delete"],
    components: {EditMenu},
    props: ["habit"],
}
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
.edit-menu {
  display: flex !important;
  align-items: center;
  margin-left: auto !important;
  position: relative !important;
  font-size: 20px;
}
</style>