<template>
	<div  :class="{popup:true, active:visible}" @click="close">

		<div ref='modal' class="popup-body" @click.stop  >
			<center>
				<h3>Creer Taux</h3>
			</center>
			<form method="post">
				<div class="field">
					<label for="id_nom">Taux:</label>
					<input type="text" v-model="taux.taux" id="id_taux" placeholder="le taux d'echange ">
				</div>
				<div class="logs">{{logs}}</div>
				<div class="buttons">
					<button @click.prevent="createtaux" ref="submit">
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
			logs:"", taux:{},
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
		createtaux(){
			let data = {
				"taux": this.taux.taux
			};
			axios.post(this.$store.state.url+`/taux/`, data, this.headers)
			.then((response) => {
				this.taux = {};
				this.$store.state.taux.push(response.data);
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
  margin-left: 35%;
}
.logs{
  width: 180px;
  color: red;
}
</style>