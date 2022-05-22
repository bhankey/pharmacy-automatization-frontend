<template>
  <div class="home">
    <button v-if="!showCreation" class="btn btn-primary btn-block" @click="switchShowCreation">Show creation</button>
    <Form v-if="showCreation" @submit="handlePharmacyCreation" :validation-schema="schema"> <!-- // TODO with modal -->
      <div class="enter_wrapper">
        <div class="form-group">
          <label for="name">Pharmacy name</label>
          <Field type="text" name="name" class="form-control" />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <Field type="text"  name="city" class="form-control" />
          <ErrorMessage name="city" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="street">Street</label>
          <Field type="text" name="street" class="form-control" />
          <ErrorMessage name="street" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="house">House</label>
          <Field type="text"  name="house" class="form-control" />
          <ErrorMessage name="house" class="error-feedback" />
        </div>
      </div>
      <div class="form-group button">
        <button class="btn btn-primary btn-block" :disabled="loading">
            <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
            ></span>
          <span>Create</span>
        </button>
      </div>
      <div class="form-group">
        <div v-if="message" class="alert alert-danger" role="alert">
          {{ message }}
        </div>
      </div>
    </Form>



    <div class="table">
      <div class="table_row">
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
import { defineComponent, ref } from 'vue'


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

      pharmacyService.create(user).
      then(
          () => {
            this.loading = false;

            this.handleGetAllPharmacies()

            this.message = ""
          },
          (error) => {
            this.loading = false;

            this.message =  (error.response &&
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
}

.enter_wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr ;

  gap: 10px 10px;
}

.table_row {
  display: grid;
  grid-auto-rows: max-content;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  margin-bottom: 20px;
  gap: 15px;
}

.button {
  border: none;
  color: white;
  padding: 5px 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 0px;
}

.home {
  width: 80%;
  margin: auto;
}

</style>