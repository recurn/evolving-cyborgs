<template>
  <div class="card single-habit">
        <div class="habit-top">
          <h2 class="habit-name">{{ habit.name }}</h2>
          <i
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
          >
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
export default {
    props: ["habit"],
}
</script>

<style>
.habit-info {
  padding: 10px 0px;
  display: flex;
  align-items: center;
}
.habit-info p {
  padding: 0px 5px;
}
</style>