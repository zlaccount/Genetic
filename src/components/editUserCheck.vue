<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：采样服务站</el-breadcrumb-item>
          <el-breadcrumb-item>服务站信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/6-1',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="mini" status-icon inline-message  >
    <el-row >

      <el-col :span="12" >
      
          <el-form-item  label="账号" prop="account">
            <el-input v-model="ruleForm.account" clearable :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" clearable :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="联系人" prop="contacts" >
            <el-input v-model="ruleForm.contacts" clearable  :disabled='this.$route.query.type' ></el-input>
          </el-form-item>
          
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="ruleForm.phone" clearable  :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="省市区" prop="adderssList" >
            <el-cascader expand-trigger="hover" @change='selCity'  :options="hospitalOptions" v-model="ruleForm.adderssList" :disabled='this.$route.query.type' > </el-cascader>
          </el-form-item>
          
          <el-form-item label="详细地址" prop="address" >
            <el-input v-model="ruleForm.address" clearable  :disabled='this.$route.query.type' id="copy" ></el-input>
          </el-form-item>


          <el-form-item v-if='!this.$route.query.type'>
            <el-button type="primary" @click="submitForm('ruleForm')" >保存</el-button>
          </el-form-item>
     
      </el-col>
      
      <el-col :span="11" >

            <el-form-item label="服务站" prop="checkName">
            <el-input v-model="ruleForm.checkName" :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

           <el-form-item label="纬度(°N)" prop="latitude">
            <el-input v-model="ruleForm.latitude" controls-position="right" type="number" :precision="6" :disabled='this.$route.query.type'></el-input>
          </el-form-item>
          <el-form-item label="经度(°E)" prop="longitude">
            <el-input v-model="ruleForm.longitude" controls-position="right" type="number" :precision="6"  :disabled='this.$route.query.type'></el-input>
          </el-form-item>

         

          <el-form-item label="" prop="">
            <a href="http://www.gpsspg.com/maps.htm" @click='copy(this)' target="_blank" class="getPosition">获取经纬度</a>
           (提示:1、复制服务站地址，进入网页搜索;2、选择百度经纬度搜索即可)
          </el-form-item>

          
            
         <el-form-item  label="工作时间" >
              <el-time-select 
                placeholder="上午"
                :disabled='this.$route.query.type'
                v-model="startTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '12:30'
                }">
              </el-time-select>
              <el-time-select 
                placeholder="下午"
                :disabled='this.$route.query.type'
                 v-model="endTime"
                :picker-options="{
                  start: '12:30',
                  step: '00:15',
                  end: '18:30',
                  minTime: startTime
                }">
              </el-time-select>

          </el-form-item>

          <el-form-item label="账户余额(￥)" prop="money" v-if=this.$route.query.type>
            <el-input  v-model="ruleForm.money" controls-position="right" :max="10000000" :min='0' :disabled='this.$route.query.type'></el-input>
          </el-form-item>

          <input type="text" id="copyContent" style="opacity:0">
      
      </el-col>

    </el-row>

      </el-form> 

  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'editUserCheck',
  data () {
    return {
      startTime: '',
      endTime: '',
      ruleForm: { },
      rules: {
        checkName: [
          { required: true, message: '请输入服务站名称', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          { min: 0, max: 30, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '账号格式错误，限4到16位字符', trigger: 'blur' }
        ],
        password: [
          { pattern: /^[a-zA-Z0-9_-]{6,12}$/, message: '密码格式错误，限6到12位字符', trigger: 'blur' },
           { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          // { pattern: /^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        adderssList: { required: true, message: '请选择省市区', trigger: 'blur' },
        address:[
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { pattern:/^[\u4E00-\u9FA5]|\w+$/, message: '格式错误', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在30个字符以内', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' },
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' },
        ],
        money: [
          { required: true, message: '请输入余额', trigger: 'blur' },
        ],
      }, 
      hospitalOptions:[],
    }
  },
  methods: {
    selCity(val){
      this.ruleForm.adderssList=val;
    },
    copy(obj){
      var address=document.getElementsByClassName("el-cascader__label")[0].innerHTML
      var provinceName=address.split("<span> / </span>")[0].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
      var cityName=address.split("<span> / </span>")[1].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
      var countryName=address.split("<span> / </span>")[2].split("<!")[0].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
      console.log(provinceName+cityName+countryName+this.ruleForm.address)
      document.getElementById("copyContent").value=provinceName+cityName+countryName+this.ruleForm.address
      var Url2=document.getElementById("copyContent");
      Url2.select(); // 选择对象  
      document.execCommand("Copy"); // 执行浏览器复制命令 
      
    },
    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.startTime||!this.endTime){
            this.$message({
              message: '请选择工作时间段！',
              type: 'warning'
            });
            return
          }
         this.addVip(this.ruleForm);
         this.$router.push({ path: '/main/6-1'})
        } else {
          return false;
        }
      });
    },

    addVip(searchPram){ //调用修改接口
       var address=document.getElementsByClassName("el-cascader__label")[0].innerHTML
      var provinceName=address.split("<span> / </span>")[0].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
      var cityName=address.split("<span> / </span>")[1].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
      var countryName=address.split("<span> / </span>")[2].split("<!")[0].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
        var url;
        if(this.$route.query.row){//修改
           url='back/userCheck/updateUserCheckById'
        }else{ //新增
           url='back/userCheck/addUserCheck'
        }
        this.$http.get(this.baseUrl.address+url,
        {
          params: 
          {
            checkId:this.$route.query.row?this.$route.query.row.userCheckId:null,
            checkName: searchPram.checkName,
            account:searchPram.account,
            passWord:searchPram.password,
            contacts: searchPram.contacts,
            phone: searchPram.phone,
            provinceCode: searchPram.adderssList[0],
            cityCode: searchPram.adderssList[1],
            countyCode: searchPram.adderssList[2],
            provinceName:provinceName,
            cityName:cityName,
            countyName:countryName,
            address:searchPram.address,
            longitude:(searchPram.longitude*1).toFixed(6),
            latitude:(searchPram.latitude*1).toFixed(6),
            workTime:`${this.startTime}-${this.endTime}`,
            money:searchPram.money
          }
        }).then(response => {
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
    },

    getAddress(){
      this.$http.get(this.baseUrl.address+'provincecityarea/selectAddessListByPage').then(response => {
       this.hospitalOptions=response.body;
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },

     detail(id){
      this.$http.get(this.baseUrl.address+'back/userCheck/selectById',{
        params:{
          userCheckId:id
        }
      }).then(response => {
         this.ruleForm=response.body.userCheck;
         if(response.body.userCheck.workTime){
           var a1= response.body.userCheck.workTime.split('-');
           this.startTime=a1[0];
           this.endTime=a1[1];
         }
           if(!response.body.userCheck.provinceCode&&!response.body.userCheck.cityCode){
             this.ruleForm.adderssList=[];
           }else{
             this.ruleForm.adderssList=[response.body.userCheck.provinceCode,response.body.userCheck.cityCode,response.body.userCheck.countyCode];
           }
       
         
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },


  },

  mounted() {
    this.getAddress();
    if(this.$route.query.row){
      this.detail(this.$route.query.row.userCheckId);
      this.rules.password=[
          { pattern: /^[a-zA-Z0-9_-]{6,12}$/, message: '密码格式错误，限6到12位字符', trigger: 'blur' },
        ]
    }
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.el-form-item__content{
  color: #999;
}
.getPosition{
  text-decoration: none;
  color: #43a0ea;
}

</style>
