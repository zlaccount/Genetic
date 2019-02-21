<template>

  <div class="container">

    <el-row class='navRow'>
      <el-col :span="5" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>当前位置：用户信息</el-breadcrumb-item> <el-breadcrumb-item>护士信息管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="17">
        <span>搜索</span>
        <el-input  size="mini" v-model="searchPram.account" placeholder="请输入账号" ></el-input>
        <el-input size="mini" v-model="searchPram.name" placeholder="请输入姓名" ></el-input>
        <el-input size="mini" v-model="searchPram.identity" placeholder="请输入身份证号" ></el-input>
        <el-input size="mini" v-model="searchPram.startMoney" placeholder="请输入开始积分"></el-input>-
        <el-input size="mini" v-model="searchPram.endMoney" placeholder="请输入结束积分"></el-input>
        
        <el-button type="primary"  size="mini"  icon="el-icon-search" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning"  size="mini" @click='reset(searchPram)'>重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >  
        <el-button type="text" @click="isDelAll" icon="el-icon-delete" >删除</el-button>
        <el-button type="text" @click="isFrazeAll('确认冻结？',0)" icon="el-icon-close" v-if='isNormel'>冻结</el-button>
        <el-button type="text" @click="isFrazeAll('确认解冻？',1)" icon="el-icon-check" v-if='isFraze'>解冻</el-button>
       </el-col>
    </el-row>
  
  
    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini'>
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="180" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/3-3/checkNurse',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="查看" type="primary"   icon="el-icon-search" circle size="mini"></el-button> -->
             <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/3-3/checkNurse',query:{row:scope.row,typeLab:'修改',type:false,pageIndex:searchPram.currentPage}}">
            <!-- <el-button  title="修改" type="primary" icon="el-icon-edit" circle size="mini" ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button  title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.nurseId)" ></el-button> -->
          <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.nurseId)" alt="">

            <!-- <el-button  title="冻结" type="warning" v-if='scope.row.auditStatus!="2"' icon="el-icon-close" circle size="mini" @click="isFraze1(scope.row)" ></el-button>     -->
             <img src="../assets/frozen.png" title="冻结" v-if='scope.row.auditStatus!="2"'  @click="isFraze1(scope.row)" alt="">
            <!-- <el-button  title="解冻" type="success" v-if='scope.row.auditStatus=="2"' icon="el-icon-check" circle size="mini" @click="isFraze1(scope.row)" ></el-button> -->
            <img src="../assets/thaw.png" title="解冻" v-if='scope.row.auditStatus=="2"' @click="isFraze1(scope.row)" alt="">
            <img src="../assets/auditStatus.png"  title="审核" alt="" @click="audit(scope.row)" v-if='scope.row.auditStatus=="0"'>
            <img src="../assets/unauditStatus.png"  title="已审核" v-if='scope.row.auditStatus!="0"' alt="">
        </template>
      </el-table-column>
      <el-table-column   prop="account"  label="用户名" width="150" > <template slot-scope="scope">{{ scope.row.account }}</template>   </el-table-column>
      <el-table-column   prop="name"  label="姓名"  > <template slot-scope="scope">{{ scope.row.name }}</template>   </el-table-column>
      <el-table-column   prop="phone"  label="手机号"  width="150" > <template slot-scope="scope">{{ scope.row.phone }}</template>   </el-table-column>
      <el-table-column   prop="identity"  label="身份证号" width="200" > <template slot-scope="scope">{{ scope.row.identity }}</template>   </el-table-column>
      <el-table-column   prop="money"  label="积分" > <template slot-scope="scope">{{ scope.row.money }}</template>   </el-table-column>
      <el-table-column   prop="auditStatus"  label="账号状态"  width="100" > <template slot-scope="scope">{{ scope.row.statusName }}</template>   </el-table-column>
      <el-table-column   prop="detailAddress"  label="地址" width="300" show-overflow-tooltip > <template slot-scope="scope">{{ scope.row.detailAddress }}</template>   </el-table-column>
      <el-table-column   prop="sf"  label="身份审核"  width="100" > <template slot-scope="scope">{{ scope.row.auditStatusName }}</template>   </el-table-column>
    </el-table>

    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>

  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'doctInfo',
  data () {
    return {
      searchPram: {account:'',name:'',identity:'',startMoney:"",endMoney:"",currentPage:''},
      totalNum:'',
      tableData3:'',
      multipleSelection: [],
      isNormel:true,
      isFraze:true,
    }
  },
   methods: {
    isFrazeAll(text,type){
      if(this.multipleSelection.length>0){
      var b=[];
      for(const item of this.multipleSelection){
          b.push(item.nurseId); 
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.frazeIntf(b,type);
      });
      }else{
        this.$message({
          message: '请至少选中一条数据！',
          type: 'warning'
        });
      }
    },

     isDelAll(){
       if(this.multipleSelection.length>0){
        var b=[];
        for(const item of this.multipleSelection){
           b.push(item.nurseId); 
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
       var flag,flag1;
       for(const item of val){
        if(item.auditStatus=='2'){ //冻结状态
           flag=2;
        }else{ //正常状态
           flag1=1;
        }
       }
 
       if(!flag&&flag1){ //全部为正常状态
          this.isNormel=true;
          this.isFraze=false;
       }
       if(!flag1&&flag){ //全部为冻结状态
         this.isNormel=false;
         this.isFraze=true;
       }
       if(flag1&&flag){ //混合两种状态
        this.isNormel=false;
        this.isFraze=false;
       }
       if(!flag1&&!flag){ //混合两种状态
        this.isNormel=true;
        this.isFraze=true;
       }
     },

    isFraze1(row){ //冻结、解冻确认框 单条
    if(row.auditStatus!='2'){//解冻状态
      this.$confirm('确认冻结?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          var a=[row.nurseId];
          this.frazeIntf(a,0);
      });
    }else{ //冻结状态
      this.$confirm('确认解冻?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          var a=[row.nurseId];
          this.frazeIntf(a,1);
      });
    }
   
  },


    searchList(searchPram,pageIndex){ //搜索按钮
      this.$http.get(this.baseUrl.address+'back/nurse/selectAllAndPage',
      {
        params: 
        {
          account:searchPram.account,
          name: searchPram.name,
          identity:searchPram.identity,
          money:searchPram.money,
          pageNum:pageIndex
        }
      }).then(response => {
        if (response.body.code=="9") {
          this.$message({
            message: response.body.msgs,
            type: "warning"
          });
        } else{
          this.tableData3=response.body.pageInfoList;
          this.totalNum=response.body.page.totalNum;
          this.searchPram.currentPage=response.body.page.currentPage;
        }
      }, response => {
          this.tableData3='';
      });

    },

    reset(searchPram){ //重置
      searchPram.account='';
      searchPram.name='';
      searchPram.identity='';
      searchPram.startMoney='';
      searchPram.endMoney='';
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
          var a=[id];
          this.delIntf(a);
      });

    },

    delIntf(nuseIds){ //调删除接口
      this.$http.get(this.baseUrl.address+'back/nurse/deleteOrSelect',
      {
        params: 
        {
          nuseIds:nuseIds,
        }
      }).then(response => {
        if(response.body.result=='0'){
          this.$message({
            message: '删除失败',
            type: 'warning'
          });
        }else{
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.searchList(this.searchPram,this.searchPram.currentPage);
        } 
      }, response => {
          this.$notify.error({
            title: '错误',
            message: '请求失败'
          });
      });
    },

    frazeIntf(nuseIds,type){ //调冻结,解冻接口
      var url;
      if(type==0){ //冻结
        url='back/nurse/audit_status';
      }else{ //解冻
        url='back/nurse/unfreeze';
      }
      this.$http.get(this.baseUrl.address+url,
      {
        params: 
        {
          nuseIds:nuseIds,
        }
      }).then(response => {
      if(response.body.result=='0'){
        this.$message({
          message: '操作失败',
          type: 'warning'
        });
      }else{
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.searchList(this.searchPram,this.searchPram.currentPage);
      } 
    }, response => {
        this.$notify.error({
          title: '错误',
          message: '请求失败'
        });
    });
  },
  audit(row){
    this.$confirm('确认审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.$http.get(this.baseUrl.address+'back/nurse/nurseAudit',
          {
            params: 
            {
              nurseId:row.nurseId
            }
          }).then(response => {
            if(response.body.msg=='护士审核成功'){
              this.$message({
                message: '审核成功',
                type: 'success'
              });
              this.searchList(this.searchPram,this.searchPram.currentPage);
            }else{
              this.$message({
                message: response.body.msg,
                type: 'warning'
              });
            }       
          }, response => {
              this.$notify.error({
                title: '错误',
                message: '请求失败'
              });
          });
         
      });
  }

  },
  mounted () {
    this.searchPram.currentPage=this.$route.query.pageIndex?this.$route.query.pageIndex:1;
    this.searchList(this.searchPram,this.searchPram.currentPage);
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.el-input__inner{
  height: 28px;
}

</style>
