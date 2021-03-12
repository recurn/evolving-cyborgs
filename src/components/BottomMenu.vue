<template>
  <div v-if="user" class="footer">
    <div class="footer-menu">
      <div class="footer-content">
        <TabMenu :model="items" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import TabMenu from "primevue/tabmenu";
import { useRouter } from "vue-router";
import getUser from "@/composables/getUser";

export default {
  components: {
    TabMenu,
  },
  setup() {
    const {user} = getUser();
    const activeIndex = ref("");

    const router = useRouter();
    const backgroundMenu = ref("#0589f5");

    const tabPosition = ref("left");

    const showMenu = ref(false);

    const handleClick = (tab) => {
      router.push({ name: tab.props.label });
    };

    const items = [
      { label: "List", icon: "pi pi-check-square", to: "/checklist" },
      { label: "Habits", icon: "el-icon-finished", to: "/habits" },
      { label: "Vices", icon: "el-icon-no-smoking", to: "/vices" },
      { label: "Friends", icon: "pi pi-heart", to: "/friends" },
      

    ];

    return {
      activeIndex,
      backgroundMenu,
      tabPosition,
      handleClick,
      showMenu,
      items,
      user,
    };
  },
};
</script>

<style>
.footer{
  background: white;
}
.footer-menu {
  height: 56px;
  border-top: 2px solid rgba(0, 0, 0, 0.05);

}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 5px;
  display: flex;
  justify-content: center; 
}
.main-footer button {
  background: var(--primary);
}
.main-footer button:focus {
  outline: none;
}
.main-footer i {
  color: white;
}
.p-tabmenu-nav a {
  display: flex;
  flex-direction: column;
  justify-content: center !important;
  align-items: center !important;
  padding-top: 0px;
}

a.p-menuitem-link {
  padding: 10px !important;

} 
a.p-menuitem-link span.p-menuitem-icon{
  width: 10px !important;
}

*:focus {
  outline: none !important;
  box-shadow: none !important;
}
</style>