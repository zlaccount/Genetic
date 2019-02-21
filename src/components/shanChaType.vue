<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="12" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item>当前位置：用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>医生信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>擅长类型</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
        <span>搜索</span>
        <el-input v-model="searchPram.reportTypeName" placeholder="请输入擅长类型" size="mini"></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini" >重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
        <router-link :to="{path:'/main/3-2-2/checkGoodType',query:{typeLab:'新增',type:false,pageIndex:searchPram.currentPage}}">
          <el-button type="text" icon="el-icon-circle-plus" >新增</el-button>
        </router-link>
        <el-button type="text"  icon="el-icon-delete" @click="isDelAll">删除</el-button>
      </el-col>
    </el-row>

    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange" size='mini' :default-sort = "{prop: 'typeId'}">
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="120" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/3-2-2/checkGoodType',query:{row:scope.row,type:true,typeLab:'查看',pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
             <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/3-2-2/checkGoodType',query:{row:scope.row,type:false,typeLab:'修改',pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="修改" type="primary" icon="el-icon-edit" circle size="mini"  ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button  title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.reportTypeId)" ></el-button> -->
           <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.reportTypeId)" alt="">
        </template>
      </el-table-column>

      <el-table-column   prop="reportTypeId"  label="编号"  sortable > <template slot-scope="scope">{{ scope.row.reportTypeId }}</template>   </el-table-column>
      <el-table-column   prop="reportTypeName"  label="擅长类型"  sortable > <template slot-scope="scope">{{ scope.row.reportTypeName }}</template>   </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  data () {
    return {
       searchPram: {reportTypeName:''},
       tableData3:'',
       multipleSelection: [],
    }
  },
   methods: {
     reset(searchPram){ //重置
      searchPram.reportTypeName='';
      this.searchList(searchPram);
    },

      isDelAll(){
       if(this.multipleSelection.length>0){
        this.$confirm('确认批量删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             var b=[];
              for(const item of this.multipleSelection){
                b.push(item.typeId); 
              }
           this.delIntf(b);
        });
       }else{
        this.$message({
          message: '请至少选中一条数据！',
          type: 'warning'
        });
       }
     },

   delIntf(roleIds){ //调删除接口
    this.$http.get(this.baseUrl.address+'back/user/goodType/deleteOrSelect',
    {
      params: 
      {
        reportTypeIds:roleIds.join(','),
      }
    }).then(response => {
        if(response.body.code==0){
          this.searchList(this.searchPram);
        } 
        this.$message({
          message: response.body.flag,
          type: response.body.code?'warning':'success'
        });
    }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
    });
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

    handleSelectionChange(val){
       this.multipleSelection=val;
    },


    searchList(searchPram){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/user/goodType/selectTypeAndPage',
      {
        params: 
        {
          reportTypeName:searchPram.reportTypeName,
        }
      }).then(response => {
        this.tableData3=response.body.selectAll;
      }, response => {
          this.tableData3='';
      });

    },


  },
  mounted () {
    this.searchList(this.searchPram);
  },

  

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">


</style>
