<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="document">
    <div
      class="habit-container"
      v-for="(habit, index) in document.habits"
      :key="habit.name"
    >
      <Habit
        :habit="habit"
        @toggle="
          () => {
            toggleShowEdit(habit);
          }
        "
        @delete="
          () => {
            handleHabitDelete(index);
          }
        "
        @checkoff="
          () => {
            handleCheckoff(index);
          }
        "
      />
    </div>
  </div>
  <div v-if="!document && !error">Loading...</div>
  <i
    v-if="!showForm"
    @click="showForm = !showForm"
    class="material-icons new-habit-button"
    >add_circle</i
  >
  <form v-if="showForm" @submit.prevent="createNewHabit">
    <input
      type="text"
      placeholder="Habit Name"
      required
      v-model="newHabitName"
    />
    <div>
      <button>Create</button>
      <button @click.prevent="clearNewHabit">Cancel</button>
    </div>
  </form>
</template>

<script>
import Habit from "@/components/Habit.vue";
import getUser from "@/composables/getUser";
import getDocument from "@/composables/getDocument";
import useDocument from "@/composables/useDocument";
import { ref } from "vue";

//import getCollection from "@/composables/getCollection";

export default {
  components: {
    Habit,
  },
  setup() {
    const { user } = getUser();
    const showForm = ref(false);
    const newHabitName = ref("");

    const { document, error } = getDocument("users", user.value.uid);
    const { deleteDoc, updateDoc, isPending, error: useError } = useDocument(
      "users",
      user.value.uid
    );

    const handleCheckoff = async (i) => {
      const habit = document.value.habits[i];
      let newHabit = null;
      if (!habit.complete) {
        newHabit = {
          name: habit.name,
          complete: !habit.complete,
          stats: {
            streak: habit.stats.streak += 1,
            timesCompleted: [...habit.stats.timesCompleted, Date.now()],
          },        
          showEditButtons: false,
        };
      }
      else {
        let newTimesCompleted = habit.stats.timesCompleted.splice(0,-1);
        newHabit = {
          name: habit.name,
          complete: !habit.complete,
          stats: {
            streak: habit.stats.streak -= 1,
            timesCompleted: [...newTimesCompleted]
          },
          showEditButtons: false,
        };
      }
      let habits = document.value.habits;
      habits[i] = newHabit;

      await updateDoc({ habits: habits });
    };

    const clearNewHabit = () => {
      showForm.value = false;
      newHabitName.value = "";
    };

    const toggleShowEdit = (habit) => {
      habit.showEditButtons = !habit.showEditButtons;
      console.log(habit.showEditButtons);
    };

    const createNewHabit = async () => {
      const newHabit = {
        name: newHabitName.value,
        complete: false,
        stats: {
          streak: 0,
          timesCompleted: []
        },
        showEditButtons: false,
      };
      clearNewHabit();
      const habits = document.value.habits;
      await updateDoc({ habits: [...habits, newHabit] });
    };

    const handleHabitDelete = async (i) => {
      if (
        confirm("Deleting a habit is permanent and cannot be undone. Continue?")
      ) {
        console.log("deleting now...");
        let habits = document.value.habits;
        habits.splice(i, 1);
        await updateDoc({ habits: [...habits] });
      } else document.value.habits[i].showEditButtons = false;
    };

    return {
      user,
      document,
      error,
      deleteDoc,
      updateDoc,
      isPending,
      useError,
      handleCheckoff,
      showForm,
      clearNewHabit,
      newHabitName,
      createNewHabit,
      handleHabitDelete,
      toggleShowEdit,
    };
  },
};
</script>

<style>
.habit-container {
  display: block;
}
.single-habit {
  background: var(white);
  padding: 20px;
  margin: 20px auto;
  width: 250px;
  height: 200px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid var(--secondary);
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.5);
}
.habit-top {
  display: flex;
}
.habit-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: row;
}
.edit-habit {
  display: flex;
  margin-left: auto;
  position: relative;
  font-size: 20px;
}
.habit-checkbox {
  font-size: 35px;
}
.habit-checkbox,
.edit-habit {
  cursor: pointer;
}
.new-habit-button {
  font-size: 50px;
  display: block;
  margin: auto auto;
  text-align: center;
  cursor: pointer;
}
form {
  max-width: 250px;
}
button {
  display: inline-block;
}
.edit-habit.delete,
.edit-habit.edit {
  font-size: 20px;
}
</style>