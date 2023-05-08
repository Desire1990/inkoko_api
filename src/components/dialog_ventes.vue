<template>
  <div :class="{popup:true, active:visible}" @click="close">
    <div class="popup-body" @click.prevent.stop>
      <center><h2>Ration du Jour</h2></center><br>
      <div v-if="ventes.length==0">{{action}}</div>
      <div class="scrollable-tab" v-else>
        <table class="table commandes">
          <thead>
            <tr class="panier-item" style="text-transform:capitalize;">
              <!-- <th>#</th> -->
              <th>produit</th>
              <th>prix Unitaire</th>
              <th>quantite</th>
              <th>total</th>
            </tr>
          </thead>
          <tbody id="commandes">
              <tr v-for="vente, count in ventes">
                <!-- <td style="color:#aaa;">{{count+1}}</td> -->
                <td style="text-transform:capitalize;">{{vente.produit}}</td>
                <td>{{money(vente.prix_achat)}} Fbu</td>
                <td>x {{vente.quantite}} {{vente.produit.unite}}</td>
                <td>{{money(vente.prix_achat*vente.quantite)}} Fbu</td>
              </tr>
          </tbody>
          <tfoot>
            <tr class="panier-item">
              <th colspan="2">Total</th>
              <th>{{money(quantite())}} kg</th>
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
    quantite(){
      let total = 0;
      for(let item of this.ventes){
        total += item.quantite
      }
      return total
    },
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