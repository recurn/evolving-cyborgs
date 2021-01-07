<template>
  <div class="home">
    <h2>Lol, and you thought I would have more than this done</h2>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
// @ is an alias to /src


export default {
  name: 'Home',
  components: {  },
  beforeMount(){
    const router = useRouter()
    router.push({name: 'Habits'})
  }
}
</script>

<style>
.home{
  margin: 20px;
}
</style>
