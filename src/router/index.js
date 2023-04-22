import Vue from 'vue'
import VueRouter from 'vue-router'
import Oeufs from '../pages/HomeOeuf.vue'
import Ration from '../pages/Ration.vue'
import Poulet from '../pages/Poulet.vue'
import Produit from '../pages/Produit.vue'
import Salle from '../pages/Salle.vue'
import Salle_pondeuse from '../pages/Salle_pondeuse.vue'
import Oeuf from '../pages/Oeuf.vue'
import Dettes from '../pages/Dettes.vue'
import Transaction from '../pages/Transaction.vue'
import Achats from '../pages/Achats.vue'
import Ventes from '../pages/Ventes.vue'
import StatsProduct from '../pages/StatsProduct.vue'
import StatsOeuf from '../pages/StatsOeuf.vue'
import StatsClients from '../pages/StatsClients.vue'
import StatsPertes from '../pages/StatsPertes.vue'
import PertePoulet from '../pages/PertePoulet.vue'
import PerteOeufs from '../pages/PerteOeufs.vue'
import Users from '../pages/Users.vue'
import PouletVendu from '../pages/PouletVendu.vue'
import Depense from '../pages/Depense.vue'
import Paiement from '../pages/Paiement.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: '', component: Ration },
  { path: '/home', name: 'home', component: Ration },
  { path: '/stock/produit', name: 'produit', component: Produit },
  { path: '/stock/salle_chair', name: 'salle', component: Salle },
  { path: '/stock/salle_pondeuse', name: 'pondeuse', component: Salle_pondeuse },
  { path: '/stock/oeuf', name: 'oeuf', component: Oeuf },
  { path: '/hist/oeuf_vendu', name: 'oeuf_vendu', component: StatsOeuf },
  { path: '/hist/achats', name: 'achats', component: Achats },
  { path: '/hist/rations', name: 'rations', component: Ventes },
  { path: '/hist/poulet_vendu', name: 'poulet_vendu', component: PouletVendu },
  { path: '/stats/product', name: 'statsproduct', component: StatsProduct },
  { path: '/stats/clients', name: 'statsclients', component: StatsClients },
  { path: '/stats/pertes', name: 'statspertes', component: StatsPertes },
  { path: '/poulets', name: 'poulets', component: PertePoulet },
  { path: '/pertes/oeufs', name: 'oeufs', component: PerteOeufs },
  { path: '/users', name: 'users', component: Users },
  { path: '/transactions', name: 'transactions', component: Transaction },
  { path: '/depenses', name: 'depenses', component: Depense },
  { path: '/paiements', name: 'paiements', component: Paiement },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
