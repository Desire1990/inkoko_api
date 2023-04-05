<template>
  <div id="body">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div class="main" v-if="logged_in">
      <NavBar/>
      <router-view/>
      <div class="loggout" @click="loggout">
        <fa icon="power-off" />
      </div>
    </div>
    <div v-else>
      <Login/>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Login from "./pages/Login.vue"
import NavBar from "./components/navbar.vue";
export default{
  components:{NavBar, Login},
  computed:{
    logged_in() {
      return this.$store.state.user != null;
    }
  },
  mounted(){
    var user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.$store.state.user = user;
    } else {
      console.warn("il y'a pas de session");
    }
    if(this.$store.state.produits.length==0){
      this.fetchProducts()
    }
  },
  watch:{
    "$store.state.user":{
      deep: true,
      handler(new_user){
        localStorage.setItem('user', JSON.stringify(new_user));
      }
    }
  },
  methods:{
    loggout(){
      if (confirm("êtes vous sur de vouloir deconnecter?")) {
        this.$store.state.user = null;
      }
    },
    fetchProducts(){
      let headers = {
        headers: {
          "Authorization": "Bearer " + this.$store.state.user.access
        }
      }
      axios.get(this.$store.state.url+'/produit/', headers)
      .then((response) => {
        this.$store.state.produits = response.data;
        this.items = response.data;
      }).catch((error) => {
        console.error(error);
      });
    }
  }
};
</script>
<style src="./style.css">
</style>