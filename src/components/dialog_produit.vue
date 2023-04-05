<template>
	<div  :class="{popup:true, active:visible}" @click="close">

		<div ref='modal' class="popup-body" @click.stop  >
			<center>
				<h3>Ajouter un Produit</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_nom">Nom:</label>
					<input type="text" v-model="produit.nom" id="id_nom" placeholder="le nom du produit">
				</div>
				<div class="field">
					<label for="id_entrant">Unité d'achat:</label>
					<input type="text" v-model="produit.unite" id="id_entrant" placeholder="exemples: kg,carton,casier...">
				</div>

				<div class="field">
					<label for="id_prix">Prix:</label>
					<input type="number" name="prix" placeholder="prix unitaire" id="id_prix"
						v-model="produit.prix_unitaire">
				</div>
				<div class="logs">{{logs}}</div>
				<div class="buttons">
					<button @click.prevent="createProduct" ref="submit">
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
			logs:"", produit:{},
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
		rapport(){
			let str = "1 "+this.produit.unite+
				" vaut combien de "+this.produit.unite_sortant+"?"
			return !this.produit.unite_sortant?1+" par defaut":str;
		},
		unite_sortant(){
			return !this.produit.unite?"exemples: kg,carton,casier...":
				this.produit.unite +" par defaut";
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
		close(){
			this.$emit("close");
		},
		uploadCSV(){
			axios.post(this.$store.state.url+`/produit/`, this.csv_array, this.headers)
			.then((response) => {
				this.$store.state.produits = this.$store.state.produits.concat(response.data);
				this.csv_array = [];
				this.close();
			}).catch((error) => {
				console.error(error);
			})
		},
		createProduct(){
			if(this.csv_array.length>0){
				this.uploadCSV();
				return;
			}
			if(!this.produit.nom){
				this.logs = "le nom est obligatoire"
				return;
			}
			if(!this.produit.unite){
				this.logs = "l'unité d'achat est obligatoire"
				return;
			}
			// if(!this.produit.rapport != !this.produit.unite_sortant){
			// 	this.logs = "le rapport et l'unité sortant vont de pair"
			// 	return;
			// }
			if(!this.produit.prix_achat){
				this.produit.prix_achat = 0;
				this.logs = ""
			}
			axios.post(this.$store.state.url+`/produit/`, this.produit, this.headers)
			.then((response) => {
				this.produit = {};
				this.$store.state.produits.push(response.data);
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
.buttons{
	display: flex;
	justify-content: center;
}
.logs{
  width: 180px;
  color: red;
}
</style>