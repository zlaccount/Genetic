<template>
  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：检测项目管理</el-breadcrumb-item>
          <el-breadcrumb-item>项目信息</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2">
        <router-link :to="{path:'/main/1-2',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>

    </el-row>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="mini"  status-icon inline-message  >

          <el-form-item  label="项目编号" prop="itemId"  v-if='this.$route.query.type'>
            <el-input v-model="ruleForm.itemId" disabled ></el-input>
          </el-form-item>
      
          <el-form-item label="项目名称" prop="itemName">
            <el-input v-model="ruleForm.itemName"  clearable :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="项目费用(￥)" prop="itemMoney">
            <el-input v-model="ruleForm.itemMoney" :precision="2" type="number" controls-position="right" :disabled='this.$route.query.type' ></el-input>
          </el-form-item>

          <el-form-item label="选择样本" prop="tag1Option">
             <el-select v-model="ruleForm.tag1Option" @change="getItemLab" multiple placeholder="请选择"  :disabled='this.$route.query.type'>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
    
          <!-- <el-form-item label="选择所需样本"  >
            <el-select   @change="getItemLab"  :disabled='this.$route.query.type'>
                <el-option  v-for="item in specimenTypeOptions" :key="item.specimenTypeId"  :label="item.specimenTypeName"  
                :value="item"  > </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所需样本" >
            <el-tag size="mini"  :key="tag.itemId" v-for="tag in tag1Option"   closable :disable-transitions="false"  @close="handleTagClose(tag)">
                {{tag.itemName}}
              </el-tag>
          </el-form-item> -->

          <el-form-item  label="检测内容" prop="itemContent">
               <el-input
                  :disabled='this.$route.query.type'
                  type="textarea"
                  :rows="6"
                  placeholder="请输入消费说明"
                  v-model="ruleForm.itemContent">
                </el-input>

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
  name: 'checkItem',
  data () {
    return {
      ruleForm: {
        itemId:'',
        itemName: '',
        itemMoney:'',
        itemContent:'',
        tag1Option:[],
      },
      rules: {
        itemName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '请输入项目名称', trigger: 'blur' },
          // { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
         itemContent: [
          { required: true, message: '请输入检测内容', trigger: 'blur' },
          // { pattern:/^[\u2E80-\u9FFF]+$/, message: '只能输入汉字', trigger: 'blur' },
          { min: 0, max: 500, message: '长度在 500个字符以内', trigger: 'blur' }
        ],
        tag1Option:[
          { required: true, message: '请选择所需样本', trigger: 'blur' },
        ],
        itemMoney:[
          { required: true, message: '请输入项目费用', trigger: 'blur' },
        ]
      },
      specimenTypeOptions:[],
      
      specimenTypeIds:[],
      options:[],
      forbidden:false
    }
  },
  methods: {
  
    handleTagClose(tag){
      this.ruleForm.tag1Option.splice(this.ruleForm.tag1Option.indexOf(tag), 1);

      this.specimenTypeIds.splice(this.specimenTypeIds.indexOf(tag.itemId),1);

    },

    getItemLab(val){
      // for(const item1 of this.tag1Option){
      //     if(item1.itemId==val.specimenTypeId){
      //       this.$message.error('请勿重复选择！');
      //       return;
      //     }
      //   }
      // this.tag1Option.push({itemId:val.specimenTypeId,itemName:val.specimenTypeName});
      // this.specimenTypeIds.push(val.specimenTypeId);
    },
 
    submitForm(formName) { //提交表单
      this.forbidden=true
      this.$refs[formName].validate((valid) => {
        if (valid) {
         if(this.ruleForm.tag1Option.length==0){
            this.$message({
              message: '请选择样本',
              type: 'warning'
            });
            this.forbidden=false
            return
         }
         this.addVip(this.ruleForm);
         setTimeout(()=>{this.$router.push({ path: '/main/1-2'})},500)
        } else {
          this.forbidden=false
          console.log('error submit!!');
          return false;
        }
      });
    },

    addVip(searchPram){ //调用修改接口
      var url;
      if (this.$route.query.row){ //修改
        url='back/item/updateItemById';
      }else{
        url='back/item/insert';
      }
        this.$http.get(this.baseUrl.address+url,
        {
          params: 
          {
            itemId:this.$route.query.row?this.$route.query.row.itemId:'',
            itemName: searchPram.itemName,
            itemMoney: parseInt(searchPram.itemMoney*100),
            ItemContent:searchPram.itemContent,
            specimenTypeIds:this.ruleForm.tag1Option.join(',')
          }
        }).then(response => {
          if(response.body.result=='0'){
             this.forbidden=false
            this.$message({
              message: '操作失败',
              type: 'warning'
            });
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

    getSpecimenList(){
      this.$http.get(this.baseUrl.address+'back/specimen/list').then(response => {
        this.specimenTypeOptions=response.body.specimenTypes;
        for(const item1 of this.specimenTypeOptions){
          this.options.push({value:item1.specimenTypeId,label:item1.specimenTypeName})
        }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });

    },

    detail(id){
      this.$http.get(this.baseUrl.address+'back/item/itemDetail',{
        params:{
          itemId:id
        }
      }).then(response => {
          this.ruleForm.itemId=response.body.item.itemId
         this.ruleForm.itemMoney=(response.body.item.itemMoney/100).toFixed(2)
          this.ruleForm.itemName=response.body.item.itemName
          this.ruleForm.itemContent=response.body.item.itemContent
        for(const i of response.body.specimenType){
          // this.ruleForm.tag1Option=[]
         
          // this.tag1Option.push({itemId:i.specimenTypeId,itemName:i.specimenTypeName});
          this.ruleForm.tag1Option.push(i.specimenTypeId)
        }
      }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
      });
    },

  },

  mounted () {
    this.getSpecimenList();

    if(this.$route.query.row){
      // this.ruleForm=this.$route.query.row;
      // this.ruleForm.tag1Option=[]
      // this.ruleForm.itemMoney=(this.ruleForm.itemMoney/100).toFixed(2)
      this.specimenTypeIds=this.$route.query.row.specimenTypeIds.split(',');
      this.detail(this.$route.query.row.itemId);
    }

  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
