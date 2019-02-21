<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="7" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：采样服务站</el-breadcrumb-item> <el-breadcrumb-item>服务站信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="17">
        <span>搜索</span>
        <el-input  size="mini" v-model="searchPram.checkName" placeholder="请输入服务站名称" ></el-input>
        <el-input size="mini" v-model="searchPram.phone" placeholder="请输入电话号码" ></el-input>
        <el-button type="primary"  size="mini"  icon="el-icon-search" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning"  size="mini" @click='reset(searchPram)'>重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >  
        <router-link :to="{path:'/main/6-1/editUserCheck',query:{typeLab:'新增',type:false,state:1,pageIndex:searchPram.currentPage}}">
          <el-button type="text" icon="el-icon-circle-plus" >新增</el-button>
        </router-link>
        <el-button type="text" @click="isDelAll" icon="el-icon-delete" >删除</el-button>
       </el-col>
    </el-row>
  
  
    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="120" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/6-1/editUserCheck',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="查看" type="primary"   icon="el-icon-search" circle size="mini"></el-button> -->
             <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/6-1/editUserCheck',query:{row:scope.row,typeLab:'修改',type:false,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="修改" type="primary" icon="el-icon-edit" circle size="mini" ></el-button> -->
             <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button  title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.userCheckId)" ></el-button> -->
           <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.userCheckId)" alt="">
        </template>
      </el-table-column>
      <el-table-column   prop="userCheckName"  label="服务站" width="150" > <template slot-scope="scope">{{ scope.row.userCheckName }}</template>   </el-table-column>
      <el-table-column   prop="linkMan"  label="联系人" width="100" > <template slot-scope="scope">{{ scope.row.linkMan }}</template>   </el-table-column>
      <el-table-column   prop="phone"  label="联系方式" width="100"> <template slot-scope="scope">{{ scope.row.phone }}</template>   </el-table-column>
      <el-table-column   prop="address"  label="详细地址" width="360" show-overflow-tooltip=true> <template slot-scope="scope">{{ scope.row.address }}</template>   </el-table-column>
      <el-table-column   prop="jwd"  label="经纬度" width="200"> <template slot-scope="scope">{{ scope.row.jwd }}</template>   </el-table-column>
      <el-table-column   prop="workTime"  label="工作时间" width="200"> <template slot-scope="scope">{{ scope.row.workTime }}</template>   </el-table-column>
      <el-table-column   prop="userCheckMoney" width="150"  label="账户余额(￥)"> <template slot-scope="scope">{{ (scope.row.userCheckMoney/100).toFixed(2) }}</template>   </el-table-column>
    </el-table>

    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'userCheck',
  data () {
    return {
      searchPram: {checkName:'',phone:'',currentPage:''},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
    }
  },
   methods: {

     isDelAll(){
       if(this.multipleSelection.length>0){
        var b=[];
        for(const item of this.multipleSelection){
           b.push(item.userCheckId); 
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
      this.$http.get(this.baseUrl.address+'back/userCheck/list',
      {
        params: 
        {
          checkName:searchPram.checkName,
          phone: searchPram.phone,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
          this.$message({
            message: response.body.msgs,
            type: "warning"
          });
        } else{
          this.tableData3=response.body.userChecks;
          for(const item of response.body.userChecks){
            item.jwd=`(${item.longitude}°E,${item.latitude}°N)`;
          }
          this.totalNum=response.body.page.totalNum;
          this.searchPram.currentPage=response.body.page.currentPage;
        }
        
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.checkName='';
      searchPram.phone='';
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
      });

    },

    delIntf(nuseIds){ //调删除接口
      this.$http.get(this.baseUrl.address+'back/userCheck/deleteUserCheckByIds',
      {
        params: 
        {
          ids:nuseIds.join(','),
        }
      }).then(response => {
           if(response.body.code==0){
              this.searchList(this.searchPram,this.searchPram.currentPage);
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
