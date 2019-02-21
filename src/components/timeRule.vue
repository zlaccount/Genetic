<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="24" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>时间设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
     
      </el-col>
    </el-row>

    <el-table :data="tableData3"  size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column  label="操作" width="100" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/9-6/checktimeRule',query:{row:scope.row,type:true,typeLab:'查看'}}">
            <!-- <el-button type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/9-6/checktimeRule',query:{row:scope.row,type:false,typeLab:'修改'}}">
            <!-- <el-button type="primary" icon="el-icon-edit" circle size="mini"  ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
        </template>
      </el-table-column>

    
      <el-table-column   prop="limitName"  label="时间类型"> <template slot-scope="scope">{{ scope.row.limitName}}</template>   </el-table-column>
      <el-table-column   prop="limitMoney"  label="时间(小时)"> <template slot-scope="scope">{{ scope.row.limitMoney }}</template>   </el-table-column>

    </el-table>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  data () {
    return {
       tableData3:[],
    }
  },
   methods: {

    searchList(){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/rule/timingNufreeze').then(response => {
        if (response.body.code=="9") {
            this.$message({
              message: response.body.msgs,
              type: "warning"
            });
        } else{
          this.tableData3.push(response.body.doctorExplain);
          this.tableData3.push(response.body.doctorNufreeze);
          this.tableData3.push(response.body.nurseNufreeze);
        }
        
      }, response => {
          this.tableData3='';
      });

    },


  },
  mounted () {
    this.searchList();
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
<style lang="scss">

</style>

