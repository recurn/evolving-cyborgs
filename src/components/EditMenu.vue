<template>
  <Button
    type="button"
    class="edit-menu p-button-rounded p-button-text p-button-sm"
    icon="pi pi-ellipsis-v"
    @click="toggle"
    aria-haspopup="true"
    aria-controls="edit-menu"
  />
  <Menu id="edit-menu" ref="menu" :model="items" :popup="true" />  
</template>

<script>
import Menu from "primevue/menu";
import Button from "primevue/button";

export default {
  components: {
    Menu,
    Button,
  },
  emits: ["delete", "update"],
  data() {
    return {
      items: [
        {
          label: "Update",
          icon: "pi pi-refresh",
          command: () => {
            this.$emit("update")
          },
        },
        {
          label: "Delete",
          icon: "pi pi-times",
          command: () => {
            this.$emit("delete")
          },
        },
      ],
    };
  },

  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>

<style>
#edit-menu{
    max-width: 100px !important;
}
</style>