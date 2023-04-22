<template>
	<div  :class="{popup:true, active:visible}" @click="close">

		<div ref='modal' class="popup-body" @click.stop  >
			<center>
				<h3>Ajouter une depense</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_nom">Montant:</label>
					<input type="number" v-model="depense.montant" id="id_nom" placeholder="le montant">
				</div>
				<div class="field">
					<label for="id_nom">Detail:</label>
					<input type="text" v-model="depense.motif" id="id_nom" placeholder="le motif du depense">
				</div>
				<div class="logs">{{logs}}</div>
				<div style="float:right;">
					<button @click.prevent="createDepense" ref="submit">
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
			logs:"", depense:{montant:'', motif:''},
			new_price:"", csv_array:[],
			csvData :{ size:0, fileData:[]}
		}
	},
	watch:{
		csv_array(new_val){
			if(new_val.length == 0){
				this.logs = "";
				this.$refs.submit.innerText = "Créer";
				return;
			}
			this.logs = new_val.length+" produits chargés";
			this.$refs.submit.innerText = "upload";
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
		createDepense(){
			let data = {
				"montant": this.depense.montant,
				"motif": this.depense.motif,
			};
			axios.post(this.$store.state.url+`/depense/`,data, this.headers)
			.then((response) => {
				this.$store.state.depenses.push(response.data);
				this.$emit("close");
			}).catch((error) => {
				console.error(error);
			})
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
.buttons *{
  margin: 0 5;
}
.logs{
  width: 180px;
  color: red;
}
</style>