<template>

  <div class="container">

   <el-row class='navRow'>
      <el-col :span="22" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：结算信息</el-breadcrumb-item>
          <el-breadcrumb-item>护士结算</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.typeLab}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/10-2',query:{pageIndex:this.$route.query.pageIndex}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-row class='opera'></el-row>
    <table class="accountInfo" cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
            <td width="200">护士姓名</td>
            <td width="200">{{userName}}</td>
            <td width="200">接单数</td>
            <td width="200">{{orderNum}}</td>
          </tr>
          <tr>
            <td width="200">总金额(元)</td>
            <td width="200">{{(closeMoney/100).toFixed(2)}}</td>
            <td width="200">结算状态</td>
            <td width="200">{{(accountsType=="1"?"已结算":"未结算")}}</td>
          </tr>
      </tbody>
    </table>
    <el-table  ref="multipleTable" :data="tableData3" size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <!-- <el-table-column  label="操作" width="180" >
        <template slot-scope="scope">
          <router-link :to="{path:'',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
              <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
        </template>
      </el-table-column> -->
      <el-table-column  prop="orderId" label="订单编号" width="200" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.orderId }}</template>   </el-table-column>
      <el-table-column  prop="orderId" label="受检人姓名" width="150"><template slot-scope="scope">{{ scope.row.inspectName }}</template>   </el-table-column>
      <el-table-column  prop="numMoney" label="结算金额(元)"><template slot-scope="scope">{{ (scope.row. numMoney/100).toFixed(2) }}</template></el-table-column>
      <el-table-column  prop="addDetails" label="上门地址" width="200" show-overflow-tooltip >  <template slot-scope="scope">{{ scope.row.addDetails   }}</template>  </el-table-column>
      <el-table-column  prop="releaseTime" label="下单时间" width="200" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.releaseTime }}</template></el-table-column>
      <el-table-column  prop="identity" label="上门时间" width="200" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.appointmentTime }}</template></el-table-column>
      <el-table-column  prop="visitServiceTime" label="采样时间" width="200" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.visitServiceTime }}</template></el-table-column>
      <el-table-column  prop="deteDoneTime" label="发样时间" width="200" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.deteDoneTime }}</template></el-table-column>
    </el-table>

    <!-- <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination> -->

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'checkStation',
  data () {
    return {
      searchPram: {currentPage:'',doctorname:""},
      totalNum:'',
      tableData3:'',
      userName:"",
      orderNum:"",
      closeMoney:"",
      accountsType:"",
      multipleSelection: [],
    }
  },
   methods: {
      searchList(id){
         this.$http.get(this.baseUrl.vip+'back/accounts/selectNurseAccountsById',
        {
          params: 
          {
            id:id
          }
        }).then(response => {
          this.userName=response.body.AccountsMoney.userName
          this.orderNum=response.body.AccountsMoney.orderNum
          this.closeMoney=response.body.AccountsMoney.closeMoney
          this.accountsType=response.body.AccountsMoney.accountsType
          this.tableData3=response.body.orderList
        }, response => {
            this.tableData3='';
        });
      },
       reset(searchPram){ //重置
        searchPram.orderId='';
        searchPram.phone='';
        searchPram.identity='';
        searchPram.orderState='';
        this.searchList(searchPram,searchPram.currentPage);
      },
    },

  mounted () {
    // this.searchPram.currentPage=this.$route.query.pageIndex?this.$route.query.pageIndex:1;
    this.searchList(this.$route.query.row.id);
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.accountInfo{
  margin-bottom: 50px;
}
.accountInfo td{
  height: 20px;
  padding: 10px;
  line-height: 20px;
  color: #666;
  text-align: center;
  font-size: 12px;
  border: 1px solid #d8d8d8;
}
.accountInfo tr td:nth-of-type(odd){
  text-align: right;
}
.accountInfo tr td:nth-of-type(even){
  color: #999;
}
</style>
