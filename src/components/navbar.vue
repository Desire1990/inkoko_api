<template>
	<center class="parent">
		<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0Xu_rtvk8mygc60iDSxns0rxJh2cJs7gzA&usqp=CAU" alt="" width="100px" height="50px">
		<router-link to="/home">
			<div class="icon">
				<fa icon="shopping-cart" />
			</div>
			HOME
		</router-link>

<!-- 		<router-link to="/home" event=""
			@mouseenter.native="e => showSubmenu(e)"
			@mouseleave.native="e => hideSubmenu(e)">
			<div class="icon">
				<fa icon="shopping-cart" />
			</div>
			HOME
			<div class="submenu">
				<router-link :to="{name:'ration'}">
					<fa icon="hand-holding-usd"/> Ration
				</router-link>
				<router-link :to="{name:'oeufs'}">
					<fa icon="hand-holding-usd"/> Oeufs
				</router-link>
				<router-link :to="{name:'poulet'}">
					<fa icon="hand-holding-usd"/> Poulet
				</router-link>
			</div>
		</router-link> -->

		
		<router-link to="/stock" event=""
			@mouseenter.native="e => showSubmenu(e)"
			@mouseleave.native="e => hideSubmenu(e)">
			<div class="icon">
				<fa icon="hand-holding-usd" />
			</div>
			STOCK
			<div class="submenu">
				<router-link :to="{name:'produit'}">
					<fa icon="hand-holding-usd"/> Produits
				</router-link>
				<router-link :to="{name:'salle'}">
					<fa icon="hand-holding-usd"/> Salle
				</router-link>
				<router-link :to="{name:'oeuf'}">
					<fa icon="hand-holding-usd"/> Oeufs
				</router-link>
			</div>
		</router-link>		


		</router-link>
		<router-link to="/hist" event=""
			@mouseenter.native="e => showSubmenu(e)"
			@mouseleave.native="e => hideSubmenu(e)">
			<div class="icon">
				<fa icon="hand-holding-usd" />
			</div>
			HISTORIQUES
			<div class="submenu">
				<router-link :to="{name:'achats'}">
					<fa icon="hand-holding-usd"/> Achats
				</router-link>
				<router-link :to="{name:'rations'}">
					<fa icon="hand-holding-usd"/> Rations
				</router-link>
				<router-link :to="{name:'oeuf_vendu'}">
					<fa icon="hand-holding-usd"/> Oeufs vendus
				</router-link><!-- 
				<router-link :to="{name:'paiements'}">
					<fa icon="hand-holding-usd"/>
					<span>Paiements</span>
				</router-link> -->
			</div>
		</router-link>
		<router-link to="/stats" event=""
			@mouseenter.native="e => showSubmenu(e)"
			@mouseleave.native="e => hideSubmenu(e)"
			v-if="is_admin || userIs('gerant')">
			<div class="icon">
				<fa icon="chart-bar" />
			</div>
			STATISTIQUES
			<div class="submenu">
				<router-link :to="{name:'statsproduct'}">
					<fa icon="chart-bar"/> Produits
				</router-link>
				<router-link :to="{name:'statsclients'}">
					<fa icon="chart-bar"/> Clientèles
				</router-link>
				<router-link :to="{name:'statspertes'}">
					<fa icon="chart-bar"/> Pertes
				</router-link>
			</div>
		</router-link>
	<!-- 	<router-link to="/pertes" event=""
			@mouseenter.native="e => showSubmenu(e)"
			@mouseleave.native="e => hideSubmenu(e)">
			<div class="icon">
				<fa icon="trash-alt" />
			</div>
			PERTES
			<div class="submenu">
				<router-link :to="{name:'poulets'}">
					<fa icon="hand-holding-usd"/> Poules
				</router-link>
				<router-link :to="{name:'oeufs'}">
					<fa icon="hand-holding-usd"/> Oeufs
				</router-link>
			</div>
		</router-link> -->
		<router-link to="/poulets">
			<div class="icon">
				<fa icon="trash-alt"/>
			</div>
			PERTES
		</router-link>
		<router-link to="/users" v-if="$store.state.user.groups.includes('admin')" >
			<div class="icon">
				<fa icon="users"/>
			</div>
			UTILISATEURS
		</router-link>
		<router-link to="/transactions">
			<div class="icon">
				<fa icon="hand-holding-usd"/>
			</div>
			TRANSACTIONS
		</router-link>
		<br><br><br>
		<div>			
			<h2>{{ this.user.username }}</h2>
		</div>
	</center>
</div>
</template>
<script >
export default {
	computed:{
		is_admin(){
			return this.$store.state.user.is_admin
		}
	},
	methods:{
		showSubmenu(event){
			let item = event.target.getElementsByClassName("submenu")[0];
			item.style.display = 'block';
		},
		hideSubmenu(event){
			let item = event.target.getElementsByClassName("submenu")[0];
			item.style.display = 'none';
		}
	}
};
</script>
<style scoped>
.parent{
	width: 100px;
	height: 100%;
	position: relative;
	background-color: var(--primary);
	font-size: .7em;
/*    overflow-y: auto;
    overflow-x: hidden;*/
}
h2{
	padding: 30px 0;
	background-color: var(--primary-light);
}
h4{
	padding: 30px 0;
	background-color: var(--primary);
}
.parent a{
	display: block;
	color: white;
	padding: 5px 0;
	list-style-type: none;
	text-align: center;
	position: relative;
}
.submenu{
	display: none;
	position: absolute;
	z-index: 3;
	background-color: var(--primary);
	color: white;
	left: 100%;
	top: 0;
	box-shadow: 2px 3px 5px black;
	overflow-y: visible;
}
.submenu a{
	padding: 3px 5px;
	font-size: 14pt;
	text-align: left;
	display: flex;
}
svg{
	margin-right: 3px;
}
.icon{
	font-size: 30px;
}
.parent a:hover{
	background-color: var(--hover);
}
.router-link-active{
	background-color: #eee!important;
	color: var(--primary)!important;
}
@media screen and (max-width: 650px){
}
</style>