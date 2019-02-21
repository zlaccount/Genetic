<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：解读报告</el-breadcrumb-item>
          <el-breadcrumb-item>报告信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2">
        <router-link :to="{path:'/main/4-1',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>

    </el-row>

    <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" size="mini">
      
          <el-form-item label="报告名称" >
            <el-input v-model="ruleForm.reportName"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="ruleForm.inspectName"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="申请时间" >
            <el-input v-model="ruleForm.applyTime"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="解读时间" >
            <el-input v-model="ruleForm.readTime"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="报告内容" >
            <el-input v-model="ruleForm.reportName"  disabled ></el-input>
            <!-- <el-button type="primary" icon="el-icon-search" @click='checkPdf' >查看</el-button> -->
            <a :href="this.baseUrl.picUrl+this.ruleForm.reportPDFUrl" target="_blank" class="checkReport">查看</a>
          </el-form-item>

          <el-form-item  label="病情分析">
               <el-input :disabled='this.$route.query.type' type="textarea" :rows="6" :minlength='1'  v-model="ruleForm.analysis"> </el-input>
          </el-form-item>

          <el-form-item  label="指导意见" >
               <el-input :disabled='this.$route.query.type'  type="textarea" :rows="6" :minlength='1' v-model="ruleForm.advice"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click='save' v-if='!this.$route.query.type'>解读</el-button>
          </el-form-item>
      </el-form> 

  </div>
</template>

<script>
export default {
  props: ['baseUrl','admin'],
  name: 'checkItem',
  data () {
    return {
      ruleForm: {
      
      },
    }
  },
  methods: {
    checkPdf(){
      window.location.href=this.baseUrl.picUrl+this.ruleForm.reportPDFUrl;
    },

    detail(id){
      this.$http.get(this.baseUrl.address+'back/report/selectReportById',{
        params:{
          detailId:id
        }
      }).then(response => {
         this.ruleForm=response.body;
         if(response.body.readStatus!="已解读"){
           this.ruleForm.reportPDFName=""
         }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },
    save(){
      this.$http.get(this.baseUrl.address+'back/report/readReport',
      {
        params: 
        {
          reportDetailId:this.$route.query.row.reportDetailId,
          doctorId:this.admin.id,
          advice:this.ruleForm.advice,
          analysis:this.ruleForm.analysis
        }
      }).then(response => {
         if(response.body.code==0){
          this.$router.push({ path: '/main/4-1'})
        }
        this.$message({
          message: response.body.msg,
          type: response.body.code?'warning':'success'
        });
      }, response => {
          this.$notify.error({
            title: '错误',
            message: '请求失败'
          });
        });
    }

  },

  mounted () {

    if(this.$route.query.row){
      this.detail(this.$route.query.row.reportDetailId);
      this.ruleForm=this.$route.query.row
    }

  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.checkReport{ 
  display: inline-block;
  width: 60px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: #43a0ea;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}
</style>
