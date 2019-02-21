<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：项目检测管理</el-breadcrumb-item>
          <el-breadcrumb-item>样本信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/1-3',query:{pageIndex:this.$route.query.pageIndex}}">
         <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="mini" status-icon inline-message >
      <el-form-item label="样本编号" prop="specimenTypeCode"  v-if='this.$route.query.type'>
        <el-input v-model="ruleForm.specimenTypeCode" disabled ></el-input>
      </el-form-item>

      <el-form-item label="样本名称" prop="specimenTypeName">
        <el-input v-model="ruleForm.specimenTypeName" :disabled='this.$route.query.type'></el-input>
      </el-form-item>
      
       <el-form-item label="样本价格(￥)" prop="specimenTypePrice">
        <el-input v-model="ruleForm.specimenTypePrice" type="number" :precision="2" :min="0" :max="10000" controls-position="right" :disabled='this.$route.query.type' ></el-input>
       </el-form-item>

       <el-form-item label="样本数量" prop="specimenTypeContent">
         <el-input v-model="ruleForm.specimenTypeContent" type="number" :min="1" :disabled='this.$route.query.type' ></el-input>
       </el-form-item>

       <el-form-item label="样本单位" prop="specimenTypeUnit" >
         <!-- <el-input v-model="ruleForm.specimenTypeUnit" placeholder="请输入样本单位" :disabled='this.$route.query.type'></el-input> -->
         <el-select v-model="ruleForm.specimenTypeUnit" placeholder="请选择样本单位" :disabled='this.$route.query.type'>
            <el-option label="ml" value="ml"></el-option>
            <el-option label="L" value="L"></el-option>
            <el-option label="g" value="g"></el-option>
            <el-option label="kg" value="kg"></el-option>
            <el-option label="根" value="根"></el-option>
            <el-option label="个" value="个"></el-option>
            <el-option label="块" value="块"></el-option>
          </el-select>
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
        specimenTypeCode: '',
        specimenTypeName: '',
        specimenTypePrice: '',
        specimenTypeContent:'',
        specimen:"",
        specimenTypeUnit:"",
      },
      rules: {
        specimenTypeName: [
          { required: true, message: '请输入样本名称', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          
        ],
        specimenTypeUnit:[
          { required: true, message: '请输入样本单位', trigger: 'change' },
        ],
        specimenTypeContent:[
          { required: true, message: '请输入样本数量', trigger: 'blur' },
        ],
        specimenTypePrice:[
          { required: true, message: '请输入样本价格', trigger: 'blur' },
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
         setTimeout(()=>{this.$router.push({ path: '/main/1-3'})},500)
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
          url='back/specimenType/updateSpecimenTypeById';
      }else{
          url='back/specimenType/addSpecimenType'; //新增
      }
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          specimenTypeId:this.$route.query.row?this.$route.query.row.specimenTypeId:null,
          specimenTypeName: searchPram.specimenTypeName,
          specimenTypePrice: parseInt(searchPram.specimenTypePrice*100),
          specimenTypeContent: searchPram.specimenTypeContent,
          specimenTypeUnit:searchPram.specimenTypeUnit
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
      this.ruleForm.specimenTypePrice=(this.ruleForm.specimenTypePrice/100).toFixed(2)
    }
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
