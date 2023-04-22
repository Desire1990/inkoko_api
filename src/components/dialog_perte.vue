<template>
  <div :class="{popup:true, active:visible}" @click="close">
    <div class="popup-body" @click.prevent.stop @keydown.stop>
      <center>
        <h3>Perte Poulet</h3>
      </center>
      <form method="post">
        <div class="field">
          <label for="id_nom">Nom du salle</label>
          <input type="text" list="noms" v-model="nom_salle">
        </div>
        <div class="field">
          <label for="id_quantite">Quantité</label>
          <input type="number" v-model="quantite">
        </div>
        <div class="field">
          <label for="id_quantite">Poids</label>
          <input type="number" v-model="poids">
        </div>
        <div class="field">
          <label for="id_quantite">Prix</label>
          <input type="number" v-model="prix_unitaire">
        </div>
        <div class="field">
          <label for="id_tel">Détails</label>
          <textarea v-model="commentaire" list="tels">
          </textarea>
        </div>
        <div class="buttons">
          <div class="logs">{{logs}}</div>
          <input type="submit" value="Soumettre" @click="postPerte">
        </div>
      </form>
      <datalist id="noms">
        <option v-for="p in salles" :value="p.nom"/>
      </datalist>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    visible:{ type:Boolean, default:false},
  }, 
  data(){
    return {
      logs:"", nom_salle:"", quantite:0, commentaire:"", prix_unitaire:0, poids:0
    }
  },
  computed:{
    salles(){
      return this.$store.state.salles
    }
  },
  methods: {
    close(){
      this.$emit("close")
    },
    postPerte(){
      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      let salle = this.$store.state.salles.find(x => x.nom == this.nom_salle);
      let data = {
        "salle":salle.id, 
        "quantite":this.quantite,
        "commentaire":this.commentaire,
        "prix_unitaire":this.prix_unitaire,
        "poids":this.poids
      }
      if(data.quantite<=0){
        this.logs = "cette quantité est invalide"
        return;
      }
      if(data.commentaire.length<7){
        this.logs = "vous devez donner un justification valide"
        return;
      }
      axios.post(this.$store.state.url+"/perte/", data, headers)
      .then((response) => {
        this.$emit("added", response.data)
        salle.quantite -= response.data.quantite;
        this.close();
      }).catch((error) => {
        if (!!error.response) {
          this.logs = error.response.data.status
        } else {
          this.logs = "une erreur est survenue";
          console.error(error);
        }
      });
    },
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
.buttons{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons *{
  margin: 0;
}
.logs{
  width: 180px;
  color: red;
}
</style>