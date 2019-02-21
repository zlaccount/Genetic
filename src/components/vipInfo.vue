<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="6" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：用户信息</el-breadcrumb-item> <el-breadcrumb-item>会员信息管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="16">
        <span>搜索</span>
        <el-input  size="mini" v-model="searchPram.account" placeholder="请输入账号" ></el-input>
        <el-input size="mini" v-model="searchPram.name" placeholder="请输入姓名" ></el-input>
        <el-input size="mini" v-model="searchPram.identity" placeholder="请输入身份证号" ></el-input>
         <el-input size="mini" v-model="searchPram.startMoney" placeholder="请输入开始积分"></el-input>-
        <el-input size="mini" v-model="searchPram.endMoney" placeholder="请输入结束积分"></el-input>
        <!-- <el-input size="mini" v-model="searchPram.money" placeholder="请输入积分"></el-input> -->
        <el-button type="primary"  size="mini"  icon="el-icon-search" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning"  size="mini" @click='reset(searchPram)'>重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >  
        <el-button type="text" icon="el-icon-delete" @click="isDelAll">删除</el-button>
       </el-col>
    </el-row>
  
  
    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="120" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/3-1/addVip',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/3-1/addVip',query:{row:scope.row,typeLab:'修改',type:false,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="修改" type="primary" icon="el-icon-edit" circle size="mini" ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button  title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.userId)" ></el-button> -->
           <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.userId)" alt="">
        </template>
      </el-table-column>
      <el-table-column   prop="account"  label="账号" width="100" > <template slot-scope="scope">{{ scope.row.account }}</template>   </el-table-column>
      <el-table-column   prop="name"  label="姓名" > <template slot-scope="scope">{{ scope.row.name }}</template>   </el-table-column>
      <el-table-column   prop="sex"  label="性别" > <template slot-scope="scope">{{ scope.row.sex }}</template>   </el-table-column>
      <el-table-column   prop="identity"  label="身份证号" width="150"> <template slot-scope="scope">{{ scope.row.identity }}</template>   </el-table-column>
      <el-table-column   prop="birthday"  label="出生日期" width="120"> <template slot-scope="scope">{{ scope.row.birthday }}</template>   </el-table-column>
      <el-table-column   prop="age"  label="年龄" > <template slot-scope="scope">{{ scope.row.age }}</template>   </el-table-column>
      <el-table-column   prop="phone"  label="手机号" width="120"> <template slot-scope="scope">{{ scope.row.phone }}</template>   </el-table-column>
      <el-table-column   prop="money"  label="积分" > <template slot-scope="scope">{{ scope.row.money }}</template>   </el-table-column>
      <el-table-column   prop="height"  label="身高(cm)" width="100" > <template slot-scope="scope">{{ scope.row.height }}</template>   </el-table-column>
      <el-table-column   prop="weight"  label="体重(kg)" width="100"> <template slot-scope="scope">{{ scope.row.weight }}</template>   </el-table-column>
    </el-table>

      <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
        layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
      </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'vipInfo',
  data () {
    return {
      searchPram: {account:'',name:'',identity:'',startMoney:'',endMoney:"",currentPage:''},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
    
    }
  },
   methods: {
     getbirth(idCard){
        var birthday = "";  
        if(idCard != null && idCard != ""){  
            if(idCard.length == 15){  
                birthday = "19"+idCard.substr(6,6);  
            } else if(idCard.length == 18){  
                birthday = idCard.substr(6,8);  
            }  
          
            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");  
        }  
          
        return birthday;  
     },
     getAge(idCard){
        var myDate = new Date(); 
        var month = myDate.getMonth() + 1; 
        var day = myDate.getDate();
        if(idCard != null && idCard != ""){ 
          var age = myDate.getFullYear()-idCard.substring(6, 10) - 1; 
          if (idCard.substring(10,12)<month||idCard.substring(10,12)==month&&idCard.substring(12,14)<=day) { 
            age++; 
          } 
        }
        return age;
     },
      getSex(idCard){
        var sex=""
        if(idCard != null && idCard != ""){ 
          idCard.substring(6, 10) + "-" + idCard.substring(10, 12) + "-" + idCard.substring(12, 14); //获取出生日期
          if (parseInt(idCard.substr(16, 1)) % 2 == 1) {   //是男则执行代码 ...
            sex="男"
          } else { //是女则执行代码 ...
            sex="女"
          }
        }
        return sex;
      },
     isDelAll(){
       if(this.multipleSelection.length>0){
        var b=[];
        for(const item of this.multipleSelection){
           b.push(item.userId); 
        }
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.delIntf(b);
        }).catch(() => { });
       }else{
        this.$message({
          message: '请至少选中一条数据！',
          type: 'warning'
        });

       }
 
     },

     handleSelectionChange(val){
       this.multipleSelection=val;
     },

    searchList(searchPram,pageIndex){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/userInfo/selectAllByPage',
      {
        params: 
        {
          account:searchPram.account,
          name: searchPram.name,
          identity:searchPram.identity,
          startMoney:searchPram.startMoney,
          endMoney:searchPram.endMoney,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
          this.$message({
            message: response.body.msgs,
            type: "warning"
          });
        } else{
          for(const item of response.body.pageInfoList){
            item.birthday=this.getbirth(item.identity)
            item.age=this.getAge(item.identity)
          }
          this.tableData3=response.body.pageInfoList;
          this.totalNum=response.body.page.totalNum;
          this.searchPram.currentPage=response.body.page.currentPage;
        }
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.account='';
      searchPram.name='';
      searchPram.identity='';
      searchPram.startMoney='';
       searchPram.endMoney='';
      this.searchList(searchPram);
    },

    handleCurrentChange(val) { //切换页
      this.searchList(this.searchPram,val);
    },

    isDel(id){ //删除确认框 单条
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          var a=[id];
          this.delIntf(a);
      }).catch(() => { });

    },

    delIntf(userInfoIds){ //调删除接口
      this.$http.get(this.baseUrl.address+'back/userInfo/deleteOrSelect',
      {
        params: 
        {
          userInfoIds:userInfoIds,
        }
      }).then(response => {
        if(response.body.result=='0'){
          this.$message({
            message: '删除失败',
            type: 'warning'
          });
        }else{
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.searchList(this.searchPram,this.searchPram.currentPage);
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
    this.searchPram.currentPage=this.$route.query.pageIndex?this.$route.query.pageIndex:1;
    this.searchList(this.searchPram,this.searchPram.currentPage);
  },

  

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">


</style>
