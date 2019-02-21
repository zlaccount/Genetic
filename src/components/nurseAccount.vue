<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="5" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：结算信息</el-breadcrumb-item>
          <el-breadcrumb-item>护士结算</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="19">
          
            <el-col :span="19">

         <span>搜索</span>
        <el-input v-model="searchPram.userName" placeholder="请输入护士姓名" size="mini" ></el-input>
         <el-date-picker
          v-model="searchPram.accountTime"
          type="month"
          size="mini"
          format="yyyy-MM"
          @change="changetime"
          placeholder="选择结算时间">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram,searchPram.currentPage)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
      </el-col>
      
    </el-row>

    <el-row class='opera'></el-row>
  
    <el-table  ref="multipleTable" :data="tableData3" size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column  label="操作" width="180" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/10-2/nurseAccountDetail',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
              <!-- <el-button type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
              <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
        </template>
      </el-table-column>
      <el-table-column  prop="orderId" label="姓名" width="240" > <template slot-scope="scope">{{scope.row.userName}} </template>  </el-table-column>
      <el-table-column  prop="orderId" label="结算时间" width="240" > <template slot-scope="scope">{{scope.row.accountsDate}}</template> </el-table-column>
      <el-table-column  prop="inspectName"  label="接单数/个"  >  <template slot-scope="scope">{{ scope.row.orderNum   }}</template>  </el-table-column>
      <el-table-column prop="phone" label="总金额(元)"><template slot-scope="scope">{{ (scope.row.closeMoney/100).toFixed(2) }}</template></el-table-column>
      <el-table-column prop="deservedMoney" label="税后收入(元)"><template slot-scope="scope">{{ (scope.row. deservedMoney/100).toFixed(2) }}</template></el-table-column>
      <el-table-column  prop="accountsType" label="结算状态"   width="300" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.accountsType=="0"?"未结算":"已结算" }}</template>   </el-table-column>
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
      searchPram: {currentPage:'',options:'',userName:"",accountTime:""},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
    }
  },
   methods: {
      searchList(searchPram,pageIndex){
         this.$http.get(this.baseUrl.vip+'back/accounts/nurseAccounts',
        {
          params: 
          {
            userName:searchPram.userName,
            searchDate:searchPram.accountTime
            // pageNum:pageIndex
          }
        }).then(response => {
          if (response.body.code=="9") {
            this.$message({
              message: response.body.msgs,
              type: "warning"
            });
          } else{
            this.tableData3=response.body.accountsMoneyList;
          }
         
          // this.totalNum=response.body.page.totalNum;
          // this.searchPram.currentPage=response.body.page.currentPage;
        }, response => {
            this.tableData3='';
        });
      },
      changetime(val){
        var year=val.getFullYear()
        var month=val.getMonth()+1
        this.searchPram.accountTime=year+"-"+month

      },
       reset(searchPram){ //重置
        searchPram.userName='';
        searchPram.accountTime=""
        this.searchList(searchPram,searchPram.currentPage);
      },
  
    },

  mounted () {
    // this.searchPram.currentPage=this.$route.query.pageIndex?this.$route.query.pageIndex:1;
    this.searchList(this.searchPram,this.searchPram.currentPage);
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
