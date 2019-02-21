<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>检测统计</el-breadcrumb-item>
          <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <!-- <el-col :span="10">
        <span>搜索</span>
        <el-cascader expand-trigger="hover" :options="hospitalOptions" v-model="searchPram.adderssList" size='mini' placeholder="请选择区域" > </el-cascader>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)" >搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col> -->

      <el-col :span="2"> 
        <router-link :to="{path:'/main/8-1'}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>

    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
     
       </el-col>
    </el-row>
  
  
    <el-table  :data="tableData3"   size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>

      <!-- <el-table-column  label="操作" width="280" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/8-1/statisticsCity/statisticsMonth',query:{row:scope.row,proCode:proCode}}">
            <el-button type="primary" icon="el-icon-search" plain size="mini">月份</el-button>
          </router-link>
          <router-link :to="{path:'/main/8-1/statisticsCity/statisticsOfCatg',query:{row:scope.row,proCode:proCode}}">
            <el-button type="primary" icon="el-icon-search" plain size="mini">套餐</el-button>
          </router-link>
          <router-link :to="{path:'/main/8-1/statisticsCity/statisticsOfService',query:{row:scope.row,proCode:proCode}}">
            <el-button type="primary" icon="el-icon-search" plain size="mini">服务站</el-button>
          </router-link>
        </template>
      </el-table-column> -->
      <el-table-column  prop="orderId"  label="订单编号">  <template slot-scope="scope">{{ scope.row.orderId }}</template>  </el-table-column>
      <el-table-column  prop="inspectName"  label="受检人">  <template slot-scope="scope">{{ scope.row.inspectName }}</template>  </el-table-column>
      <el-table-column  prop="numMoney"  label="订单金额">  <template slot-scope="scope">{{ (scope.row.numMoney/100).toFixed(2) }}</template>  </el-table-column>
      <el-table-column  prop="payTiem"  label="支付时间">  <template slot-scope="scope">{{ scope.row.payTiem }}</template>  </el-table-column>
      <el-table-column  prop="deteDoneTime"  label="消费时间">  <template slot-scope="scope">{{ scope.row.deteDoneTime }}</template>  </el-table-column>

    </el-table>
    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>
  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'statisticsCity',
  data () {
    return {
      countTime:'',
      searchPram: {currentPage:""},
      tableData3:'',
      totalNum:"",
      hospitalOptions: []
    }
  },
   methods: {

    searchList(searchPram,pageIndex){ //搜索按钮
      this.$http.get(this.baseUrl.address+'/back/user/statistics/statisticsByDetails',
      {
        params: 
        {
          countTime:this.countTime,
          pageNum:pageIndex
        }
      }).then(response => {
        this.tableData3=response.body.orderList;
        this.totalNum=response.body.page.totalNum;
        this.searchPram.currentPage = response.body.page.currentPage;
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.adderssList=[];
      this.searchList(searchPram);
    },
    handleCurrentChange(val) {
        //切换页
        this.searchList(this.searchPram, val);
      },

    // getAddress(){
    //   this.$http.get(this.baseUrl.address+'provincecityarea/selectAddessListByPage').then(response => {
    //    this.hospitalOptions=response.body;
    //   }, response => {
    //     this.$notify.error({
    //       title: '错误',
    //       message: '请求失败'
    //     });
    //   });
    // },


    },

  mounted () {
     this.searchPram.currentPage=this.$route.query.pageIndex?this.$route.query.pageIndex:1;
    this.countTime=this.$route.query.month;
    this.searchList(this.searchPram, this.searchPram.currentPage);
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">


</style>
