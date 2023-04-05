<template>
	<div class="container">
		<button class="cart_button" 
			@click="cart.decrease(item.product.id)">-
		</button>
		<button class="cart_button" 
			@click="cart.increase(item.product.id)">+
		</button>
		<div class="cart_body">
			<div>
				<b>{{ item.quantite }}</b> x Oeufs
				<fa icon="trash-alt" style="color:#b55"
					@click="remove(item)"/>
			</div>
			<div>
				<b>{{ money(item.getTotale()) }}</b> Fbu
			</div>
		</div>
	</div>
</template>
<script >
export default {
	props: {
		item:{type:Object, required:true}
	},
	computed:{
		cart(){
			return this.$store.state.cart;
		}
	},
	methods:{
		remove(item){
			let position = this.cart.find(item.product.id);
			this.cart.content.splice(position,1)
		}
	}
};
</script>
<style scoped>
.container{
	display: flex;
	flex-direction: row;
	align-items: center;
}
.cart_body{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.cart_button{
	min-width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
}
.cart_item{
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>