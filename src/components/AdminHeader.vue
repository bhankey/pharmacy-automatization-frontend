<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/pharmacies" class="navbar-brand">Pharmacy automatization</a>
    <div class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link to="/pharmacies" class="nav-link">Pharmacies</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/users" class="nav-link">Users</router-link>
      </li>
    </div>
    <div v-if="!currentUser" class="navbar-nav ml-auto">
      <li class="nav-item">
        <router-link to="/login" class="nav-link">
          <font-awesome-icon icon="sign-in-alt" /> Login
        </router-link>
      </li>
    </div>

    <div v-if="currentUser" class="navbar-nav ml-auto">
      <li class="nav-item">
        <router-link to="/profile" class="nav-link">
          <font-awesome-icon icon="user" />
          {{ currentUser.username }}
        </router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click.prevent="logOut">
          <font-awesome-icon icon="sign-out-alt" /> LogOut
        </a>
      </li>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AdminHeader",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
}
</script>

<style scoped>

</style>