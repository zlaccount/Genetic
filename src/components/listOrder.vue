<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="6" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="18">
        <span>搜索</span>
        <el-input v-model="searchPram.orderId" placeholder="请输入订单编号" size="mini" ></el-input>
        <el-input v-model="searchPram.inspectName" placeholder="请输入姓名" size="mini" ></el-input>
        <el-input v-model="searchPram.phone" placeholder="请输入手机号" size="mini" ></el-input>
        <el-input v-model="searchPram.identity" placeholder="请输入身份证号" size="mini" ></el-input>
        <el-select  size="mini" v-model="searchPram.issueSevriceType" placeholder="请选择采样方式">
            <el-option label="护士上门" value="1"></el-option>
            <el-option label="自行去服务站" value="0"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'></el-row>

    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini' >
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column  label="操作" width="50" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/5-1/checkOrder',query:{row:scope.row,typeLab:'查看',pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
        </template>
      </el-table-column>
      <el-table-column  prop="orderId" label="订单编号" width="150" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.orderId }}</template>   </el-table-column>
      
      <el-table-column  prop="inspectName"  label="受检人"  width="150" >  <template slot-scope="scope">{{ scope.row.inspectName   }}</template>  </el-table-column>
      <el-table-column  prop="phone" label="手机号"  width="150"  > <template slot-scope="scope">{{ scope.row.phone }}</template>   </el-table-column>
      <el-table-column  prop="identity" label="身份证号"  width="250" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.identity }}</template>   </el-table-column>
      <el-table-column  prop="userCheck"  label="采样方式"  width="200" >  <template slot-scope="scope">{{ scope.row.serviceMethod==0?"自行去服务站":"护士上门"  }}</template>  </el-table-column>
      <el-table-column  prop="payStatus"  label="订单状态" width="250"  >  <template slot-scope="scope">{{ scope.row.payStatus}}</template>  </el-table-column>
      <el-table-column  prop="time"  label="订单时间"  width="250"  >  <template slot-scope="scope">{{ scope.row.time}}</template>  </el-table-column>
    </el-table>

    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl','admin'],
  name: 'item',
  data () {
    return {
      searchPram: {orderId:'',inspectName:'',phone:'',identity:'',issueSevriceType:"",currentPage:''},
      totalNum:'',
      tableData3:'',
      multipleSelection: []
    }
  },
   methods: {
    searchList(searchPram,pageIndex){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/order/listOrder',
      {
        params: 
        {
          orderId:searchPram.orderId,
          username:searchPram.inspectName,
          phone:searchPram.phone,
          identity:searchPram.identity,
          issueSevriceType:searchPram.issueSevriceType,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
          this.$message({
            message: response.body.msgs,
            type: "warning"
          });
        } else{
           this.tableData3=response.body.orderList;
          this.totalNum=response.body.page?response.body.page.totalNum:'1';
          this.searchPram.currentPage=response.body.page?response.body.page.currentPage:'1';
        }
       
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.orderId='';
      searchPram.inspectName='';
      searchPram.phone='';
      searchPram.identity='';
      searchPram.issueSevriceType="",
      this.searchList(searchPram);
    },

    handleCurrentChange(val) { //切换页
      this.searchList(this.searchPram,val);
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
.el-table .cell a img{
  margin-left: 7px;
}
input{
  height: 28px !important;
  line-height: 28px !important;
}
.el-input{
  height: 28px !important;
  line-height: 28px !important;
}
</style>
