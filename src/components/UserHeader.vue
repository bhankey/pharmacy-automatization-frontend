<template>
	<nav class="navbar navbar-expand shadow-lg siteNav">
		<div class="container">
			<router-link to="/sales" class="navbar-brand">Pharmacy automatization</router-link>

			<ul class="navbar-nav mr-auto menu">
				<li class="nav-item">
					<router-link to="/sales" class="nav-link">Sales</router-link>
				</li>
			</ul>

			<ul v-if="!currentUser" class="navbar-nav ml-auto profileNav">
				<li class="nav-item">
					<router-link to="/login" class="nav-link">
						<font-awesome-icon icon="sign-in-alt"/>
						Login
					</router-link>
				</li>
			</ul>

			<ul v-if="currentUser" class="navbar-nav ml-auto profileNav">
				<li class="nav-item">
					<router-link to="/profile" class="nav-link">
						<font-awesome-icon icon="user"/>
						{{ currentUser.username }}
					</router-link>
				</li>

				<li class="nav-item">
					<a class="nav-link" @click.prevent="logOut">
						<font-awesome-icon icon="sign-out-alt"/>
						LogOut
					</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
export default {
	name: "UserHeader",
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