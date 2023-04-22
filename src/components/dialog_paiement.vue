<template>
  <div :class="{popup:true, active:visible}" @click="close">
    <div class="popup-body" @click.prevent.stop @keydown.stop>
      <center>
        <h3>Paiement</h3>
      </center>
      <form method="post">
        <div class="field">
          <label for="id_unite">Montant:</label>
          <input type="number" v-model="paiement.montant" id="id_unite">
        </div>
        <div class="field">
          <label for="id_unite">Detail:</label>
          <input type="text" v-model="paiement.motif" id="id_unite">
        </div>
        <div class="field">
          <label for="id_nom">Nom de l'employé</label>
          <input type="text" list="noms" v-model="responsable.nom"
            id="id_nom" @change="setTel">
        </div>
        <div class="field">
          <label for="id_tel">Téléphone</label>
          <input type="text" v-model="responsable.telephone" id="id_tel"
             list="tels" @change="setNom">
        </div>
        <div class="buttons">
          <div class="logs">{{logs}}</div>
          <input type="submit" value="Valider" @click="postPaiement">
        </div>
      </form>
      <datalist id="noms">
        <option v-for="c in responsables" :value="c.nom"/>
      </datalist>

      <datalist id="tels">
        <option v-for="c in responsables" :value="c.telephone"/>
      </datalist>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    visible:{ type:Boolean, default:false},
    modelaVisible:true
  },
  data(){
    return {
      responsable:{ nom:"", telephone:""},
      paiement:{ montant:"", motif:""},
      cart: this.$store.state.cart,
      dette_p:null, logs:""
    }
  },
  computed:{
    payee:{
      get(){
        return this.dette_p == null ? this.cart.getTotal() : this.dette_p
      },
      set(val){
        this.dette_p = val
      }
    },
    responsables(){
      return this.$store.state.responsables
    },
    host(){
      return this.$store.state.url
    },
    username(){
      return this.$store.state.user.username
    },
    headers(){
      return {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
    }
  },
  mounted(){
      axios.get(this.$store.state.url+'/responsable/', this.headers)
      .then((response) => {
        this.$store.state.responsables = response.data.results;
      }).catch((error) => {
      });
  },
  methods: {
    close(){
      this.$emit("close")
    },
    setTel(){
      for(let responsable of this.responsables){
        if (responsable.nom == this.responsable.nom) {
          this.responsable.telephone = responsable.telephone;
          return;
        }
      }
    },
    setNom(){
      for(let responsable of this.responsables){
        if (responsable.telephone == this.responsable.telephone) {
          this.responsable.nom = responsable.nom;
          return;
        }
      }
    },
    postPaiement(){
      let data = {
        "montant":this.paiement.montant,
        "motif":this.paiement.motif,
        "responsable":this.responsable
      };
      axios.post(this.$store.state.url+`/paiement/`, data, this.headers)
      .then((response) => {
        let paie = response.data;
        let p = this.$store.state.p
        this.responsable = { nom:"", telephone:""};
        this.$store.state.paiements.unshift(paie);
        this.$emit("close");
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
.buttons *{
  margin: 0;
}
.buttons{
  display: flex;
  justify-content: center;
}
.logs{
  width: 180px;
  color: red;
}
</style>