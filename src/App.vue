<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<script>
    export default {
        mounted() {
            /*console.log(this.$refs.test.nodeType)
            console.log(this.$refs.test.childNodes)
            let arr = [
                {name:'bin'},
                {name:'yan'},
            ]
            for (const arrKey in arr) {
                console.log(arrKey)
            }*/
            /*let userInfo = {
                name:'bin',
                aaa:{
                    bbb:'bbb',
                    ccc:'ccc',
                }
            }
            if (userInfo.name&&(name=userInfo.name)){

            }*/
        }
    }
</script>
<style>

</style>
