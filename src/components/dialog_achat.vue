<template>
	<div :class="{popup:true, active:visible}" @click="close">
		<div class="popup-body" @click.prevent.stop>
			<center>
				<h3>Augmenter {{produit.nom}}</h3>
			</center>
			<form method="post">
				<div class="inline_field">
					<div class="field">
						<label for="lg_qtt">{{ produit.unite }}</label>
						<input type="number" v-model="lg_qtt" id="lg_qtt">
					</div>
				</div>
				<!-- <div class="total">
					La quantité total en unités:
					<b>{{ qttTotal }}</b>
				</div> -->
				<div :class="{'inline_field':produit.rapport!=1}">
					<div class="field">
						<label for="prix">Prix unitaire</label>
						<input type="number" v-model="prix"
							id="prix" ref="prix">
					</div>
					<div class="field">
						<label for="total">Prix total</label>
						<input type="number" v-model="total"
							id="total" ref="total">
					</div>
				</div>
				<div class="field">
					<label for="id_prix">Details:</label>
					<textarea name="prix" v-model="details"></textarea> 
				</div>
				<div class="buttons">
					<div class="logs">{{logs}}</div>
					<input type="submit" @click="submit" value="submit">
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
		produit:{ type:Object, required:true},
		achat:{ type:Object, required:false}
	},
	data(){
		return {
			payee: 0, lg_qtt: 0, total:0, logs:"",
			sm_qtt: 0, prix: 0, details:""
		}
	},
	computed:{
		qttTotal(){
			return this.lg_qtt //*this.produit.rapport+(this.sm_qtt*1);
		},
		headers(){
			return {
				headers: {
					"Authorization": "Bearer " + this.$store.state.user.access
				}
			}
		}
	},
	watch:{
		prix(value){
			if(this.$refs.prix == document.activeElement){
				this.total = value*this.qttTotal;
			}
		},
		total(value){
			if(this.$refs.total == document.activeElement){
				this.prix = value/this.qttTotal;
			}
		},
		achat(value){
			console.log(value);
			if(this.produit.rapport == 1){
				this.lg_qtt = value.quantite;
			} else {
				this.sm_qtt = value.quantite;
			}
			this.total = value.prix_total;
		}
	},
	methods: {
		close(){
			this.lg_qtt = 0;
			this.sm_qtt = 0;
			this.$emit("close")
		},
		submit(){
			if(!this.achat){
				this.performAchat()
			} else {
				this.performEdition()
			}
		},
		performAchat(){
			let data = {
				"quantite": this.qttTotal,
				"details": this.details,
				"prix_total": this.total,
				"produit": this.produit.id
			};
			let url = this.$store.state.url
			axios.post(url+"/achat/", data, this.headers)
			.then((response) => {
				let produits = this.$store.state.produits
				let produit = produits.find(x => x.id == this.produit.id);
				this.$store.state.achats.unshift(response.data)
				if(!!produit){
					produit.quantite += response.data.quantite;
					this.$emit("close");
				} else {
					this.logs = "quelque chose a mal tourné";
				}
			}).catch((error) => {
				if (!!error.response) {
					this.logs = error.response.data.status
				} else {
					this.logs = "une erreur est survenue";
				}
    		})
		},
		performEdition(){
			let data = {
				"quantite": this.qttTotal,
				"details": this.details,
				"prix_total": this.total,
				"produit": this.produit.id
			};
			let url = this.$store.state.url
			axios.put(url+`/achat/${this.achat.id}/`, data, this.headers)
			.then((response) => {
				this.produit.quantite-=this.achat.quantite;
				this.achat.quantite = response.data.quantite;
				this.produit.quantite += response.data.quantite;
				this.achat.prix_total = response.data.prix_total;
				this.achat.prix_unitaire = response.data.prix_unitaire;
				this.$emit("close");
			}).catch((error) => {
				if (!!error.response) {
					this.logs = error.response.data.status
				} else {
					this.logs = "une erreur est survenue";
				}
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
.inline_field{
	display: flex;
}
</style>
