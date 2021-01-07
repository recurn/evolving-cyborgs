<template>
<div v-if="error">{{ error }}</div>
  <div v-if="document">
    <div v-for="habit in document.habits" :key="habit.name">
        <span class="single-habit">
            <p class="habit-name">{{habit.name}}</p>
            <i v-if="habit.complete" class="material-icons habit-checkbox">check_box</i>
        </span>
    </div>
  </div>
  <div v-else>NO DOC</div>
</template>

<script>
import getUser from "@/composables/getUser";
import getDocument from "@/composables/getDocument";
// import getCollection from "@/composables/getCollection";

export default {
  setup() {
    const { user } = getUser();

    const { document, error } = getDocument("users", user.value.uid);

    console.log(user.value.uid);

    return { user, document, error };
  },
};
</script>

<style>
</style>