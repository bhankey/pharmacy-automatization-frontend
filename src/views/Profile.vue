<template>
  <div class="container">
    <header class="jumbotron">
      <h3>User profile page</h3>
    </header>
    <p>
      <strong>ID:</strong>
      {{currentUser?.id}}
    </p>
    <p>
      <strong>Name:</strong>
      {{currentUser?.name ?? "empty"}}
    </p>
    <p>
      <strong>Surname:</strong>
      {{currentUser?.surname ?? "empty"}}
    </p>
    <p>
      <strong>Email:</strong>
      {{currentUser?.email}}
    </p>
    <p>
      <strong>Role:</strong>
      {{currentUser?.role}}
    </p>
  </div>
</template>
<script>
export default {
  name: 'ProfilePage',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  // watch: {
  //   user: function () {
  //     return this.$store.state.auth.user;
  //   }
  // },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>