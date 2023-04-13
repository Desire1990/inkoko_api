<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar @changed="filterByDate" @searched="performFilter" :show_date="userIs('admin')||userIs('gestionnaire')"/>
    </div>
    <div class="recycler">
    </div>
      <div class="scrollable-tab">
        <table class="table commandes">
          <thead>
            <tr class="panier-item">
              <th>#</th>
              <th>Date</th>
              <th>Client</th>
              <th>Prix</th>
              <th>Quantite</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody id="commandes">
            <tr v-for="commande, count in items">
              <th>{{count+1}}</th>
              <td>{{datetime(commande.date)}}</td>
              <td>{{(commande.client)}}</td>              
              <td>{{(commande.prix)}} Fbu</td>              
              <td>{{(commande.quantite)}}</td>              
              <td>{{money(commande.prix*commande.quantite)}} Fbu</td>              
            </tr>
          </tbody>
          <tfoot>
            <tr class="panier-item">
              <th colspan="4">Total</th>
              <th>{{(totale())}} oeufs</th>
              <th>{{money(total())}} Fbu</th>
            </tr>
          </tfoot>
        </table>
      </div>
     <DetailsDialog :visible='details_opened' :commande='active_commande' @close="details_opened=false"/>
  </div>
</template>

<script>
import axios from "axios";
import SearchBar from "../components/searchbar";
import DetailsDialog from "../components/dialog_ventes";

export default {
  components:{
    SearchBar, DetailsDialog
  },
  data(){
    return{
      query_date : false,
      items : this.$store.state.oeufs_vendus,
      details_opened:false,
      active_commande :{},
    }
  },
  watch:{
    "$store.state.items"(new_val){
      this.items = new_val;
    }
  },

  methods:{
    total(){
      let total = 0;
      for(let item of this.items){
        total += (item.prix * item.quantite);
      }
      return total;
    },
    totale(){
      let total = 0;
      for(let item of this.items){
        total += (item.quantite);
      }
      return total;
    },
    userIs(group){
      return this.$store.state.user.groups.includes(group);
    },
    performFilter(value){
      let data = this.$store.state.oeufs_vendus.filter( x => {
        return x.id == value |
          x.client.toLowerCase().includes(value.toLowerCase())|
          x.date.toLowerCase().includes(value.toLowerCase())
      });
      this.items = data;
    },
    fetchData(){
      let headers = {
          headers: {
            "Authorization": "Bearer " + this.$store.state.user.access
          }
        }
      axios.get(this.$store.state.url+'/oeuf_vendu/', headers)
      .then((response) => {
        this.$store.state.oeufs_vendus = response.data.results;
        this.items = response.data.results;
        this.$store.state.commandes_fetched = true;
      }).catch((error) => {
        if(error.response.data.code == "token_not_valid"){
          let data = {
            refresh: this.$store.state.user.refresh
          };
          axios.post(this.$store.state.url+'/refresh/', data)
          .then((response) => {
            this.$store.state.user.access = response.data.access;
            this.fetchData()
          }).catch((error) =>{
            this.$store.state.user = null;
          })
        }
      });
    },
    filterByDate(e){
      let since = e.du;
      let to = e.au;

      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+`/oeuf_vendu/?du=${since}&au=${to}`, headers)
      .then((response) => {
        this.query_date=true;
        this.items = response.data.results;
      }).catch((error) => {
        this.query_date = false;
        console.log(error);
      });
      
    }
  },
  mounted(){
    // if(!this.$store.state.commandes_fetched){
      this.fetchData()
    // }
  }
};
</script>
<style scoped>
.top{
  display: flex;
  justify-content: center;
}
.scrollable-tab{
  width: 100%;
  /*height: 0px;*/
  overflow: auto;
  padding: 0 20px;
  position: relative;
}
.uncommited{
  color: red;
}
.scrollable-tab table thead tr th{
  position: sticky;
  top: 0;
}
.scrollable-tab table tfoot tr th{
  position: sticky;
  bottom: 0;
}
@media screen and (max-width: 650px){
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
  padding-left: 10px;
}
</style>
