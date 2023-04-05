<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar :show_date="false" @searched="searchItem"/>
    </div>
      <label>
        <button style="float: right; margin-right:50px" @click="perte_shown=true">ajouter</button>
      </label>
    <div class="recycler">
    </div>
    <div class="scrollable-tab">
      <table class="table items">
        <thead>
          <tr class="panier-item" style="text-transform:capitalize;">
            <th>id</th>
            <th>Utilisateur</th>
            <th>Salle</th>
            <th>date</th>
            <th>quantité perdu</th>
            <th>prix vente</th>
            <th>motif</th>
            <th v-if ="userIs('admin')">Action</th>
          </tr>
        </thead>
        <tbody id="pertes">
          <tr v-for="perte in items" v-if="!perte.validated">
            <td>{{ perte.id }}</td>
            <td>{{ perte.user.username }}</td>
            <td>{{ perte.salle }}</td>
            <td>{{ datetime(perte.date) }}</td>
            <td>{{ perte.quantite }} poulles</td>
            <td>{{ money(perte.prix_unitaire*perte.quantite) }}</td>
            <td>{{ perte.commentaire }}</td>
            <td v-if="userIs('admin')">
              <button @click="acceptPerte(perte)">Accepter</button>
              <button @click="deletePerte(perte)">Refuser</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="panier-item">
            <th colspan="5">total</th>
            <th>{{money(total)}} Fbu</th>
            <th></th>
<!--             <th>
              <button @click="perte_shown=true">ajouter</button>
            </th> -->
<!--             <th v-if="userIs('admin')">
                <button>Tout accepter</button>
                <button>Tout refuser</button>
            </th>
 -->          </tr>
        </tfoot>
      </table>
    </div>
    <PerteDialog :visible.sync="perte_shown"
      @close="perte_shown=false" @added="pushPerte"/>
  </div>
</template>

<script>
import axios from "axios";
import SearchBar from "../components/searchbar";
import PerteDialog from "../components/dialog_perte";

export default {
  components:{
    SearchBar, PerteDialog,
  },
  data(){
    return{
      items : [], perte_shown:false,
    }
  },
  computed:{
    total(){
      let tot = 0;
      // if (this.items.length == 0 ) return tot;
      for(let perte of this.items) {
        if(!perte.validated)
          tot += perte.prix_unitaire*perte.quantite;
      }
      return tot;
    },
    headers(){
      return {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
    }
  },
  methods:{
    userIs(group){
      return this.$store.state.user.groups.includes(group);
    },
    searchItem(value){
      let returnedValues = this.$store.state.pertes.filter(item => {
        return item.id == value | item.produit.toLowerCase().includes(value.toLowerCase())
      })
      this.items = returnedValues;
    },
    pushPerte(data){
      this.items.push(data);
    },
    acceptPerte(perte){
      if(confirm("Acceptez-vous vraiment cette perte?")){
        console.log("triggered")
        let data = {"validated":true}
        axios.patch(this.$store.state.url+`/perte/${perte.id}/`, data, this.headers
        ).then((response) => {
          perte.validated = true;
        }).catch((error) => {
          console.error(error);
        })
      }
    },
    deletePerte(perte){
      if(confirm(`Etes vous sur de supprimer cette perte?
NB: Si vous supprimez cette perte, sa quantité sera réajoutée dans le stock de la salle`)){
        let data = {"validated":true}
        axios.delete(this.$store.state.url+`/perte/${perte.id}/`, this.headers
        ).then((response) => {
          this.items.splice(this.items.indexOf(perte), 1);
          this.$store.state.salles.find(
            x => x.id==perte.salle_id
          ).quantite += perte.quantite;
        }).catch((error) => {
          console.error(error);
        })
      }
    },
  },
  mounted(){
    axios.get(this.$store.state.url+'/perte/', this.headers)
    .then((response) => {
      this.$store.state.pertes = response.data;
      this.items = response.data.results;
    }).catch((error) => {
      console.error(error)
    });
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
label{
  float: right;
}
</style>
