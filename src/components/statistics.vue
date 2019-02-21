<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="12" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>检测统计</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="12">
        <span>搜索</span>
        <!-- <el-cascader expand-trigger="hover" :options="hospitalOptions" v-model="searchPram.adderssList" size='mini' placeholder="请选择区域" > </el-cascader> -->
        <el-date-picker
          v-model="searchPram.year"
          type="year"
          size="mini"
          :picker-options="pickerOptions0"
          placeholder="请选择年份">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)" >搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
     
       </el-col>
    </el-row>
  
  
    <el-table  :data="tableData3"   size='mini' >
      <el-table-column  label="序号" type="index" width="50"></el-table-column>

      <el-table-column  label="操作" width="120" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/8-1/statisticsCity',query:{month:scope.row.countTime}}">
            <!-- <el-button  type="primary" icon="el-icon-search" plain size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
        </template>
      </el-table-column>
      <!-- <el-table-column  prop="name" label="区域">
         <template slot-scope="scope">{{ scope.row.name   }}</template> 
      </el-table-column>
      <el-table-column   label="套餐消费"  > 
         <el-table-column  prop="totalCategory"  label="数量(个)"><template slot-scope="scope">{{ scope.row.totalCategory }}</template>   </el-table-column>
         <el-table-column  prop="totalMoney"  label="收入(元)"><template slot-scope="scope">{{ scope.row.totalMoney }}</template>   </el-table-column>
     </el-table-column>
      <el-table-column    label="服务站产生订单"  >  
         <el-table-column  prop="totalCount"  label="数量(个)"><template slot-scope="scope">{{ scope.row.totalCount }}</template>   </el-table-column>
         <el-table-column  prop="totalMoney"  label="收入(元)"><template slot-scope="scope">{{ scope.row.totalMoney }}</template>   </el-table-column>
      </el-table-column> -->
      <el-table-column  prop="countTime"  label="月份">  <template slot-scope="scope">{{ scope.row.countTime }}</template>  </el-table-column>
      <el-table-column  prop="orderNum"  label="订单数">  <template slot-scope="scope">{{ scope.row.orderNum }}</template>  </el-table-column>
      <el-table-column  prop="orderMoney"  label="订单金额">  <template slot-scope="scope">{{ (scope.row.orderMoney/100).toFixed(2) }}</template>  </el-table-column>

    </el-table>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'statistics',
  data () {
    return {
      searchPram: {year:""},
      tableData3:'',
      value5:"",
      pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },  
     
    }
  },
   methods: {

    searchList(searchPram){ //搜索按钮
    var year=new Date(searchPram.year).getFullYear()
      this.$http.get(this.baseUrl.address+'/back/user/statistics/dataStatisticsByPage',
      {
        params: 
        {
          year:year||""
        }
      }).then(response => {
        if (response.body.code=="9") {
            this.$message({
              message: response.body.msgs,
              type: "warning"
            });
          } else{
            this.tableData3=response.body;
          }
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.year="";
      this.searchList(searchPram);
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
    // this.getAddress();
    this.searchList(this.searchPram);
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
