<template>
  <div class="footer">
    <el-menu
      v-if="showMenu"
      default-active="1"
      class="el-menu-vertical"
      :router="true"
      >
      <el-menu-item index="Habits">Habits</el-menu-item>
      <el-menu-item index="Vices">Vices</el-menu-item>
    </el-menu>
    <div class="main-footer">
    <div class="footer-content">
    <button @click="showMenu = !showMenu"><i class="material-icons">menu</i></button>
    </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const activeIndex = ref('');

    const router = useRouter();
    const backgroundMenu = ref("#0589f5");

    const tabPosition = ref("left");

    const showMenu = ref(false);

    const handleClick = (tab) => {
      router.push({ name: tab.props.label });
    };

    return {
      activeIndex,
      backgroundMenu,
      tabPosition,
      handleClick,
      showMenu,
    };
  },
};
</script>

<style scoped>
.main-footer {
  height: 60px;
  background: var(--primary);
}
.footer-content{
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 5px;
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
.el-menu-vertical{
    border-top-right-radius: 5px;
    border-right: 2px solid var(--primary);
    border-top: 2px solid var(--primary);
    border-left: 2px solid var(--primary);
    width: 90px;
}
</style>