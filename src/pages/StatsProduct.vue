<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar @changed="filterByDate" @searched="performFilter"/>
    </div>
    <div class="recycler">
    </div>
      <div class="scrollable-tab">
        <table class="table ventes">
          <thead>
            <tr class="panier-item">
              <th>id</th>
              <th>produit</th>
              <th>quantité consommée</th>
              <th>prix d'achat total</th>
            </tr>
          </thead>
          <tbody id="ventes">
              <tr v-for="entries, count in Object.entries(grouped_ventes)">
                <td>{{ count+1 }}</td>
                <td>{{ entries[0] }}</td>
                <td>{{ entries[1].quantite }}</td>
                <td>{{ money(entries[1].prix_achat||null) }}</td>
              </tr>
          </tbody>
          <tfoot>
            <tr class="panier-item">
              <th colspan="3">total</th>
              <th>{{money(totals.achat)}} Fbu</th>
            </tr>
          </tfoot>
        </table>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import SearchBar from "../components/searchbar";

export default {
  components:{
    SearchBar
  },
  data(){
    return{
      ventes : [],
      query_date : false
    }
  },
  computed:{
    totals(){
      let tot = {"achat":0,"vente":0};
      for(let entries of Object.entries(this.grouped_ventes)) {
        tot.vente += entries[1].prix_vente || 0;
        tot.achat += entries[1].prix_achat || 0
      }
      return tot;
    },
    grouped_ventes(){
      let new_ventes = {};
      let new_vente = null
      let tot_vente = 0
      let tot_achat = 0
      for(let vente of this.ventes){
        tot_vente = vente.prix_vente*vente.quantite
        tot_achat = vente.prix_achat*vente.quantite
        if(vente.produit in new_ventes){
          new_vente = new_ventes[vente.produit];
          new_vente.quantite += vente.quantite
          new_vente.prix_vente += tot_vente
          new_vente.prix_achat += tot_achat
          new_vente.benefice += !!vente.prix_achat?tot_vente-tot_achat:0
        } else {
          new_vente = {
            "id": vente.produit_id,
            "quantite": vente.quantite,
            "prix_achat": vente.prix_achat*vente.quantite,
            "prix_vente": vente.prix_vente*vente.quantite,
            "benefice": !!vente.prix_achat?tot_vente-tot_achat:null,
          }
        }
        new_ventes[vente.produit] = new_vente;
      }
      return new_ventes
    }
  },
  methods:{
    totalAchat(vente){
      if(!vente) return 0
      return !!vente.prix_achat?vente.prix_achat*vente.quantite:0
    },
    totalVente(vente){
      if(!vente) return 0
      return vente.prix_vente*vente.quantite
    },
    searchItem(value){
      let returnedValues = {};
      if (value=='') 
        this.ventes = this.$store.state.ventes;
      else{
        this.ventes = this.$store.state.ventes.filter(x => {
          return x.produit.toLowerCase().includes(value.toLowerCase())
        })
      }
    },
    performFilter(value){
      let data = this.$store.state.produits.filter( x => {
        return x == value |
          x.toLowerCase().includes(value.toLowerCase())
      });
      this.items = data;
    },
    filterByDate(e){
      let since = e.du;
      let to = e.au;

      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      let path = `/vente/?commande__date__gte=${since} 00:00&commande__date__lte=${to} 23:59`
      axios.get(this.$store.state.url+path, headers)
      .then((response) => {
        this.ventes = response.data.results;
      }).catch((error) => {
        console.error(error);
      });
    },

    fetchData(){
      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      let d = new Date();
      let to = new Date().toISOString()
      let since = new Date(d.setDate(1)).toISOString();

      let path = `/vente/?commande__date__gte=${since}&commande__date__lte=${to}`
      axios.get(this.$store.state.url+path, headers)
      .then((response) => {
        this.$store.state.ventes = response.data;
        this.ventes = response.data.results;
      }).catch((error) => {
      });
    }
  }
  ,
  mounted(){
    this.fetchData();
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
table, thead, td, th{
  border: 1px solid black;
  padding: 5px;
}
</style>
