<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="12" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：解读报告</el-breadcrumb-item>
          <el-breadcrumb-item>报告信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>

      <el-col :span="12">
        <span>搜索</span>
        <el-input v-model="searchPram.reportName" placeholder="请输入报告名称" size="mini" ></el-input>
        <el-input v-model="searchPram.inspectName" placeholder="请输入姓名" size="mini" ></el-input>
        <el-select size="mini"  v-model="searchPram.readStatus" placeholder="请选择报告状态">
          <el-option  v-for="(item,index) in orderState"  :label="item.label" :value="item.value" :key="index"> </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'></el-row>

    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column  label="操作" width="100" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/4-1/checkReport',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/4-1/checkReport',query:{row:scope.row,typeLab:'解读报告',type:false,pageIndex:searchPram.currentPage}}">
          <!-- <el-button  title="解读报告" type="success" icon="el-icon-document" v-if='scope.row.readStatus=="未解读"' circle size="mini"></el-button> -->
          <img src="../assets/read.png"  v-if='scope.row.readStatus=="未解读"'  title="解读报告" alt="">
          </router-link>
        </template>
      </el-table-column>
      <el-table-column  prop="reportName" label="报告名称"  > <template slot-scope="scope">{{ scope.row.reportName }}</template>   </el-table-column>
      <el-table-column  prop="inspectName"  label="姓名" >  <template slot-scope="scope">{{ scope.row.inspectName   }}</template>  </el-table-column>
      <el-table-column  prop="readStatus" label="报告状态" > <template  slot-scope="scope">{{ scope.row.readStatus }}</template>   </el-table-column>
      <el-table-column  prop="applyTime"  label="申请时间" >  <template slot-scope="scope">{{ scope.row.applyTime  }}</template>  </el-table-column>
      <el-table-column  prop="readTime"  label="解读时间"  >  <template slot-scope="scope">{{ scope.row.readTime}}</template>  </el-table-column>
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
      searchPram: {reportName:'',inspectName:'',readStatus:"",currentPage:''},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
      orderState:[{
        value:"2",
        label:"未解读"
      },
      {
        value:"3",
        label:"已解读"
      }]
    }
  },
   methods: {
    searchList(searchPram,pageIndex){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/report/list',
      {
        params: 
        {
          reportName:searchPram.reportName,
          inspectName:searchPram.inspectName,
          readStatus:searchPram.readStatus,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
          this.$message({
            message: response.body.msgs,
            type: "warning"
          });
        } else{
          this.tableData3=response.body.detailList;
          this.totalNum=response.body.page?response.body.page.totalNum:'1';
          this.searchPram.currentPage=response.body.page?response.body.page.currentPage:'1';
        }
        
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.reportName='';
      searchPram.inspectName='';
      searchPram.readStatus=""
      this.searchList(searchPram);
    },

    handleCurrentChange(val) { //切换页
      this.searchList(this.searchPram,val);
    },



   readReport(searchPram){ //调解读报告
      this.$confirm('确定解读报告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      
    this.$http.get(this.baseUrl.address+'back/report/readReport',
    {
      params: 
      {
        reportDetailId:searchPram.reportDetailId,
        doctorId:this.admin.id,
        advice:searchPram.advice,
        analysis:searchPram.analysis
      }
    }).then(response => {
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
