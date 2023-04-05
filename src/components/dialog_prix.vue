<template>
    <div  :class="{popup:true, active:visible}" @click="close">

        <div ref='modal' class="popup-body" @click.stop  >
            <center>
                <h3>Ajouter prix</h3>
            </center>
            <form method="post">
                <div class="field">
                    <label for="id_nom">Prix:</label>
                    <input type="text" v-model="prix.prix" id="id_nom" placeholder="le prix de l'oeuf">
                </div>
                <div class="logs">{{logs}}</div>
                <div class="buttons">
                    <button @click.prevent="createProduct" ref="submit">
                        Créer
                    </button>
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
        modelaVisible:true
    },
    data(){
        return {
            logs:"", prix:{},
            new_price:"", csv_array:[],
            csvData :{ size:0, fileData:[]}
        }
    },
    computed:{
        headers(){
            return {
                headers: {
                    "Authorization": "Bearer " + this.$store.state.user.access
                }
            }
        }
    },
    methods: {
        close(){
            this.$emit("close");
        },
        createProduct(){
            if(!this.prix.prix){
                this.logs = "le prix est obligatoire"
                return;
            }
            axios.post(this.$store.state.url+`/prix/`, this.prix, this.headers)
            .then((response) => {
                this.prix = {};
                this.$store.state.prix.push(response.data);
                this.$emit("close");
            }).catch((error) => {
                console.error(error);
            })
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