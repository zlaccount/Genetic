<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：项目检测管理</el-breadcrumb-item>
          <el-breadcrumb-item>套餐类型</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/1-4',query:{pageIndex:this.$route.query.pageIndex}}">
         <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" size="mini"  status-icon inline-message  >
      <el-form-item label="套餐类型编号" prop="categoryTypeCode"  v-if='this.$route.query.type'>
        <el-input v-model="ruleForm.categoryTypeCode" disabled ></el-input>
      </el-form-item>

      <el-form-item label="套餐类型名称" prop="categoryTypeName">
        <el-input v-model="ruleForm.categoryTypeName" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>

      <el-form-item v-if='!this.$route.query.type'>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="forbidden">保存</el-button>
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
        categoryTypeCode: '',
        categoryTypeName: '',
      },
      rules: {
        categoryTypeName: [
          { required: true, message: '请输入套餐类型名称', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          // { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ]
      },
      forbidden:false
    }
  },
  methods: {
    submitForm(formName) { //提交表单
      this.forbidden=true
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.updateDoct(this.ruleForm);
         setTimeout(()=>{this.$router.push({ path: '/main/1-4'})},500)
        } else {
          this.forbidden=false
          console.log('error submit!!');
          return false;
        }
      });
    },

    updateDoct(searchPram){ //调用修改接口
      var url='';
      if(this.$route.query.row){ //修改
          url='back/categoryType/updateById';
      }else{
          url='back/categoryType/insert'; //新增
      }
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          typeId:this.$route.query.row?this.$route.query.row.typeId:null,
          categoryTypeName: searchPram.categoryTypeName,
        }
      }).then(response => {
         this.$message({
            message: response.body.msg,
            type: 'success'
          });
      }, response => {
        this.forbidden=false
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
