<template>
  <div id="app">
   <router-view :baseUrl="baseUrl"  />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
      return {
        baseUrl: {
          vip: 'http://59.172.27.186:8888/gene_detection/',//用户 "http://59.172.27.186:8888/gene_we/" 
          role: "http://59.172.27.186:8888/gene_detection/",//系统 角色'http://59.172.27.186:8888/gene_admin/'
          reportUrl:"http://59.172.27.186:8888/gene_detection/",
          picUrl:"http://59.172.27.186:3109/gene/",//存放图片的地址
          address:'http://59.172.27.186:8888/gene_detection/',//省市区
          // address:'http://59.172.27.186:8888/gene_detection/'
        }
      };
    },

  }
</script>

<style lang="scss">
.loginForm .el-form-item__error{
  margin-left: 80px;
}
    
.clearFloat{
  clear: both;
}
*{
  margin: 0 0;
  padding:0 0;
  font-family: 'MicroSoft YaHei'
}

#app {
  .el-submenu__title i {
  color:white
  }
  .top{ //顶部
    padding:0 50px;
    height: 50px;
    line-height: 50px;
    .rightCont_top{
      float:right;
      .manager{
        color:#72B0EA;
        margin-right:10px;
      }
   
    }
  }
  .container{ //中间内容区
    width:80%;
    margin:0 auto;
    .navRow{ //位置 搜索栏
      min-width: 1200px;
      border: 1px solid  #D8D8D8;
      border-top:none;
      height:60px;
      line-height:60px;
      .el-breadcrumb{
        min-height:60px;
        line-height:60px;
        margin-left:20px;
      }
      .el-input{
        width:150px;
        margin:0 5px;
      }
      span{
      font-size:14px;
      }
    }

    .opera{ //操作按钮栏
      height:50px;
      line-height:50px;
    }


    .el-table{ //网格栏
      border-collapse: collapse;/*边框会合并为一个单一的边框*/
      th{
        background-color: #EAEAEA;
        border: 1px solid  #D8D8D8;
        text-align: center;
      }
      td{
        border: 1px solid  #D8D8D8;
        text-align: center;
      }
    }

    .el-pagination{ //分页栏
      text-align: center;
      margin-top: 20px;
    }
    .el-tag{
      margin-left: 10px;
    }
    .el-form{
      margin-top:50px;
      border: 1px solid  #D8D8D8;
      padding: 30px 0px;
      .el-input,.el-textarea{
        width: 450px;
      }
    }
  }
}
.el-table .cell.el-tooltip{
      white-space: nowrap;
}
.cell{
   white-space: nowrap !important;
}
.el-table .cell{
   white-space: nowrap;
}
.el-table .cell a,.el-table .cell>img{
  margin-top: 6px;
  margin-right: 6px;
  cursor: pointer;
}
.el-table img{
  width: 16px;
  height: 16px;
}
.navRow{
  z-index: 12;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
 
input[type="number"] {
    -moz-appearance: textfield;
}
.el-input-number--mini .el-input__inner{
  width: 132px;
}
.el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase{
    margin-left: 10px;
}

</style>
