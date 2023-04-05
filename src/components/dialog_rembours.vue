<template>
  <div :class="{popup:true, active:visible}" @click="close">
    <div class="popup-body" @click.prevent.stop>
      <center>
        <h3>Client</h3>
      </center>
      <form method="post">
        <div>
          La somme à payer <b>{{money(reste)}}</b>Fbu
        </div>
        <div class="field">
          <label for="id_payee">La somme payée</label>
          <input type="number" id="id_payee" v-model="payee">
        </div>
        <div>
          La somme à retourner <b>{{money(dette.reste - payee)}}</b>Fbu
        </div>
        <div class="buttons">
          <div class="logs">{{logs}}</div>
          <input type="submit" @click="makePayment" value="Payer">
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    visible:{ type:Boolean, default:false},
    dette:{ type:Object, required:true},
  },
  data(){
    return {
      dette_p:null, logs:""
    }
  },
  computed:{
    payee:{
      get(){
        if(this.dette_p=="") return 0
        if(this.dette_p!=null) return this.dette_p
        return this.reste
      },
      set(val){this.dette_p=val}
    },
    reste(){
      return this.dette.reste - this.dette.uncommited
    }
  },
  methods: {
    close(){
      this.dette_p = null;
      this.$emit("close")
    },
    makePayment(event){
      this.payee = this.payee>this.reste?this.reste:this.payee
      let data = {
        "somme" : this.payee,
        "commande" : this.dette.id
      }
      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.post(this.$store.state.url+`/paiement/`,data, headers)
      .then((response) => {
        let paiement = response.data;
        let old_commande = this.$store.state.commandes.find(x => x.id == this.dette.id)
        let old_dette = this.$store.state.dettes.find(x => x.id == this.dette.id)
        if(!!old_commande){
          old_commande.uncommited = paiement.somme;
        }
        if(!!old_dette){
          this.dette.uncommited += paiement.somme;
        }
        this.$emit("close");
      }).catch((error) => {
        if (!!error.response) {
          this.logs = error.response.data.status
        } else {
          this.logs = "une erreur est survenue";
        }
      });
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
.buttons{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logs{
  max-width: 180px;
  word-break: break-all;
  color: red;
}
</style>