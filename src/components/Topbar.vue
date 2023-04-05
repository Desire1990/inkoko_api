<template>
  <div class="wrapper">
    <div class="content">
      <header style="background-color: #08a;">
                <h2 class="heading" id="dashboard">
                    Gestion Elevage
                </h2>
            </header>
    </div>
  </div>
</template>
<script>
// import { toast } from 'bulma-toast'
import axios from 'axios'
export default {
  data(){
    return{
        cart:{
            items:[]
        },
        cartbon:{
            items:[]
        }
    }
  },
  beforeCreate() {
    // initialize
    this.$store.commit('initiallizeStore')
    
    const token = this.$store.state.token

    if(token) {
      axios.defaults.headers.common['Authorization'] = "Token " + token
    } else {
      axios.defaults.headers.common['Authorization'] = ''
    }

  },
  mounted(){
    this.cart = this.$store.state.cart
    this.cartbon = this.$store.state.cartbon
    var user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.$store.state.user = user;
    } else {
      console.warn("il y'a pas de session");
    }
  },
  watch:{
    "$store.state.user":{
      deep: true,
      handler(new_user){
        localStorage.setItem('user', JSON.stringify(new_user));
      }
    }
  },
  computed: {
    logged_in() {
      return this.$store.state.user != null;
    },
    cartTotalLength() {
      let totalLength = 0
      for (let i = 0; i < this.cart.items.length; i++) {
        totalLength += parseFloat(this.cart.items[i].quantity)
      }

      return totalLength
    },

    cartTotalLengthbon() {
      let totalLength = 0
      for (let i = 0; i < this.cartbon.items.length; i++) {
        totalLength += parseFloat(this.cartbon.items[i].quantity)
      }

      return totalLength
    }
  },

  methods:{
    loggout(){
      if (confirm("Are you sure you wanna logout?")) {
        this.$store.state.user = null;
        const toPath = this.$route.query.to || '/'
        this.$router.push(toPath)
        toast({
            message: ' Welcome back!!! logged out successfully!',
            type: 'is-success',
            dismissible: true,
            duration: 2000,
            position: 'center'
        })
        this.$router.push('/')
      }
    },

  }
   
}
</script>
<style scoped>
.main-wrapper{
    background: rgba(0, 0, 0, .1);
    backdrop-filter: blur(6px);
}
.user-wrapper{
    filter: brightness(150%);
}
.search {
    position: relative;
    width: 40px;
    height: 60px;
    border-radius: 30px;
    transition: var(--transition);
    box-shadow: 0 0 0 5px rgba(183, 204, 235, 0.378);
    overflow: hidden;
}

.search:hover,
.search:active,
.search:focus{
    width: 400px;
}

body.light .search.active {
    width: 350px;
}

.search .icon {
    position: relative;
    top: 0;
    left: 0;
    width: 40px;
    height: 60px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    cursor: pointer;
}
.search:hover .search-rotate{
    transform: rotate(100deg);
    position: absolute;
    
}
.search .icon::before {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 3px solid var(--new-content);
    transform: translate(-4px, -4px);
}
.content
.search .icon::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 12px;
    background: var(--new-content);
    transform: translate(6px, 6px) rotate(315deg);
}

.search .input {
    position: relative;
    width: 300px;
    height: 60px;
    left: 60px;
    /* top: -100%; */
    transition: var(--transition);
    display: flex;
    justify-content: center;
    align-items: center;
}

.search .input input {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    border: none;
    font: 600 1.2rem rajdhani;
    background: var(--orange);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    outline: none;
    padding-left: 10px;
}
.dis-wrap{
    position: absolute;
    top: 5rem;
    display: flex;
    justify-content: center;
    left: 55%;
    z-index: auto;
    background: #000;
    border-radius: 12px;
    padding: 10px;
    animation: fade 1s ease-in infinite;
}

.dis-warn {
    position: absolute;
    top: 5rem;
    display: flex;
    justify-content: center;
    left: 55%;
    z-index: auto;
    background: #000;
    border-radius: 12px;
    padding: 10px;
}

@keyframes fade {
    50%{
        opacity:.2;
    }
}
.display{
    text-transform: uppercase;
    font: 600 2rem rajdhani;
    background: linear-gradient(45deg, #cc03c9, #009dff, #00ffff);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
}
.light .display{
    filter: brightness(140%);
}
/* ======================= */
.light .search {
    box-shadow: 0 2px 2px 2px #e70558;
}

.light .search .icon::before {
    border: 3px solid #e70558;
}

.light .search .icon::after {
    background: var(--pink);
}


/* ===================== */

.switch {
    position: absolute;
    top: 99px;
    left: calc(50% - 75px);
    max-height: 80px;
    max-width: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
}
#toggle:hover:after,
#dashboard:hover,
#kleenpulse:hover {
    text-transform: uppercase;
    background: linear-gradient(-140deg, #fff, #0ff, #ff004c, #ffcc00, #0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: anime 6s linear infinite;
}

#toggle .fas.fa-moon,
#toggle .fas.fa-sun{
    position: absolute;
    left: 27px;
    top: 21px;
    z-index: 2;
    font-size: 1.6rem;
}
#toggle .fas.fa-sun{
    opacity: 0;
}

.light #toggle .fas.fa-moon {
    opacity: 0;
}
.light #toggle .fas.fa-sun {
    opacity: 1;
    top: 16px;
    font-size: 1.9rem;
    background: var(--pink);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

#toggle .indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    height: 100%;
    background: #c3c2c2;
    cursor: pointer;
    border-radius: 50%;
    transform: scale(.9);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 10px 3px var(--indicator);
}

#toggle:hover .indicator {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 -10px 3px var(--indicator);
}

/* ===========SIDEBAR========== */
.sidebar {
    width: 250px;
}

/* ===========SIDEBAR========== */

#nav-toggle:checked~.main-content {
    margin-left: 70px;
}

#nav-toggle:checked~.main-content header {
    width: calc(100% - 70px);
    left: 70px;
}

.main-content {
    transition: margin-left 300ms;
    margin-left: 250px;
    background: rgba(0, 0, 0, .2);
}

/* ====GLASSMORPHISM CHANGE HERE!==== */
header {
    /*  background:#fff; */
    background: var(--new-BG);
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, .2);
    left: 250px;
    width: 100;
    top: 0;
    z-index: 100;
    transition: left 300ms;
}

.search-wrapper {
    border: 1px solid #ccc;
    border-radius: 30px;
    height: 50px;
    display: flex;
    align-items: center;
    overflow-x: hidden;
}

.search-wrapper:focus,
.search-wrapper:hover {
    border: 1px solid var(--icon-color);
}

.search-wrapper input {
    height: 100%;
    padding: .5rem;
    border: none;
    background: transparent;
}

input {
    color: #fff;
    font-size: 15px;
}


.search-wrapper span {
    display: inline-block;
    padding: 0rem 1rem;
    font-size: 1.5rem;
    color: var(--new-content);
}

.user-wrapper {
    display: flex;
    align-items: center;
    padding: 0 10px;
}
.light .user-wrapper{
    border-left: 4px solid #ea0565;
}

.user-wrapper img {
    border-radius: 50%;
    margin-right: 1rem;
}

.user-wrapper div h4 {
    color: #fff;

}

.user-wrapper small {
    display: inline-block;
    color: #e0e0e0;
}
.heading{
  color: #fff;
}
  .loggout{
  position: fixed;
  right: 10px;
  top: 5px;
  font-size: 20px;
  background: #944;
  color: #ccc;
  padding: 3px 10px;
  box-shadow: 0px 0px 5px 2px #777;
}
.loggout:hover{
  color: #fff;
}
.desos:hover{
    background-color: #777;
}
</style>

