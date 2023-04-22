<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar @changed="filterByDate" @searched="searchItem"/>
    </div>
    <div class="recycler">
    </div>
      <div class="scrollable-tab">
        <table class="table stats">
          <thead>
            <tr class="panier-item" style="text-transform:capitalize;">
              <!-- <th>id</th> -->
              <th>client</th>
              <th>télephone</th><!-- 
              <th>nombre de fois</th>
              <th>la somme payée</th> -->
            </tr>
          </thead>
          <tbody id="stats">
              <tr v-for="stat in stats">
                <!-- <th>{{ stat.id }}</th> -->
                <td>{{ stat.nom }}</td>
                <td>{{ stat.tel }}</td><!-- 
                <td>{{ stat.commande }}</td>
                <td>{{ money(stat.total) }}</td> -->
              </tr>
          </tbody><!-- 
          <tfoot>
            <tr class="panier-item">
              <th colspan="4">total</th>
              <th>{{money(total)}} Fbu</th>
            </tr>
          </tfoot> -->
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
      stats : []
    }
  },
  methods : {
    searchItem(value){
      let returnedValues = {};
      if (value=='') 
        return this.fetchData();
      !this.query_date && value!= ''? 
        returnedValues = this.$store.state.stats.filter(item => {
          return item.id == value | item.nom.toLowerCase().includes(value.toLowerCase())
        }) :
        returnedValues = this.stats.filter(item => {
          return item.id == value | item.nom.toLowerCase().includes(value.toLowerCase())
        })


      this.stats = returnedValues;
    },

    filterByDate(e){
      let since = e.du;
      let to = e.au;

      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+'/client/'+since+'/'+to+'/', headers)
      .then((response) => {
        this.query_date = true;
        this.stats = response.data.results;
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
      axios.get(this.$store.state.url+'/client/', headers)
      .then((response) => {
        this.$store.state.stats = response.data;
        this.stats = response.data.results;
        console.log(response.data)
      }).catch((error) => {
      });
    }


  },
  computed:{
    total(){
      let tot = 0;
      for(let stat of this.stats) {
        tot += stat.total;
      }
      return tot;
    }
  },
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
