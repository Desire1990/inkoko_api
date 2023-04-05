<template>
	<div :class="{popup:true, active:visible}" @click="close">
		<div class="popup-body" @click.prevent.stop>
			<center>
				<h3>Modifier {{produit.nom}}</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_unite">Nom:</label>
					<input type="text" v-model="new_produit.nom" id="id_unite">
				</div>
				<div class="field">
					<label for="id_unite">Unite d'achat:</label>
					<input type="text" v-model="new_produit.unite" id="id_unite">
				</div>
				<div class="field">
					<label for="id_prix">Nouveau prix:</label>
					<input type="number" name="prix" placeholder="prix" required="" id="id_quantite" v-model="new_produit.prix_unitaire">
				</div>
				<div class="buttons">
					<div class="logs">{{logs}}</div>
					<input type="submit" value="Modifier" @click="changerPrix">
				</div>
    		</form>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	props: {
		visible:{ type:Boolean, default:false},
		produit:{ type:Object, required:true}
	},
	data(){
		return {
			logs:"", new_price:"", new_produit:""
		}
	},
	watch:{
		produit(new_value){
			this.new_produit = JSON.parse(JSON.stringify(new_value));
		}
	},
	methods: {
		close(){
			this.$emit("close");
		},
		changerPrix(){
			let headers = {
				headers: {
				"Authorization": "Bearer " + this.$store.state.user.access
				}
			};
			axios.put(this.$store.state.url+`/produit/${this.produit.id}/`, this.new_produit, headers)
			.then((response) => {
				let produits = this.$store.state.produits;
				for(var i = 0; i < produits.length; i++){
					let x = produits[i];
					if(x.id==this.produit.id){
						this.$store.state.produits[i] = response.data;
						break;
					}
				}
				this.$emit("close");
			}).catch((error) => {
				console.error(error);
			})
		}
	}
};
</script>
<style scoped>
form{
	margin-top: 10px;
	display: flex;
	flex-direction: column;
}
form div{
	margin: 5px;
}
[disabled]{
	border: 1px solid gray;
}
.buttons{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons *{
  margin: 0;
}
.logs{
  width: 180px;
  color: red;
}
</style>