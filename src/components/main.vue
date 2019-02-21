<template>
  <div class="main">
    <div class='top'>
      <img src="../assets/logo1.png">

      <span class='rightCont_top'>
        <span>你好！</span>
        <span class='manager'>{{admin.name}}</span>
    
        <el-button type="danger"  size="mini"  @click="exit" icon='el-icon-back'> 退出登录</el-button>
        
      </span>
    </div>

      
    <el-menu  :default-active="$route.path"  mode="horizontal"  background-color="#47A6E8"  text-color="white" active-text-color="#ffd04b" router='true'>
      <el-submenu index="1">
        <template slot="title">检测项目管理</template>
        <el-menu-item index='/main/1-1'>套餐信息</el-menu-item>
        <el-menu-item index='/main/1-2'>项目信息</el-menu-item>
        <el-menu-item index='/main/1-3'>样本信息</el-menu-item>
        <el-menu-item index='/main/1-4'>套餐类型</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">用户信息</template>
        <el-menu-item index='/main/3-1'>会员信息管理</el-menu-item>
        <el-menu-item index='/main/3-2-1'>医生信息管理</el-menu-item>
        <!-- <el-submenu index="3-2">
            <template slot="title">医生信息管理</template>
            <el-menu-item index='/main/3-2-1'>医生信息</el-menu-item>
            <el-menu-item index='/main/3-2-2'>擅长类型</el-menu-item>
        </el-submenu> -->
      
        <el-menu-item index='/main/3-3'>护士信息管理</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">解读报告</template>
        <el-menu-item index='/main/4-1'>报告信息</el-menu-item>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title">订单管理</template>
        <el-menu-item index='/main/5-1'>订单信息</el-menu-item>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">采样服务站</template>
        <el-menu-item index='/main/6-1'>服务站信息</el-menu-item>
      </el-submenu>

      <el-submenu index="7">
        <template slot="title">检测站</template>
        <el-menu-item index='/main/7-1'>全部订单</el-menu-item>
      </el-submenu>

      <el-submenu index="8">
        <template slot="title">统计分析</template>
        <el-menu-item index='/main/8-1'>检测统计</el-menu-item>
      </el-submenu>

      <el-submenu index="9">
        <template slot="title">系统管理</template>
        <el-menu-item index='/main/9-1'>角色信息</el-menu-item>
        <el-menu-item index='/main/9-2'>用户信息</el-menu-item>
        <el-menu-item index='/main/9-3'>价格管理</el-menu-item>
        <el-menu-item index='/main/9-4'>粉丝规则</el-menu-item>
        <el-menu-item index='/main/9-5'>积分规则</el-menu-item>
        <el-menu-item index='/main/9-6'>时间设置</el-menu-item>

      </el-submenu>

       <el-submenu index="10">
        <template slot="title">结算信息</template>
        <el-menu-item index='/main/10-1'>医生结算</el-menu-item>
        <el-menu-item index='/main/10-2'>护士结算</el-menu-item>
        <el-menu-item index='/main/10-3'>服务站结算</el-menu-item>
      </el-submenu>

       <el-submenu index="11">
        <template slot="title">会员卡</template>
        <el-menu-item index='/main/11-1'>卡号管理</el-menu-item>
        <!-- <el-menu-item index='/main/10-2'>护士结算</el-menu-item>
        <el-menu-item index='/main/10-3'>服务站结算</el-menu-item> -->
      </el-submenu>
    </el-menu>   

    <router-view :baseUrl="baseUrl" :admin='admin'/>
  </div>

</template>

<script>
export default {
  props: ['baseUrl'],
  name: 'main',
  data () {
    return {
      activeIndex:'/main/1-1',
      admin:{
        name:'',
        id:''
      }
    }
  },
  methods: {
    exit(){
      this.$confirm('确认退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/login' ,query:{exit:true}}) ;
      });
    },

  },
  mounted(){
    this.admin.name=sessionStorage.getItem("adminName");
    this.admin.id=this.$route.query.adminId
  },

}
</script>

<style lang="scss">
.main{
  // min-width: 1200px;
  width: 1903px;
  background-color: #FFFFFF;
  .el-submenu__title{
    font-size: 16px;
  }
  .el-submenu__title i {
    color:white
  }

  .is-active i{
    color:  rgb(255, 208, 75);
  }
}
.top img{
  width:200px;
  height: 50px;
}
.el-button+.el-button{
  margin-left: 0px !important;
}

body .el-table th.gutter{
    display: table-cell !important;
}
</style>
