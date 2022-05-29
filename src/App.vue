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

<style>
:root {
	--offset: 32px;
	--offsetHalf: calc(var(--offset) / 2);
	--offsetTwice: calc(var(--offset) * 2);

	--yellow: #ffba08;
	--black: #0f0f0f;
	--white: #ffffff;
	--grayLight: #fbfbfb;
	--blue: #337ca0;
	--opal: #f26157;

	--yellowRGB: 255, 186, 8;
	--blackRGB: 0, 0, 0;
	--whiteRGB: 255, 255, 255;
	--grayLightRGB: 250, 250, 250;
	--blueRGB: 51, 124, 160;
	--opalRGB: 242, 97, 87;
}

</style>