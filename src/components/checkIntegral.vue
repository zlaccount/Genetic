<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>积分规则</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/9-5'}">
         <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" size="mini"  status-icon inline-message  >

      <el-form-item label="积分类型" >
        <el-input v-model="ruleForm.limitName" disabled ></el-input>
      </el-form-item>

      <el-form-item label="积分兑换规则(%)" prop="limitMoney">
        <el-input v-model="ruleForm.limitMoney" type="number" :min="0" :max="100"  :disabled='this.$route.query.type' ></el-input>
      </el-form-item>

      <el-form-item v-if='!this.$route.query.type'>
        <el-button type="primary" @click="submitForm('ruleForm')" >保存</el-button>
      </el-form-item>
     
    </el-form>

  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  data () {
    return {
      ruleForm: { 
        limitName:'',
        limitMoney:'',
      },
      rules: {
        limitMoney: [
          { required: true, message: '积分兑换规则', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.updateDoct(this.ruleForm);
         this.$router.push({ path: '/main/9-5'})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    updateDoct(searchPram){ //调用修改接口
       var url;
      if(this.$route.query.row.limitCode=='00001'){
         url='back/rule/updateLimit';
      }else{
        url='back/rule/updateLimit';
      }
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          limitId:this.$route.query.row.limitId,
          limitMoney:parseInt(searchPram.limitMoney)
        }
      }).then(response => {
          this.$message({
            message: response.body.flag,
            type: response.body.code?'warning':'success'
          });
      }, response => {
          this.$notify.error({
            title: '错误',
            message: '请求失败'
          });
      });
    },

  },

  mounted () {
    if(this.$route.query.row){
      this.ruleForm=this.$route.query.row;
    }
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 
</style>
