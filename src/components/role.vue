<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="12" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
        <span>搜索</span>
        <el-input v-model="searchPram.roleCode" placeholder="请输入角色名称" size="mini"></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini" >重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
        <router-link :to="{path:'/main/9-1/addRole',query:{typeLab:'新增',type:false,pageIndex:searchPram.currentPage}}">
          <el-button type="text" icon="el-icon-circle-plus" >新增</el-button>
        </router-link>
        <el-button type="text"  icon="el-icon-delete" @click="isDelAll">删除</el-button>
      </el-col>
    </el-row>

    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange" size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="120" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/9-1/addRole',query:{row:scope.row,type:true,typeLab:'查看',pageIndex:searchPram.currentPage}}">
            <!-- <el-button type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/9-1/addRole',query:{row:scope.row,type:false,typeLab:'修改',pageIndex:searchPram.currentPage}}">
            <!-- <el-button type="primary" icon="el-icon-edit" circle size="mini"  ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.roleId)" ></el-button> -->
          <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.roleId)" alt="">
        </template>
      </el-table-column>
      <el-table-column   prop="roleCode"  label="角色名称"> <template slot-scope="scope">{{ scope.row.roleCode }}</template>   </el-table-column>

    </el-table>

    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'role',
  data () {
    return {
       searchPram: {roleCode:'',currentPage:''},
       tableData3:'',
       multipleSelection: [],
       totalNum:''
    }
  },
   methods: {
     reset(searchPram){ //重置
      searchPram.roleCode='';
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
                b.push(item.roleId); 
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
    this.$http.get(this.baseUrl.address+'back/admin/deleteRoleByRoleIds',
    {
      params: 
      {
        roleIds:roleIds,
      }
    }).then(response => {
            var type;
           if(response.body.code=='0'){
            type='success';
            this.searchList(this.searchPram,this.searchPram.currentPage);
          }   else{
            type='warning'
          }
            this.$message({
              message: response.body.msg,
              type: type
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

     handleCurrentChange(val) { //切换页
      this.searchList(this.searchPram,val);
     },

    searchList(searchPram,pageIndex){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/admin/listRole',
      {
        params: 
        {
          roleCode:searchPram.roleCode,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
            this.$message({
              message: response.body.msgs,
              type: "warning"
            });
        } else{
          this.tableData3=response.body.roles;
          this.totalNum=response.body.pageBean.totalNum;
          this.searchPram.currentPage=response.body.pageBean.currentPage;
        }
      }, response => {
          this.tableData3='';
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
<style scoped lang="scss">
.main{
  width: initial;
  min-width: 1300px;
}
#app .container{
  width: 50%;
  margin:initial;
  margin-left: 10%;
 
}

</style>
