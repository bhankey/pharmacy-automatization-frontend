<template>
<div class="block">
  <button class="btn btn-primary btn-group button" @click="minus">-</button>
  <div>{{count}}</div>
  <button class="btn btn-primary btn-group button" @click="add">+</button>
</div>
</template>

<script>
export default {
  name: "CounterWithButtons",
  props: ['initialCount', 'plusAction', 'minusAction', 'minimum', "maximum"],
  data: function () {
    return {
      count: 0,
    }
  },
  methods: {
    add: function() {
      if (this.count > this.maximum) {
        return
      }

      this.count++

      this.$emit('plusAction');
    },
    minus: function() {
      if (this.count <= this.minimum) {
        return
      }

      this.count--

      this.$emit('minusAction');
    },
  },
  created() {
    this.count = this.initialCount
  },
}

</script>

<style scoped>
.block {
  display: inline-flex;
}
.button {
  width: 30px;
  height: 30px;
}
</style>