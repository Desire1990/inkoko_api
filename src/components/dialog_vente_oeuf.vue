<template>
  <div :class="{popup:true, active:visible}" @click="close">
    <div class="popup-body" @click.prevent.stop @keydown.stop>
      <center>
        <h3>Vente oeufs</h3>
      </center>
      <form method="post">
        <div class="field">
          <label for="id_nom">Quantite</label>
          <input type="number" list="noms" v-model="oeuf.quantite"
            id="id_nom" placeholder="quantite à vendre">
        </div>
        <div class="field">
          <label for="id_nom">Nom du client</label>
          <input type="text" list="noms" v-model="client.nom"
            id="id_nom" @change="setTel">
        </div>
        <div class="field">
          <label for="id_tel">Téléphone</label>
          <input type="text" v-model="client.tel" id="id_tel"
             list="tels" @change="setNom">
        </div>
        <div class="buttons">
          <div class="logs">{{logs}}</div>
          <input type="submit" value="Vendre" @click="postCommande">
        </div>
      </form>
      <datalist id="noms">
        <option v-for="c in clients" :value="c.nom"/>
      </datalist>

      <datalist id="tels">
        <option v-for="c in clients" :value="c.tel"/>
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
            logs:'',
            oeuf:{quantite:0},
            client:{ nom:"", tel:""},
        }
    },
    computed:{
        clients(){
          return this.$store.state.clients
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
        if(this.clients.length<1){
          axios.get(this.$store.state.url+'/client/', this.headers)
          .then((response) => {
            this.$store.state.clients = response.data.results;
          }).catch((error) => {
          });
        }
      },
    methods: {
        close(){
          this.$emit("close")
        },
        setTel(){
          for(let client of this.clients){
            if (client.nom == this.client.nom) {
              this.client.tel = client.tel;
              return;
            }
          }
        },
        setNom(){
          for(let client of this.clients){
            if (client.tel == this.client.tel) {
              this.client.nom = client.nom;
              return;
            }
          }
        },
    postCommande(){
      if(this.client.tel.length<7){
          this.logs = "le numero est obligatoire pour les dettes"
          return;
        }
      let data = {};
      data = { "client":this.client,
      };
      axios.post(this.$store.state.url+"/oeuf_vendu/", {
            client: this.client,
            quantite: this.oeuf.quantite
          }, this.headers)
      .then((response) => {
        let commande = response.data;
        this.client = { nom:"", tel:""};
        this.oeuf = { quantite:""};
        this.$store.state.oeufs_vendus.unshift(commande);
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
[disabled]{
    border: 1px solid gray;
}
.buttons{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttons{
  display: flex;
  justify-content: space-between;
  align-items: center;
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