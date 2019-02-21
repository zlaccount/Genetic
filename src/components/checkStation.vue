<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="5" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：检测站</el-breadcrumb-item>
          <el-breadcrumb-item>全部订单</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="19">
        <span>搜索</span>
        <el-input v-model="searchPram.orderId" placeholder="请输入订单编号" size="mini" ></el-input>
         <el-input size="mini" v-model="searchPram.phone" placeholder="请输入手机号" ></el-input>
          <el-input size="mini" v-model="searchPram.identity" placeholder="请输入身份证号" ></el-input>
        <el-select size="mini"  v-model="searchPram.orderState" placeholder="请选择订单状态">
          <el-option  v-for="(item,index) in orderState"  :label="item.label" :value="item.value" :key="index"> </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram,searchPram.currentPage)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
       <router-link :to="{path:'/main/7-1/receiveSample'}">
         <el-button type="primary" size="mini">收样</el-button>
         </router-link>
    </el-row>
  
    <el-table  ref="multipleTable" :data="tableData3" size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column  label="操作" width="150" >
        <template slot-scope="scope">
            <el-button  size="mini" @click="receiving(scope.row.orderId)" v-if='scope.row.payStatus=="待收样"'>一键收样</el-button>
             <router-link :to="{path:'/main/7-1/uploadReport',query:{row:scope.row,typeLab:'订单详情',orderId:scope.row.orderId,type:true,pageIndex:searchPram.currentPage}}">
                <el-button  size="mini" v-if='scope.row.payStatus=="待出报告"'>上传报告</el-button>
              </router-link>
            <router-link :to="{path:'/main/7-1/uploadReport',query:{row:scope.row,typeLab:'订单详情',orderId:scope.row.orderId,type:true,pageIndex:searchPram.currentPage}}">
              <el-button  size="mini" v-if='scope.row.payStatus=="已出报告"'>已出报告</el-button>
            </router-link>
        </template>
      </el-table-column>

      <el-table-column  prop="orderId" label="订单编号" width="240" > <template slot-scope="scope">{{ scope.row.orderId }}</template>   </el-table-column>
      <el-table-column  prop="inspectName"  label="受检人姓名" width="160"  >  <template slot-scope="scope">{{ scope.row.inspectName   }}</template>  </el-table-column>
      <el-table-column prop="phone"   label="手机号" width="200" >  <template slot-scope="scope">{{ scope.row. phone }}</template></el-table-column>
      <el-table-column  prop="identity" label="身份证号"   width="300" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.identity }}</template>   </el-table-column>
      <el-table-column  prop="payStatus"  label="订单状态" width="200" >  <template slot-scope="scope">{{ scope.row.payStatus   }}</template>  </el-table-column>
      <el-table-column  prop="time" label="收样时间" width="200" > <template slot-scope="scope">{{ scope.row.time }}</template>   </el-table-column>
    </el-table>

    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'checkStation',
  data () {
    return {
      searchPram: {orderId:'',currentPage:'',phone:'',identity:'',orderState:""},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
      orderState:[{
        value:"7",
        label:"待收样"
      },{
        value:"8",
        label:"待出报告"
      },{
        value:"9",
        label:"已出报告"
      }]
    }
  },
   methods: {
     
    handleCurrentChange(val) { //切换页
      this.searchList(this.searchPram,val);
    },

      searchList(searchPram,pageIndex){
         this.$http.get(this.baseUrl.address+'back/detection/listHistoryOrder',
        {
          params: 
          {
            orderId:searchPram.orderId,
            phone: searchPram.phone,
            identity:searchPram.identity,
            payStatus:searchPram.orderState,
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
          this.totalNum=response.body.page.totalNum;
          this.searchPram.currentPage=response.body.page.currentPage;
        }
        }, response => {
            this.tableData3='';
        });
      },
      receiving(orderId){
        this.$http.get(this.baseUrl.address+'back/detection/getSample',
        {
          params: 
          {
            orderId:orderId,
          }
        }).then(response => {
          if(response.body.msg=="收货完成"){
            this.$message({
              message: response.body.msg,
              type: 'success'
            });
            this.searchList(this.searchPram,this.searchPram.currentPage)
          }
        }, response => {
            this.$message.error('请求失败');
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
    this.searchPram.currentPage=this.$route.query.pageIndex?this.$route.query.pageIndex:1;
    this.searchList(this.searchPram,this.searchPram.currentPage);
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-table .cell a, .el-table .cell > img {
    margin-top: 6px;
    margin-right: 0;
    cursor: pointer;
}
</style>
