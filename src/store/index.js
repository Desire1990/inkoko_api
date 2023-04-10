import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:null,
    clients:[],
    url:"/api",
    // url:"http://127.0.0.1:8000/api",
    // url:'https://inkoko.amidev.bi/api',
    produits:[],
    salles:[],
    stats:[],
    oeufs:[],
    oeufs_vendus:[],
    achats:[],
    transactions:[],
    responsables:[],
    pertes:[],
    pouletVendus:[],
    commandes:[],
    prix:[],
    rations:[],
    users:[],
    dettes:[],
    achats_fetched:false,
    dettes_fetched:false,
    commandes_fetched:false,
    cart:new Object({
      content: [],
      getTotal(){
        let tot = 0;
        for (let i = 0; i < this.content.length; i++) {
          tot += this.content[i].getTotal();
        }
        return tot;
      },
      getLength(){
        return this.content.length
      },
      find(product_id){
        for (let i = 0; i < this.content.length; i++) {
          let item = this.content[i];
          if (item.product.id == product_id) {
            return i;
          }
        }
        return -1;
      },
      getQuantite(product_id){
        let position = this.find(product_id);
        if(position>=0){
          return this.content[position].quantite;
        }
        return 0;
      },
      increase(product_id){
        let position = this.find(product_id);
        if(position>=0){
          let item = this.content[position];
          if(item.quantite<item.product.quantite)
            item.quantite++;
        }
      },
      decrease(product_id){
        let position = this.find(product_id);
        if(position>=0){
          let item = this.content[position];
          if(item.quantite>1){
            item.quantite--;
          } else {
            this.content.splice(position,1)
          }
        }
      },
      add(item, qtt){
        if(item.quantite==0) return;
        let position = this.find(item.id);
        if(position>=0){
          if(!!qtt && item.quantite>qtt){
            this.content[position].quantite = qtt
          } else {
            this.increase(item.id)
          }
        } else {
          let ikintu = new Object({
            product: item,
            quantite : !!qtt ? qtt : 1, // si la qtt est donnée
            getTotal(){
              return this.product.prix_unitaire*this.quantite
            }
          });
          this.content.push(ikintu);
        }
      },
    })
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
