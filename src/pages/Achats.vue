<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar
        @changed="filterByDate" @searched="searchItem"
        :show_date="userIs('admin')"
      />
    </div>
    <div class="recycler">
    </div>
      <div class="scrollable-tab">
        <table class="table achats">
          <thead>
            <tr class="panier-item" style="text-transform:capitalize;">
              <!-- <th>#</th> -->
              <th>nom</th>
              <th>quantité</th>
              <th>prix unitaire</th>
              <th>prix d'achat</th>
              <th>acheteur</th>
              <th>date</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody id="achats">
              <tr v-for="achat, count in achats">
                <!-- <th>{{ count+1 }}</th> -->
                <td>{{ achat.produit.nom }}</td>
                <td>{{ achat.quantite }} {{ achat.produit.unite }}</td>
                <td>{{ money(achat.prix_unitaire) }}</td>
                <td>{{ money(achat.prix_total) }} Fbu</td>
                <td>{{ achat.user }}</td>
                <td>{{ datetime(achat.date) }}</td>
                <td>{{achat.details}}</td>
                  <!-- <button @click="modifier(achat)" v-if="userIs('admin')">
                    modifier
                  </button>
                </td> -->
              </tr>
          </tbody>
          <tfoot>
            <tr class="panier-item">
              <th colspan="3">total</th>
              <th>{{money(total)}} Fbu</th>
              <th colspan="3"></th>

            </tr>
          </tfoot>
        </table>
      </div>
    <AchatDialog :visible="achat_mode" :achat="active_item" :produit="produit" @close="exitEdition"/>
  </div>
</template>

<script>
import axios from "axios";
import SearchBar from "../components/searchbar";
import AchatDialog from "../components/dialog_achat";

export default {
  data(){
    return {
      achats : this.$store.state.achats,
      query_date:false, active_item:null,
      achat_mode:false
    }
  },
  components:{
    SearchBar, AchatDialog
  },
  watch:{
    "$store.state.achats"(new_val){
      this.achats = this.$store.state.achats;
    }
  },
  computed:{
    total(){
      let tot = 0;
      if (this.achats.length == 0 ) return tot;
      for(let achat of this.achats) {
        tot += achat.prix_total;
      }
      return tot;
    },
    produit(){
      if(!this.active_item) return {rapport:1};
      console.log(this.active_item)
      let p;
      p = this.$store.state.produits.find(x => x.nom==this.active_item.produit);
      return p;
    }
  },
  methods:{
    searchItem(value){
      let returnedValues = {};
      this.achats = this.$store.state.achats;
      if (value=='') return 
      value = value.toLowerCase().split(",")
      returnedValues = this.achats.filter(item => {
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
      this.achats = returnedValues;
    },
    getMonday() {
      let d = new Date();
      var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1);
      return new Date(d.setDate(diff)).toISOString();
    },
    fetchAchats(){
      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      let args = `date__lte=${new Date().toISOString()}&date__gte=${this.getMonday()}`
      axios.get(this.$store.state.url+`/achat/?${args}`, headers)
      .then((response) => {
        this.$store.state.achats = response.data.results;
        this.achats = response.data.results;
      }).catch((error) => {
        if(error.response.data.code == "token_not_valid"){
          let data = {
            refresh: this.$store.state.user.refresh
          };
          axios.post(this.$store.state.url+'/refresh/', data)
          .then((response) => {
            this.$store.state.user.access = response.data.access;
            headers.headers.Authorization = "Bearer " + response.data.access
          }).catch((error) =>{
            this.$store.state.user = null;
          })
        }
      });
    },
    filterByDate(e){
      let since = new Date(e.du).toISOString();
      let to = new Date(e.au).toISOString();

      let args = `date__lte=${to}&date__gte=${since}`

      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+`/achat/?${args}`, headers)
      .then((response) => {
        this.query_date=true
        this.$store.state.achats = response.data.results;
      }).catch((error) => {
        this.query_date=false;
        console.error(error);
      });
      
    },
    modifier(achat){
      this.active_item = achat;
      this.achat_mode = true;
    },
    exitEdition(){
      this.achat_mode = false;
    }
  },
  mounted(){
    if(!this.$store.state.achats_fetched){
      this.fetchAchats();
    }
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
table,th, td {
  border: 1px solid black;
  padding: 5px;
}
</style>
