<template>
	<div class="container userProfile">
		<header class="jumbotron userProfile__header shadow">
			<h3>User profile page</h3>
		</header>

		<div class="userProfile__content shadow">
			<div class="userProfile__item">
				<h4 class="userProfile__label">ID:</h4>
				<p class="userProfile__value">
					{{ currentUser?.id }}
				</p>
			</div>

			<div class="userProfile__item">
				<h4 class="userProfile__label">Name:</h4>
				<p class="userProfile__value">
					{{ currentUser?.name ?? "empty"}}
				</p>
			</div>

			<div class="userProfile__item">
				<h4 class="userProfile__label">Surname:</h4>
				<p class="userProfile__value">
					{{ currentUser?.surname ?? "empty" }}
				</p>
			</div>


			<div class="userProfile__item">
				<h4 class="userProfile__label">Email:</h4>
				<p class="userProfile__value">
					{{ currentUser?.email }}
				</p>
			</div>

			<div class="userProfile__item">
				<h4 class="userProfile__label">Role:</h4>
				<p class="userProfile__value">
					{{ currentUser?.role }}
				</p>
			</div>
		</div>
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

<style>
.userProfile__header {
	border-radius: var(--offsetHalf);
	background-image: var(--mainGradient);
	margin-bottom: var(--offsetTwice);
}

.userProfile__header h3 {
	margin: 0;
	padding: 0;

	font-weight: 800;
	font-size: 2.8rem;
	color: var(--whiteC);
	text-shadow: 0 0.1rem 0.2rem rgba(var(--blackRGB), 0.8);

	text-align: center;
	text-transform: uppercase;
}

.userProfile__content {
	border-radius: var(--offsetHalf);
	background-color: var(--whiteC);
	padding: var(--offset);
}

.userProfile__item {
	display: grid;
	grid-template-columns: minmax(120px, auto) 1fr;
	gap: var(--offset);
}

.userProfile__item:not(:last-child) {
	margin-bottom: var(--offsetHalf);
}

.userProfile__label {
	font-weight: bold;
	margin: 0;
	padding: 0;
}

.userProfile__value {
	margin: 0;
	padding: 0;
}

</style>