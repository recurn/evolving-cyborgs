<template>
  <el-button :plain="true" @click="open">Show message</el-button>
</template>

<script>
export default {
  methods: {
    open() {
      this.$message("This is a message.");
    },
  },
};
</script>

<style>
</style>