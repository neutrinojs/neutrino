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
        Welcome to <%= data.directory %>
    </div>
</template>

<style module>
    .App {
        padding: 20px;
    }
</style>