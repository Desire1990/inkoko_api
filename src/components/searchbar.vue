<template>
<div class="center">
	<!-- <button class="change red" @click="changeColor('red')"></button> -->
	<!-- <button class="change green" @click="changeColor('green')"></button> -->
	<!-- <button class="change blue" @click="changeColor('blue')"></button> -->
	<input type="text" placeholder="Keyword" @keydown.stop 
		id="id_username" v-model="keyword" autofocus>
	<button type="reset" @click="keyword=''">&times</button>
	<div v-if="show_date" style="display:inline">
		<button style="margin-left:0" @click="triggered=!triggered">
			Date
		</button>
		<div class="form" v-if="triggered">
			<label>Du:</label>
			<input type="date" name="date_du" v-model="date.du"/>
			<label>Au:</label>
			<input type="date" name="date_au" v-model="date.au"/>
			<input type="submit" value="search"
				@click="performSearch"
				style="border:1px solid black" />
		</div>
	</div>
</div>
</template>

<script>
export default {
	props:{
		show_date:{type:Boolean, default:true}
	},
	components:{ },
	data(){
		return {
			keyword : "",
			date:{ du:null, au:null},
			triggered:false,
		}
	},
	watch:{
		keyword(val){
			this.$emit("searched", val);
		}
	},
	methods:{
		performSearch(){
			this.triggered=false;
			this.$emit("changed", this.date);
		},
		changeColor(color){
			if(color == 'red'){
				document.documentElement.style.setProperty('--primary', '#d55');
				document.documentElement.style.setProperty('--primary-light', '#faa');
				document.documentElement.style.setProperty('--hover', '#faa');
			}
			if(color == 'green'){
				document.documentElement.style.setProperty('--primary', 'green');
				document.documentElement.style.setProperty('--primary-light', '#595');
				document.documentElement.style.setProperty('--hover', '#595');
				
			}
			if(color =='blue'){
				document.documentElement.style.setProperty('--primary', '#08a');
				document.documentElement.style.setProperty('--primary-light', 'lightblue');
				document.documentElement.style.setProperty('--hover', '#29b');
			}
		}
	}
};
</script>
<style scoped>
.center{
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
}
.change{
}
.red{
	background-color: red;
}
.green{
	background-color: green;
}
.blue{
	background-color: #0088aa;
}
.form{
	position: absolute;
	z-index: 3;
	background-color: #007799;
	padding: 5px 10px;
	box-shadow: 0px 4px 7px 2px black
}
input[type=date]{
	display: block;
	font-size: 1.3em;
	font-weight: bold;
	width: 200px;
}
label{
	font-size: .8em;
	font-weight: bold;
}
</style>