<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="!error && !checks" class="loading-spinner">
    <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
  </div>
  <div v-if="checks">
    <div v-for="check in checks" :key="check.name">
      <div class="card checkList-card">
        <div>
          <h2>{{ check.name }}</h2>
        </div>

        <div>
          <i
            v-if="check.status"
            class="material-icons habit-checkbox"
            @click="
              () => {
                toggleCheck(check);
              }
            "
            >check_box</i
          >
          <i
            v-if="!check.status"
            class="material-icons habit-checkbox"
            @click="
              () => {
                toggleCheck(check);
              }
            "
            >check_box_outline_blank</i
          >
        </div>
      </div>
    </div>
  </div>
  <i
    v-if="!showForm && checks"
    @click="showForm = !showForm"
    class="material-icons new-habit-button"
    >add_circle</i
  >
  <form v-if="showForm" @submit.prevent="createNewCheck">
    <input
      type="text"
      placeholder="Item Name"
      required
      v-model="newCheckName"
    />
    <div>
      <button>Create</button>
      <button @click.prevent="clearNewCheck">Cancel</button>
    </div>
  </form>
</template>

<script>
import getUser from "@/composables/getUser";
import useDocument from "@/composables/useDocument";
import getCollection from "@/composables/getCollection";
import useCollection from "@/composables/useCollection";
// import getDocument from "@/composables/getDocument";
// import addXp from "@/composables/useXp";
import { onBeforeUpdate, ref } from "vue";
//import {timestamp} from "@/firebase/config"

export default {
  setup() {
    const { user } = getUser();
    const newCheckName = ref("");
    const showForm = ref(false);

    const { documents: checks, error } = getCollection(
      "users/" + user.value.uid + "/checkList"
    );

    // const { deleteDoc, updateDoc, isPending, error: useError } = useDocument(
    //   "users",
    //   user.value.uid
    // );

    //const { document: userInfo } = getDocument("users", user.value.uid);

    let updateScores = true;

    onBeforeUpdate(() => {
      if (checks.value && updateScores) {
        return checks.value.map((check) => {
          const { updateDoc } = useDocument(
            "users/" + user.value.uid + "/checkList",
            check.id
          );
          let date = new Date(check.lastChecked);
          let day_1 = new Date(date);
          day_1.setHours(0, 0, 0, 0);
          day_1.setDate(date.getDate() + 1);

          let now = new Date();
          now.setHours(0, 0, 0, 0);
          let newCheck = check;
          if (now.getTime() >= day_1.getTime()) {
            newCheck.status = 0;
          } else {
            return check;
          }

          updateDoc(newCheck);
          updateScores = false;
          return newCheck;
        });
      }
    });

    const toggleCheck = async (check) => {
      const { updateDoc } = useDocument(
        "users/" + user.value.uid + "/checkList",
        check.id
      );

      check.status = !check.status;
      if (check.status) {
        check.lastChecked = new Date().toString();
      }

      updateDoc({
        ...check,
      });
    };

    // const handleCheckoff = async (habit) => {
    //   const { updateDoc } = useDocument(
    //     "users/" + user.value.uid + "/habits",
    //     habit.id
    //   );

    //   //let xp = user.value.xp;

    //   let newHabit = null;
    //   let xp = 5;
    //   if (habit.status == 0) {
    //     newHabit = {
    //       name: habit.name,
    //       status: 1,
    //       stats: {
    //         streak: (habit.stats.streak += 1),
    //         score: habit.stats.score,
    //         history: [
    //           ...habit.stats.history,
    //           { status: 1, time: new Date().toString() },
    //         ],
    //       },
    //       showEditButtons: false,
    //     };
    //   } else {
    //     xp =
    //       Math.round(
    //         -habit.stats.streak * (1 + habit.stats.score / 100) * 10
    //       );
    //     let newhistory = habit.stats.history.slice(0, -1);
    //     newHabit = {
    //       name: habit.name,
    //       status: 0,
    //       stats: {
    //         streak: (habit.stats.streak -= 1),
    //         score: habit.score,
    //         history: [...newhistory],
    //       },
    //       showEditButtons: false,
    //     };
    //   }
    //   newHabit.stats.score = getUpdatedscore(newHabit);

    //   if (newHabit.status == 1) {
    //     xp =
    //       Math.round(
    //         newHabit.stats.streak * (1 + newHabit.stats.score / 100) * 10
    //       );
    //   }
    //   emitter.emit("addXp", {xp: xp, message: `For completing ${habit.name}`});

    //   // const {gainLevel, level} =  addXp(userInfo.value, xp, user.value.uid);

    //   // if (gainLevel) {

    //   //   emitter.emit('level-up', level);
    //   // }
    //   await updateDoc(newHabit);
    // };

    // const internalInstance = getCurrentInstance();
    // const emitter = internalInstance.appContext.config.globalProperties.emitter;

    // const getUpdatedscore = (habit) => {
    //   let score = 0;
    //   if (habit.stats.history.length != 0) {
    //     let total = 0;
    //     habit.stats.history.forEach((item) => {
    //       total += item.status;
    //     });
    //     score = Math.round((total / habit.stats.history.length) * 100);
    //   }
    //   return score;
    // };

    const clearNewCheck = () => {
      showForm.value = false;
      newCheckName.value = "";
    };

    // const toggleShowEdit = (habit) => {
    //   habit.showEditButtons = !habit.showEditButtons;
    // };

    const createNewCheck = async () => {
      const newCheck = {
        name: newCheckName.value,
        status: 0,
        lastChecked: new Date().toString(),
      };
      clearNewCheck();

      const { addDoc } = useCollection(
        "users/" + user.value.uid + "/checkList"
      );
      await addDoc({ ...newCheck });
    };

    // const handleHabitDelete = async (habit) => {
    //   if (
    //     confirm("Deleting a habit is permanent and cannot be undone. Continue?")
    //   ) {
    //     const { deleteDoc } = useDocument(
    //       "users/" + user.value.uid + "/habits",
    //       habit.id
    //     );
    //     await deleteDoc();
    //   } else habit.showEditButtons = false;
    // };

    return {
      newCheckName,
      error,
      checks,
      createNewCheck,
      showForm,
      toggleCheck,
    };
  },
};
</script>

<style>
.checkList-card{
  margin-bottom: 15px !important;
  display: flex;
justify-content: space-between;
flex-direction: row !important;    
text-align: center;
}

.checkList-card div {
    display: flex;
    flex-direction: row ;
    }

</style>