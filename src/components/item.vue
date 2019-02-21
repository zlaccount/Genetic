<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="12" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：项目检测管理</el-breadcrumb-item>
          <el-breadcrumb-item>项目信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="12">
        <span>搜索</span>
        <el-input v-model="searchPram.itemName" placeholder="请输入项目名称" size="mini" ></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
        <router-link :to="{path:'/main/1-2/checkItem',query:{typeLab:'新增',type:false,pageIndex:searchPram.currentPage}}">
          <el-button type="text" icon="el-icon-circle-plus" >新增</el-button>
        </router-link>
        <el-button type="text"  icon="el-icon-delete" @click="isDelAll">删除</el-button>
       </el-col>
    </el-row>
  
  
    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini' >
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="120" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/1-2/checkItem',query:{row:scope.row.item,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/1-2/checkItem',query:{row:scope.row.item,typeLab:'修改',type:false,pageIndex:searchPram.currentPage}}">
            <!-- <el-button title="修改" type="primary" icon="el-icon-edit" circle size="mini" ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button  title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.item.itemId)" ></el-button> -->
          <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.item.itemId)" alt="">
        </template>
      </el-table-column>
      <el-table-column  prop="itemId" label="项目编号" width="150" show-overflow-tooltip=true> <template slot-scope="scope">{{ scope.row.item.itemId }}</template>   </el-table-column>
      <el-table-column  prop="itemName"  label="项目名称" width="180" show-overflow-tooltip  >  <template slot-scope="scope">{{ scope.row.item.itemName   }}</template>  </el-table-column>
      <el-table-column  prop="itemContent" label="检查内容" width="400" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.item.itemContent }}</template>   </el-table-column>
      <el-table-column  prop="itemMoney"  label="项目费用(￥)"  width="120" >  <template slot-scope="scope">{{ (scope.row.item.itemMoney/100).toFixed(2)   }}</template>  </el-table-column>
      <el-table-column  prop="specimenTypeName"  label="所需样本" width="400" show-overflow-tooltip >  <template slot-scope="scope">{{ scope.row.item.specimenTypeName }}</template>  </el-table-column>
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
      searchPram: {itemName:'',currentPage:''},
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
           b.push(item.item.itemId); 
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
      if(searchPram.itemName){ //条件搜索
        url1='back/item/selectAll';
      }else{ //查全部
        url1='back/item/selectAll'
      }
      this.$http.get(this.baseUrl.address+url1,
      {
        params: 
        {
          itemName:searchPram.itemName,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
          this.$message({
            message: response.body.msgs,
            type: "warning"
          });
        } else {
          var a=[];
          for(var i=0;i<response.body.items.length;i++){
            for(var j=0;j<response.body.items[i].specimenType.length;j++){
              a.push(response.body.items[i].specimenType[j].specimenTypeName);
            }
            Object.assign(response.body.items[i].item,{specimenTypeName:a.join(',')});
            a=[];
          }
          this.tableData3=response.body.items;
          this.totalNum=response.body.page?response.body.page.totalNum:'1';
          this.searchPram.currentPage=response.body.page?response.body.page.currentPage:'1';
        }
        
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.itemName='';
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
    this.$http.get(this.baseUrl.address+'back/item/deleteItemByIds',
    {
      params: 
      {
        itemIds:itemIds.join(','),
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
