<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：检测站</el-breadcrumb-item>
          <el-breadcrumb-item>全部订单</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2">
        <router-link :to="{path:'/main/7-1',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-row class='opera'></el-row>
    <div class="detail-table">
      <table border="0" cellspacing="0" cellpadding="0">
            <tbody id="todayDetaillist">
              <tr>
                <td>订单编号</td>
                <td>{{orderData.orderId}}</td>
                <td>身份证号</td>
                <td>{{orderData.identity}}</td>
              </tr>
              <tr>
                <td>受检人</td>
                <td>{{orderData.inspectName}}</td>
                <td>手机号</td>
                <td>{{orderData.phone}}</td>
              </tr>
              <tr>
                <td rowspan="2">订单状态</td>
                <td><div class="sampling">{{orderData.payStatus}}</div></td>
                <td>操作</td>
                <td>
                  <template>
                    <el-button type="button" @click="open4" :disabled='(orderData.payStatus=="已出报告"?true:false)'>上传报告</el-button>
                  </template>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="background: #fff;text-align: left;line-height:30px;">
                  <div class="step">
                    <el-steps direction="vertical" :active="1" :space="60" >
                      <el-step title="已检测完成，已出报告" :description="orderData.time[2]" v-if='orderData.time.length>2' icon="el-icon-circle-check-outline"></el-step>
                      <el-step title="样本已到，正在检测" :description="orderData.time[1]" v-if='orderData.time.length>1' icon="el-icon-circle-check-outline"></el-step>
                      <el-step title="样本已收货" :description="orderData.time[0]" icon="el-icon-circle-check-outline"></el-step>
                    </el-steps>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="uploadbg" v-if='reportMask'>
            <div class="hos_img">
                <div class="upload-title">
                    报告上传
                    <img src="../assets/close.png" alt="" @click="close">
                </div>
                <el-upload
                  class="upload-demo"
                  :action='this.baseUrl.reportUrl+"communal/upload?uploadType=userReport"'
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :before-upload="beforeAvatarUpload"
                  :on-success='uploadPicSucs'
                  multiple
                  :limit="10000"
                  accept=".pdf,.PDF"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过60M</div>
                </el-upload>
                <div class="upload" id="upload" @click="upload">确定上传</div>
            </div>
        </div>
       
  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'checkItem',
  data () {
    return {
      reportMask:false,
      orderData:"",
      reportList:[],
      reportname:"",
      fileList: []
    }
  },
  methods: {
     handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadPicSucs(files, fileList){
        this.reportList.push({"name":fileList.name,"generateReport":fileList.response.imagePath})
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'application/pdf';
        const isLt2M = file.size / 1024 / 1024 < 60;

        if (!isJPG) {
          this.$message.error('上传文件只能是PDF格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 60M');
        }
        return isJPG && isLt2M;
    },
    orderDetail(orderId){
      this.$http.get(this.baseUrl.address+'back/detection/orderDetail',
        {
          params: 
          {
            orderId:orderId,
            
          }
        }).then(response => {
          this.orderData=response.body;
        }, response => {
            this.tableData3='';
        });
    },

     open4() {
        this.reportMask=true
      },
      close(){
        this.reportMask=false
        this.reportList=[]
      },

     upload(){
      if(this.reportList.length==0){
        this.$message.error('请先上传报告文件');
        return false
      }
        this.$http.get(this.baseUrl.address+'back/detection/generateReport',
        {
          params: 
          {
            orderId:this.$route.query.row.orderId,
            reportUrls:JSON.stringify(this.reportList)
            
          }
        }).then(response => {
          if(response.body.msg=="上传报告成功"){
            this.reportMask=false
            this.$message({
              message: '上传成功',
              type: 'success'
            });
            this.$router.push({ path: '/main/7-1'})
          }else{
            this.reportMask=false
            this.$message.error(response.body.msg);
          }
          
        }, response => {
            this.$message.error('请求失败');
        });
     }
  },

  mounted () {
    if(this.$route.query.row){
      this.ruleForm=this.$route.query.row;
      this.orderId=this.$route.query.row.orderId;
      this.orderDetail(this.$route.query.row.orderId);
    }

  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 .detail-table table  tr td:nth-child(odd){
  background: #f4f4f4;
  text-align: right;
  padding-right: 10px;
  width: 200px;
}
.detail-table table  tr td:nth-child(even){
  background: #fff;
  text-align: left;
  padding-left: 10px;
  width: 450px;
}

.detail-table table tr th,.detail-table table tr td{
  width: 250px;
  height: 40px;
  line-height: 40px;
}
.detail-table table{
  margin:0 auto;
  border-top: 1px solid #d8d8d8;
  border-left: 1px solid #d8d8d8;
  font-size:14px;
  color:#666;
}
.detail-table table tr td{
  border-bottom: 1px solid #d8d8d8;
  border-right: 1px solid #d8d8d8;
  padding-left: 10px;
}
.upload_report{
  width: 60px;
  height: 26px;
  text-align: center;
  line-height: 26px;
  color: #999;
  background: #fff;
  border: none;
  border: 1px solid #d8d8d8;
  cursor: pointer;
  outline: none;
}
.step{
  margin-top:10px;
}
.el-button{
  padding:8px 6px;
}
.uploadbg{
  background:rgba(0,0,0,.1);
  height: 100%;
  width:100%;
  padding-top: 180px;
  padding-bottom:180px;
  position: absolute;
  top:0;
  left: 0;
}
.upload{
  text-align: center;
  line-height: 40px;
  background:#43a0ea;
  color: #fff;
  cursor: pointer;
  margin: 10px auto;
  bottom: 20px;
  width: 140px;
  height: 40px;
  border-radius: 2px;
 
}
.hos_img{
  min-height: 200px;
  width: 400px;
  margin-bottom: 25px;
  margin:0 auto;
  background:#fff;
  padding-bottom:10px;
  z-index: 100;
  position: relative;
}
.hos_img span:first-child{
  margin-top: 40px;
}
.upload-title{
  height: 40px;
  border-bottom: 1px solid #d8d8d8;
  text-align: center;
  line-height: 40px;
}
.upload-title img{
  float: right;
  margin-top: 10px;
  margin-right:14px;
  cursor:pointer;
}
.upload-demo{
  padding:10px 14px;
}
</style>
