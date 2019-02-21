<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：检测项目管理</el-breadcrumb-item>
          <el-breadcrumb-item>套餐信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/1-1',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="mini"  status-icon inline-message  >
    <el-row >

      <el-col :span="12" >
          <el-form-item  label="套餐编号" prop="categoryId" v-if='this.$route.query.type'>
            <el-input v-model="ruleForm.categoryId" disabled ></el-input>
          </el-form-item>
      
          <el-form-item label="套餐名称" prop="categoryName">
            <el-input v-model="ruleForm.categoryName"  clearable :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="套餐类型" prop="categoryType" >
             <el-select  placeholder="请选择套餐类型"  v-model="ruleForm.categoryType" :disabled='this.$route.query.type'>
               <el-option  v-for="item in hospitalOptions" :key="item.categoryTypeCode"  :label="item.categoryTypeName"  
                  :value="item.categoryTypeCode"  > </el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="选择体检项目" prop="tag1Option">
             <el-select v-model="ruleForm.tag1Option" @change="getItemLab" @remove-tag="removeItem" multiple placeholder="请选择"  :disabled='this.$route.query.type'>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>


          <!-- <el-form-item label="选择体检项目" prop="item" >
            <el-select placeholder="请选择体检项目" @change="getItemLab" :disabled='this.$route.query.type'>
                <el-option  v-for="item in itemOptions" :key="item.item.itemId"  :label="item.item.itemName"  
                :value="item.item.itemId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="体检项目名称"  >
            <el-tag size="mini"  :key="tag.itemId" v-for="tag in tag1Option"   closable :disable-transitions="false"  @close="handleTagClose(tag)">
                {{tag.itemName}}
              </el-tag>
          </el-form-item> -->

          <el-form-item label="所需样本" >
            <el-tag size="mini" :key="tag.specimenTypeId" v-for="tag in tag2Option" :disable-transitions="false"  @close="handleTag2Close(tag)">
                {{tag.specimenTypeName}}
              </el-tag>
          </el-form-item>

          <el-form-item label="套餐价格(￥)" prop="price">
            <el-input v-model="ruleForm.price" :precision="2"  controls-position="right" :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item  label="适合人群" prop="useForPeople">
            <el-input v-model="ruleForm.useForPeople" :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item  label="检测内容" prop="content"  class="content">
              <el-tag size="mini"   :key="tag.itemId" v-for="tag in checkContent"  :disable-transitions="false" >
                {{tag.itemName+"："+tag.itemContent}}
              </el-tag>

          </el-form-item>

          <el-form-item label="图片说明" prop="categoryImageInfo">
           <el-upload class="upload-demo"
            :disabled='this.$route.query.type'
            :action='this.baseUrl.reportUrl+"communal/upload?uploadType=reportImg"'
            :on-preview="handlePicture"
            :on-remove="handlePictureCard"
            :on-success='uploadPic'
            :on-exceed="handleExceed"
            :before-upload="beforeAvatar"
            :limit=5
            :file-list="fileList1"
            accept=".jpg,.png"
            list-type="picture-card" >
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
          <el-dialog :visible.sync="dialog">
            <img width="100%" :src="dialogImage" alt="">
          </el-dialog>
        </el-form-item>

       <el-form-item  label="文字说明" prop="categoryImgText">
            <el-input
            :disabled='this.$route.query.type'
              type="textarea"
              :rows="6"
              placeholder="请输入文字说明"
              v-model="ruleForm.categoryImgText">
            </el-input>
          </el-form-item>

          <el-form-item v-if='!this.$route.query.type'>
            <el-button type="primary" @click="submitForm('ruleForm')" :disabled="forbidden">保存</el-button>
          </el-form-item>
     
      </el-col>
      
      <el-col :span="11" >
        <el-form-item label="banner图" prop="categoryImageUrl">
           <el-upload class="upload-demo"
            :disabled='this.$route.query.type'
            :action='this.baseUrl.reportUrl+"communal/upload?uploadType=adminCategory"'
            :on-preview="handlePictureCardPreview"
            :on-remove="handlePictureCardRemove"
            :on-success='uploadPicSucs'
            :on-exceed="handleExc"
            :before-upload="beforeAvatarUpload"
            :limit=1
            :file-list="fileList2"
            accept=".jpg,.png"
            list-type="picture-card" >
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

         <el-form-item  label="消费说明" prop="consumptionInfo">
            <el-input
            :disabled='this.$route.query.type'
              type="textarea"
              :rows="6"
              placeholder="请输入消费说明"
              v-model="ruleForm.consumptionInfo">
            </el-input>
          </el-form-item>

          <el-form-item  label="体检须知" prop="needAdvice">
            <el-input
            :disabled='this.$route.query.type'
              type="textarea"
              :rows="6"
              placeholder="请输入体检须知"
              v-model="ruleForm.needAdvice">
            </el-input>
          </el-form-item>
      
      </el-col>

    </el-row>

      </el-form> 

  </div>
</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'checkPac',
  data () {
    return {
      ruleForm: {
        categoryId:'',
        categoryName: '',
        categoryType:'',
        price:0,
        useForPeople:'',
        content:'',
        consumptionInfo:'',
        needAdvice:'',
        categoryImageUrl:'',
        tag1Option:[],
        categoryImgText:""
      },
      item:"",
      rules: {
        categoryName: [
          { required: true, message: '请输入套餐名称', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '请输入正确套餐名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        categoryType:[
          { required: true, message: '请选择套餐类型', trigger: 'blur' },
        ],
        categoryImageUrl: [
          { required: true, message: '请上传banner图', trigger: 'blur' },
        ],
        // categoryImgText:[
        //   { required: true, message: '请输入文字说明', trigger: 'blur' },
        // ],
         needAdvice: [
          { required: true, message: '请输入体检须知', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          { min: 0, max: 500, message: '长度在 500个字符以内', trigger: 'blur' }
        ],
        tag1Option:[
          { required: true, message: '请选择体检项目', trigger: 'blur' },
        ],
        useForPeople: [
          { required: true, message: '请输入适合人群', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          // { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        consumptionInfo: [
          { required: true, message: '请输入消费说明', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          { min: 0, max: 500, message: '长度在 500 个字符以内', trigger: 'blur' }
        ],
      
      },
      categoryImageInfo:[],
      hospitalOptions: [],
      itemOptions:[],
      subjectId:[],
      tag2Option:[],
      fileList1:[],
      fileList2:[],
      dialogImageUrl: '',
      dialogVisible: false,
      dialogImage:'',
      dialog:false,
      itemIds:[],
      options:[],
      checkContent:[],
      forbidden:false
    }
  },
  methods: {
    handleTagClose(tag){
      console.log(tag)
      for(var i=0;i<this.tag2Option.length;i++){
        if(this.tag2Option[i].itemId==tag.itemId){
          this.tag2Option.splice(i,1);
          i=-1;
        }
      }
      this.ruleForm.tag1Option.splice(this.ruleForm.tag1Option.indexOf(tag), 1);
      this.itemIds.splice(this.itemIds.indexOf(tag.itemId),1);
      this.ruleForm.price=this.ruleForm.price*1;
      this.ruleForm.price-=(tag.itemMoney/100);
      this.ruleForm.price=this.ruleForm.price.toFixed(2)
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5 张图片`);
        },
    handleExc(files, fileList){
      this.$message.warning(`当前限制选择 1 张图片`);
    },
    handleTag2Close(tag){
      this.tag2Option.splice(this.tag2Option.indexOf(tag), 1);
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/png'||'image/jpeg'||'image/jpg';
        const isLt2M = file.size / 1024 / 1024 <10;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 10M!');
        }
        return isJPG && isLt2M;
    },
    beforeAvatar(file){
        const isJPG = file.type === 'image/png'||'image/jpeg'||'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 500kb!');
        }
        return isJPG && isLt2M;
    },

    getItemLab(val){
      // debugger;
        // for(const item1 of this.tag1Option){
        //   if(item1.itemId==val){
        //     this.$message.error('请勿重复选择！');
        //     return;
        //   }
        // }
         this.itemitemIds=[]
         this.tag2Option=[]
         this.checkContent=[]
         this.ruleForm.price=0
        for(const itemid of val){
            this.$http.get(this.baseUrl.address+'back/item/itemDetail',{
              params:{
                itemId:itemid,
              }
            }).then(response => {
              this.ruleForm.tag1Option=val
              // this.tag1Option.push({itemId:response.body.item.itemId,itemName:response.body.item.itemName,itemContent:response.body.item.itemContent,itemMoney:response.body.item.itemMoney});
              this.itemIds.push(response.body.item.itemId);
              for(const item of response.body.specimenType){
                // if(this.tag2Option.indexOf({specimenTypeId:item.specimenTypeId,specimenTypeName:item.specimenTypeName})==-1){
                  this.tag2Option.push({specimenTypeId:item.specimenTypeId,specimenTypeName:item.specimenTypeName});
                  console.log(this.tag2Option.indexOf({specimenTypeId:item.specimenTypeId,specimenTypeName:item.specimenTypeName}))
                
                // }
                // this.tag2Option.push({specimenTypeId:item.specimenTypeId,specimenTypeName:item.specimenTypeName,itemId:response.body.item.itemId});
              }
              this.checkContent.push({itemName:response.body.item.itemName,itemContent:response.body.item.itemContent})
              this.ruleForm.price=this.ruleForm.price*1
              this.ruleForm.price+=(response.body.item.itemMoney/100);
              this.ruleForm.price=this.ruleForm.price.toFixed(2)
              var newArr=this.tag2Option
              for(var i=0;i<this.tag2Option.length;i++){
                // if(newArr.indexOf(this.tag2Option[i])==-1){
                  for(var j=0;j<newArr.length;j++){
                    if(newArr[j].specimenTypeId==this.tag2Option[i].specimenTypeId&&j!=i){
                      this.tag2Option.splice(j,1)
                    }
                  }
                // }
              }
              // this.tag2Option=newArr
              // for(var i=0;i<this.tag2Option.length;i++){
              //   for(var j=i+1;j<this.tag2Option.length-1;j++){
              //     if(this.tag2Option[i].specimenTypeId==this.tag2Option[j].specimenTypeId){
              //       this.tag2Option.splice(j,1)
              //     }
              //   }
              // }
              
            }, response => {
              this.$notify.error({
                title: '错误',
                message: '请求失败'
              });
            });
      }
    },
    uploadPicSucs(imgUrl){
      this.ruleForm.categoryImageUrl=imgUrl.imagePath;
    },
    uploadPic(imgUrl){
      this.categoryImageInfo.push(imgUrl.imagePath);
      
    },

    handlePictureCardRemove(file, fileList){//删除图片
      if(fileList.length==0){
        this.ruleForm.categoryImageUrl='';
      }
    },
    handlePictureCard(file, fileList){//删除图片
    this.fileList1=fileList
    var popurl=file.url.split("/gene")[1]
    var index=this.categoryImageInfo.indexOf(popurl)
    this.categoryImageInfo.splice(index, 1);
      if(fileList.length==0){
        this.categoryImageInfo=[];
      }
    },

     handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

  handlePicture(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submitForm(formName) { //提交表单
      this.forbidden=true
      this.$refs[formName].validate((valid) => {
        if (valid) {
         if(this.ruleForm.tag1Option.length==0){
            this.$message({
              message: '请添加体检项目',
              type: 'warning'
            });
            this.forbidden=false
            return
         }
         this.addVip(this.ruleForm);
         setTimeout(()=>{this.$router.push({ path: '/main/1-1'})},500)
         
        } else {
          this.forbidden=false
          console.log('error submit!!');
          return false;
        }
      });
    },

    addVip(searchPram){ //调用修改接口
    console.log(searchPram.categoryImageInfo)
    var url;
    if (this.$route.query.row){ //修改
      url='back/category/edit';
    }else{
      url='back/category/insert';
    }
        this.$http.get(this.baseUrl.address+url,
        {
          params: 
          {
            categoryId:this.$route.query.row?this.$route.query.row.categoryId:'',
            name: searchPram.categoryName,
            type: searchPram.categoryType,
            money: parseInt(searchPram.price*100),
            matters:searchPram.useForPeople,
            content: searchPram.content,
            image:searchPram.categoryImageUrl,
            needAdvice:searchPram.needAdvice,
            consumptionInfo:searchPram.consumptionInfo,
            categoryImgText:searchPram.categoryImgText,
            categoryImg:this.categoryImageInfo.join(","),
            itemIds:this.ruleForm.tag1Option.join(',')
          }
        }).then(response => {
          if(response.body.result=='0'){
            this.$message({
              message: '操作失败',
              type: 'warning'
            });
            this.forbidden=false
          }else{
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }       
        }, response => {
           this.forbidden=false
            this.$notify.error({
              title: '错误',
              message: '请求失败'
            });
        });
    },

    getCategoryTypeList(){
      this.$http.get(this.baseUrl.address+'back/categoryType/selectAll',{
        params:{
          pageSize:1000,
          pageNum: 1,
        }
      }).then(response => {
        this.hospitalOptions=response.body.types;
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
      
      this.$http.get(this.baseUrl.address+'back/item/selectAll',{
        params:{
          pageSize:10000,
          pageNum: 1,
        }
      }).then(response => {
        this.itemOptions=response.body.items;
        for(const items of response.body.items){
          this.options.push({value:items.item.itemId,label:items.item.itemName})
        }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });

    },

    detail(id){
       this.$http.get(this.baseUrl.address+'back/category/selectCategoryById',{ //详情
        params:{
          categoryId:id
        }
      }).then(response => {
        this.ruleForm.consumptionInfo=response.body.category.consumptionInfo;
        this.ruleForm.needAdvice=response.body.category.needAdvice;
        this.ruleForm.categoryType=response.body.category.type;
        this.ruleForm.categoryImgText=response.body.category.categoryImgText
        if(response.body.category.categoryImg){
          this.categoryImageInfo=response.body.category.categoryImg.split(",")
          var imglist=response.body.category.categoryImg.split(",")
          for(const item of imglist){
            this.fileList1.push({url:this.baseUrl.picUrl+item})
          }
        }
        // this.fileList1.push({url:this.baseUrl.picUrl+response.body.category.categoryImg})
        for(const items of response.body.items){
          // this.tag1Option.push({itemId:item.itemId,itemName:item.itemName,itemContent:item.itemContent,itemMoney:item.itemMoney});
          this.ruleForm.tag1Option.push(items.itemId)
          this.itemIds.push(items.itemId);
              this.$http.get(this.baseUrl.address+'back/item/itemDetail',{
                params:{
                  itemId:items.itemId,
                }
              }).then(response => {
                 this.checkContent.push({itemName:response.body.item.itemName,itemContent:response.body.item.itemContent})
                // this.tag1Option.push({itemId:response.body.item.itemId,itemName:response.body.item.itemName,itemContent:response.body.item.itemContent,itemMoney:response.body.item.itemMoney});
                // this.itemIds.push(response.body.item.itemId);
                for(const item of response.body.specimenType){
                  this.tag2Option.push({specimenTypeId:item.specimenTypeId,specimenTypeName:item.specimenTypeName,itemId:response.body.item.itemId});
                }
              var newArr=this.tag2Option
              for(var i=0;i<this.tag2Option.length;i++){
                // if(newArr.indexOf(this.tag2Option[i])==-1){
                  for(var j=0;j<newArr.length;j++){
                    if(newArr[j].specimenTypeId==this.tag2Option[i].specimenTypeId&&j!=i){
                      this.tag2Option.splice(j,1)
                    }
                  }
                // }
              }
                // this.ruleForm.price+= parseInt(response.body.item.itemMoney);
              }, response => {
                this.$notify.error({
                  title: '错误',
                  message: '请求失败'
                });
              });
        }
          
        // for(const item of response.body.specimenTypes){
        //   this.tag2Option.push({specimenTypeId:item.specimenTypeId,specimenTypeName:item.specimenTypeName});
        // }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });

      });
    },

  },

  mounted () {
  
    this.getCategoryTypeList();
    if(this.$route.query.row){
      this.ruleForm=this.$route.query.row;
      this.ruleForm.tag1Option=[]
      this.ruleForm.price=(this.ruleForm.price/100).toFixed(2)
      this.fileList2.push({url:this.baseUrl.picUrl+this.$route.query.row.categoryImageUrl});
      this.detail(this.$route.query.row.categoryId);
    }
   

  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-tag{
  height: initial !important;
  white-space:normal !important;
}

</style>
