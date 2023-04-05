<template>
	<div :class="{popup:true, active:visible}" @click="close">
		<div class="popup-body" @click.prevent.stop>
			<center>
				<h3>Oeuf pondu dans salle {{ salle.nom}}</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_prix">Quantite:</label>
					<input type="text"  name="prix" v-model="lg_qtt"></input> 
				</div>
				<div class="field">
					<label for="id_prix">Commentaire:</label>
					<input type="text" name="prix" v-model="commentaire"></input> 
				</div>
				<div class="buttons">
					<div class="logs">{{logs}}</div>
					<input type="submit" @click="performAchat" value="submit">
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
		salle:{ type:Object, required:true},
		achat:{ type:Object, required:false}
	},
	data(){
		return {
			payee: 0, lg_qtt: 0, total:0, logs:"",
			sm_qtt: 0, prix: 0, commentaire:"", quantite:0
		}
	},
	computed:{
		qttTotal(){
			return this.lg_qtt //*this.salle.rapport+(this.sm_qtt*1);
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
			if(this.salle.rapport == 1){
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
		performAchat(){
			let data = {
				"quantite": this.qttTotal,
				"commentaire": this.commentaire,
				"salle": this.salle.id
			};
			let url = this.$store.state.url
			axios.post(url+"/oeuf/", data, this.headers)
			.then((response) => {
				let salles = this.$store.state.salles
				let salle = salles.find(x => x.id == this.salle.id);
				this.$store.state.oeufs.unshift(response.data)
				if(!!salle){
					salle.quantite_oeuf += response.data.quantite;
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
				"salle": this.salle.id
			};
			let url = this.$store.state.url
			axios.put(url+`/achat/${this.achat.id}/`, data, this.headers)
			.then((response) => {
				this.salle.quantite-=this.achat.quantite;
				this.achat.quantite = response.data.quantite;
				this.salle.quantite += response.data.quantite;
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
