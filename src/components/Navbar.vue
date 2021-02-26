<template>
  <div class="navbar">
    <nav>
        <router-link :to="{ name: 'Home' }" class="home-set">
          <img class="home-icon" src="@/assets/001-cyborg.png" />
        </router-link>

        <h2>Evolving Cyborgs</h2>

        <div class="buttons">
          <div v-if="user">
            <el-button @click="handleLogoutClick" size="small"
              >Logout</el-button
            >
          </div>
          <div v-else>
            <router-link class="btn" :to="{ name: 'Login' }">Login</router-link>
            <router-link class="btn" :to="{ name: 'Signup' }"
              >Signup</router-link
            >
          </div>
        </div>

    </nav>
          <div>
        <Level :user="user" />
      </div>
  </div>
</template>

<script>
import useLogout from "@/composables/useLogout";
import getUser from "@/composables/getUser";
import { useRouter } from "vue-router";
import Level from "./Level";

export default {
  components: {
    Level,
  },
  setup() {
    const { logout } = useLogout();
    const router = useRouter();
    const { user } = getUser();

    const handleLogoutClick = async () => {
      await logout();
      router.push({ name: "Login" });
    };

    return { handleLogoutClick, user };
  },
};
</script>

<style>
.navbar {
  background: var(--primary);
}
nav a {
  text-decoration: none;
  color: aliceblue;
}
nav {
  display: flex;
  padding: 20px;
  padding-bottom: 0px;
  align-items: center;
  color: aliceblue;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 0px;
  justify-content: space-between;
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