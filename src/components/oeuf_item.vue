<template>
	<div :data-id='item.id' :class="{'parent':true,'danger':item.quantite_oeuf==0}">
		<div style="flex-grow: 1;">
		<span class="name"> {{ item.nom }}</span>
		<div class="prix"> {{ money(500)}} Fbu</div>
		</div>
		<div class="qtt">
			quantité dispo:
			<span class="dispo">
				{{item.quantite_oeuf}} oeufs
			</span>
		</div>
		<div class="buttons">
			<button class="bg-blue" @click="decreaseQtt">-</button>
			<input v-if="editable" type="number" class="item_qtt"
				v-model="qtt" @keydown.stop :max="item.quantite_oeuf">
			<label v-else @click="enableEdition">{{qtt}}</label>
			<button class="bg-blue" @click="increaseQtt">+</button>
		</div>
	</div>
</template>
<script >
import EVENT_BUS from '../main'
export default {
	props: {
		item:{type:Object, required:true}
	},
	data(){
		return {
			cart : this.$store.state.cart,
			editable:false
		}
	},
	methods: {
		getIcon(item){
			if (item.image == null) {
				return "/img/item.png";
			}
			return item.image;
		},
		increaseQtt : function(){
			this.cart.add(this.item);
		},
		decreaseQtt : function(){
			this.cart.decrease(this.item.id);
		},
		enableEdition(){
			if(this.item.quantite_oeuf!=0) this.editable=true
		}
	},
	computed:{
		qtt:{
			get(){
				return this.cart.getQuantite(this.item.id);
			},
			set(value){
				if(value.length==0) return;
				this.cart.add(this.item, value);
			}
		}
	}
};
</script>
<style scoped>
*{
	color: black; 
}
.img{
	padding: 5px;
	color:#aaa;
}
.danger *{
	color:#079!important;
	border-color: #079!important;
	cursor: not-allowed;
}
.parent{
	background: var(--primary-light);
    padding: 3px;
	text-align: center;
	display: flex;
	flex-direction: column;
}
.name{
	font-size: 1.1em;
}
.prix{
	font-weight: 1000;
	font-size: .8em;
	margin-bottom: 2px;
}
.qtt{
	font-size: .7em;
	margin-bottom: 2px;
}
.qtt .dispo{
	font-weight: bold;
}
.buttons{
	display: flex;
	margin-top: 2px;
	border-top: 1px solid black;
}
.bg-blue{
	width: 35%;
	padding: 7px;
	margin: 0;
	text-align: center;
	border-radius: 0;
	background: #afd8f3;
	font-weight: bold;
	font-size: 20px;
	background-color: var(--primary-light);
}
label{
	flex-grow: 1;
	background-color: white;
	color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    border-top: 0;
}
.bg-blue:hover{
	background-color: var(--primary);
	color: white;
}
.item_qtt{
	text-align: center;
	width: 70px;
    border-top: 0;
    padding-right: -5px;
}
.dispo{
	color: #fff;
	padding: 2px 5px;
	background-color: var(--primary);
}
.danger .dispo{
	background-color: #0000;
}
</style>