<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="!error && !updatedVices" class="loading-spinner"><i class="pi pi-spin pi-spinner" style="fontSize: 2rem"></i></div>
  <div v-if="updatedVices">
    <div v-for="vice in updatedVices" :key="vice.id">
      <Vice :vice="vice" :user="user" @reset="reset" />
    </div>
  </div>
  <form v-if="showForm" autocomplete="off" class="add-form card">
    <span class="p-float-label">
      <InputText id="inputtext" type="text" v-model="newViceName" />
      <label for="inputtext">Vice Name</label>
    </span>
    <div class="add-form-buttons">
      <Button
        @click.prevent="clearNewVice"
        icon="pi pi-times"
        id="bottom-add-form-button"
        class="p-button-rounded p-button-danger"
      />
      <Button
        @click.prevent="createNewVice"
        icon="pi pi-check"
        id="bottom-add-form-button"
        class="p-button-rounded"
      />
    </div>
      
  </form>
  <div v-if="showForm" id="overlay" @click="showForm = false">
  </div>
  <!-- <i
    v-if="!showForm && updatedVices"
    @click="showForm = !showForm"
    class="material-icons new-habit-button"
    >add_circle</i
  >
  <form v-if="showForm" @submit.prevent="createNewVice">
    <input type="text" placeholder="Vice Name" required v-model="newViceName" />
    <div>
      <button>Create</button>
      <button @click.prevent="clearNewVice">Cancel</button>
    </div>
  </form> -->
</template>

<script>
import getUser from "@/composables/getUser";
import getCollection from "@/composables/getCollection";
import useCollection from "@/composables/useCollection";
import useDocument from "@/composables/useDocument";
import Vice from "../components/Vice";
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import { computed, getCurrentInstance, ref, watchEffect } from "vue";

export default {
  components: {
    Button,
    InputText,
    Vice,
  },
  setup() {
    const { user } = getUser();
    const showForm = ref(false);
    const newViceName = ref("");
    const { documents: vices, error } = getCollection(
      "users/" + user.value.uid + "/vices"
    );

    const clearNewVice = () => {
      showForm.value = false;
      newViceName.value = "";
    };

    const reset = async (vice) => {
      const { updateDoc } = useDocument(
        "users/" + user.value.uid + "/vices",
        vice.id
      );

      let now = new Date();
      await updateDoc({
        lastAward: 0,
        stats: {
          history: [{ note: "", time: now.toString() }, ...vice.stats.history],
        },
      });
    };

    watchEffect(() => {
      if (vices.value) {
        let now = new Date();
        vices.value = vices.value.map((vice) => {
          // const { updateDoc } = useDocument(
          //   "users/" + user.value.uid + "/vices",
          //   vice.id
          // );

          let lastTimeNum = Date.parse(vice.stats.history[0].time);

          let diff = now - lastTimeNum;

          let days = Math.floor(diff / (1000 * 60 * 60 * 24));
          diff -= days * 1000 * 60 * 60 * 24;
          let hours = Math.floor(diff / (1000 * 60 * 60));
          diff -= hours * 1000 * 60 * 60;
          let minutes = Math.floor(diff / (1000 * 60));

          return {
            name: vice.name,
            id: vice.id,
            lastAward: vice.lastAward,
            stats: {
              history: [...vice.stats.history],
              timeSinceLast: {
                days: days,
                hours: hours,
                minutes: minutes,
              },
            },
          };
        });
      }
    });

    const updatedVices = computed(() => {
      return vices.value;
    });

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    emitter.on("addButton", toggleShowForm);

    function toggleShowForm() {
      showForm.value = !showForm.value;
    }

    const createNewVice = async () => {
      let now = new Date();
      const newVice = {
        name: newViceName.value,
        lastAward: 0,
        stats: {
          history: [
            {
              note: "Vice Created",
              time: now.toString(),
            },
          ],
        },
      };
      clearNewVice();
      const { addDoc } = useCollection("users/" + user.value.uid + "/vices");
      await addDoc({ ...newVice });
    };

    return {
      updatedVices,
      vices,
      error,
      showForm,
      newViceName,
      clearNewVice,
      createNewVice,
      reset,
      user
    };
  },
};
</script>

<style>
.single-vice {
  background: white;
  padding: 20px;
  margin: 20px auto;
  width: 300px;
  min-height: 225px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid var(--secondary);
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.5);
}
form {
  background: #fff;
}
</style>