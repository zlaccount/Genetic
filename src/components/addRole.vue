<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="2">
        <router-link :to="{path:'/main/9-1',query:{pageIndex:this.$route.query.pageIndex}}">
         <el-button type="warning" size='mini'>返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size='mini' label-width="220px" class="demo-ruleForm" status-icon inline-message>
      <el-form-item label="角色名称" prop="roleCode">
        <el-input v-model="ruleForm.roleCode" clearable :disabled='this.$route.query.row' ></el-input>
      </el-form-item>

      <el-form-item label="角色权限" prop="permissionIds">
        <el-checkbox-group v-model="ruleForm.permissionIds" :disabled='this.$route.query.type'>
          <el-checkbox  v-for='i in checkboxOptuin' :key='i.permissionId' :label="i.permissionId">{{i.permissionName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" v-if='!this.$route.query.type' >保存</el-button>
      </el-form-item>
     

    </el-form>


  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'role_check',
  data () {
    return {
      ruleForm: {
        roleCode: '',
        permissionIds: [],
      },
      rules: {
        roleCode: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8个字符', trigger: 'blur' },
        ],
        permissionIds: [
          { required: true, message: '请勾选要添加的权限', trigger: 'blur' }
        ],
     
      },
      checkboxOptuin:[],

    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addRole(this.ruleForm);
          this.$router.push({ path: '/main/9-1'})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getPermission(){ //查询所有权限
     this.$http.get(this.baseUrl.address+'back/admin/listPermission').then(response => {
       this.checkboxOptuin=response.body.permissions;
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },
      addRole(searchPram){ //调用修改接口
        var url;
        if(this.$route.query.row){//修改
           url='/back/admin/updateRole';
        }else{ //新增
           url='back/admin/addPermissions'
        }
        this.$http.get(this.baseUrl.address+url,
        {
          params: 
          {
            roleId:this.$route.query.row?this.$route.query.row.roleId:'',
            roleCode:searchPram.roleCode,
            permissionIds:searchPram.permissionIds
          } 
        }).then(response => {
          var type;
           if(response.body.code=='0'){
            type='success';
          }   else{
            type='warning'
          }
            this.$message({
              message: response.body.msg,
              type: type
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
    this.getPermission();
    if(this.$route.query.row){
      this.ruleForm.roleCode=this.$route.query.row.roleCode;
      this.ruleForm.permissionIds= this.$route.query.row.permissionList;
    }
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
