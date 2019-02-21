<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：会员卡</el-breadcrumb-item>
          <el-breadcrumb-item>会员卡录入</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/11-1',query:{pageIndex:this.$route.query.pageIndex}}">
         <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="250px" size="mini"  status-icon inline-message  >
      <!-- <el-form-item label="用户名" prop="account">
        <el-input v-model="ruleForm.account" disabled></el-input>
      </el-form-item> -->

      <el-form-item label="卡号" prop="cardCode">
        <el-input v-model="ruleForm.cardCode" type="number" :disabled='this.$route.query.type' ></el-input>
      </el-form-item>
      
       <el-form-item label="验证码" prop="authCode">
        <el-input v-model="ruleForm.authCode" clearable :disabled='this.$route.query.type' ></el-input>
      </el-form-item>
      <el-form-item label="卡类型" prop="cardType" >
        <el-select  size="mini" v-model="ruleForm.cardType" @change="chooseCardType" placeholder="请选择卡类型" :disabled='this.$route.query.type'>
            <el-option label="余额卡" value="1"></el-option>
            <el-option label="套餐卡" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡余额" prop="cardBalance" v-if='ruleForm.cardType=="余额卡"'>
        <el-input v-model="ruleForm.cardBalance" clearable :disabled='this.$route.query.status' ></el-input>
      </el-form-item>
       <el-form-item label="选择套餐" prop="CategoryList" v-if='ruleForm.cardType=="套餐卡"'>
             <el-select v-model="CategoryList" @change="getItemLab" @remove-tag="removeItem" multiple placeholder="请选择"  :disabled='this.$route.query.status'>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item  label="" v-for="tag in packageList" :key="tag.categoryName" v-if='ruleForm.cardType=="套餐卡"'>
            <div class="packageInfo"  >
                <el-tag>{{tag.categoryName}}</el-tag> 
                <el-input-number v-model="tag.numBer" :disabled="status" @change="handleChange"  :min="1"></el-input-number>
            </div>
        </el-form-item>
      <!-- <el-form-item label="使用状态" prop="employStatus">
        <el-input v-model="ruleForm.employStatus" clearable :disabled='this.$route.query.type' ></el-input>
      </el-form-item> -->
       <el-form-item label="姓名" prop="userName">
        <el-input v-model="ruleForm.userName" clearable :disabled='this.$route.query.status' ></el-input>
      </el-form-item>
       <el-form-item label="手机号" prop="userPhone">
        <el-input v-model="ruleForm.userPhone" clearable :disabled='this.$route.query.status' ></el-input>
      </el-form-item>
       <el-form-item label="使用人单位" prop="userCorporation">
        <el-input v-model="ruleForm.userCorporation" clearable :disabled='this.$route.query.status' ></el-input>
      </el-form-item>
       <el-form-item label="使用人地址" prop="userAddress">
        <el-input v-model="ruleForm.userAddress" clearable :disabled='this.$route.query.status' ></el-input>
      </el-form-item>

      

      <el-form-item v-if='!this.$route.query.status'>
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
        cardCode: "",
        authCode: "",
        cardType: "",
        cardBalance:"",
        addTieme:"",
        employStatus:"",
        employTime:"",
        userName:"",
        userPhone:"",
        userCorporation:"",
        userAddress:"",
        tag1Option:[],
        
      },
      rules: {
        cardCode: [
          { required: true, message: '请输入卡号', trigger: 'blur' },
        ],
        authCode: [
          { required: true, message: '验证码', trigger: 'blur' },
        //   { pattern: /^1[34578]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        cardType: [
          { required: true, message: '请选择卡类型', trigger: 'blur' },
        ],

      },
      checkList:[],
      packageList:[],
      CategoryList:[],
      status:false,
      options:[]
    }
  },
  methods: {
    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.ruleForm.cardType=="余额卡"){
            if(this.ruleForm.cardBalance==""){
              this.$message({
                message: '请输入余额',
                type: 'warning'
              });
              return
            }
          }
          if(this.ruleForm.cardType=="套餐卡"){
            if(this.packageList.length==0){
              this.$message({
                message: '请选择套餐',
                type: 'warning'
              });
              return
            }
          }
         this.updateDoct(this.ruleForm);
        
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getItemLab(val){
      // debugger;
      var packages=this.packageList
      this.packageList=[]
      for(var i=0;i<val.length;i++){
           this.$http.get(this.baseUrl.address+'back/category/selectCategoryById',{    
              params:{
                categoryId:val[i]
              }
            }).then(response => {
              // debugger
              this.packageList.push({categoryId:response.body.category.categoryId,categoryName:response.body.category.name,numBer:"1"})
              for(var i=0;i<this.packageList.length;i++){
                for(var j=0;j<packages.length;j++){
                  if(this.packageList[i].categoryId==packages[j].categoryId){
                    this.packageList[i].numBer=packages[j].numBer
                  }
                }
              }
            }, response => {
              this.$notify.error({
                title: '错误',
                message: '请求失败'
              });
            });
            }
    },
    handleChange(val){
      console.log(this.packageList)
      
    },
    chooseCardType(val){
        if(val=="1"){
            this.ruleForm.cardType="余额卡"
            this.packageList=[]
            this.CategoryList=[]
        }else if(val=="2"){
            this.ruleForm.cardType="套餐卡"
           
        }
    },
    updateDoct(searchPram){ //调用修改接口
      var url='';
      if(this.$route.query.row){ //修改
          url='/back/clubCard/updateClubCardByPage';
      }else{
          url='/back/clubCard/insertClubCard'; //新增
      }
      if(searchPram.cardType=="套餐卡"){
        var type=2
        searchPram.cardBalance=0
      }else{
        var type=1
      }
    //   this.$http.get(this.baseUrl.address+url,
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          clubCardId:this.$route.query.row?this.$route.query.row.clubCardId:null,
          cardCode: (searchPram.cardCode*1).toFixed(),
          authCode: searchPram.authCode,
          cardType: type,
          cardBalance:(searchPram.cardBalance*100).toFixed(),
          employTime:searchPram.employTime,
          userName:searchPram.userName,
          userPhone:searchPram.userPhone,
          userCorporation:searchPram.userCorporation,
          CategoryLists:JSON.stringify(this.packageList),
          userAddress:searchPram.userAddress
        }
      }).then(response => {
        if(response.body.code=='0'){
          this.$message({
            message: response.body.msg,
            type: 'success'
          });
          this.$router.push({ path: '/main/11-1'})
        }else{
          this.$message({
            message: "修改成功",
            type: 'success'
          });
          this.$router.push({ path: '/main/11-1'})
        }       
      }, response => {
          this.$notify.error({
            title: '错误',
            message: '请求失败'
          });
      });
    },
    getPackageList(){
        this.$http.get(this.baseUrl.address+'back/clubCard/selectCategoryAll',{
      //  this.$http.get('http://192.168.1.92:8080/gene_detection/back/clubCard/selectCategoryAll',{    
        params:{
          
        }
      }).then(response => {
        
        for(const items of response.body.CategoryList){
          this.options.push({value:items.categoryId,label:items.name})
          //  debugger
        }
       
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },
    detail(id){
      this.$http.get(this.baseUrl.address+'/back/clubCard/selectClubCardById',{    
        params:{
          clubCardId:id
        }
      }).then(response => {
        if(response.body.clubCard.categoryList.length>0){
          for(const item of response.body.clubCard.categoryList){
              this.packageList.push({categoryId:item.cardCategoryId,categoryName:item.cardCategoryName,numBer:item.categoryNum})
              this.CategoryList.push(item.cardCategoryId)
          }
        }
        // debugger
        this.ruleForm.cardCode=response.body.clubCard.cardCode
        this.ruleForm.authCode=response.body.clubCard.authCode
        this.ruleForm.cardType=(response.body.clubCard.cardType=="1"?"余额卡":"套餐卡")
        this.ruleForm.cardBalance=(response.body.clubCard.cardBalance/100).toFixed(2)
        this.ruleForm.addTieme=response.body.clubCard.addTieme
        this.ruleForm.employStatus=response.body.clubCard.employStatus=="0"?"未使用":"已使用"
        this.ruleForm.employTime=response.body.clubCard.employTime
        this.ruleForm.userName=response.body.clubCard.userName
        this.ruleForm.userPhone=response.body.clubCard.userPhone
        this.ruleForm.userCorporation=response.body.clubCard.userCorporation
        this.ruleForm.userAddress=response.body.clubCard.userAddress
       
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });

    }

  },

  mounted () {
      this.getPackageList()
    if(this.$route.query.row){
      // alert(this.$route.query.status)
      this.status=this.$route.query.status
      this.ruleForm=this.$route.query.row;
      this.ruleForm.cardType=(this.ruleForm.cardType=="1"?"余额卡":"套餐卡")
      this.detail(this.$route.query.row.clubCardId)
      console.log(this.ruleForm)
    }

  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.packageInfo{
    margin-bottom: 10px;
}
 
</style>
