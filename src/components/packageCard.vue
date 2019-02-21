<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="6" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：会员卡</el-breadcrumb-item> <el-breadcrumb-item>卡号管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="16">
        <span>搜索</span>
        <el-input  size="mini" v-model="searchPram.cardCode" placeholder="请输入卡号" ></el-input>
        <el-input size="mini" v-model="searchPram.startMoney" placeholder="请输入开始余额" ></el-input>-
        <el-input size="mini" v-model="searchPram.endMoney" placeholder="请输入结束余额" ></el-input>
        <el-select  size="mini"  placeholder="请选择卡类型" v-model="searchPram.cardType">
             <el-option  v-for="(item,index) in cardState"  :label="item.label" :value="item.value" :key="index"> </el-option>
        </el-select>
        <el-select  size="mini"  placeholder="请选择使用状态" v-model="searchPram.employStatus">
             <el-option  v-for="(item,index) in employStatus"  :label="item.label" :value="item.value" :key="index"> </el-option>
        </el-select>
        <el-button type="primary"  size="mini"  icon="el-icon-search" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning"  size="mini" @click='reset(searchPram)'>重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >  
          <router-link :to="{path:'/main/11-1/checkcard',query:{typeLab:'新增',type:false,state:false,pageIndex:searchPram.currentPage}}">
          <el-button type="text" icon="el-icon-circle-plus" >新增</el-button>
        </router-link>
        <!-- <el-button type="text" icon="el-icon-delete" @click="isDelAll">删除</el-button> -->
       </el-col>
    </el-row>
  
  
    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <!-- <el-table-column   type="selection"   width="60">  </el-table-column> -->
      <el-table-column  label="操作" width="200" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/11-1/checkcard',query:{row:scope.row,typeLab:'查看',type:true,status:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/11-1/checkcard',query:{row:scope.row,typeLab:'修改',type:true,status:false,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="修改" type="primary" icon="el-icon-edit" circle size="mini" ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button  title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.userId)" ></el-button> -->
           <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.clubCardId)" alt="">
        </template>
      </el-table-column>
      <el-table-column   prop="account"  label="卡号" width="300" > <template slot-scope="scope">{{ scope.row.cardCode }}</template>   </el-table-column>
      <el-table-column   prop="name"  label="卡类型" > <template slot-scope="scope">{{ scope.row.cardType=="1"?"余额卡":"套餐卡" }}</template>   </el-table-column>
      <el-table-column   prop="sex"  label="卡余额" > <template slot-scope="scope">{{ (scope.row.cardBalance/100).toFixed(2) }}</template>   </el-table-column>
      <el-table-column   prop="identity"  label="开卡时间" width="300"> <template slot-scope="scope">{{ scope.row.addTieme }}</template>   </el-table-column>
      <el-table-column   prop="birthday"  label="使用状态" width="200"> <template slot-scope="scope">{{ scope.row.employStatus=="0"?"未使用":scope.row.employStatus=="1"?"已使用":"未使用" }}</template>   </el-table-column>
      <!-- <el-table-column   prop="age"  label="使用时间" > <template slot-scope="scope">{{ scope.row.age }}</template>   </el-table-column>
      <el-table-column   prop="phone"  label="使用人姓名" width="120"> <template slot-scope="scope">{{ scope.row.phone }}</template>   </el-table-column>
      <el-table-column   prop="money"  label="使用人手机号" > <template slot-scope="scope">{{ scope.row.money }}</template>   </el-table-column>
      <el-table-column   prop="height"  label="使用人单位" width="100" > <template slot-scope="scope">{{ scope.row.height }}</template>   </el-table-column>
      <el-table-column   prop="weight"  label="使用人地址" width="100"> <template slot-scope="scope">{{ scope.row.weight }}</template>   </el-table-column> -->
    </el-table>

      <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
        layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
      </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'vipInfo',
  data () {
    return {
      searchPram: {cardCode:'',authCode:'',cardType:'',cardBalance:'',addTieme:"",employStatus:"",endMoney:"",currentPage:''},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
      cardState:[{
        value:"1",
        label:"余额卡"
      },{
        value:"2",
        label:"套餐卡"
      }],
      employStatus:[
          {
            value:"0",
            label:"未使用"
          },
          {
            value:"1",
            label:"已使用"
          }
      ]
    }
  },
   methods: {
     isDelAll(){
       if(this.multipleSelection.length>0){
        var b=[];
        for(const item of this.multipleSelection){
           b.push(item.clubCardId); 
        }
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.delIntf(b);
        }).catch(() => { });
       }else{
        this.$message({
          message: '请至少选中一条数据！',
          type: 'warning'
        });

       }
 
     },

     handleSelectionChange(val){
       this.multipleSelection=val;
     },

    searchList(searchPram,pageIndex){ //搜索按钮
      this.$http.get(this.baseUrl.address+'/back/clubCard/selectClubCardByPage',
      {
        params: 
        {
          cardCode:searchPram.cardCode,
          cardType: searchPram.cardType,
          employStatus:searchPram.employStatus,
          startMoney:searchPram.startMoney,
          endMoney:searchPram.endMoney,
          pageSize:10,
          pageNum:pageIndex
        }
      }).then(response => {
         if (response.body.code=="9") {
            this.$message({
              message: response.body.msgs,
              type: "warning"
            });
        } else{
          this.tableData3=response.body.clubCardList;
          this.totalNum=response.body.page.totalNum;
          this.searchPram.currentPage=response.body.page.currentPage;
        }
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.cardCode='';
      searchPram.cardBalance='';
      searchPram.cardType='';
      searchPram.employStatus='';
      searchPram.startMoney=""
       searchPram.endMoney=""
      this.searchList(searchPram);
    },

    handleCurrentChange(val) { //切换页
      this.searchList(this.searchPram,val);
    },

    isDel(id){ //删除确认框 单条
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          var a=id;
          this.delIntf(a);
      }).catch(() => { });

    },

    delIntf(userInfoIds){ //调删除接口
      this.$http.get(this.baseUrl.address+'back/clubCard/deleteClubCardById',
      {
        params: 
        {
          clubCardId:userInfoIds,
        }
      }).then(response => {
        if(response.body.code=='0'){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.searchList(this.searchPram,this.searchPram.currentPage);
        }else{
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          
        } 
      }, response => {
          this.$notify.error({
            title: '错误',
            message: '请求失败'
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
<style  lang="scss">


</style>
