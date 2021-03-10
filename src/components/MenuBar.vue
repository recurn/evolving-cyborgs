<template>
  <div v-if="user" class="menu-bar">
    <Button
      type="button"
      icon="pi pi-bars"
      class="p-button-lg"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
    <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
  </div>
</template>

<script>
import Menu from "primevue/menu";
import Button from "primevue/button";
import useLogout from "@/composables/useLogout";
import { useRouter } from 'vue-router';
import getUser from '@/composables/getUser'
import { ref } from 'vue';

export default {
  components: { Button, Menu },
  methods: {
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
  setup() {
    const route = useRouter();
    const { logout } = useLogout();
    const {user} = getUser();
    const items = ref([
        {
          label: "Options",
          items: [
            {
              label: "Logout",
              icon: "pi pi-arrow-right",
              command: () => {
                route.push('./login')
                logout();
                
              },
            },
          ],
        },
        {
          label: "Navigate",
          items: [
            {
              label: "Habits", icon: "el-icon-finished", to: "/habits"
            },
            {
              label: "Vices", icon: "el-icon-no-smoking", to: "/vices"
            },
            { label: "Friends", icon: "pi pi-heart", to: "/friends" }
          ],
        },
      ],)

      return {items, user}
  }
};
</script>

<style>
.menu-bar {
  display: flex;
  margin-right: 20px;
  left: 20px;
  z-index: 2;
}
.p-button.p-button-lg{
  background: var(--primary);
  border: none;
}
</style>