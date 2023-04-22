<template>
	<div :class="{popup:true, active:visible}" @click="close">
		<div class="popup-body" @click.prevent.stop>
			<center>
				<h3>Modifier {{produit.nom}}</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_unite">Montant:</label>
					<input type="text" v-model="new_produit.montant" id="id_unite">
				</div>
				<div class="field">
					<label for="id_unite">Detail:</label>
					<input type="text" v-model="new_produit.motif" id="id_unite">
				</div>
				<div class="buttons">
					<div class="logs">{{logs}}</div>
					<input type="submit" value="Modifier" @click="changerSalle">
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
		changerSalle(){
			let headers = {
				headers: {
				"Authorization": "Bearer " + this.$store.state.user.access
				}
			};
			axios.put(this.$store.state.url+`/paiement/${this.produit.id}/`, this.new_produit, headers)
			.then((response) => {
				let paiements = this.$store.state.paiements;
				for(var i = 0; i < paiements.length; i++){
					let x = paiements[i];
					if(x.id==this.produit.id){
						this.$store.state.paiements[i] = response.data;
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