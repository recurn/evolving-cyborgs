<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="habits">
    <div
      class="habit-container"
      v-for="(habit, index) in habits"
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
            handleCheckoff(habit);
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
import useDocument from "@/composables/useDocument";
import getCollection from "@/composables/getCollection"
import useCollection from "@/composables/useCollection"
import {  ref } from "vue";

export default {
  components: {
    Habit,
  },
  setup() {
    const { user } = getUser();
    const showForm = ref(false);
    const newHabitName = ref("");

    const {documents:habits , error} = getCollection("users/" + user.value.uid + "/habits")

    const { deleteDoc, updateDoc, isPending, error: useError } = useDocument(
      "users",
      user.value.uid
    );

    const handleCheckoff = async (habit) => {
      console.log(habit)

      const {updateDoc} = useDocument("users/" + user.value.uid + "/habits", habit.id)
      let newHabit = null;
      if (habit.status == 0) {
        newHabit = {
          name: habit.name,
          status: 1,
          stats: {
            streak: habit.stats.streak += 1,
            history: [...habit.stats.history, Date.now()],
          },        
          showEditButtons: false,
        };
      }
      else {
        let newhistory = habit.stats.history.splice(0,-1);
        newHabit = {
          name: habit.name,
          status: 0,
          stats: {
            streak: habit.stats.streak -= 1,
            history: [...newhistory]
          },
          showEditButtons: false,
        };
      }

      await updateDoc(newHabit);
    };

    const clearNewHabit = () => {
      showForm.value = false;
      newHabitName.value = "";
    };

    const toggleShowEdit = (habit) => {
      habit.showEditButtons = !habit.showEditButtons;
    };

    const createNewHabit = async () => {
      console.log(habits.value)
      const newHabit = {
        name: newHabitName.value,
        status: 0,
        stats: {
          streak: 0,
          history: []
        },
        showEditButtons: false,
      };
      clearNewHabit();

      const {addDoc} = useCollection("users/" + user.value.uid + "/habits")
      await addDoc({...newHabit})
    };

    const handleHabitDelete = async (i) => {
      if (
        confirm("Deleting a habit is permanent and cannot be undone. Continue?")
      ) {
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
      habits,
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