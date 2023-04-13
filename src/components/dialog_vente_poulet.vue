<template>
	<div :class="{popup:true, active:visible}" @click="close">
		<div class="popup-body" @click.prevent.stop>
			<center>
				<h3>Poulet vendu dans salle {{ salle.nom}}</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_prix">Quantite:</label>
					<input type="text" placeholder="quantite de poulet" name="prix" v-model="poulet.quantite"></input> 
				</div>
				<div class="field">
					<label for="id_prix">Poids:</label>
					<input type="text"  name="prix" placeholder="poids en kg" v-model="poulet.poids"></input> 
				</div>
				<div class="field">
					<label for="id_prix">Prix:</label>
					<input type="text" placeholder="prix unitaire" name="prix" v-model="poulet.prix_unitaire"></input> 
				</div>
				<div class="field">
		          <label for="id_nom">Nom du client</label>
		          <input type="text" list="noms" v-model="client.nom"  placeholder="nom du client"
		            id="id_nom" @change="setTel">
		        </div>
		        <div class="field">
		          <label for="id_tel">Téléphone</label>
		          <input type="text" v-model="client.tel" id="id_tel"  placeholder="telephone du client"
		             list="tels" @change="setNom">
		        </div>
				<div class="field">
					<label for="id_prix">Details:</label>
					<input type="text" name="prix"  placeholder="commentaire" v-model="poulet.commentaire"></input> 
				</div>
				<div class="buttons">
					<div class="logs">{{logs}}</div>
					<input type="submit" @click="performAchat" value="submit">
				</div>
			</form>
	      <datalist id="noms">
	        <option v-for="c in clients" :value="c.nom"/>
	      </datalist>

	      <datalist id="tels">
	        <option v-for="c in clients" :value="c.tel"/>
	      </datalist>
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
			poulet:{},
			client:{ nom:"", tel:""},
			payee: 0, lg_qtt: 0, total:0, logs:"",
			sm_qtt: 0, prix: 0, commentaire:"", quantite:0
		}
	},
	computed:{
		clients(){
	      return this.$store.state.clients
	    },

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
	mounted(){
	      axios.get(this.$store.state.url+'/client/', this.headers)
	      .then((response) => {
	        this.$store.state.clients = response.data.results;
	      }).catch((error) => {
	      });
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
		setTel(){
	      for(let client of this.clients){
	        if (client.nom == this.client.nom) {
	          this.client.tel = client.tel;
	          return;
	        }
	      }
	    },
	    setNom(){
	      for(let client of this.clients){
	        if (client.tel == this.client.tel) {
	          this.client.nom = client.nom;
	          return;
	        }
	      }
	    },
		close(){
			this.lg_qtt = 0;
			this.sm_qtt = 0;
			this.$emit("close")
		},
		performAchat(){
			let data = {
				"quantite": this.poulet.quantite,
				"poids": this.poulet.poids,
				"prix_unitaire": this.poulet.prix_unitaire,
				"commentaire": this.poulet.commentaire,
				"salle": this.salle.id,
				"client": this.client
			};
			let url = this.$store.state.url
			axios.post(url+"/poulle_vendu/", data, this.headers)
			.then((response) => {
				let salles = this.$store.state.salles
				let salle = salles.find(x => x.id == this.salle.id);
				this.$store.state.oeufs.unshift(response.data)
				if(!!salle){
					salle.quantite -= response.data.quantite;
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
.buttons{
	padding-left: 30%;
}
</style>
