<script>
  export default {
    name: 'App',
    data() {
      return {};
    }
  };
</script>

<template>
  <div :class="$style.App">
    <h1>Welcome to <%= data.directory %></h1>
  </div>
</template>

<style module>
  .App {
    padding: 20px;
  }
</style>
