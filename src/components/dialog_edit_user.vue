<template>
	<div :class="{popup:true, active:visible}">
		<div class="popup-body" @click.prevent.stop>
			<div class="head">
				<h3>Modifier Utilisateur</h3>
				<button class="close" @click="close">x</button>
			</div>
			<form method="post">
				<div class="field">
					<label for="id_username">Username:</label>
					<input type="text" v-model="new_user.username" id="id_username">
				</div>
				<div class="field">
					<label for="id_first_name">Prenom:</label>
					<input type="text" v-model="new_user.first_name" id="id_first_name">
				</div>
				<div class="field">
					<label for="id_last_name">Nom:</label>
					<input type="text" v-model="new_user.last_name" id="id_last_name">
				</div>
				<div class="field">
					<label for="id_first_name">
						Mot de passe:
					</label>
					<input type="password" v-model="new_user.password" id="id_psswd">
				</div>
				<div class="field">
					<label for="confirm">
						confirmation:
					</label>
					<input type="password" v-model="confirm" id="confirm">
				</div>
				<div class="field" v-if="is_admin">
					<label for="id_group">Groupe:</label>
					<select v-model="group">
						<option v-for="group in groups" :selected="user.groups.includes(group)" :value="group">
							{{group}}
						</option>
					</select>
				</div>
				<div class="buttons">
					<div class="logs">{{logs}}</div>
					<input type="submit" value="Modifier" @click="changerUser">
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
		item:{ type:Object, required:true},
	},
	data(){
		return {
			logs:"", new_user:{}, group:"",
			groups:["admin", "gestionnaire", "agent"],
			confirm:""
		}
	},
	computed:{
		is_admin(){
			return this.$store.state.user.is_admin
		}
	},
	watch:{
		item(new_value){
			this.new_user = JSON.parse(JSON.stringify(new_value));
		}
	},
	methods: {
		close(){
			this.$emit("close");
		},
		changerUser(){
			let user = {
				"username":this.new_user.username,
				"first_name":this.new_user.first_name,
				"last_name":this.new_user.last_name,
			}
			if(!!this.group){
				user["group"] = this.group
			}
			if(!!this.new_user.password){
				if(this.new_user.password==this.confirm){
					if(this.new_user.password.length<6){
						this.logs = "le mot de passe doit avoir au moins 6 caractères"
						return;
					}
					user["password"]=this.new_user.password
				}else{
					this.logs = "les mot de passes doivent être identiques"
					return;
				}
			}
			let headers = {
				headers: {
				"Authorization": "Bearer " + this.$store.state.user.access
				}
			};
			axios.put(this.$store.state.url+`/user/${this.item.id}/`, user, headers)
			.then((response) => {
				Object.assign(this.item, response.data);
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
.close{
	position: absolute;
	right: 0;
	top: 0;
	background: #ffff;
	color:#000;
	font-size: 1.2em;
	font-weight: bold;
	padding: 0 5px;
}
.head{
	display: flex;
	justify-content: center;
	align-items: center;
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
  margin: 0;
}
.logs{
  width: 180px;
  color: red;
}
</style>