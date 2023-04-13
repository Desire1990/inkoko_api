<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar @changed="filterByDate" @searched="searchItem" :show_date="userIs('admin')"/>
    </div>
    <div class="recycler">
    </div>
      <div class="scrollable-tab">
        <table class="table commandes">
          <thead>
            <tr class="panier-item">
              <th>#</th>
              <th>Date</th>
              <th>Responsable</th>
              <th>options</th>
            </tr>
          </thead>
          <tbody id="commandes">
            <tr v-for="commande, count in rations.results">
              <th>{{count+1}}</th>
              <td>{{datetime(commande.date)}}</td>
              <td>{{(commande.responsable)}}</td>              
              <td>
                <div class="btns">
                  <button @click="showDetails(commande)">
                    détails
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
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
      rations : this.$store.state.rations,
      details_opened:false,
      active_commande :{},
    }
  },
  computed:{
    totals(){
      let tots = { a_payer: 0, payee: 0, reste: 0}
      if (this.commandes.length == 0 ) return tots;
      for(let commande of this.commandes) {
        tots.a_payer += commande.a_payer;
        tots.payee += commande.payee;
        tots.reste += commande.reste;
      }
      return tots;
    },
  },
  methods:{
    userIs(group){
      return this.$store.state.user.groups.includes(group);
    },
     searchItem(value){
      let returnedValues = {};
      this.rations = this.$store.state.rations;
      if (value=='') return 
      value = value.toLowerCase().split(",")
      returnedValues = this.$store.state.rations.filter(item => {
        if(!value[1]){
          return(
            item.id == value || 
            item.user.toLowerCase().includes(value[0]) || 
            this.datetime(item.date).includes(value[0])||
            item.produit.toLowerCase().includes(value[0])
          )
        } else {
          return (
            (
              item.id == value || 
              item.user.toLowerCase().includes(value[0]) ||
              this.datetime(item.date).includes(value[0])||
              item.produit.toLowerCase().includes(value[0])
            )&&(
              item.id == value || 
              item.user.toLowerCase().includes(value[0]) ||
              this.datetime(item.date).includes(value[0])||
              item.produit.toLowerCase().includes(value[0])
            )
          )
        }
      })
      this.rations = returnedValues;
    },
    showDetails(commande){
      this.active_commande = commande;
      this.details_opened=true;
    },
    fetchData(){
      let headers = {
          headers: {
            "Authorization": "Bearer " + this.$store.state.user.access
          }
        }
      axios.get(this.$store.state.url+'/ration/', headers)
      .then((response) => {
        this.$store.state.rations = response.data;
        this.rations = response.data;
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
      axios.get(this.$store.state.url+`/ration/?du=${since}&au=${to}`, headers)
      .then((response) => {
        this.query_date=true;
        this.rations = response.data;
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
  padding-left: 5px;
}
</style>
