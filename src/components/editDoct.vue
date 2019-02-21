<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>医生信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>医生信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/3-2-1',query:{pageIndex:this.$route.query.pageIndex}}">
         <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" size="mini"  status-icon inline-message  >
      <!-- <el-form-item label="用户名" prop="account">
        <el-input v-model="ruleForm.account" disabled></el-input>
      </el-form-item> -->

      <el-form-item label="医生姓名" prop="name">
        <el-input v-model="ruleForm.name" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>
      
       <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" clearable :disabled='this.$route.query.type' ></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="identity" >
        <el-input v-model="ruleForm.identity" clearable  :disabled='this.$route.query.type' ></el-input>
      </el-form-item>
      <!-- <el-form-item label="擅长类型"   prop="reportTypeName" >
        <el-select  v-model="ruleForm.doctorTypeNames"  multiple placeholder="请选择擅长类型" :disabled='this.$route.query.type'>
          <el-option  v-for="item in this.$route.query.goodTypeOptions" :key="item.reportTypeId" :label="item.reportTypeName" :value="item.reportTypeId"> </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item v-if='!this.$route.query.type'>
        <el-button type="primary" @click="submitForm('ruleForm')" >保存</el-button>
      </el-form-item>
     
    </el-form>


  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'editDoct',
  data () {
    return {
      ruleForm: {
        account: '',
        name: '',
        identity: '',
        phone:'',
        reportTypeName:[],
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { pattern:/^[\u2E80-\u9FFF]+$/, message: '请输入正确的姓名', trigger: 'blur' },
          {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        identity: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, message: '身份证格式错误', trigger: 'blur' }
        ],
        // reportTypeName: [
        //   { required: true, message: '请选择擅长类型', trigger: 'blur' },
        // ],
      },
    }
  },
  methods: {
    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.updateDoct(this.ruleForm);
        //  this.$router.push({ path: '/main/3-2-1'})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    updateDoct(searchPram){ //调用修改接口
      var url='';
      if(this.$route.query.row){ //修改
          url='back/doctor/update';
      }else{
          url='back/doctor/insert'; //新增
      }
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          doctorId:this.$route.query.row?this.$route.query.row.doctorId:null,
          name: searchPram.name,
          identity: searchPram.identity,
          phone: searchPram.phone,
          // goodTypeList:searchPram.reportTypeName,
          // goodTypeList:["18010141804023856"]
        }
      }).then(response => {
        if(response.body.result=='0'){
          this.$message({
            message: response.body.msg,
            type: 'warning'
          });
        }else{
          this.$message({
            message: "修改成功",
            type: 'success'
          });
          this.$router.push({ path: '/main/3-2-1'})
        }       
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
      console.log(this.ruleForm)
    }

  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

 
</style>
