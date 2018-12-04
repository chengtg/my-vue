<template>
    <div>
        <el-button class="login-btn-submit" type="primary" @click="see()" style="float:left;">查看流程</el-button>
        <pdf src="./static/main/home.pdf" style="display:inline-block; width:550px;"></pdf>
    </div>
</template>

<script>
  import pdf from 'vue-pdf';
    export default {
      components: {
          pdf
      },
      methods: {
          see() {
              window.open('./static/main/home.pdf', '_blank');
          }
      }
  };
</script>
