<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="!error && !habits" class="loading-spinner">
    <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
  </div>
  <transition-group
    tag="div"
    name="list"
    appear
    v-if="habits"
    class="habit-container"
  >
    <div v-for="habit in habits" :key="habit.name">
      <Habit
        :habit="habit"
        :user="user.uid"
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
        @update="
          () => {
            handleHabitUpdate(habit);
          }
        "
        @checkoff="
          () => {
            handleCheckoff(habit);
          }
        "
      />
    </div>
  </transition-group>
  <form v-if="showForm" class="add-form card" autocomplete="off">
    <span class="p-float-label">
      <InputText id="inputtext" type="text" v-model="newHabitName" />
      <label for="inputtext">Habit Name</label>
    </span>
    <div class="add-form-buttons">
      <Button
        @click.prevent="clearNewHabit"
        icon="pi pi-times"
        id="bottom-add-form-button"
        class="p-button-rounded p-button-danger"
      />
      <Button
        @click.prevent="createNewHabit"
        icon="pi pi-check"
        id="bottom-add-form-button"
        class="p-button-rounded"
      />
      <!-- <Button class="p-button-danger"  @click.prevent="clearNewHabit">Cancel</Button>
      <Button id="bottom-add-form-button">Create</Button> -->
    </div>
  </form>
  <div v-if="showForm" id="overlay" @click="showForm = false"></div>
  <form v-if="showUpdate" class="add-form card" autocomplete="off">
    <span class="p-float-label">
      <input type="text" v-model="showUpdate.name" />
      <!-- <label for="inputtext">Habit Name</label> -->
    </span>
    <div class="habit-update">
      <div v-for="att in showUpdate.attributes" :key="att.name">
        <select v-model="att.name">
          <option>None</option>
          <option v-for="userAtt in attributes" :key="userAtt.index">
            {{ userAtt.name }}
          </option>
        </select>
        <input type="number" v-model="att.percent">%
        <Button
          @click.prevent="
            showUpdate.attributes = showUpdate.attributes.filter(
              (item) => item !== att
            )
          "
          icon="pi pi-minus"
          id="bottom-add-form-button"
          class="p-button-rounded p-button-danger"
        />
      </div>
      <Button
        @click.prevent="showUpdate.attributes.push({})"
        icon="pi pi-plus"
        id="bottom-add-form-button"
        class="p-button-rounded"
      />
    </div>
    <div class="add-form-buttons">
      <Button
        @click.prevent="showUpdate = false"
        icon="pi pi-times"
        id="bottom-add-form-button"
        class="p-button-rounded p-button-danger"
      />
      <Button
        @click.prevent="updateHabit(showUpdate)"
        icon="pi pi-check"
        id="bottom-add-form-button"
        class="p-button-rounded"
      />
      <!-- <Button class="p-button-danger"  @click.prevent="clearNewHabit">Cancel</Button>
      <Button id="bottom-add-form-button">Create</Button> -->
    </div>
  </form>
  <div v-if="showUpdate" id="overlay" @click="showUpdate = false"></div>
</template>

<script>
import Habit from "@/components/Habit.vue";
import getUser from "@/composables/getUser";
import useDocument from "@/composables/useDocument";
import getCollection from "@/composables/getCollection";
import useCollection from "@/composables/useCollection";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

import { getCurrentInstance, onBeforeUpdate, ref } from "vue";

export default {
  components: {
    Habit,
    InputText,
    Button,
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
          
          if(!habit.attributes){
            habit.attributes = [];
          }

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
              now.setDate(now.getDate() - 1);
              while (now.getTime() > day_2.getTime()) {
                day_2.setDate(day_2.getDate() + 1);
                newHabit.stats.history.push({
                  status: 0,
                  time: day_2.toString(),
                });
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

    const { documents: attributes } = getCollection(
      "users/" + user.value.uid + "/attributes"
    );

    const handleCheckoff = async (habit) => {
      const { updateDoc } = useDocument(
        "users/" + user.value.uid + "/habits",
        habit.id
      );

      let newHabit = null;
      let xp = 5;
      if (habit.status == 0) {
        newHabit = {
          name: habit.name,
          status: 1,
          stats: {
            streak: (habit.stats.streak += 1),
            score: habit.stats.score,
            history: [
              ...habit.stats.history,
              { status: 1, time: new Date().toString() },
            ],
          },
          showEditButtons: false,
        };
      } else {
        xp = Math.round(
          -habit.stats.streak * (1 + habit.stats.score / 100) * 10
        );
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

      if (newHabit.status == 1) {
        xp = Math.round(
          newHabit.stats.streak * (1 + newHabit.stats.score / 100) * 10
        );
      }
      emitter.emit("addXp", {
        xp: xp,
        message: `For completing ${habit.name}`,
        stats: habit.linkedStats,
      });

      habit.attributes.forEach((att) => {
        let attribute = attributes.value.find((a) => a.name == att.name);
        emitter.emit("addStatXp", {
          xp: (xp * att.percent) / 100,
          stat: attribute,
        });
      });

      // const {gainLevel, level} =  addXp(userInfo.value, xp, user.value.uid);

      // if (gainLevel) {

      //   emitter.emit('level-up', level);
      // }
      await updateDoc(newHabit);
    };

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    emitter.on("addButton", toggleShowForm);

    function toggleShowForm() {
      showForm.value = !showForm.value;
    }

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

    const showUpdate = ref(false);

    const handleHabitUpdate = async (habit) => {
      showUpdate.value = { ...habit };
    };

    const updateHabit = async (habit) => {
      showUpdate.value = false;
      const { updateDoc } = useDocument(
        "users/" + user.value.uid + "/habits",
        habit.id
      );

      updateDoc(habit);
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
      handleHabitUpdate,
      updateHabit,
      showUpdate,
      toggleShowEdit,
      attributes,
      habits,
    };
  },
};
</script>

<style>
.habit-update{
  display: flex;
  flex-direction: column;
}
.habit-update div{
  align-content: center;
  display: flex;
  justify-content: flex-start;
  height: 40px;
  margin: 10px 0px;
}
.habit-update input {
  max-width: 50px;
}

.loading-spinner,
.loading-spinner i {
  margin: 0 auto;
  padding: 0;
}
.loading-spinner {
  width: 32px;
}
.habit-container {
  display: block;
  margin: 0 auto;
}
.single-habit {
  background: white;
  padding: 20px;
  margin: 20px auto;
  width: 300px;
  /* min-height: 225px; */
  max-width: 90%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid var(--secondary);
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.5);
}
.add-form {
  position: fixed;
  padding: 20px;
  width: 300px !important;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}
#bottom-add-form-button {
  margin: 10px auto;
}
#overlay {
  height: 150%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #00000073;
  z-index: 2;
}
.add-form-buttons {
  display: flex;
  justify-content: space-between;
}
.p-float-label {
  margin: 20px 0px !important;
}
.habit-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: row;
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
  max-width: 300px;
}
button {
  display: inline-block;
}
.edit-habit.delete,
.edit-habit.edit {
  font-size: 20px;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-enter-active {
  transition: all 0.4s ease;
}
.list-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}
</style>
