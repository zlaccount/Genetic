<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>护士信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/3-3',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="mini"  status-icon inline-message  >
    <el-row >

      <el-col :span="12" >
          <el-form-item label="用户名" prop="account">
            <el-input v-model="ruleForm.account" disabled ></el-input>
          </el-form-item>

          <el-form-item  label="姓名" prop="name">
            <el-input v-model="ruleForm.name" clearable :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="ruleForm.phone" clearable :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="身份证号" prop="identity" >
            <el-input v-model="ruleForm.identity" clearable  :disabled='this.$route.query.type' ></el-input>
          </el-form-item>
          
          <el-form-item label="积分" prop="money">
            <el-input v-model="ruleForm.money" :min="0" :max="1000000000" controls-position="right" disabled ></el-input>
          </el-form-item>

          <el-form-item label="省市区" prop="adderssList" >
            <el-cascader expand-trigger="hover" :options="hospitalOptions" v-model="ruleForm.adderssList" 
            :disabled='this.$route.query.type' @change="handleChangeCasecader" > </el-cascader>
          </el-form-item>
          
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="ruleForm.address" clearable  :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

        

       <el-form-item v-if='!this.$route.query.type'>
            <el-button type="primary" @click="submitForm('ruleForm')" >保存</el-button>
          </el-form-item>
     
      </el-col>
      
      <el-col :span="11" >

          <el-form-item label="身份审核" prop="auditStatus">
            <el-input v-model="ruleForm.auditStatus" disabled ></el-input>
          </el-form-item>

             <el-form-item label="账号状态" prop="statusName">
            <el-input v-model="ruleForm.statusName" disabled ></el-input>
          </el-form-item>

        

        <el-form-item label="证明材料" prop="aptitudeImage">
           <el-upload class="upload-demo"
            :disabled='this.$route.query.type'
            action='http://59.172.27.186:8888/gene_detection/communal/upload?uploadType=nurseData'
            :on-preview="handlePictureCardPreview"
            :on-remove="handlePictureCardRemove"
            :on-success='uploadPicSucs'
            :file-list="fileList2"
            list-type="picture-card" >
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form-item>
        <!-- <el-form-item v-if='ruleForm.auditStatus=="待审核"'>
            <el-button type="primary" @click="audit()" :disabled='ruleForm.auditStatus!="待审核"' v-if='ruleForm.auditStatus=="待审核"'>{{ruleForm.auditStatus=="待审核"?"审核":"已审核"}}</el-button>
          </el-form-item> -->
       
      </el-col>

    </el-row>

      </el-form> 

  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'checkNurse',
  data () {
    return {
      ruleForm: {
        account:'',
        name: '',
        phone:'',
        identity: '',
        money: '',
        adderssList:[],
        address:'',
        sf:'',
        statusName:'',
        aptitudeImage:'',
        vals:[]
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '请输入正确的姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        identity: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, message: '身份证格式错误', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        adderssList: [
          { required: true, message: '请选择省市区', trigger: 'blur' },
        ],
        address:[
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { pattern:/^[\u4E00-\u9FA5]|\w+$/, message: '地址格式错误', trigger: 'blur' },
          { min: 0, max: 30, message: '长度在 30个字符以内', trigger: 'blur' }
        ],
        aptitudeImage: [
          { required: true, message: '请上传材料证明，否则无法通过护士审核', trigger: 'blur' },
        ],
      },
      hospitalOptions: [],
      fileList2:[],
      dialogImageUrl: '',
      dialogVisible: false,
     
    }
  },
  methods: {
    uploadPicSucs(imgUrl){
      this.ruleForm.aptitudeImage=imgUrl.imagePath;
    },
    handleChangeCasecader(value){ 
      this.ruleForm.adderssList=value;
    },
    handlePictureCardRemove(file, fileList) {//删除图片
      if(fileList.length==0){
        this.ruleForm.aptitudeImage='';
      }
    },
    getCascaderObj(val, opt){
      return val.map(function (value, index, array) {
            for (var itm of opt) {
                if (itm.value == value) { opt = itm.children; return itm; }
            }
            return null;
        });
    },
     handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submitForm(formName) { //提交表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
         this.addVip(this.ruleForm);
         this.$router.push({ path: '/main/3-3'})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // audit(){
    //   if(this.fileList2.length==0){
    //     this.$message.error('该护士还未上传资质');
    //     return false
    //   }
    //   this.$http.get(this.baseUrl.address+'back/nurse/nurseAudit',
    //   {
    //     params: 
    //     {
    //       nurseId:this.$route.query.row.nurseId
    //     }
    //   }).then(response => {
    //     if(response.body.msg=='护士审核成功'){
    //       this.$message({
    //         message: '审核成功',
    //         type: 'success'
    //       });
    //       this.$router.push({ path: '/main/3-3'})
    //     }else{
    //       this.$message({
    //         message: response.body.msg,
    //         type: 'warning'
    //       });
    //     }       
    //   }, response => {
    //       this.$notify.error({
    //         title: '错误',
    //         message: '请求失败'
    //       });
    //   });
      
    // },

    addVip(searchPram){ //调用修改接口
     var address=document.getElementsByClassName("el-cascader__label")[0].innerHTML
      var provinceName=address.split("<span> / </span>")[0].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
      var cityName=address.split("<span> / </span>")[1].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
      var countryName=address.split("<span> / </span>")[2].split("<!")[0].replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
        this.$http.get(this.baseUrl.address+'back/nurse/update',
        {
          params: 
          {
            nurseId:this.$route.query.row.nurseId,
            name: searchPram.name,
            identity: searchPram.identity,
            phone: searchPram.phone,
            adderssList1: searchPram.adderssList,
            provinceName:provinceName,
            cityName:cityName,
            countyName:countryName,
            address:searchPram.address,
            aptitudeImage:searchPram.aptitudeImage
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
          }       
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
       this.ruleForm.adderssList=this.$route.query.row.adderssList;
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
    if(this.$route.query.row.auditStatus=="0"){
      this.ruleForm.auditStatus="待审核"
    }else if(this.$route.query.row.auditStatus=="1"){
      this.ruleForm.auditStatus="正常"
    }else if(this.$route.query.row.auditStatus=="2"){
       this.ruleForm.auditStatus="冻结"
    }
    this.getAddress();
    if(this.$route.query.row.aptitudeImage){
     this.fileList2.push({url:this.baseUrl.picUrl+this.$route.query.row.aptitudeImage});
    }
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
