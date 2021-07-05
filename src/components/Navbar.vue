<template>
  <div class="navbar">
    <nav>
      <div id="navbar-top">
        <Avatar
        v-if="user"
          label=""
          size="large"
          shape="circle"
          style="background-color: #ffffff; color: #2196f3"
          >{{ user.displayName[0] }}</Avatar
        >
        <router-link :to="{ name: 'Home' }" class="home-set">
          <img class="home-icon" src="@/assets/cyborg.svg" />
          <h4>
            Evolving <br />
            Cyborgs
          </h4>
        </router-link>
        <MenuBar />
      </div>
      <div class="buttons" v-if="user">
        <div v-if="user"></div>
        <div v-else>
          <router-link class="btn" :to="{ name: 'Login' }">Login</router-link>
          <router-link class="btn" :to="{ name: 'Signup' }">Signup</router-link>
        </div>
      </div>
    </nav>
    <div v-if="user">
      <Level :user="user" />
    </div>
  </div>
</template>

<script>
import useLogout from "@/composables/useLogout";
import getUser from "@/composables/getUser";
import { useRouter } from "vue-router";
import Level from "./Level";
import Avatar from "primevue/avatar";
import { ref } from "vue";
import MenuBar from "@/components/MenuBar";

export default {
  components: {
    Level,
    Avatar,
    MenuBar,
  },
  setup() {
    const { logout } = useLogout();
    const router = useRouter();
    const routeName = ref(router.currentRoute);
    const { user } = getUser();

    const items = ref([
      {
        label: "Logout",
        icon: "el-icon-right",
      },
    ]);

    const handleLogoutClick = async () => {
      await logout();
      router.push({ name: "Login" });
    };

    const handleClick = (tab) => {
      console.log(tab);
    };

    return {
      handleLogoutClick,
      user,
      handleClick,
      items,
      routeName,
    };
  },
};
</script>

<style>
#navbar-top {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-content: center;
}
.navbar {
  background: var(--primary);
}
nav h4 {
  padding-left: 10px;
}
nav a {
  text-decoration: none;
  color: aliceblue;
}
.el-menu a {
  text-decoration: none;
}
nav {
  display: flex;
  padding: 20px;
  padding-bottom: 0px;
  align-items: center;
  text-align: center;
  color: aliceblue;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 0px;
}

.routeName {
  justify-content: center;
}

.buttons {
  margin-left: auto;
  display: inline-block;
}
button,
.btn {
  background: white;
  border: 0px;
  padding: 8px 8px;
  border-radius: 12px;
  margin: 10px 5px;
  color: black;
  font-size: 15px;
}
.home-icon {
  max-width: 50px;
}
.home-set {
  display: flex;
  align-items: center;
}
.home-set h1 {
  margin-left: 20px;
}
.username {
  margin: 10px;
  display: inline-block;
  align-items: center;
}
</style>