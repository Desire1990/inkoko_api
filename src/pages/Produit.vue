<template>
  <div class="parent">
    <div class="top">
      <SearchBar :show_date="false" @searched="performFilter"/>
    </div>
<!-- 		<div class="btns">
			<button @click="generateCSV"><fa icon="download"/> Generer un model</button>
			<button @click.prevent="onPickFile">
				<fa icon="upload"/> Charger
			</button>
			<input type="file" style="display: none"
				ref="fileInput" accept="text/csv"
				@change="uploadCSV">
		</div> -->
    <!-- <div class="recycler"> -->
    <!-- </div> -->
		<div class="scrollable-tab">
        <table class="table paiements">
         <thead>
            <tr class="panier-item">
              <!-- <th>#</th> -->
              <th>nom</th>
              <th>quantite</th>
              <th>date</th>
              <th>prix d'achat</th>
              <th>prix d'achat Total</th>
              <th>
              	<button @click="add_mode=true">Ajouter</button>
              </th>
            </tr>
          </thead>
          <tbody id="paiements">
            <tr v-for="(item, count) in items" :class="level(item.quantite)">
              <!-- <th>{{ count+1}}</th> -->
              <td>{{ item.nom }}</td>
              <td>{{ item.quantite }} {{ item.unite }}</td>
              <td>{{ datetime(item.date) }}</td>
              <td>{{money(item.prix_unitaire)}} Fbu</td>
              <td>{{money(item.prix_unitaire * item.quantite)}} Fbu</td>
              <td>
                <div class="btns">
                  <button v-if='$store.state.user.groups.includes("admin")' @click.prevent="startEdit(item)">Edit</button>
                  <button @click.prevent="startAchat(item)" style="background-color:teal;">Acheter</button>
                </div>
              </td>
            </tr>
        </tbody>
		<tfoot>
			<tr class="panier-item">
				<th colspan="4">total</th>
				<th>{{money(total())}} Fbu</th>
				<th colspan="2"></th>
			</tr>
		</tfoot>
      </table>
	</div>
  	<EditDialog :visible="edit_mode" :produit="active_item" @close="exitEdition"/>
  	<AchatDialog :visible="achat_mode" :produit="active_item" @close="exitEdition"/>
  	<ProduitDialog :visible="add_mode" @close="exitEdition"/>
  </div>
</template>
<script>
import axios from "axios"
import SearchBar from "../components/searchbar.vue";
import Item from "../components/achat_item.vue";
import EditDialog from "../components/dialog_edit_produit.vue";
import ProduitDialog from "../components/dialog_produit.vue";
import AchatDialog from "../components/dialog_achat.vue";

export default{
	components:{SearchBar, Item, EditDialog, AchatDialog, ProduitDialog},
	data(){
		return {
			csvData : {},
			items:this.$store.state.produits,
			active_item:{},
			edit_mode:false, achat_mode:false, add_mode:false
		}
	},
	watch:{
		"$store.state.produits"(new_val){
			this.items = new_val;
		}
	},
	methods:{
		fetchData(){
      let headers = {
          headers: {
            "Authorization": "Bearer " + this.$store.state.user.access
          }
        }
      if(this.$store.state.users.length==0){
        axios.get(this.$store.state.url+'/produit/', headers)
        .then((response) => {
          this.$store.state.produits = response.data.results;
          this.items = response.data.results;
          console.log(response.data.results)
        }).catch((error) => {
          if(error.response){
          }else{
            console.error(error)
          }
        });
      }
    },
		total(){
			let total = 0;
			for(let item of this.items){
				total += (item.prix_unitaire * item.quantite);
			}
			return total;
		},
		exitEdition(){
			this.active_item = {};
			this.edit_mode = false;
			this.achat_mode = false;
			this.add_mode = false;
		},
		startEdit(item){
			this.active_item = item;
			this.edit_mode = true;
		},
		startAchat(item){
			this.active_item = item;
			this.achat_mode = true;
		},
		
		performFilter(value){
			let data = this.$store.state.produits.filter( x => {
				return x.id == value |
					x.nom.toLowerCase().includes(value.toLowerCase())
			});
			this.items = data;
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

			let data = this.items;
			let headers = `id;produit;quantite;prix_achat;details\n`;
			for (var i = 0;i< data.length ; i++) {
				headers += data[i].id+';'+data[i].nom+'\n';
			}
			console.log(headers);
			this.download(headers);

		},
		level(quantite){
			if(quantite==0) return "empty";
			if(quantite<=5) return "low";
		},
		onPickFile () {
		  this.$refs.fileInput.click();
		},
		uploadCSV(event){
			if (event.target.files && event.target.files[0]) {
		         let reader = new FileReader();
		         reader.readAsBinaryString(event.target.files[0]);
		         reader.onload = e => {
		            console.log(e);
		            this.csvData.size = e.total;
		            this.csvData.fileData = e.target.result;
		            let xData = this.convertToJSON(this.csvData.fileData);
		            console.log(xData);
		            console.table(xData);
		         };
		     }
		},
		convertToJSON(data_csv){
			let lines=data_csv.trim().split("\n");
			let result = [];
			let headers=lines[0].split(";");
			let line = [];
			let data = {};
			lines = lines.slice(1);
			for(let i=0;i<lines.length;i++){
				line = lines[i].split(";");
				for(let j=0; j<line.length; j++){
					if((line.indexOf(line[j]) !==0) && (!(isNaN(line[j])))){
						let x = Number.parseFloat(line[j]);
						data[headers[j]] = x.toFixed(2);
					}
					else{
						data[headers[j]] = line[j];
					}
				}
				result.push(data);
				data = {};
			}

			return result; 
		},
	},
	mounted(){
		this.fetchData()
	}
};
</script>
<style scoped>
.top{
  display: flex;
  justify-content: center;
}
.empty{
	color: red;
}
.low{
	color:#a50;
}
.scrollable-tab{
  width: 100%;
  /*height: 0px;*/
  overflow: auto;
  padding: 0 20px;
  position: relative;
}
.scrollable-tab table thead tr th{
  position: sticky;
  top: 0;
}
.scrollable-tab table tfoot tr th{
  position: sticky;
  bottom: 0;
}
.btns{
	display: flex;
}
.hidden{
  visibility: hidden;
}
@media screen and (max-width: 320px){
  .scrollable-tab{
    position: inherit;
    height: auto;
    overflow-y: hidden;
  }
  .scrollable-tab table thead tr th{
    position: inherit;
  }
}
thead{
    text-transform: capitalize;	
}
table,th, td {
  border: 1px solid black;
	padding: 5px;
}
</style>
