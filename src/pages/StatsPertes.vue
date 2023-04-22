<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar @changed="filterByDate" @searched="searchItem"/>
    </div>
    <div class="recycler">
    </div>
      <div class="scrollable-tab">
        <table class="table pertes">
          <thead>
            <tr class="panier-item" style="text-transform: capitalize;">
              <!-- <th>id</th> -->
              <th>salle</th>
              <th>du</th>
              <th>au</th>
              <th>quantité perdu</th>
              <th>prix de vente</th>
            </tr>
          </thead>
          <tbody id="pertes">
              <tr v-for="perte, count in pertes">
                <!-- <th>{{ count+1 }}</th> -->
                <td>{{ perte.salle }}</td>
                <td>{{ datetime(since) }}</td>
                <td>{{ datetime(to) }}</td>
                <td>{{ perte.quantite }} poulles</td>
                <td>{{ money(perte.total) }}</td>
              </tr>
          </tbody>
          <tfoot>
            <tr class="panier-item">
              <th colspan="4">total</th>
              <th>{{money(total)}} Fbu</th>
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
      query_date : false,
      pertes : [], to:String(new Date()),
      since:new Date(new Date().setUTCDate(new Date().getUTCDate() -7))
    }
  },
  computed:{
    total(){
      let tot = 0;
      if (this.pertes.length == 0 ) return tot;
      for(let perte of this.pertes) {
        tot += perte.total;
      }
      return tot;
    }
  },
  methods:{

    searchItem(value){
      let returnedValues = {};
      if (value=='') 
        return this.fetchData();
      !this.query_date && value!= ''? 
        returnedValues = this.pertes.filter(item => {
          return item.id == value | item.produit.toLowerCase().includes(value.toLowerCase())
        }) :
        returnedValues = this.pertes.filter(item => {
          return item.id == value | item.produit.toLowerCase().includes(value.toLowerCase())
        })


      this.pertes = returnedValues;
    },

    filterByDate(e){
      this.since = e.du;
      this.to = e.au;

      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+'/perte/stats/'+this.since+'/'+this.to+'/', headers)
      .then((response) => { 
        this.query_date = true;
        this.pertes = response.data;
        console.log(this.pertes)
      }).catch((error) => {
        this.query_date = false;
        console.error(error);
      });
      
    },

    fetchData(){
      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+'/perte/stats/', headers)
      .then((response) => {
        this.pertes = response.data;
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
