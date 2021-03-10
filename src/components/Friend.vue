<template>
    <div class="card" v-if="friendRef">
        <h3>{{friendRef.displayName}}</h3>
        <div class="level-display">
      <p id="level-text">Lvl: {{ friendRef.level }}</p></div>

      <el-progress
        :text-inside="true"
        :color="color"
        :stroke-width="20"
        :percentage="width"
        status="exception"
      >
        <span>{{ friendRef.xp }}/{{ friendRef.nextLevelXp }}</span>
      </el-progress>
  </div>
</template>

<script>
import getDocument from '@/composables/getDocument'
//import getUser from '@/composables/getUser'
import { ref, watchEffect } from 'vue';

export default {
    props: ["friend"],
    setup(props){

        const {document: friendRef} = getDocument('users/', props.friend.userId)

         const width = ref(0);

        const color = ref("#ffd75d");

        watchEffect(() => {
      if (friendRef.value) {
        let xp = friendRef.value.xp;
        let next = friendRef.value.nextLevelXp;
        let percent = (xp / next) * 100;
        width.value = percent;
      }
    });



        return {friendRef, width, color}
    }
}
</script>

<style>

</style>