<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="12" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：项目检测管理</el-breadcrumb-item>
          <el-breadcrumb-item>样本信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="12">
        <span>搜索</span>
        <el-input v-model="searchPram.specimenTypeName" placeholder="请输入样本名称" size="mini" ></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
        <router-link :to="{path:'/main/1-3/checkSpecimen',query:{typeLab:'新增',type:false,pageIndex:searchPram.currentPage}}">
          <el-button type="text" icon="el-icon-circle-plus" >新增</el-button>
        </router-link>
        <el-button type="text"  icon="el-icon-delete" @click="isDelAll">删除</el-button>
       </el-col>
    </el-row>
  
  
    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini'  >
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="120" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/1-3/checkSpecimen',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/1-3/checkSpecimen',query:{row:scope.row,typeLab:'修改',type:false,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="修改" type="primary" icon="el-icon-edit" circle size="mini" ></el-button> -->
             <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button  title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.specimenTypeId)" ></el-button> -->
          <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.specimenTypeId)" alt="">
        </template>
      </el-table-column>
      <el-table-column  prop="specimenTypeCode" label="样本编号" > <template slot-scope="scope">{{ scope.row.specimenTypeCode }}</template>   </el-table-column>
      <el-table-column  prop="specimenTypeName"  label="样本名称" >  <template slot-scope="scope">{{ scope.row.specimenTypeName   }}</template>  </el-table-column>
      <el-table-column  prop="specimenTypePrice"  label="样本价格(￥)" >  <template slot-scope="scope">{{ (scope.row.specimenTypePrice/100).toFixed(2)  }}</template>  </el-table-column>
      <el-table-column  prop="specimenTypeContent"  label="样本数量" >  <template slot-scope="scope">{{scope.row.specimenTypeContent}}{{ scope.row.specimenTypeUnit }}</template>  </el-table-column>
    </el-table>

    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'item',
  data () {
    return {
      searchPram: {specimenTypeName:'',currentPage:''},
      totalNum:'',
      tableData3:'',
      multipleSelection: []
    }
  },
   methods: {
      isDelAll(){
        if(this.multipleSelection.length>0){
        var b=[];
        for(const item of this.multipleSelection){
           b.push(item.specimenTypeId); 
        }
        this.$confirm('确认批量删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.delIntf(b);
        });
       }else{
        this.$message({
          message: '请至少选中一条数据！',
          type: 'warning'
        });
       }
     },

     handleSelectionChange(val){ //勾选事件
       this.multipleSelection=val;
     },

    searchList(searchPram,pageIndex){ //搜索按钮
     var url1;
      if(searchPram.specimenTypeName){ //条件搜索
        url1='back/specimenType/listByName';
      }else{ //查全部
        url1='back/specimenType/selectAll'
      }
      this.$http.get(this.baseUrl.address+url1,
      {
        params: 
        {
          specimenTypeName:searchPram.specimenTypeName,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
          this.$message({
            message: response.body.msgs,
            type: "warning"
          });
        } else{
          this.tableData3=response.body.specimenTypes;
          this.totalNum=response.body.page?response.body.page.totalNum:'1';
          this.searchPram.currentPage=response.body.page?response.body.page.currentPage:'1';
        }
       
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.specimenTypeName='';
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

   delIntf(itemIds){ //调删除接口
    this.$http.get(this.baseUrl.address+'back/specimen/deleteSpecimenTypeByIds',
    {
      params: 
      {
        specimenTypeIds:itemIds.join(','),
      }
    }
    
    ).then(response => {
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
<style scoped lang="scss">

</style>
