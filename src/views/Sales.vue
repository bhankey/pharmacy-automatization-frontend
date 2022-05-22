<template>
  <div class="home">
    <div class="table">
      <div class="table_row">
        <div>Name</div>
        <div>All Count</div>
        <div>Price</div>
        <div>Purchase Count</div>
        <div>Sum</div>
        <div>Need recipe</div>
      </div>

      <div class="table_row" v-for="item in products" :key="item.id">
        <div>
          {{ item?.name}}
        </div>
        <div>
          {{ item?.count}}
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
    <div class="purchase_window" v-if="showPurchaseWindow">
      <div>Purchase confirm </div>
      <header style="color:#000;">
        <span @click="switchShowPurchaseWindow" class="close-button topright">&times;</span>
      </header>
      <div class="table">
        <div class="table_row">
          <div>Name</div>
          <div>Count</div>
          <div>Price</div>
        </div>

        <div class="table_row" v-for="item in reservationItems" :key="item.id">
          <div>
            {{ item?.name}}
          </div>
          <div>
            {{ item?.count}}
          </div>
          <div>
            {{ item?.price }}
          </div>
        </div>
      </div>
      <div>
        {{message}}
      </div>
      <button @click="handleConfirmPurchase" class=" btn  btn-primary confirm_button">
        Confirm
      </button>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import prodcutsService from "@/services/product.service";
import pharmacyService from "@/services/pharmacy.service";
import { defineComponent, ref } from 'vue'
import CounterWithButtons from "@/components/CounterWithButtons";
import { uuid } from 'vue-uuid';


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
      showCreation: ref(false),
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

      prodcutsService.addToReservation(this.purchaseUUID, product)
    },
    handleDeleteFromReservationProduct(product) {
      if (!product.purchaseCount) {
        product.purchaseCount = 0
      }

      product.purchaseCount--
      product.count++

      product.sum = product.price * product.purchaseCount

      prodcutsService.deleteFromReservation(this.purchaseUUID, product)
    },

    switchShowPurchaseWindow() {
      this.showPurchaseWindow = !this.showPurchaseWindow

      this.getReservationItems()
    },

    getReservationItems() {
      prodcutsService.showReservation(this.purchaseUUID).then(
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
        prodcutsService.confirmPurchase(this.purchaseUUID).then(
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

    prodcutsService.showReservation(this.purchaseUUID).then(
        (data) => {
          console.log(data.data.items)

          if (!this.products) {
            this.products = []
          }

          let alreadyPurchaseProducts = data.data.items
          for(let product of alreadyPurchaseProducts) {
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
}

.table_row {
  display: grid;
  grid-auto-rows: max-content;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  margin-bottom: 20px;
  gap: 15px;
}

.home {
  width: 80%;
  margin: auto;
}

.sqrBall {
  position: absolute; /* Child should have absolute position */
  bottom: 20%;
  left: 20%;
}

.confirm_button {
  position: absolute; /* Child should have absolute position */
  bottom: 5%;
  left: 5%;
}

.purchase_window {
  width: 50%;
  height: 70%;

  background: #f7f7f7;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;

  padding-top: 3%;
  padding-left: 3%;

  margin: auto;
}

.close-button {
  border: none;
  display: inline-block;
  padding: 8px 16px;
  vertical-align: middle;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background-color: inherit;
  text-align: center;
  cursor: pointer;
  white-space: nowrap
}

.topright {
  position: absolute;
  right: 3%;
  top: 3%;
}

</style>