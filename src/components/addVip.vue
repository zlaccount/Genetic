<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>会员信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/3-1',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" size="mini"  status-icon inline-message  >
      <el-form-item  label="姓名" prop="name">
        <el-input v-model="ruleForm.name" clearable :disabled='this.$route.query.type' ></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="identity" >
        <el-input v-model="ruleForm.identity" clearable @change="identityChange(ruleForm.identity)" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-input v-model="ruleForm.sex" disabled ></el-input>
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
        <el-input v-model="ruleForm.birthday" disabled ></el-input>
      </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input v-model="ruleForm.age" disabled ></el-input>
      </el-form-item>
      
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone" clearable :disabled='this.$route.query.type' ></el-input>
      </el-form-item>

      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm.account" disabled ></el-input>
      </el-form-item>

      <el-form-item label="积分" prop="money">
        <el-input v-model="ruleForm.money" controls-position="right" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>

      <el-form-item label="身高(cm)" prop="height">
        <el-input v-model="ruleForm.height" :precision="2" type="number" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>

      <el-form-item label="体重(kg)" prop="weight">
        <el-input v-model="ruleForm.weight" :precision="2" type="number" :disabled='this.$route.query.type' ></el-input>
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
  name: 'addVip',
  data () {
    return {
      ruleForm: {
        name: '',
        identity: '',
        sex: '',
        birthday: '',
        age: '',
        phone:'',
        account: '',
        money: '',
        weight:'',
        height:''
      },

      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { pattern:/^[\u2E80-\u9FFF]+$/, message: '请输入正确的姓名', trigger: 'blur' },
          {min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' },
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' },
        ],
        birthday: [
          { required: true, message: '生日不能为空', trigger: 'blur' },
        ],
        identity: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, message: '身份证格式错误', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
      },
      
    }
  },
  methods: {
    identityChange(val){
      var pam=this.IdCard(val)
      this.ruleForm.sex=pam.sex;
      this.ruleForm.age=pam.age;
      this.ruleForm.birthday=pam.birth;
    },

    IdCard(UUserCard){
      var birth=UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);//获取出生日期
      var sex='';
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {      //获取性别
        sex= "男";
      } else {
        sex= "女";
      }
      var myDate = new Date();//获取年龄
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
        age++;
      }
      return {birth:birth,sex:sex,age:age};
  },



    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.addVip(this.ruleForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addVip(searchPram){ //调用修改接口
        this.$http.get(this.baseUrl.address+'back/userInfo/update',
        {
          params: 
          {
            userId:this.$route.query.row.userId,
            name: searchPram.name,
            identity: searchPram.identity,
            sex: searchPram.sex,
            birthday: searchPram.birthday,
            age: searchPram.age,
            phone: searchPram.phone,
            money: searchPram.money,
            weight:searchPram.weight,
            height:searchPram.height,
          }
        }).then(response => {
          if(response.body.result=='0'){
            this.$message({
              message: '修改失败',
              type: 'warning'
            });
          }else{
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.$router.push({ path: '/main/3-1'})
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
    this.ruleForm=this.$route.query.row;
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
