<template>
  <Navbar />
  <div class="content">
      <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {Navbar},
  mounted() {
    this.emitter.on("send-message", message => {
      this.$message({
          message: `Congrats, you earned ${message} xp.`,
          type: 'success'
        });
    })
    this.emitter.on('level-up', level => {
      this.$alert(`You are now level ${level}`, 'Congratulations!', {
          confirmButtonText: 'OK'
        });
    })
  }  
}
</script>

<style>
#app{
background: #f6f7f2;
min-width: 400px;
}

footer{
  min-width: 400px;
}
</style>
