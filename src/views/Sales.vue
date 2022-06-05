<template>
	<div class="home">
		<header class="jumbotron pageHeader shadow">
			<h3>Sales</h3>
		</header>

		<div class="table shadow">
			<div class="table_header">
				<div>Name</div>
				<div>All Count</div>
				<div>Price</div>
				<div>Purchase Count</div>
				<div>Sum</div>
				<div>Need recipe</div>
			</div>

			<div class="table_row" v-for="item in products" :key="item.id">
				<div>
					{{ item?.name }}
				</div>
				<div>
					{{ item?.count }}
				</div>
				<div>
					{{ item?.price }}
				</div>
				<CounterWithButtons
					:minimum="0" :maximum="item.count" :initial-count="item.purchaseCount ?? 0"
					@plus-action=handleReserveProduct(item) @minus-action="handleDeleteFromReservationProduct(item)">
				</CounterWithButtons>
				<div>
					{{ item?.sum ?? 0 }}
				</div>
				<div>
					{{ item?.need_recepi ?? false }}
				</div>
			</div>
		</div>

		<button @click="switchShowPurchaseWindow" class=" btn  btn-primary sqrBall">
			Purchase
		</button>


		<div class="purchase_window shadow" v-if="showPurchaseWindow">
			<header class="purchase_window__header">
				<h3>Purchase confirm</h3>

				<button @click="switchShowPurchaseWindow" class="close-button">&times;</button>
			</header>

			<div class="purchase_table shadow-sm">
				<div class="purchase_table__header">
					<div>Name</div>
					<div>Count</div>
					<div>Price</div>
				</div>

				<div class="purchase_table__rows">
					<div class="purchase_table__row" v-for="item in reservationItems" :key="item.id">
						<div>
							{{ item?.name }}
						</div>
						<div>
							{{ item?.count }}
						</div>
						<div>
							{{ item?.price }}
						</div>
					</div>
				</div>
			</div>

      <div style="margin-left: auto; margin-right: auto"> Summary price: {{this.reservationItems.sumPrice}}</div>
			<footer class="purchase_window__footer">
				<button @click="handleConfirmPurchase" class=" btn  btn-primary confirm_button">
					Confirm
				</button>

				<div v-if="message" class="shadow-sm">
					{{ message }}
				</div>
			</footer>
		</div>
	</div>
</template>

<script>
import * as yup from "yup";
import productsService from "@/services/product.service";
import pharmacyService from "@/services/pharmacy.service";
import {defineComponent} from 'vue'
import CounterWithButtons from "@/components/CounterWithButtons";
import {uuid} from 'vue-uuid';


export default defineComponent({
	name: "SalesPage",
	components: {CounterWithButtons},
	data() {
		const schema = yup.object().shape({
			name: yup.string().required("Name required!"),
		});

		let purchaseUUID = localStorage.getItem("purchaseUUID") ?? uuid.v4()

		localStorage.setItem("purchaseUUID", purchaseUUID)

		return {
			loading: false,
			message: "",
			schema,
			products: null,
			showCreation: false,
			purchaseUUID: purchaseUUID,
			showPurchaseWindow: false,
			reservationItems: null,
		};
	},
	methods: {
		handleReserveProduct(product) {
			if (!product.purchaseCount) {
				product.purchaseCount = 0
			}

			product.purchaseCount++
			product.count--

			product.sum = product.price * product.purchaseCount

			productsService.addToReservation(this.purchaseUUID, product)
		},
		handleDeleteFromReservationProduct(product) {
			if (!product.purchaseCount) {
				product.purchaseCount = 0
			}

			product.purchaseCount--
			product.count++

			product.sum = product.price * product.purchaseCount

			productsService.deleteFromReservation(this.purchaseUUID, product)
		},

		switchShowPurchaseWindow() {
			this.showPurchaseWindow = !this.showPurchaseWindow

			this.getReservationItems()
		},

		getReservationItems() {
			productsService.showReservation(this.purchaseUUID).then(
				(data) => {
					let res = data.data.items
					res.sumPrice = data.data.price

					this.reservationItems = res
					console.log(res)
				},
				(error) => {
					this.message = "failed to load reservation"

					console.log(error)
				})
		},

		handleConfirmPurchase() {
			productsService.confirmPurchase(this.purchaseUUID).then(
				() => {
					this.purchaseUUID = uuid.v4()
					localStorage.setItem("purchaseUUID", this.purchaseUUID)
					this.getProduct()

					this.switchShowPurchaseWindow()
				},
				(error) => {
					this.message = 'failed to confirm purchase'

					console.log(error)
				}
			)
		},
		getProduct() {
			pharmacyService.getAvailableProducts().then(
				(data) => {
					console.log(data.data)

					this.products = data.data.products
				},
				(error) => {
					this.message = "failed to load users"

					console.log(error)
				})
		}
	},
	beforeMount() {
		pharmacyService.getAvailableProducts().then(
			(data) => {
				console.log(data.data)

				this.products = data.data.products
			},
			(error) => {
				this.message = "failed to load users"

				console.log(error)
			})

		productsService.showReservation(this.purchaseUUID).then(
			(data) => {
				console.log(data.data.items)

				if (!this.products) {
					this.products = []
				}

				let alreadyPurchaseProducts = data.data.items
				for (let product of alreadyPurchaseProducts) {
					product.purchaseCount = product.count
					product.count = 0

					product.sum = product.price * product.purchaseCount
				}

				this.products = this.products.concat(alreadyPurchaseProducts)


			},
			(error) => {
				this.message = "failed to load users"

				console.log(error)
			})
	}
})
</script>

<style scoped>
.table {
	text-align: left;
	box-sizing: border-box;
	border-radius: var(--offsetHalf);
	margin-bottom: var(--offsetTwice);
	overflow: hidden;
}

.table_row {
	display: grid;
	grid-auto-rows: max-content;
	grid-template-columns: repeat(6, 1fr);
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
	grid-template-columns: repeat(6, 1fr);

	gap: var(--offsetHalf);
	align-items: center;
	padding: var(--offsetHalf);

	font-weight: bold;
	border: 1px solid rgba(var(--opalRGB), 0.1);
	border-radius: var(--offsetHalf) var(--offsetHalf) 0 0;
	background-color: rgba(var(--opalRGB), 0.3);
}

.home {
	margin: auto;
}

.purchase_window {
	box-sizing: border-box;

	position: absolute;

	top: 50%;
	left: 50%;

	transform: translate(-50%, -50%);

	padding: var(--offset);

	max-width: 800px;
	max-height: 800px;
	width: 100%;
	height: 100%;

	background-color: var(--grayLight);
	border-radius: var(--offsetHalf);

	display: grid;
	grid-template-rows: max-content 1fr max-content;
	gap: var(--offset);
}

.purchase_window__header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.purchase_window__header h3 {
	font-weight: bold;
	text-transform: uppercase;
}

.purchase_table {
	border-radius: var(--offsetHalf);
	background-color: var(--whiteC);
	overflow: hidden;
}

.purchase_table__header {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: var(--offsetHalf);

	font-weight: bold;
	background-color: rgba(var(--opalRGB), 0.3);
	padding: var(--offsetHalf);
}

.purchase_table__rows {
	overflow-y: scroll;
	max-height: 535px;
	box-sizing: border-box;
}

.purchase_table__row {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: var(--offsetHalf);

	padding: var(--offsetHalf);
}

.purchase_window__footer {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.purchase_window__footer button {
	margin-right: var(--offset);
}

.purchase_window__footer div {
	background-color: var(--whiteC);
	flex-grow: 1;

	display: flex;
	align-items: center;
	color: var(--black);
	padding: calc(var(--offsetHalf) / 2) var(--offsetHalf);
	border-radius: calc(var(--offsetHalf) / 2);
}

.close-button {
	border: 1px solid var(--opal);
	border-radius: 50%;
	background-color: var(--opal);
	color: var(--whiteC);
	font-weight: bold;

	width: var(--offset);
	height: var(--offset);

	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;

	transition: var(--mainTransition);
}

.close-button:hover {
	background-color: var(--whiteC);
	color: var(--opal);
}
</style>