<template>
  <Navbar />
  <div class="content">
      <router-view/>
  </div>
  <BottomMenu />
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import BottomMenu from '@/components/BottomMenu.vue'

export default {
  components: {Navbar, BottomMenu},
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

min-width: 400px;
}

html, body {
  height: 100%;
  background: #f6f7f2;
}

body {
  display: flex;
  flex-direction: column;
}
.content{
  flex: 1;
  padding-bottom: 80px;
  padding-top: 20px;
}

.footer{
  overflow: hidden;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
