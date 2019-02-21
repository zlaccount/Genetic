<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="20" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>检测统计</el-breadcrumb-item>
          <el-breadcrumb-item>{{cityName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$route.query.row.codeImg}}月份套餐详情列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/8-1/statisticsCity/statisticsMonth',query:{row:{code:this.$route.query.cityCode,name:cityName},proCode:proCode}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>

    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
     
       </el-col>
    </el-row>
  
  
    <el-table :data="tableData3" height="520px"  size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column  prop="categoryName" label="套餐名称">
         <template slot-scope="scope">{{ scope.row.categoryName   }}</template> 
      </el-table-column>
      <el-table-column  prop="totalOrderDetail"  label="订单数(个)"><template slot-scope="scope">{{ scope.row.totalOrderDetail }}</template>   </el-table-column>
      <el-table-column  prop="totalCategoryMoney"  label="订单收入(￥)"><template slot-scope="scope">{{ scope.row.totalCategoryMoney }}</template>   </el-table-column>
    </el-table>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  data () {
    return {
      tableData3:'',
      cityName:'',
      proCode:''
    }
  },
   methods: {
    searchList(){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/user/statistics/selectCategoryByMonth',
      {
        params: 
        {
          cityCode:this.$route.query.cityCode,
          monthId:this.$route.query.row.codeImg,
        }
      }).then(response => {
        this.tableData3=response.body.orderDetailsList;
      }, response => {
          this.tableData3='';
      });

    },

    },

  mounted () {
    this.cityName=this.$route.query.cityName;
    this.proCode=this.$route.query.proCode;
    this.searchList();
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">


</style>
