<template>
    <input class="word-group" :value="word" readonly />
</template>

<script>
    export default {
        name: "WordGroup",
        props:{
            word:String,
        }
    }
</script>

<style scoped>
    .word-group{
        color: #409eff;
        background: #ecf5ff;
        margin: 10px 0 0 10px;
        display: inline-block;
        border: 0;
        width: 50px;
    }
    .word-group:hover{
         border: 0 !important;
     }
    .word-group:active{
         border: 0 !important;
     }
    .word-group:link{
         border: 0 !important;
     }
    .word-group:visited{
         border: 0 !important;
     }
</style>
