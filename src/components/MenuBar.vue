<template>
  <div v-if="user" class="menu-bar">
    <Button
      type="button"
      icon="pi pi-bars"
      class="p-button-lg"
      @click="visibleLeft = true"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
    <Sidebar v-model:visible="visibleLeft" :autoZIndex="false" class="p-sidebar-sm">
      
    <Menu :model="items"/>
    </Sidebar>
    
  </div>
</template>

<script>
import Menu from "primevue/menu";
import Button from "primevue/button";
import useLogout from "@/composables/useLogout";
import { useRouter } from 'vue-router';
import getUser from '@/composables/getUser'
import Sidebar from 'primevue/sidebar';
import { ref } from 'vue';

export default {
  components: { Button, Menu, Sidebar },
  setup() {
    const route = useRouter();
    const { logout } = useLogout();
    const {user} = getUser();
    const visibleLeft = ref(false);

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
              label: "Check List", icon: "pi pi-check-square", to: "/checklist", command: () => {visibleLeft.value = false;}
            },
            {
              label: "Habits", icon: "el-icon-finished", to: "/habits", command: () => {visibleLeft.value = false;}
            },
            {
              label: "Vices", icon: "el-icon-no-smoking", to: "/vices", command: () => {visibleLeft.value = false;}
            },
            { label: "Friends", icon: "pi pi-heart", to: "/friends", command: () => {visibleLeft.value = false;} }
          ],
        },
      ],)

      return {items, user, visibleLeft}
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
.p-menu {
  border: none !important;
  width: 100% !important;
}

.p-menu .p-menuitem-text {
  padding: 5px;
}

.p-sidebar-left.p-sidebar-sm, .p-sidebar-right.p-sidebar-sm {
  width: 200px !important;
}
</style>