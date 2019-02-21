<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/9-2',query:{pageIndex:this.$route.query.pageIndex}}">
         <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" size="mini"  status-icon inline-message  >

      <el-form-item label="用户名" prop="account">
        <el-input v-model="ruleForm.account" :disabled='this.$route.query.row' ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="userName">
        <el-input v-model="ruleForm.userName" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>

      <el-form-item label="选择角色" prop="tag1Option">
         <el-select v-model="ruleForm.tag1Option" @change="getItemLab"  multiple placeholder="请选择角色" :disabled='this.$route.query.type'>
          <el-option
            v-for="item in permissionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        account:'',
        password:'',
        userName:'',
        tag1Option:[]
      },
      permissionOptions:[],
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '用户名格式错误', trigger: 'blur' }
        ],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
        ],
        tag1Option: [
          { required: true, message: '请选择角色', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.updateDoct(this.ruleForm);
         this.$router.push({ path: '/main/9-2'})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getItemLab(val){

    },

    updateDoct(searchPram){ //调用修改接口
      var url='';
      if(this.$route.query.row){ //修改
          url='back/admin/updateUser';
      }else{
          url='back/admin/addRole'; //新增
      }
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          userAdminId:this.$route.query.row?this.$route.query.row.userAdminId:null,
          account:searchPram.account,
          password:searchPram.password,
          userName:searchPram.userName,
          roleIds:searchPram.tag1Option
        }
      }).then(response => {
          if(response.body.code=="0"){
            this.$message({
              message: response.body.msg,
              type: 'success'
            });
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

    detail(id){
      this.ruleForm.tag1Option=[];
      this.$http.get(this.baseUrl.address+'back/admin/selectAdminByAdminId',{
        params:{
          adminId:id,
        }}).then(response => {
        if(response.body.roleList!=0){
          for(const item of response.body.roleList){
            if(this.$route.query.row){
              this.ruleForm.tag1Option.push(item.roleId)
            }
          }
        }
      }, response => {
          this.$notify.error({
            title: '错误',
            message: '请求失败'
          });
      });
    },
    qurPermission(){ //搜索按钮
      this.ruleForm.tag1Option=[];
      this.$http.get(this.baseUrl.address+'back/admin/listRole',{
        params:{
          pageNum:1,
          pageSize:100
        }}).then(response => {
        // this.permissionOptions=response.body.roles;
        for(const items of response.body.roles){
          this.permissionOptions.push({value:items.roleId,label:items.roleCode})
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
    this.qurPermission();
    if(!this.$route.query.row){
      this.rules.password= [{ required: true, message: '请输入密码', trigger: 'blur' }]
    }else{
        this.ruleForm=this.$route.query.row;
        this.detail(this.$route.query.row.userAdminId);
        // this.qurPermission(this.$route.query.row.roleId);
        this.ruleForm.password=""
    }
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 
</style>
