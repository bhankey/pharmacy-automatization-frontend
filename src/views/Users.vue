<template>
  <div class="home">
    <button v-if="!showCreation" class="btn btn-primary btn-block" @click="switchShowCreation">Show creation</button>
    <Form v-if="showCreation" @submit="handleUserCreation" :validation-schema="schema"> <!-- // TODO with modal -->
      <div class="enter_wrapper">
        <div class="form-group">
          <label for="name">Name</label>
          <Field type="text" name="name" class="form-control" />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="surname">Surname</label>
          <Field type="text"  name="surname" class="form-control" />
          <ErrorMessage name="surname" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <Field type="text" name="email" class="form-control" />
          <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Field type="text" name="password" class="form-control" />
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <Field type="text" name="role" as="select" class="form-control">
            <option value="admin">admin</option>
            <option value="apothecary">apothecary</option>
          </Field>
          <ErrorMessage name="role" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="default_pharmacy_id">Pharmacy</label>
          <Field type="text" as="select" name="default_pharmacy_id" class="form-control">
            <option v-for="item in pharmacies" :value="item.id" :key="item.id">{{item.name}}</option>
          </Field>
          <ErrorMessage name="default_pharmacy_id" class="error-feedback" />
        </div>
      </div>
      <div class="form-group">
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
        <div>Surname</div>
        <div>Email</div>
        <div>Role</div>
        <div>Default Pharmacy</div>
      </div>

      <div class="table_row" v-for="item in users" :key="item.id">
        <div>
          {{ item?.id }}
        </div>
        <div>
          {{ item.name ?? "none" }}
        </div>
        <div>
          {{ item.surname ?? "none" }}
        </div>
        <div>
          {{ item?.email }}
        </div>
        <div>
          {{ item?.role }}
        </div>
        <div>
          {{ item?.default_pharmacy_id ?? "none" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ErrorMessage, Field, Form} from "vee-validate";
import * as yup from "yup";
import pharmacyService from "@/services/pharmacy.service";
import userService from "@/services/user.service";
import { defineComponent, ref } from 'vue'


export default defineComponent({
  name: "UsersPage",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      name: yup.string().required("Name required!"),
      email: yup.string().email(),
      password: yup.string().required("Password required!"),
      role: yup.string().required("Role required!"),
    });
    return {
      loading: false,
      message: "",
      schema,
      pharmacies: null,
      showCreation: ref(false),
      users: null,
    };
  },
  methods: {
    handleUserCreation(user) {
      this.loading = true;
      console.log(user)

      userService.register(user).
      then(
          () => {
            this.loading = false;

            this.handleGetAllUsers()

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

    handleGetAllUsers() {
      userService.getAllUser().then(
          (data) => {
            this.users = data.data
          },
          (error) => {
            this.message = "failed to load users"

            console.log(error)
          })
    },

    switchShowCreation() {
      console.log(this.showCreation)
      this.showCreation = !this.showCreation
    }
  },
  beforeMount() {
    userService.getAllUser().then(
        (data) => {
          console.log(data.data)

          this.users = data.data
        },
        (error) => {
          this.message = "failed to load users"

          console.log(error)
        })

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
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;

  gap: 10px 10px;
}

.table_row {
  display: grid;
  grid-auto-rows: max-content;
  grid-template-columns: 0.5fr 1fr 1fr 4fr 2fr 0.5fr;
  margin-bottom: 20px;
  gap: 15px;
}

.home {
  width: 80%;
  margin: auto;
}

</style>