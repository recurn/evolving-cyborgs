<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="habits">
    <div class="habit-container" v-for="habit in habits" :key="habit.name">
      <Habit
        :habit="habit"
        @toggle="
          () => {
            toggleShowEdit(habit);
          }
        "
        @delete="
          () => {
            handleHabitDelete(habit);
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
import getCollection from "@/composables/getCollection";
import useCollection from "@/composables/useCollection";
import { onBeforeUpdate, ref } from "vue";
//import {timestamp} from "@/firebase/config"

export default {
  components: {
    Habit,
  },
  setup() {
    const { user } = getUser();
    const showForm = ref(false);
    const newHabitName = ref("");

    const { documents: habits, error } = getCollection(
      "users/" + user.value.uid + "/habits"
    );

    const { deleteDoc, updateDoc, isPending, error: useError } = useDocument(
      "users",
      user.value.uid
    );

    let updateScores = true;

    onBeforeUpdate(() => {
      if (habits.value && updateScores) {
        return habits.value.map((habit) => {
          let history = habit.stats.history;
          if (history.length > 0) {
            const { updateDoc } = useDocument(
              "users/" + user.value.uid + "/habits",
              habit.id
            );
            let date = new Date(history[history.length - 1].time);
            let day_1 = new Date(date);
            day_1.setHours(0, 0, 0, 0);
            day_1.setDate(date.getDate() + 1);

            let day_2 = new Date(date);
            day_2.setHours(0, 0, 0, 0);
            day_2.setDate(date.getDate() + 2);

            let now = new Date();
            now.setHours(0, 0, 0, 0);
            let newHabit = habit;
            if (now.getTime() >= day_2.getTime()) {
              newHabit.stats.streak = 0;
              newHabit.status = 0;
              day_2.setDate(date.getDate());
              now.setDate(now.getDate() - 1)
              while (now.getTime() > day_2.getTime()){
                day_2.setDate(day_2.getDate() + 1);
                newHabit.stats.history.push({
                  status: 0,
                  time: day_2.toString(),
                })
              }
            } else if (now.getTime() >= day_1.getTime()) {
              newHabit.status = 0;
            } else {
              return habit;
            }
            newHabit.stats.score = getUpdatedscore(newHabit);
            updateDoc(newHabit);
            updateScores = false;
            return { ...newHabit };
          }
        });

      }
    });

    const handleCheckoff = async (habit) => {
      const { updateDoc } = useDocument(
        "users/" + user.value.uid + "/habits",
        habit.id
      );

      let newHabit = null;
      if (habit.status == 0) {
        newHabit = {
          name: habit.name,
          status: 1,
          stats: {
            streak: (habit.stats.streak += 1),
            score: habit.score,
            history: [
              ...habit.stats.history,
              { status: 1, time: new Date().toString() },
            ],
          },
          showEditButtons: false,
        };
      } else {
        let newhistory = habit.stats.history.slice(0, -1);
        newHabit = {
          name: habit.name,
          status: 0,
          stats: {
            streak: (habit.stats.streak -= 1),
            score: habit.score,
            history: [...newhistory],
          },
          showEditButtons: false,
        };
      }
      newHabit.stats.score = getUpdatedscore(newHabit);

      await updateDoc(newHabit);
    };

    const getUpdatedscore = (habit) => {
      let score = 0;
      if (habit.stats.history.length != 0) {
        let total = 0;
        habit.stats.history.forEach((item) => {
          total += item.status;
        });
        score = Math.round((total / habit.stats.history.length) * 100);
      }
      return score;
    };

    const clearNewHabit = () => {
      showForm.value = false;
      newHabitName.value = "";
    };

    const toggleShowEdit = (habit) => {
      habit.showEditButtons = !habit.showEditButtons;
    };

    const createNewHabit = async () => {
      const newHabit = {
        name: newHabitName.value,
        status: 0,
        stats: {
          streak: 0,
          score: 0,
          history: [],
        },
        showEditButtons: false,
      };
      clearNewHabit();

      const { addDoc } = useCollection("users/" + user.value.uid + "/habits");
      await addDoc({ ...newHabit });
    };

    const handleHabitDelete = async (habit) => {
      if (
        confirm("Deleting a habit is permanent and cannot be undone. Continue?")
      ) {
        const { deleteDoc } = useDocument(
          "users/" + user.value.uid + "/habits",
          habit.id
        );
        await deleteDoc();
      } else habit.showEditButtons = false;
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