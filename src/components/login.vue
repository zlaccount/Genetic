<template>

    <div id='login' class="login" :style="{backgroundImage: 'url(' + backgroundImage + ')' }" >

     
           <img src="../assets/logo1.png" alt="" class="logo">
     
     <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" class="loginForm" >
   
       <h1>基因检测后台管理系统</h1>
      <el-form-item  prop="account">
        <el-input v-model="ruleForm2.account" clearable placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" clearable @keyup.enter.native="submitForm('ruleForm2')" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
      </el-form-item>
      <el-form-item >
        <el-button @click="resetForm('ruleForm2')" class="resetBtn" >重置</el-button>
      </el-form-item>

    </el-form>

     
    </div>


</template>

<script>
import backgroundImage from '@/assets/login_bg3.jpg'

export default {
  props: ['baseUrl'],
  name: 'login',
  data () {
      return {
        backgroundImage:backgroundImage,
        ruleForm2: {
          password: '',
          account: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { pattern: /^1[34578]\d{9}$/, message: '账号输入格式有误', trigger: 'blur' }
          ],
          password: [
             { required: true, message: '请输入密码', trigger: 'blur' },
             { min:6,max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
        },
      };
    },
    methods: {
      login(ruleForm2){
        this.$http.post(this.baseUrl.address+'back/admin/login',ruleForm2
      ).then(response => {
           this.ruleForm2.account='';
           this.ruleForm2.password='';
            if(response.body.code==0){
              sessionStorage.setItem("adminName",response.body.adminName)
             this.$router.push({ path: '/main',query:{adminName:response.body.adminName,adminId:response.body.adminId}}) ;
            }else{
              this.$message({
                message: response.body.msg,
                type: 'warning'
              });
            } 
        }, response => {
            this.$notify.error({
              title: '错误',
              message: '请求失败'
            });
        });
      },
      enter(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.login(this.ruleForm2);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },


      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.login(this.ruleForm2);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },

    mounted () {
      if(this.$route.query.exit){
        this.ruleForm2.password='';
        this.ruleForm2.account='';
      }
    },

  }
</script>

<style scoped lang="scss">
  .login{
    height: 100%;
    background-size: 100% 100%;
    .logo{
      width:250px;
      height: 80px;
        display: block;
        margin: auto auto;
        position: relative;
        top:90px;
      }
    .el-form{
      display: block;
      width: 450px;
      height: 400px;
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      margin: 130px auto auto auto;
      text-align: center;
    
      h1{
        color: white;
        height: 110px;;
        line-height: 110px;
      }
      .el-form-item{
        height: 50px;
        .el-input,.el-button{
          width: 300px;
        }
        .resetBtn{
          position: relative;
          bottom: 10px;
        }
      }
    }
  }
</style>
