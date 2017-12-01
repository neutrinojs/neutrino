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
    <h1>Welcome to <%= data.name %></h1>
  </div>
</template>

<style module>
  .App {
    padding: 20px;
  }
</style>
