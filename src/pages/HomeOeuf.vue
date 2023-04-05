<template>
  <div class="parent">
  	<SearchBar :show_date="false" @searched="performFilter"/>
  	<div class="page">
  		<div class="items">
  			<div class="recycler">
  				<Item v-for="item in non_empty_items" :item="item" :key="item.id"/>
  			</div>
  			<hr style="margin: 20px 0;">
  			<div class="recycler">
  				<Item v-for="item in empty_items" :item="item" :key="item.id"/>
  			</div>
  		</div>
  		<div class="cart" v-if="panier_shown">
	  		<span class="close_panier" @click="panier_shown=false">x</span>
			<h3 class="title">Panier</h3>
			<div class="panier_items">
				<CartItem v-for="item in cart.content" :item="item" :key="item.id"/>
			</div>
			<div class="totals">
				<div> Total </div>
				<div> <b>{{ money(cart.getTotal()) }}</b> Fbu</div>
			</div>
			<div class="cart_buttons" v-if="!!cart.getLength()">
				<button @click="cart.content=[]">reset</button>
				<button @click="confirm_vente=true">valider</button>
			</div>
  		</div>
  		<div class="btn_panier" @click="panier_shown=true" v-else>
  			panier({{ cart.getLength() }})
  		</div>
  	</div>
  	<!-- <DialogSubmit :visible="confirm_vente" @close="confirm_vente=false"/> -->
  </div>
</template>
<script>
import axios from "axios"
import SearchBar from "../components/searchbar.vue";
import Item from "../components/oeuf_item.vue";
import CartItem from "../components/panier_oeuf_item.vue";
import DialogSubmit from "../components/dialog_submit.vue";
export default{
	components:{SearchBar, Item, CartItem, DialogSubmit},
	data(){
		return {
			items:this.$store.state.salles,
			cart:this.$store.state.cart,
			panier_shown : true,
			confirm_vente:false,
			to_search:""
		}
	},
	computed:{
		non_empty_items(){
			return this.items.filter(x => x.quantite_oeuf > 0)
		},
		empty_items(){
			return this.items.filter(x => x.quantite_oeuf == 0)
		}
	},
	methods:{
		performFilter(value){
			let data = this.$store.state.salles.filter( x => {
				return x.id == value |
					x.nom.toLowerCase().includes(value.toLowerCase())
			});
			this.items = data;
		},
		fetchProducts(){
			let headers = {
				headers: {
					"Authorization": "Bearer " + this.$store.state.user.access
				}
			}
			axios.get(this.$store.state.url+'/salle/', headers)
			.then((response) => {
				this.$store.state.salles = response.data.results;
				this.items = response.data.results;
			}).catch((error) => {
				if(error.response.data.code == "token_not_valid"){
					let data = {
						refresh: this.$store.state.user.refresh
					};
					axios.post(this.$store.state.url+'/refresh/', data)
					.then((response) => {
						this.$store.state.user.access = response.data.access;
						this.fetchProducts();
					}).catch((error) =>{
						this.$store.state.user = null;
					})
				}
			});
		}
	},
	mounted(){
		if(this.$store.state.salles.length<1){
			this.fetchProducts();
		}
		document.onkeydown = (e) => {
			if (location.pathname !== "/home/ration") return
			this.to_search += e.key;
			let action = setTimeout(()=>{
				for(let item of this.$store.state.salles){
					if(item.id == this.to_search){
						this.cart.add(item);
						break;
					}
				};
				clearTimeout(action);
				this.to_search = "";
			}, 200);
		}
	}
};
</script>
<style>
.parent{
	display: flex;
	height: 100%;
	flex-direction: column;
}
.title{
	text-align: center;
	margin: 10px;
}
.cart_body{
	flex-grow: 1;
}
.btn_panier{
	position: absolute;
	right: 0;
	background: #079;
	padding: 3px 10px;
	font-weight: bold;
	font-size: 18px;
	color: #ddd;
	box-shadow: 0px 0px 5px 2px #777;
}
.btn_panier:hover{
	color: white;
	cursor: default;
}
.close_panier{
	position: absolute;
	left: 5px;
	top: 5px;
	background: #944;
	padding: 0 7px 3px 7px;
	font-weight: bold;
	color: #ddd;
	font-family: monospace;
	font-size: 20px;
	box-shadow: 0px 0px 5px 2px #777;
	cursor: default;
}
.close_panier:hover{
	color: white;
}
.page{
	display: flex;
	flex-direction: row;
	height: 90%;
}
.items{
	position: relative;
	flex-grow: 1;
	height: 100%;
	overflow-y: auto;
	padding: 10px;
}
.recycler{
	width: 100%;
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	column-gap: 10px;
	grid-row-gap: 10px;
}
.cart{
	min-width: 350px;
	font-size: .8em;
	max-height: 100%;
	position: relative;
	box-shadow: 0px 0px 5px 2px #777;
	display: flex;
	flex-direction: column;
}
.totals{
	display: flex;
	justify-content: space-between;
	margin:0 10px 0 15px
}
.panier_items{
	overflow-y: auto;
	flex-grow: 1;
	margin: 10px;
	align-items: baseline;
	border-bottom: 1px solid black;
}
.cart_buttons{
	display: flex;
	justify-content: flex-end;
}
@media screen and (max-width: 1200px){
	.recycler{
		grid-template-columns: repeat(4, 1fr);
	}
}
@media screen and (max-width: 900px){
	.recycler{
		grid-template-columns: repeat(3, 1fr);
	}
}
@media screen and (max-width: 600px){
	.recycler{
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>
