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
					<input type="text" v-model="transaction.adresse" id="id_nom" placeholder="l'adresse'">
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
					<label for="id_prix">Montant:</label>
					<input type="number" name="prix" placeholder="frais en %" id="id_prix"
						v-model="transaction.frais">
				</div>
				<div class="logs">{{logs}}</div>
				<div class="buttons">
					<button @click.prevent="createTransaction" ref="submit">
						Créer
					</button>
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
		modelaVisible:true
	},
	data(){
		return {
			logs:"", transaction:{},
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
	computed:{
		headers(){
			return {
				headers: {
					"Authorization": "Bearer " + this.$store.state.user.access
				}
			}
		}
	},
	methods: {
		close(){
			this.$emit("close");
		},
		createTransaction(){
			if(this.csv_array.length>0){
				this.uploadCSV();
				return;
			}
			if(!this.transaction.nom){
				this.logs = "le nom est obligatoire"
				return;
			}
			if(!this.transaction.prenom){
				this.logs = "le prenom est obligatoire"
				return;
			}
			if(!this.transaction.adresse){
				this.logs = "l'adresse est obligatoire"
				return;
			}
			if(!this.transaction.telephone){
				this.logs = "le telephone est obligatoire"
				return;
			}
			if(!this.transaction.montant_euro){
				this.transaction.montant_euro = 0;
				this.logs = ""
			}
			if(!this.transaction.frais){
				this.transaction.frais = 0;
				this.logs = ""
			}
			axios.post(this.$store.state.url+`/transaction/`, this.transaction, this.headers)
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