<template>
  <div :class="{popup:true, active:visible}" @click="close">
    <div class="popup-body" @click.prevent.stop>
      <center><h2>Ration</h2></center><br>
      <div v-if="ventes.length==0">{{action}}</div>
      <div class="scrollable-tab" v-else>
        <table class="table commandes">
          <thead>
            <tr class="panier-item">
              <th>#</th>
              <th>produit</th>
              <th>quantite</th>
              <th>prix Unitaire</th>
              <th>total</th>
            </tr>
          </thead>
          <tbody id="commandes">
              <tr v-for="vente, count in ventes">
                <td style="color:#aaa;">{{count+1}}</td>
                <td>{{vente.produit}}</td>
                <td>x {{vente.quantite}}{{vente.produit.unite}}</td>
                <td>{{money(vente.prix_achat)}} Fbu</td>
                <td>{{money(vente.prix_achat*vente.quantite)}} Fbu</td>
              </tr>
          </tbody>
          <tfoot>
            <tr class="panier-item">
              <th colspan="4">total</th>
              <th>{{money(commande.a_payer)}} Fbu</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data(){
    return {
      ventes:[],
      action:"récuperation des ventes..."
    }
  },
  props: {
    visible:{ type:Boolean, default:false},
    commande:{ type:Object, required:true}
  },
  watch:{
    visible(is_visible){
      if(this.visible){
        let headers = {
          headers: {
            "Authorization": "Bearer " + this.$store.state.user.access
          }
        }
        axios.get(this.$store.state.url+'/vente/?commande='+this.commande.id, headers)
        .then((response) => {
          this.ventes = response.data.results;
          this.action = "pas de details."
        }).catch((error) => {
          console.error(error);
        });
      }
    }
  },
  methods: {
    close(){
      this.$emit("close")
    }
  }
};
</script>
<style scoped>
form{
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
form div{
  margin: 5px;
}
[disabled]{
  border: 1px solid gray;
}
table,th, td {
  border: 1px solid black;
  padding: 10px;
}
</style>