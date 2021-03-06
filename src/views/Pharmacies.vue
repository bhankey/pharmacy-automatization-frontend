<template>
	<div class="home">
		<header class="jumbotron pageHeader shadow">
			<h3>pharmacies</h3>
		</header>

		<button v-if="!showCreation" class="btn btn-primary btn-block" @click="switchShowCreation">Show creation
		</button>

		<Form v-if="showCreation" @submit="handlePharmacyCreation" :validation-schema="schema">
			<!-- // TODO with modal -->
			<div class="enter_wrapper">
				<div class="form-group">
					<label for="name">Pharmacy name</label>
					<Field type="text" name="name" class="form-control"/>
					<ErrorMessage name="name" class="error-feedback"/>
				</div>
				<div class="form-group">
					<label for="city">City</label>
					<Field type="text" name="city" class="form-control"/>
					<ErrorMessage name="city" class="error-feedback"/>
				</div>
				<div class="form-group">
					<label for="street">Street</label>
					<Field type="text" name="street" class="form-control"/>
					<ErrorMessage name="street" class="error-feedback"/>
				</div>
				<div class="form-group">
					<label for="house">House</label>
					<Field type="text" name="house" class="form-control"/>
					<ErrorMessage name="house" class="error-feedback"/>
				</div>
			</div>
			<div class="form-group button">
				<button class="btn btn-primary btn-block" :disabled="loading">
					<span v-show="loading" class="spinner-border spinner-border-sm"></span>
					<span>Create</span>
				</button>
			</div>
			<div class="form-group alert">
				<div v-if="message" class="alert alert-danger" role="alert">
					{{ message }}
				</div>
			</div>
		</Form>

		<div class="table shadow">
			<div class="table_header">
				<div>ID</div>
				<div>Name</div>
				<div>City</div>
				<div>Street</div>
				<div>House</div>
			</div>

			<div class="table_row" v-for="item in pharmacies" :key="item.id">
				<div>
					{{ item?.id }}
				</div>
				<div>
					{{ item?.name }}
				</div>
				<div>
					{{ item.address?.city }}
				</div>
				<div>
					{{ item.address?.street }}
				</div>
				<div>
					{{ item.address.house }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {ErrorMessage, Field, Form} from "vee-validate";
import * as yup from "yup";
import pharmacyService from "@/services/pharmacy.service";
import {defineComponent, ref} from 'vue'


export default defineComponent({
	name: "PharmaciesPage",
	components: {
		Form,
		Field,
		ErrorMessage,
	},
	data() {
		const schema = yup.object().shape({
			name: yup.string().required("Name required!"),
		});
		return {
			loading: false,
			message: "",
			schema,
			pharmacies: null,
			showCreation: ref(false),
		};
	},
	methods: {
		handlePharmacyCreation(user) {
			this.loading = true;

			pharmacyService.create(user).then(
				() => {
					this.loading = false;

					this.handleGetAllPharmacies()

					this.message = ""
				},
				(error) => {
					this.loading = false;

					this.message = (error.response &&
							error.response.data &&
							error.response.data.error) ||
						error.message ||
						error.toString();

					return Promise.reject(error);
				}
			)
		},

		handleGetAllPharmacies() {
			pharmacyService.getAllPharmacies().then(
				(data) => {
					this.pharmacies = data.data.pharmacies
				},
				(error) => {
					this.message = "failed to load pharmacies"

					console.log(error)
				})
		},

		switchShowCreation() {
			console.log(this.showCreation)
			this.showCreation = !this.showCreation
		}
	},
	beforeMount() {
		pharmacyService.getAllPharmacies().then(
			(data) => {
				this.pharmacies = data.data.pharmacies
			},
			(error) => {
				this.message = "failed to load pharmacies"

				console.log(error)
			}
		)
	}
})
</script>

<style scoped>
.table {
	text-align: left;
	box-sizing: border-box;
	border-radius: var(--offsetHalf);
	margin-top: var(--offsetTwice);
	margin-bottom: var(--offsetTwice);
	overflow: hidden;
}

.table_row {
	display: grid;
	grid-auto-rows: max-content;
	grid-template-columns: repeat(5, 1fr);
	gap: var(--offsetHalf);
	align-items: center;
	padding: var(--offsetHalf);
	background-color: var(--whiteC);
}

.table_row:not(:last-child) {
	border-radius: 0 0 var(--offsetHalf) var(--offsetHalf);
}

.table_header {
	display: grid;
	grid-auto-rows: max-content;
	grid-template-columns: repeat(5, 1fr);

	gap: var(--offsetHalf);
	align-items: center;
	padding: var(--offsetHalf);

	font-weight: bold;
	border: 1px solid rgba(var(--opalRGB), 0.1);
	border-radius: var(--offsetHalf) var(--offsetHalf) 0 0;
	background-color: rgba(var(--opalRGB), 0.3);
}

.enter_wrapper {
	display: grid;
	grid-template-columns: repeat(2, 1fr);

	gap: var(--offsetHalf);
}

.home {
	margin: auto;
}

</style>