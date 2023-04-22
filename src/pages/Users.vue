<template>
  <div class="parent" @click="popover_opened=false">
    <div class="top">
      <SearchBar :show_date="false" @searched="searchItem"/>
    </div>
    <div class="recycler">
    </div>
    <div class="scrollable-tab">
      <table class="table users">
        <thead>
          <tr class="panier-item" style="text-transform:capitalize;">
            <!-- <th>#</th> -->
            <th>username</th>
            <th>prenom</th>
            <th>nom</th>
            <th>actif</th>
            <th>groupes</th> 
            <th>options
                <button style="float: right; margin-right:50px" @click="user_shown=true">Ajouter</button>
            </th>
          </tr>
        </thead>
        <tbody id="users">
          <tr v-for="user, counter in users">
            <!-- <td>{{counter+1}}</td> -->
            <td>{{user.username}}</td>
            <td>{{user.first_name}}</td>
            <td>{{user.last_name}}</td>
            <td>{{user.is_active}}</td>
            <td class="groups">
              <span v-for="g in user.groups">
                {{g}}<span class="comma">,</span>
              </span>
            </td>
            <td>
              <div class="btns">
                <button @click="editUser(user)" v-if="permited(user)">
                  editer
                </button>
                <span v-if="editable(user)">
                  <button v-if="user.is_active" @click="deactivateUser(user)">desactiver</button>
                  <button v-else @click="activateUser(user)">activer</button>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EditUser :visible="edit_mode" :item="active_user" @close="exitEdition"/>
    <Adduser :visible.sync="user_shown"
      @close="user_shown=false"/>
  </div>
</template>
<script>
import axios from "axios";
import SearchBar from "../components/searchbar";
import EditUser from "../components/dialog_edit_user";
import Adduser from '@/components/dialog_add_user'

export default {
  components:{
    SearchBar, EditUser, Adduser
  },
  data(){
    return{
      query_date : false, edit_mode:false,
      users : this.$store.state.users,
      details_opened:false, active_user:{groups:[]},user_shown:false
    }
  },
  computed:{
  },
  methods:{
    editable(user){
      return this.$store.state.user.is_admin && user.id!=this.$store.state.user.id
    },
    permited(user){
      return this.$store.state.user.is_admin || this.$store.state.user.id == user.id;
    },
    searchItem(value){
      let returnedValues = {};
      if (value=='') return this.fetchData();
      !this.query_date && value!= ''? 
        returnedValues = this.$store.state.users.filter(item => {
          return item.id == value | item.client.toLowerCase().includes(value.toLowerCase())
        }) :
        returnedValues = this.users.filter(item => {
          return item.id == value | item.client.toLowerCase().includes(value.toLowerCase())
        })
      this.users = returnedValues;
    },
    fetchData(){
      let headers = {
          headers: {
            "Authorization": "Bearer " + this.$store.state.user.access
          }
        }
      if(this.$store.state.users.length==0){
        axios.get(this.$store.state.url+'/user/', headers)
        .then((response) => {
          this.$store.state.users = response.data.results;
          this.users = response.data.results;
          console.log(response.data.results)
        }).catch((error) => {
          if(error.response){
          }else{
            console.error(error)
          }
        });
      }
    },
    headers(){
      return {
        headers: {
        "Authorization": "Bearer " + this.$store.state.user.access
        }
      };
    },
    deactivateUser(user){
      if (confirm("voulez-vous vraiment arreter cette utilisateur?")) {
        axios.put(this.$store.state.url+`/user/${user.id}/`, {"is_active":false}, this.headers())
        .then((response) => {
          Object.assign(user, response.data);
        }).catch((error) => {
          console.error(error);
        })
      }
    },
    activateUser(user){
      if (confirm("voulez-vous mettre cette utilisateur en action?")) {
        axios.put(this.$store.state.url+`/user/${user.id}/`, {"is_active":true}, this.headers())
        .then((response) => {
          Object.assign(user, response.data);
        }).catch((error) => {
          console.error(error);
        })
      }
    },
    exitEdition(x){
      this.edit_mode = false
      this.user_shown = false;
    },
    editUser(user){
      this.edit_mode = true;
      this.active_user = user
    }
  },
  mounted(){
    axios.get(this.$store.state.url+'/user/', this.headers)
    .then((response) => {
      this.$store.state.users = response.data;
      this.items = response.data.results;
    }).catch((error) => {
      console.error(error)
    });
    this.fetchData()
  },
};
</script>
<style scoped>
.top{
  display: flex;
  justify-content: center;
}
.groups .comma:last-child {
    display: none;
}
.scrollable-tab{
  width: 100%;
  /*height: 0px;*/
  overflow: auto;
  padding: 0 20px;
  position: relative;
}
.uncommited{
  color: red;
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
table,th, td {
  border: 1px solid black;
  padding: 5px;
}
</style>
