<template>
  <div class="single-habit">
        <div class="habit-top">
          <h3 class="habit-name">{{ habit.name }}</h3>
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

        <div class="streak">
          <p>{{habit.stats.streak}}</p>
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

</style>