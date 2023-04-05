<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar @changed="filterByDate" @searched="searchItem"/>
    </div>
    <div class="recycler">
    </div>
      <div class="scrollable-tab">
        <table class="table dettes">
          <thead>
            <tr class="panier-item">
              <th>id</th>
              <th>client</th>
              <th>Date</th>
              <th>somme</th>
              <th>payée</th>
              <th>Reste</th>
              <th>options</th>
            </tr>
          </thead>
          <tbody id="dettes">
            <tr v-for="dette in dettes"
                :class="{'uncommited':dette.uncommited>0}">
              <td>{{dette.id}}</td>
              <td>{{dette.client}}</td>
              <td>{{datetime(dette.date)}}</td>
              <td>{{(dette.a_payer) }} Fbu</td>
              <td>{{(dette.payee + dette.uncommited) }} Fbu</td>
              <td>{{(dette.reste - dette.uncommited) }} Fbu</td>
              <td>
                <div class="btns">
                  <button @click="rembourser(dette)"
                    v-if="dette.uncommited<dette.reste">
                    payer
                  </button>
                </div>
              </td>
            </tr>
        </tbody>
        <tfoot>
          <tr class="panier-item">
            <th>total</th>
            <th></th>
            <th></th>
            <th>{{(totals.a_payer)}} Fbu</th>
            <th>{{(totals.payee)}} Fbu</th>
            <th>{{(totals.reste)}} Fbu</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
    <RemboursDialog :visible='rembours_opened' :dette='active_dette' @close="rembours_opened=false"/>
  </div>
</template>

<script>
import axios from "axios";
import SearchBar from "../components/searchbar";
import RemboursDialog from "../components/dialog_rembours";

export default {
  components:{
    SearchBar, RemboursDialog
  },
  data(){
    return{
      dettes : this.$store.state.dettes,
      rembours_opened:false,
      active_dette :{},
      query_date : false
    }
  },
  computed:{
    totals(){
      let tots = { a_payer: 0, payee: 0, reste: 0}
      if (this.dettes.length == 0 ) return tots;
      for(let dette of this.dettes) {
        tots.a_payer += dette.a_payer;
        tots.payee += dette.payee;
        tots.reste += dette.reste - dette.uncommited;
      }
      return tots;
    },

  },
  methods:{
    searchItem(value){
      let returnedValues = {};
      if (value=='') {
        this.dettes = this.$store.state.dettes;
        return 
      }
      value = value.toLowerCase();
      returnedValues = this.dettes.filter(item => {
        return(
          item.id == value || 
          item.user.toLowerCase().includes(value) || 
          this.datetime(item.date).includes(value)||
          item.client.toLowerCase().includes(value)
        )
      })
      this.dettes = returnedValues;
    },
    rembourser(dette){
      this.active_dette = dette;
      this.rembours_opened = true ;
    },
    fetchData(){
      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+'/commande/dettes/', headers)
      .then((response) => {
        this.$store.state.dettes = response.data;
        this.dettes = response.data;
        this.$store.state.dettes_fetched = true;
        
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
      let since = e.du;
      let to = e.au;

      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+'/commande/dettes/'+since+'/'+to+'/', headers)
      .then((response) => {
        this.query_date = true;
        this.dettes = response.data;
      }).catch((error) => {
        this.query_date = false;
        console.error(error);
      }); 
    }
  },
  mounted(){
    if (!this.$store.state.dettes_fetched) {
      this.fetchData();
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
.uncommited{
  color: red;
}
.scrollable-tab table tfoot tr th{
  position: sticky;
  bottom: 0;
}
.hidden{
  visibility: hidden;
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
</style>
