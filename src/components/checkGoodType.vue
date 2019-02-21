<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>医生信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>擅长类型</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/3-2-2'}">
         <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" size="mini"  status-icon inline-message  >

      <el-form-item label="类型编号"  v-if='this.$route.query.type'>
        <el-input v-model="ruleForm.reportTypeId" disabled ></el-input>
      </el-form-item>

      <el-form-item label="擅长类型" prop="reportTypeName">
        <el-input v-model="ruleForm.reportTypeName" :disabled='this.$route.query.type' ></el-input>
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
        reportTypeId:'',
        reportTypeName:'',
      },
      rules: {
        reportTypeName: [
          { required: true, message: '请输入擅长类型', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          
        ],
      },
    }
  },
  methods: {
    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.updateDoct(this.ruleForm);
         this.$router.push({ path: '/main/3-2-2'})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    updateDoct(searchPram){ //调用修改接口
    var url;
    if(this.$route.query.row){
      url='/back/user/goodType/update'
    }else{
      url='/back/user/goodType/insert'
    }
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          reportTypeId:searchPram.reportTypeId,
          reportTypeName:searchPram.reportTypeName
        }
      }).then(response => {
          this.$message({
            message: response.body.flag,
            type: response.body.code?'warning':'success'
          });
          this.$router.push({ path: '/main/3-2-2'})
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
