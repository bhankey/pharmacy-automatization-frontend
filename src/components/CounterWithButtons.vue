<template>
	<div class="block">
		<button class="btn btn-primary btn-group button" :disabled="!canMinus" @click="minus">
			<span>-</span>
		</button>
		<div>{{ count }}</div>
		<button class="btn btn-primary btn-group button" :disabled="!canAdd" @click="add">
			<span>+</span>
		</button>
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
	computed: {
		canAdd: function () {
			return this.count < this.maximum;
		},
		canMinus: function () {
			return this.count > this.minimum;
		}
	},
	methods: {
		add: function () {
			if (this.canAdd) {
				this.count++;
				this.$emit('plusAction');
			}
		},
		minus: function () {
			if (this.canMinus) {
				this.count--;
				this.$emit('minusAction');
			}
		},
	},
	created() {
		this.count = this.initialCount
	},
}

</script>

<style scoped>
.block {
	max-width: calc(var(--offset) * 4);
	display: grid;
	grid-template-columns: var(--offset) 1fr var(--offset);
	align-items: center;
}

div {
	text-align: center;
}

.button {
	width: var(--offset);
	height: var(--offset);
	box-sizing: border-box;
	padding: 0;
}

.button:hover {
	transition: var(--mainTransition);
}

.button:disabled {
	background-color: var(--grayDark);
	border-color: var(--grayDark);
	//cursor: not-allowed;
}

.button span {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
}
</style>