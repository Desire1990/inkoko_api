<template>
	<div  :class="{popup:true, active:visible}" @click="close">

		<div ref='modal' class="popup-body" @click.stop  >
			<center>
				<h3>Ajouter une Salle</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_nom">Nom:</label>
					<input type="text" v-model="salle.nom" id="id_nom" placeholder="le nom du salle">
				</div>
			  <div class="field">
			    <label>Selectionnez le type de poulle</label><br>
			    <select type="text" name="cars_id" v-model="salle.type_poulle" id="id_entrant">
			        <option>---- Selection d'une type ----</option>
			        <option value="poulet pondeuse">Poulet pondeuse</option>
			        <option value="poulet en chair">Poulet en chair</option>
			    </select>			  
			  </div>

				<div class="field">
					<label for="id_nom">Quantite:</label>
					<input type="text" v-model="salle.quantite" id="id_nom" placeholder="le nombre de poulles">
				</div>
        <div class="field">
          <label for="id_nom">Nom du responsable</label>
          <input type="text" list="noms" v-model="responsable.nom"
            id="id_nom" @change="setTel">
        </div>
        <div class="field">
          <label for="id_tel">Téléphone</label>
          <input type="text" v-model="responsable.telephone" id="id_tel"
             list="tels" @change="setNom">
        </div>
				<div class="logs">{{logs}}</div>
				<div style="float:right;">
					<button @click.prevent="createProduct" ref="submit">
						Créer
					</button>
				</div>				
    		</form>
    	<datalist id="noms">
        <option v-for="c in responsables" :value="c.nom"/>
      </datalist>

      <datalist id="tels">
        <option v-for="c in responsables" :value="c.tel"/>
      </datalist>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	props: {
		visible:{ type:Boolean, default:false},
		modelaVisible:true
	},
	data(){
		return {
			logs:"", salle:{nom:'', type_poulle:'', quantite:0},selectedId:null,responsable:{ nom:"", telephone:""},
			new_price:"", csv_array:[],
			csvData :{ size:0, fileData:[]}
		}
	},
	watch:{
		csv_array(new_val){
			if(new_val.length == 0){
				this.logs = "";
				this.$refs.submit.innerText = "Créer";
				return;
			}
			this.logs = new_val.length+" produits chargés";
			this.$refs.submit.innerText = "upload";
		}
	},
	computed:{
        responsables(){
          return this.$store.state.responsables
        },
        host(){
          return this.$store.state.url
        },
        username(){
          return this.$store.state.user.username
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
        if(this.responsables.length<1){
          axios.get(this.$store.state.url+'/responsable/', this.headers)
          .then((response) => {
            this.$store.state.responsables = response.data.results;
          }).catch((error) => {
          });
        }
      },
	methods: {
		close(){
			this.$emit("close");
		},
		  setTel(){
          for(let responsable of this.responsables){
            if (responsable.nom == this.responsable.nom) {
              this.responsable.telephone = responsable.telephone;
              return;
            }
          }
        },
        setNom(){
          for(let responsable of this.responsables){
            if (responsable.telephone == this.responsable.telephone) {
              this.responsable.nom = responsable.nom;
              return;
            }
          }
        },
		createProduct(){
			axios.post(this.$store.state.url+`/salle/`,{
            responsable: this.responsable,
            nom: this.salle.nom,
            type_poulle: this.salle.type_poulle,
            quantite: this.salle.quantite,
          }, this.headers)
			.then((response) => {
				this.$store.state.salles.push(response.data);
				this.$emit("close");
			}).catch((error) => {
				console.error(error);
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
[disabled]{
	border: 1px solid gray;
}
.buttons{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons *{
  margin: 0 5;
}
.logs{
  width: 180px;
  color: red;
}
</style>