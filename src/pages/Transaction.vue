<template>
  <div class="parent">
    <div class="top">
      <SearchBar :show_date="true"  @changed="filterByDate" @searched="performFilter" />
    </div><br>
    <div>
        <label v-if="$store.state.user.groups.includes('admin')">
        	<button @click="add_mod=true">Taux</button>
        	<button @click="add_mode=true">Ajouter</button>
        </label>
    	<!-- <h2 style="text-align:center; text-transform:uppercase;">Toutes les transactions</h2><br><br> -->
    </div>
    <div class="recycler">
    </div>
		<div class="scrollable-tab">
        <table class="table paiements">
          <thead style="text-transform:capitalize;">
            <tr class="panier-item">
              <th>#</th>
              <!-- <th>Agent</th> -->
              <th>nom & Prenom</th>
              <th>telephone</th>
              <th>Adresse</th>
              <th v-if="$store.state.user.groups.includes('admin')" >montant ($)</th>
              <th>montant (Fbu)</th>
              <th v-if="$store.state.user.groups.includes('admin')" >taux</th>
              <th v-if="$store.state.user.groups.includes('admin')">Frais</th>
              <th>date</th>
              <th>valider</th>
            </tr>
          </thead>
          <tbody id="paiements">
						<tr v-for="item, count in items">
              <th>{{ count+1 }}</th>
              <!-- <td>{{ item.user.username }}</td> -->
              <td>{{ item.nom }} {{ item.prenom }}</td>
              <td>{{ item.telephone }}</td>
              <td>{{ item.adresse }}</td>
              <td v-if="$store.state.user.groups.includes('admin')">{{money(item.montant_euro)}} $</td>
              <td>{{money((item.montant_euro*item.taux)-(item.montant_euro*item.taux)*item.frais/100)}} Fbu</td>
              <td v-if="$store.state.user.groups.includes('admin')">{{(item.taux)}} Fbu</td>
              <td v-if="$store.state.user.groups.includes('admin')">{{(item.frais)}} %</td>
              <!-- <td v-if="$store.state.user.groups.includes('admin')">{{ item.validated }}</td> -->
              <td>{{datetime(item.date)}}</td>
              <td v-if='item.validated==false'>
                <div class="btns">
                  <button v-if="$store.state.user.groups.includes('admin')" @click.prevent="startEdit(item)">Edit</button>
                  <button style="background-color:red;" v-if="$store.state.user.groups.includes('admin')"  @click.prevent="Delete(item)">Delete</button>
                </div>
                <div class="btns">
                  <!-- <button @click.prevent="startEdit(item)">Edit</button> -->
                  <button v-if="$store.state.user.groups.includes('gestionnaire')" @click.prevent="Valider(item)" class="valider">valider</button>
                </div>
              </td>
              <td v-else></td>
            </tr>
        </tbody>
		<tfoot>
			<tr class="panier-item">
				<th colspan="4">Total</th>
				<th v-if="$store.state.user.groups.includes('admin')">{{money(total())}} $</th>
				<th>{{money(totale())}} Fbu</th>
				<th colspan="3"></th>

			</tr>
		</tfoot>
      </table>
	</div>
  	<EditDialog :visible="edit_mode" :produit="active_item" @close="exitEdition"/>
  	<AchatDialog :visible="achat_mode" :produit="active_item" @close="exitEdition"/>
  	<ProduitDialog :visible="add_mode" @close="exitEdition"/>
  	<TauxDialog :visible="add_mod" @close="exitEdition"/>
  </div>
</template>
<script>
import axios from "axios"
import SearchBar from "../components/searchbar.vue";
import Item from "../components/achat_item.vue";
import EditDialog from "../components/dialog_edit_transaction.vue";
import ProduitDialog from "../components/dialog_transaction.vue";
import TauxDialog from "../components/dialog_taux.vue";
import AchatDialog from "../components/dialog_achat.vue";

export default{
	components:{SearchBar, Item, EditDialog, AchatDialog, ProduitDialog, TauxDialog},
	data(){
		return {
			csvData : {},
			items:this.$store.state.transactions,
			active_item:{},
			edit_mode:false, achat_mode:false, add_mode:false, add_mod:false
		}
	},
	watch:{
		"$store.state.transactions"(new_val){
			this.items = new_val;
		}
	},
	methods:{
    Delete(item) {
			let headers = {
					headers: {
					"Authorization": "Bearer " + this.$store.state.user.access
					}
				};
        if (confirm('Delete ' + item.id)) {
            axios.delete(this.$store.state.url+`/transaction/${item.id}/`, headers)
                .then( response =>                     
                {
                    this.fetchData()
                    return response
                }
            );
        }
    },
		successAlert() {  
        this.$swal({  
            type: 'success',  
            title: 'Valider la transaction',  
            text: 'Transaction validée avec succès!!!!'  
        });  
    }, 
		Valider(item){
		 let headers = {
				headers: {
				"Authorization": "Bearer " + this.$store.state.user.access
				}
			};
  		axios.get(this.$store.state.url + `/transaction/${item.id}/valider/`,headers)
  		.then(response =>{
  			this.fetchData()
  			this.successAlert()
  		})
  	},
  	performFilter(value){
			let data = this.$store.state.transactions.filter( x => {
				return x.id == value |
					x.nom.toLowerCase().includes(value.toLowerCase())|
					x.telephone.toLowerCase().includes(value.toLowerCase())|
					x.prenom.toLowerCase().includes(value.toLowerCase())
			});
			this.items = data;
		},
		fetchData(){
      let headers = {
          headers: {
            "Authorization": "Bearer " + this.$store.state.user.access
          }
        }
      if(this.$store.state.users.length==0){
        axios.get(this.$store.state.url+'/transaction/', headers)
        .then((response) => {
          this.$store.state.transactions = response.data.results;
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
    filterByDate(e){
      let since = e.du;
      let to = e.au;

      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+`/transaction/?du=${since}&au=${to}`, headers)
      .then((response) => {
        this.query_date=true;
        this.items = response.data.results;
      }).catch((error) => {
        this.query_date = false;
        console.log(error);
      });
      
    },
		total(){
			let total = 0;
			for(let item of this.items){
				if(item.validated==true){
					total += (item.montant_euro);
				}
			}
			return total;
		},
		totale(){
			let total = 0;
			for(let item of this.items){
				if(item.validated==true){
					total += ((item.montant_euro*item.taux)-(item.montant_euro*item.taux)*item.frais/100);
				}
			}
			return total;
		},
		exitEdition(){
			this.active_item = {};
			this.edit_mode = false;
			this.achat_mode = false;
			this.add_mode = false;
			this.add_mod = false;
		},
		startEdit(item){
			this.active_item = item;
			this.edit_mode = true;
		},
		startAchat(item){
			this.active_item = item;
			this.achat_mode = true;
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
		level(quantite){
			if(quantite==0) return "empty";
			if(quantite<=5) return "low";
		},
		onPickFile () {
		  this.$refs.fileInput.click();
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
@media screen and (max-width: 300px){
  .scrollable-tab{
    position: inherit;
    height: auto;
    overflow-y: hidden;
  }
  .scrollable-tab table thead tr th{
    position: inherit;
  }
}
table,th, td {
  border: 1px solid black;
	padding: 5px;
}
label{
	float: right;
	padding: 5px;
	margin-right: 10px;
}
.valider:hover{
	box-shadow: red;
}
</style>
