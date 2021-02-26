<template>
  <Navbar />
  <div class="content">
      <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {Navbar}
  
}
</script>

<style>
.content{
  width: 100%;
}
#app{
background: #f6f7f2;
min-width: 400px;
}

footer{
  min-width: 400px;
}
</style>
