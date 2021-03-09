<template>
  <div class="footer">
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
export default {
  components: {
    TabMenu,
  },
  setup() {
    const activeIndex = ref("");

    const router = useRouter();
    const backgroundMenu = ref("#0589f5");

    const tabPosition = ref("left");

    const showMenu = ref(false);

    const handleClick = (tab) => {
      router.push({ name: tab.props.label });
    };

    const items = [
      { label: "Habits", icon: "pi pi-fw pi-check", to: "/habits" },
      { label: "Vices", icon: "pi pi-fw pi-times", to: "/vices" },
    ];

    return {
      activeIndex,
      backgroundMenu,
      tabPosition,
      handleClick,
      showMenu,
      items,
    };
  },
};
</script>

<style>
.footer{
  background: white;
}
.footer-menu {
  height: 52px;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
  z-index: 1;

}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 5px;
  display: flex;
  justify-content: center; 
  z-index: -1;
  position: relative;
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
.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link{
  position: relative;
  z-index: 3;
}

</style>