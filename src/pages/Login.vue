<template>
	<div class="centered">
		<form action="." method="post">
        <center>
            <h2 style="text-transform: uppercase;">chicken breeding</h2>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0Xu_rtvk8mygc60iDSxns0rxJh2cJs7gzA&usqp=CAU" alt="" width="100%" height="50%">
        </center>
		    <div class="field">
				<label for="id_username">Username:</label>
				<input type="text" name="username" placeholder="Username " required
					id="id_username" v-model="username" autocomplete="on">
			</div>
		    <div class="field">
				<label for="id_password">Password:</label>
				<input type="password" name="password" placeholder="Password " required
					id="id_password" v-model="password" autocomplete="on">
			</div>
			<label for="id_password" v-if="logs.length>0"
				 style="color:red">{{ logs }}
			</label>
			<div class="btns">
	    		<button @click.prevent="logIn">Log In</button>
			</div>
			<center>
				Developped by <b><a href="https://github.com/Desire1990">Desos</a></b>
			</center>
		</form>
	</div>
</template>
<script>
import axios from "axios"
export default{
	data(){
		return{
			logs:"",
			username:"",
			password:"",
			url:this.$store.state.url
		}
	},
	methods:{
		logIn(){
			this.logs = "loging in..."
			axios.post(this.url+"/login/", {
				"username": this.username,
				"password": this.password
			}).then((response) => {
				this.$store.state.user = response.data;
			}).catch((error) => {
				if (!!error.response) {
					this.logs = JSON.stringify(error.response.data)
				} else {
					this.logs = "erreur de connectivité";
				}
			});
		}
	}
};
</script>
<style scoped>
.centered{
	display: flex;
	justify-content: center;
	margin-top: 50px;
}
form{
	background-color: white;
	width: 400px;
	padding: 10px 20px;
	border-radius: 0;
	box-shadow: 0 3px 5px rgba(0, 0, 0, .5);
}
.btns{
	display: flex;
	justify-content: flex-end;
}
center{
	margin-top: 10px;
}
h2, a{
	color: var(--primary);
}
</style>
