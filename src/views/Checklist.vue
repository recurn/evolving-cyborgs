<template>
  <div v-if="error">{{ error }}</div>
  <div v-if="!error && !checks" class="loading-spinner">
    <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
  </div>
  <div v-if="checks">
    <div v-for="check in checks" :key="check.name">
      <div class="card checkList-card">
        <div id="checklist-info">
          <h3>{{ check.name }}</h3>
          <EditMenu
            @delete="
              () => {
                handleCheckoffDelete(check);
              }
            "
          />
        </div>
        <div>
          <Button
            v-if="check.status == 1"
            icon="pi pi-check"
            @click="
              () => {
                toggleCheck(check);
              }
            "
          />
          <Button
            v-if="check.status == 0"
            icon="pi pi-minus"
            @click="
              () => {
                toggleCheck(check);
              }
            "
            class="p-button-outlined p-button-plain"
          />
          <!-- <i
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
          > -->
        </div>
      </div>
    </div>
  </div>

  <form v-if="showForm" autocomplete="off" class="add-form card">
    <span class="p-float-label">
      <InputText id="inputtext" type="text" v-model="newCheckName" />
      <label for="inputtext">Item Name</label>
    </span>
    <div class="add-form-buttons">
      <Button
        @click.prevent="clearNewCheck"
        icon="pi pi-times"
        id="bottom-add-form-button"
        class="p-button-rounded p-button-danger"
      />
      <Button
        @click.prevent="createNewCheck"
        icon="pi pi-check"
        id="bottom-add-form-button"
        class="p-button-rounded"
      />
    </div>
  </form>
  <div v-if="showForm" id="overlay" @click="showForm = false"></div>
</template>

<script>
import getUser from "@/composables/getUser";
import useDocument from "@/composables/useDocument";
import getCollection from "@/composables/getCollection";
import useCollection from "@/composables/useCollection";
import EditMenu from "@/components/EditMenu.vue";
// import getDocument from "@/composables/getDocument";
// import addXp from "@/composables/useXp";
import { getCurrentInstance, onBeforeUpdate, ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
//import {timestamp} from "@/firebase/config"

export default {
  components: {
    Button,
    InputText,
    EditMenu,
  },
  setup() {
    const { user } = getUser();
    const newCheckName = ref("");
    const showForm = ref(false);

    const { documents: checks, error } = getCollection(
      "users/" + user.value.uid + "/checkList"
    );

    const handleCheckoffDelete = async (check) => {
      if (
        confirm("Deleting a item is permanent and cannot be undone. Continue?")
      ) {
        const { deleteDoc } = useDocument(
          "users/" + user.value.uid + "/checkList",
          check.id
        );
        await deleteDoc();
      }
    };

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
    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    emitter.on("addButton", toggleShowForm);

    function toggleShowForm() {
      showForm.value = !showForm.value;
    }

    const clearNewCheck = () => {
      showForm.value = false;
      newCheckName.value = "";
    };

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
      clearNewCheck,
      handleCheckoffDelete,
    };
  },
};
</script>

<style>
.checkList-card {
  margin-bottom: 15px !important;
  display: flex;
  justify-content: space-between;
  flex-direction: row !important;
  text-align: center;
}

.checkList-card div {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>