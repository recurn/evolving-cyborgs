<template>
  <div>
      <el-progress type="dashboard" :percentage="stat.xp/stat.nextLvlXp * 100">
        <template #default="">
          <img :src="'img/icons/stats/' + name + '.svg'" :alt="name" />
          <div class="stats-info">
            <h1 class="stat-level">{{ stat.level }}</h1>
            <h3 class="stat-label">{{ name }}</h3>
            <span class="percentage-label"
              >xp: {{ stat.xp }}/{{
                stat.nextLvlXp
              }}</span
            >
          </div>
        </template>
      </el-progress>
    </div>
</template>

<script>
export default {
    props: ["stat", "name"],


}
</script>

<style>

</style>