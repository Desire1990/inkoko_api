<template>
	<div  :class="{popup:true, active:visible}" @click="close">

		<div ref='modal' class="popup-body" @click.stop  >
			<center>
				<h3>Creer Tranfer</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_nom">Nom:</label>
					<input type="text" v-model="transaction.nom" id="id_nom" placeholder="le nom ">
				</div>
				<div class="field">
					<label for="id_nom">Prenom:</label>
					<input type="text" v-model="transaction.prenom" id="id_nom" placeholder="le prenom">
				</div>
				<div class="field">
					<label for="id_nom">Adresse:</label>
					<input type="text" v-model="transaction.adresse" id="id_nom" placeholder="adresse">
				</div>
				<div class="field">
					<label for="id_entrant">Telephone:</label>
					<input type="text" v-model="transaction.telephone" id="id_entrant" placeholder="exemples: +25779462806">
				</div>

				<div class="field">
					<label for="id_prix">Montant:</label>
					<input type="number" name="prix" placeholder="le montant en euro" id="id_prix"
						v-model="transaction.montant_euro">
				</div>
				<div class="field">
					<label for="id_prix">Frais:</label>
					<input type="number" name="prix" placeholder="frais en %" id="id_prix"
						v-model="transaction.frais">
				</div>
				<div class="field" hidden>
          <label for="id_nom">Taux</label>
          <input type="number" list="noms" v-model="tau.taux"  placeholder="taux de change"
            id="id_nom" @change="setTaux">
        </div>
				<div class="logs">{{logs}}</div>
				<div class="buttons">
					<button @click.prevent="createTransaction" ref="submit">
						Créer
					</button>
				</div>				
    		</form>
    		<datalist id="noms">
	        <option v-for="c in taux" :value="c.taux"/>
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
			logs:"", transaction:{},tau:{},
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
			this.logs = new_val.length+" transactions chargés";
			this.$refs.submit.innerText = "upload";
		}
	},
	mounted(){
      axios.get(this.$store.state.url+'/taux/', this.headers)
      .then((response) => {
        this.$store.state.taux = response.data.results;
      }).catch((error) => {
      });
  },
	computed:{
		taux(){
      return this.$store.state.taux
    },
		headers(){
			return {
				headers: {
					"Authorization": "Bearer " + this.$store.state.user.access
				}
			}
		}
	},
	methods: {
		setTaux(){
      for(let tau of this.taux){
        if (tau.date= this.tau.date) {
          this.tau.taux = tau.taux;
          return;
        }
      }
    },
    setNom(){
      for(let tau of this.taux){
        if (tau.taux == this.tau.taux) {
          this.tau.date = tau.date;
          return;
        }
      }
    },
		close(){
			this.$emit("close");
		},
		createTransaction(){
			let data = {
				"nom": this.transaction.nom,
				"prenom": this.transaction.prenom,
				"telephone": this.transaction.telephone,
				"adresse": this.transaction.adresse,
				"montant_euro": this.transaction.montant_euro,
				"frais": this.transaction.frais,
				"tau": this.tau
			};
			axios.post(this.$store.state.url+`/transaction/`, data, this.headers)
			.then((response) => {
				this.transaction = {};
				this.$store.state.transactions.push(response.data);
				this.$emit("close");
			}).catch((error) => {
				console.error(error);
			})
		},
		download (data){
			const blob = new Blob([data], {type: 'text/csv'});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.setAttribute('hidden', '');
			a.setAttribute('href', url);
			a.setAttribute('download', 'model.csv');
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
        },
    generateCSV(){
			let data = `"sep=;"\nnom;unite;unite_sortant;rapport;prix_vente\n`
			this.download(data)
		},

		onPickFile () {
		  this.$refs.fileInput.click();
		},
		loadCSV(event){
			if (event.target.files && event.target.files[0]) {
		         let reader = new FileReader();
		         reader.readAsBinaryString(event.target.files[0]);

		         reader.onload = e => {
		            this.csvData.size = e.total;
		            this.csvData.fileData = e.target.result;
		            let xData = this.convertToJSON(this.csvData.fileData);
		            this.csv_array = xData;     
		         };
		     }
		},
		convertToJSON(data_csv){
			let lines=data_csv.trim().split("\n");
			let result = [];
			let headers=lines[0].trim().split(";");
			let line = [];
			let data = {};
			lines = lines.slice(1);

			for(let i=0;i<lines.length;i++){
				line = lines[i].trim().split(";");
				for(let j=0; j<line.length; j++){
					data[headers[j]] = line[j];
				}
				result.push(data);
				data = {};
			}
			return result; 
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
  margin-left: 35%;
}
.logs{
  width: 180px;
  color: red;
}
</style>