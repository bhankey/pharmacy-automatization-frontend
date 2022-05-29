<template>
	<div id="app">
		<div id="modals"></div>
		<AdminHeader v-if="showAdminBoard"></AdminHeader>
		<UserHeader v-if="!showAdminBoard"></UserHeader>
		<div class="container">
			<router-view/>
		</div>
	</div>
</template>

<script>

import AdminHeader from "@/components/AdminHeader";
import UserHeader from "@/components/UserHeader";

export default {
	components: {UserHeader, AdminHeader},
	computed: {
		currentUser() {
			return this.$store.state.auth.user;
		},
		showAdminBoard() {
			return this.currentUser?.role === "admin";
		},
	},
	methods: {
		logOut() {
			this.$store.dispatch('auth/logout');
			this.$router.push('/login');
		}
	}
};
</script>