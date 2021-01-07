<template>
  <div class="navbar">
    <nav>
      <router-link :to="{ name: 'Home' }" class="home-set">
        <img class='home-icon' src="@/assets/001-cyborg.png" />
        <h1>Evolving Cyborgs</h1>
      </router-link>
      <div class="buttons">
        <div v-if="user">
          <button @click="handleLogoutClick">Logout</button>
        </div>
        <div v-else>
          <router-link  class="btn" :to="{ name: 'Login' }">Login</router-link>
          <router-link  class="btn" :to="{ name: 'Signup' }">Signup</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import useLogout from "@/composables/useLogout";
import getUser from "@/composables/getUser";
import { useRouter } from "vue-router";

export default {
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
  align-items: center;
  color: aliceblue;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.buttons {
  margin-left: auto;
}
button, .btn{
    background: white;
    border: 0px;
    padding: 10px;
    border-radius: 12px;
    margin: 0 10px;
    color: black;
    font-size: 15px;
}
.home-icon{
    max-width: 50px;
}
.home-set {
    display: flex;
    align-items: center;
}
.home-set h1 {
    margin-left: 20px;
}
</style>