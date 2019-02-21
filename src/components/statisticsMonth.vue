<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="20" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>检测统计</el-breadcrumb-item>
          <el-breadcrumb-item>{{cityName}}</el-breadcrumb-item>
          <el-breadcrumb-item>月份检测统计</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="2"> 
        <router-link :to="{path:'/main/8-1/statisticsCity',query:{proCode:proCode}}">
          <el-button type="warning" size="mini">返回</el-button>
        </router-link>
      </el-col>

    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
     
       </el-col>
    </el-row>
  
  
    <el-table  :data="tableData3" height="520px"  size='mini' >
      <el-table-column  label="操作" width="200" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/8-1/statisticsCity/statisticsMonth/statisticsOfCatgofMonth',query:{row:scope.row,cityCode:cityCode,cityName:cityName,proCode:proCode}}">
            <el-button type="primary" icon="el-icon-search" plain size="mini">套餐</el-button>
          </router-link>
          <router-link :to="{path:'/main/8-1/statisticsCity/statisticsMonth/statisticsOfServiceOfMonth',query:{row:scope.row,cityCode:cityCode,cityName:cityName,proCode:proCode}}">
            <el-button type="primary" icon="el-icon-search" plain size="mini">服务站</el-button>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column  prop="codeImg" label="月份">
         <template slot-scope="scope">{{ scope.row.codeImg }}</template> 
      </el-table-column>

      <el-table-column   label="套餐消费"  > 
        

         <el-table-column  prop="totalCategoryCount"  label="数量(个)"><template slot-scope="scope">{{ scope.row.totalCategoryCount }}</template>   </el-table-column>
         <el-table-column  prop="money"  label="收入(元)"><template slot-scope="scope">{{ scope.row.money }}</template>   </el-table-column>
         
     </el-table-column>
      <el-table-column    label="服务站产生订单"  >  
         <el-table-column  prop="totalCount"  label="数量(个)"><template slot-scope="scope">{{ scope.row.totalCount }}</template>   </el-table-column>
         <el-table-column  prop="money"  label="收入(元)"><template slot-scope="scope">{{ scope.row.money }}</template>   </el-table-column>
        
      </el-table-column>
      <el-table-column  prop="totalUseCount"  label="会员数(个)">  <template slot-scope="scope">{{ scope.row.totalUseCount }}</template>  </el-table-column>
    </el-table>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  data () {
    return {
      tableData3:'',
      proCode:'',
      cityCode:'',
      cityName:''
    }
  },
   methods: {

    searchList(){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/user/statistics/selectOrderbyMonth',
      {
        params: 
        {
          cityCode:this.$route.query.row.code,
        }
      }).then(response => {
        this.tableData3=response.body.listMonth;
        this.cityCode=response.body.cityCode;
      }, response => {
          this.tableData3='';
      });

    },

    },

  mounted () {
    this.proCode=this.$route.query.proCode;
    this.cityName=this.$route.query.row.name;
    this.searchList();
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">


</style>
