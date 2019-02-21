<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：检测站</el-breadcrumb-item>
          <el-breadcrumb-item>收样</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2">
        <router-link :to="{path:'/main/7-1'}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" size="mini">
      <el-row >
 <el-col :span="12" >
          <el-form-item label="样本编号" >
            <input v-model="ruleForm.specimenCode" v-focus class="orderId" @keyup.enter="getSampleInfo">
          </el-form-item>
          <el-form-item label="订单编号" >
            <el-input v-model="ruleForm.orderId"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="ruleForm.inspectName"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model="ruleForm.inspectPhone"  disabled ></el-input>
          </el-form-item>

          <el-form-item label="身份证号" >
            <el-input v-model="ruleForm.inspectIdentity"  disabled ></el-input>
          </el-form-item>

          <!-- <el-form-item label="所购套餐" >
            <el-tag  :key="tag.category" v-for="tag in tagOption" >
              {{tag.category}}
            </el-tag>
          </el-form-item> -->

          <el-form-item  label="所需样本" >
            <div :key="tag.specimenName" v-for="tag in specimenOption" class="samplist">
               <el-tag >
              {{tag.specimenName}}
            </el-tag>
            <el-button type="primary" size="mini" :disabled="tag.takeStatus==1" @click="scanCode(tag.specimenId)">{{tag.sampleStatus}}</el-button>
            </div>
             
          </el-form-item>
           
           <el-form-item  label="样本条码" v-if='ruleForm.scan'>
                <input  v-focus='ruleForm.sample' v-model="ruleForm.sampleCode" class="orderId" @keyup.enter="getsample">
          </el-form-item>

          <el-form-item>
              <el-button type="primary" size="mini" @click="getAllSample">一键收样</el-button>
           </el-form-item>
    </el-col>

  <el-col :span="11" > 
      
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
      ruleForm: {
          specimenCode:"",
          orderId:"",
          inspectName:"",
          inspectPhone:"",
          inspectIdentity:"",
          scan:false,
          sample:false,
          sampleCode:"",
          specimenId:""

      },
      tagOption:[],
      specimenOption:[],
      stepOption:[]
    }
  },
  directives: {
    focus: {
        // 指令的定义
        inserted: function (el) {
            el.focus()
        }
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
    getsample(){
      this.$http.get(this.baseUrl.address+'back/detection/printCodeByOrderSpecimen',{
        params:{
          orderId:this.ruleForm.orderId,
          // specimenId:this.ruleForm.specimenId,
          specimenCode:this.ruleForm.sampleCode
        }
      }).then(response => {
        if(response.body.Code==0){
           this.$message({
            message: "收样成功",
            type: 'success'
          });
          this.ruleForm.scan=false
          for(var i=0;i<this.specimenOption.length;i++){
            if(this.ruleForm.sampleCode==this.specimenOption[i].specimenCode){
              this.specimenOption[i].takeStatus=1
              this.specimenOption[i].sampleStatus="已收样"
            }
          }
          // this.afterScan()
        }else{
          this.$message({
            message: response.body.msg,
            type: 'warning'
          });
          this.ruleForm.sample=""
        }
        
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },
    getSampleInfo(){
      this.$http.get(this.baseUrl.address+'back/detection/checkStationGatherCode',{
        params:{
         specimenCode:this.ruleForm.specimenCode
        }
      }).then(response => {
        if(response.body.code==1){
          this.$message({
            message: response.body.msg,
            type: 'warning'
          });
        }else{
          this.ruleForm.orderId=response.body.order.orderId
          this.ruleForm.inspectName=response.body.order.inspectName
          this.ruleForm.inspectPhone=response.body.order.inspectPhone
          this.ruleForm.inspectIdentity=response.body.order.inspectIdentity
          this.specimenOption=response.body.specimenList
          for(const items of this.specimenOption){
            if(items.takeStatus==1){
              items.sampleStatus="已收样"
            }else{
              items.sampleStatus="扫码收样"
            }
          }
          this.ruleForm.sampleCode=this.ruleForm.specimenCode
          this.getsample()
        }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },
    afterScan(){
      this.$http.get(this.baseUrl.address+'back/detection/checkStationGatherCode',{
        params:{
         specimenCode:this.ruleForm.specimenCode
        }
      }).then(response => {
        if(response.body.code==1){
          this.$message({
            message: response.body.msg,
            type: 'warning'
          });
        }else{
          this.ruleForm.orderId=response.body.order.orderId
          this.ruleForm.inspectName=response.body.order.inspectName
          this.ruleForm.inspectPhone=response.body.order.inspectPhone
          this.ruleForm.inspectIdentity=response.body.order.inspectIdentity
          this.specimenOption=response.body.specimenList
          for(const items of this.specimenOption){
            if(items.takeStatus==1){
              items.sampleStatus="已收样"
            }else{
              items.sampleStatus="扫码收样"
            }
          }
          this.ruleForm.sampleCode=this.ruleForm.specimenCode
        }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },
    scanCode(specimenId){
      this.ruleForm.scan=true
      this.ruleForm.sample=true
      this.ruleForm.sampleCode=""
      this.ruleForm.specimenId=specimenId
    },
    getAllSample(){
      if(this.ruleForm.orderId==""){
         this.$message({
            message: "请选择要收样的订单",
            type: 'warning'
          });
          return
      }
      this.$http.get(this.baseUrl.address+'back/detection/getSample',{
        params:{
         orderId:this.ruleForm.orderId
        }
      }).then(response => {
        if(response.body.code==1){
          this.$message({
            message: response.body.msg,
            type: 'warning'
          });
        }else{
           this.$message({
            message: response.body.msg,
            type: 'success'
          });
          this.$router.push({ path: '/main/7-1'})
        }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    }

  },
  
  

  mounted () {
    // this.getSampleInfo()
   

  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-step.is-vertical{
  height: 60px;
}
.orderId{
    width: 420px;
    height: 26px;
    outline: none;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    padding: 0 15px;
    color: #999;
}
.samplist{
  margin-bottom: 10px;
}
</style>
