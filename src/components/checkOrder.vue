<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2">
        <router-link :to="{path:'/main/5-1',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>

    </el-row>

    <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" size="mini"  >
      <el-row >
 <el-col :span="12" >
      <el-form-item label="订单编号" >
            <el-input v-model="ruleForm.orderId"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="ruleForm.inspectName"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="手机号" >
            <el-input v-model="ruleForm.inspectPhone"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="身份证号" >
            <el-input v-model="ruleForm.inspectIdentity"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="所购套餐" >
            <el-tag  :key="tag.category" v-for="tag in tagOption" >
              {{tag.category}}
            </el-tag>
          </el-form-item>

          <el-form-item  label="所需样本" >
              <el-tag  :key="tag.specimenName" v-for="tag in specimenOption" >
              {{tag.specimenName}}
            </el-tag>
          </el-form-item>
           <el-form-item  label="护士姓名" v-if='this.ruleForm.serviceMethod==1'>
               <el-input  disabled  type="text" :rows="2" v-model="ruleForm.nurseName" > </el-input>
          </el-form-item>
          <el-form-item  label="护士手机" v-if='this.ruleForm.serviceMethod==1'>
               <el-input  disabled  type="text" :rows="2" v-model="ruleForm.nursePhone"> </el-input>
          </el-form-item>
           <el-form-item  label="服务站" v-if='this.ruleForm.serviceMethod==0'>
               <el-input  disabled  type="textarea" :rows="2" v-model="ruleForm.userCheck" > </el-input>
          </el-form-item>

           <el-form-item  label="订单状态" >
               <el-input  disabled  type="textarea" :rows="2" v-model="ruleForm.payStatus"> </el-input>
          </el-form-item>
    </el-col>
  <el-col :span="11" > 
           <el-form-item  label="订单流程" >
             <el-steps :active="1" align-center direction="vertical">

               <el-step :title="step.time" :key="step.time" v-for="step in stepOption" :description="step.status" icon="el-icon-circle-check-outline"></el-step>

            </el-steps>

          </el-form-item>
      
  </el-col>
      </el-row>
    
      </el-form> 

  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'checkItem',
  data () {
    return {
      ruleForm: {},
      tagOption:[],
      specimenOption:[],
      stepOption:[]
    }
  },
  methods: {

    detail(id){
      this.$http.get(this.baseUrl.address+'back/order/orderDetail',{
        params:{
          orderId:id
        }
      }).then(response => {
         this.ruleForm=response.body;
         this.ruleForm.orderId=this.$route.query.row.orderId;
         this.tagOption=response.body.categoryList;
         this.specimenOption=response.body.specimenList;
         this.stepOption=response.body.time;
         this.stepOption=this.stepOption.reverse()
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
      this.detail(this.$route.query.row.orderId);
    }

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-step.is-vertical{
  height: 60px;
}
</style>
