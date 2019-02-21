<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="5" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：采样服务站</el-breadcrumb-item>
          <el-breadcrumb-item>结算信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="19">
           <span>结算时间</span>
            <el-select v-model="searchPram.value" value="">
              <el-option
                v-for="item in options"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-col :span="19">

         <span>搜索</span>
        <el-input v-model="searchPram.name" placeholder="请输入服务站" size="mini" ></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram,searchPram.currentPage)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
      </el-col>
      
    </el-row>

    <el-row class='opera'></el-row>
  
    <el-table  ref="multipleTable" :data="tableData3" size='mini' :default-sort = "{prop: 'orderId', order: 'descending'}" >
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column  label="操作" width="180" >
        <template slot-scope="scope">
          <router-link :to="{path:'',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
              <el-button type="primary" icon="el-icon-search" circle size="mini"></el-button>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column  prop="orderId" label="服务站" width="240" sortable > <template slot-scope="scope">{{ scope.row.orderId }}</template>   </el-table-column>
      <el-table-column  prop="inspectName"  label="总订单数"  sortable >  <template slot-scope="scope">{{ scope.row.inspectName   }}</template>  </el-table-column>
      <el-table-column prop="phone"   label="总样本数"  sortable >  <template slot-scope="scope">{{ scope.row. phone }}</template></el-table-column>
      <el-table-column  prop="identity" label="总金额(样本)"   width="300" show-overflow-tooltip sortable> <template slot-scope="scope">{{ scope.row.identity }}</template>   </el-table-column>
      
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
      searchPram: {currentPage:'',options:'',doctorname:""},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
      options:[{
        value:"选项1",
        label:"1-28号之间"
      }]
    }
  },
   methods: {
      searchList(searchPram,pageIndex){
        //  this.$http.get(this.baseUrl.reportUrl+'/detection/listOrder',
        // {
        //   params: 
        //   {
        //     phone: searchPram.phone,
        //     identity:searchPram.identity,
        //     orderState:searchPram.orderState,
        //     pageNum:pageIndex
        //   }
        // }).then(response => {
        //   this.tableData3=response.body.orderList;
        //   this.totalNum=response.body.page.totalNum;
        //   this.searchPram.currentPage=response.body.page.currentPage;
        // }, response => {
        //     this.tableData3='';
        // });
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

</style>
