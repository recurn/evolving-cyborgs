<template>
  <div v-if="activities && activities.length > 0">
    <div v-for="activity in activities" :key="activity.id">
      <div class="card">
        {{ activity.name }}
        <div class="attributes">
          <div v-for="att in activity.attributes" :key="att.name">
            <img
              :src="'img/icons/stats/' + att.name + '.svg'"
              :alt="att.name"
            />
          </div>
        </div>
        <div>Total Times: {{ activity.history.length }}</div>
        <Button
          icon="pi pi-check"
          class="p-button-rounded"
          @click="
            () => {
              handleCheckActivity(activity);
            }
          "
        >
        </Button>
      </div>
    </div>
  </div>
  <form v-if="showForm" autocomplete="off">
    <span>
      <input
        id="inputtext"
        type="text"
        v-model="newActivity.name"
        placeholder="Activity Name"
      />
    </span>
    <!-- TODO: Switch this into its own component (on Habits too!) -->
    <div v-for="att in newActivity.attributes" :key="att.name">
      <select v-model="att.name">
        <option>None</option>
        <option v-for="userAtt in attributes" :key="userAtt.index">
          {{ userAtt.name }}
        </option>
      </select>
      <input type="number" v-model="att.percent" />%
      <Button
        @click.prevent="
          newActivity.attributes = newActivity.attributes.filter(
            (item) => item !== att
          )
        "
        icon="pi pi-minus"
        id="bottom-add-form-button"
        class="p-button-rounded p-button-danger"
      />
    </div>
    <Button
      @click.prevent="newActivity.attributes.push({})"
      icon="pi pi-plus"
      id="bottom-add-form-button"
      class="p-button-rounded"
    />
    <Button @click="handleCreateActivity">Create</Button>
    <Button @click="clearNewActivity">Clear</Button>
  </form>
</template>

<script>
import getUser from "@/composables/getUser";
import Button from "primevue/button";
import useDocument from "@/composables/useDocument";
import useCollection from "@/composables/useCollection";
import getCollection from "@/composables/getCollection";
import { getCurrentInstance, ref } from "@vue/runtime-core";
//import Button from "primevue/button";
export default {
  components: { Button },
  setup() {
    const { user } = getUser();
    const { documents: activities } = getCollection(
      "users/" + user.value.uid + "/activities"
    );
    const { documents: attributes } = getCollection(
      "users/" + user.value.uid + "/attributes"
    );

    const { addDoc: addActivity } = useCollection(
      "users/" + user.value.uid + "/activities"
    );

    const internalInstance = getCurrentInstance();
    const emitter = internalInstance.appContext.config.globalProperties.emitter;
    emitter.on("addButton", toggleShowForm);

    const showForm = ref(false);

    function toggleShowForm() {
      showForm.value = !showForm.value;
    }

    const newActivity = ref({ name: "", attributes: [] });
    const handleCreateActivity = () => {
      let newAttributes = newActivity.value.attributes.map((att) => {
        let currentAtt = attributes.value.filter(
          (item) => item.name == att.name
        )[0];
        return {
          id: currentAtt.id,
          name: currentAtt.name,
          percent: att.percent,
        };
      });
      addActivity({
        name: newActivity.value.name,
        attributes: [...newAttributes],
        history: [],
      });
      clearNewActivity();
    };

    const clearNewActivity = () => {
      newActivity.value = { name: "", attributes: [] };
      showForm.value = false;
    };

    const handleCheckActivity = (activity) => {
      const { updateDoc: updateActivity } = useDocument(
        "users/" + user.value.uid + "/activities",
        activity.id
      );
      let now = new Date();
      let newHistory = activity.history;
      newHistory.push({
        time: now.toString(),
        comment: "",
      });

      updateActivity({
        history: newHistory,
      });

      let xp = 100

      emitter.emit("addXp", {
        xp: xp,
        message: `For completing ${activity.name}`
      });

      activity.attributes.forEach((att) => {
        let attribute = attributes.value.find((a) => a.name == att.name);
        emitter.emit("addStatXp", {
          xp: (xp * att.percent) / 100,
          stat: attribute,
        });
      });
    };

    return {
      user,
      activities,
      showForm,
      handleCreateActivity,
      newActivity,
      clearNewActivity,
      attributes,
      addActivity,
      handleCheckActivity,
    };
  },
};
</script>

<style></style>
