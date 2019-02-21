<template>

  <div class="container">
    <el-row class='navRow'>
      <el-col :span="12" >
        <el-breadcrumb separator-class="el-icon-arrow-right" >
          <el-breadcrumb-item>当前位置：项目检测管理</el-breadcrumb-item>
          <el-breadcrumb-item>套餐信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
        <span>搜索</span>
        <el-input v-model="searchPram.name" placeholder="请输入套餐名称" size="mini" ></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchList(searchPram)">搜索</el-button>
        <el-button type="warning" @click='reset(searchPram)' size="mini">重置</el-button>
      </el-col>
    </el-row>

    <el-row class='opera'>
      <el-col :span="24" >
        <router-link :to="{path:'/main/1-1/checkPac',query:{typeLab:'新增',type:false,state:false,pageIndex:searchPram.currentPage}}">
          <el-button type="text" icon="el-icon-circle-plus" >新增</el-button>
        </router-link>
        <el-button type="text"  icon="el-icon-delete" @click="isDelAll">删除</el-button>
       </el-col>
    </el-row>
  
  
    <el-table  ref="multipleTable" :data="tableData3"  @selection-change="handleSelectionChange"  size='mini'  >
      <el-table-column  label="序号" type="index" width="50"></el-table-column>
      <el-table-column   type="selection"   width="60">  </el-table-column>
      <el-table-column  label="操作" width="160" >
        <template slot-scope="scope">
          <router-link :to="{path:'/main/1-1/checkPac',query:{row:scope.row,typeLab:'查看',type:true,pageIndex:searchPram.currentPage}}">
            <!-- <el-button title="查看" type="primary" icon="el-icon-search" circle size="mini"></el-button> -->
            <img src="../assets/look_over.png"  title="查看" alt="">
          </router-link>
          <router-link :to="{path:'/main/1-1/checkPac',query:{row:scope.row,typeLab:'修改',type:false,pageIndex:searchPram.currentPage}}">
            <!-- <el-button title="修改" type="primary" icon="el-icon-edit" circle size="mini" ></el-button> -->
            <img src="../assets/modify.png" title="修改" alt="">
          </router-link>
          <!-- <el-button title="删除" type="danger" icon="el-icon-delete" circle size="mini" @click="isDel(scope.row.categoryId)" ></el-button> -->
          <img src="../assets/delete.png" title="删除"  @click="isDel(scope.row.categoryId)" alt="">
          <img src="../assets/grounding.png" title="上架" v-if='scope.row.upStatus==0'  @click="isFraze1(scope.row)" alt="" >
          <img src="../assets/undercarriage.png" title="下架" v-if='scope.row.upStatus==1' @click="isFraze1(scope.row)" alt="">
          <!-- <el-button title="下架" type="warning" v-if='scope.row.upStatus==1' icon="el-icon-download" circle size="mini" @click="isFraze1(scope.row)" ></el-button>
          <el-button title="上架" type="success" v-if='scope.row.upStatus==0' icon="el-icon-upload2" circle size="mini" @click="isFraze1(scope.row)" ></el-button> -->
          
        </template>
      </el-table-column>

      <el-table-column  prop="categoryId" label="套餐编号" width="250" show-overflow-tooltip=true> <template slot-scope="scope">{{ scope.row.categoryId }}</template>   </el-table-column>
      <el-table-column  prop="categoryName"  label="套餐名称" width="180" show-overflow-tooltip=true >  <template slot-scope="scope">{{ scope.row.categoryName   }}</template>  </el-table-column>
      <el-table-column prop="categoryType"   label="套餐类型" width="100" >  <template slot-scope="scope">{{ scope.row. categoryType   }}</template></el-table-column>
      <el-table-column  prop="itemName" label="体检项目"   width="200" show-overflow-tooltip> <template slot-scope="scope">{{ scope.row.itemName }}</template>   </el-table-column>
      <el-table-column  prop="useForPeople"  label="适合人群" show-overflow-tooltip=true>  <template slot-scope="scope">{{ scope.row.useForPeople   }}</template>  </el-table-column>
      <el-table-column  prop="upStatusName" label="套餐状态"  > <template slot-scope="scope">{{ scope.row.upStatusName }}</template>   </el-table-column>
      <el-table-column  prop="price"  label="价格(￥)"  align="right">  <template slot-scope="scope">{{ (scope.row.price/100).toFixed(2)   }}</template>  </el-table-column>
      <el-table-column  prop="itemCount"  label="检查项" >  <template slot-scope="scope">{{ scope.row.itemCount   }}</template>  </el-table-column>
    </el-table>

    <el-pagination  background @current-change="handleCurrentChange" :current-page="searchPram.currentPage" :page-sizes="[10]" :page-size="10"
      layout="total, sizes,prev, pager, next, jumper" :total="totalNum">
    </el-pagination>

  </div>

</template>

<script>
export default {
  props: ["baseUrl"],
  name: "packageInfo",
  data() {
    return {
      searchPram: { name: "", currentPage: "" },
      totalNum: "",
      tableData3: "",
      multipleSelection: []
    };
  },
  methods: {
    isFraze1(row) {
      //上架、下架确认框 单条
      if (row.upStatus == 0) {
        //下架状态
        this.$confirm("确认上架?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.frazeIntf(row.categoryId, 0);
        });
      } else {
        //上架状态
        this.$confirm("确认下架?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.frazeIntf(row.categoryId, 1);
        });
      }
    },

    frazeIntf(categoryId, type) {
      //调上架下架接口
      var url;
      if (type == 0) {
        //上架
        url = "back/category/up";
      } else {
        //下架
        url = "back/category/down";
      }
      this.$http
        .get(this.baseUrl.address + url, {
          params: {
            categoryId: categoryId
          }
        })
        .then(
          response => {
            if (response.body.code == 0) {
              this.searchList(this.searchPram, this.searchPram.currentPage);
            }
            this.$message({
              message: response.body.msg,
              type: response.body.code ? "warning" : "success"
            });
          },
          response => {
            this.$notify.error({
              title: "错误",
              message: "请求失败"
            });
          }
        );
    },

    isDelAll() {
      if (this.multipleSelection.length > 0) {
        var b = [];
        for (const item of this.multipleSelection) {
          b.push(item.categoryId);
        }
        this.$confirm("确认批量删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.delIntf(b);
        });
      } else {
        this.$message({
          message: "请至少选中一条数据！",
          type: "warning"
        });
      }
    },

    handleSelectionChange(val) {
      //勾选事件
      this.multipleSelection = val;
    },

    searchList(searchPram, pageIndex) {
      //搜索按钮
      this.$http
        .get(this.baseUrl.address + "back/category/selectAll", {
          params: {
            name: searchPram.name,
            pageNum: pageIndex
          }
        })
        .then(
          response => {
            if (response.body.code=="9") {
              this.$message({
                message: response.body.msgs,
                type: "warning"
              });
            } else {
              this.tableData3 = response.body.categories;
              this.totalNum = response.body.page.totalNum;
              this.searchPram.currentPage = response.body.page.currentPage;
            }
          },
          response => {
            this.tableData3 = "";
          }
        );
    },

    reset(searchPram) {
      //重置
      searchPram.name = "";
      this.searchList(searchPram);
    },

    handleCurrentChange(val) {
      //切换页
      this.searchList(this.searchPram, val);
    },

    isDel(id) {
      //删除确认框 单条
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var a = [id];
          this.delIntf(a);
        })
        .catch(() => {});
    },

    delIntf(categoryIds) {
      //调删除接口
      this.$http
        .get(this.baseUrl.address + "back/category/deleteByCategoryIds", {
          params: {
            categoryIds: categoryIds.join(",")
          }
        })
        .then(
          response => {
            if (response.body.result == "0") {
              this.$message({
                message: "删除失败",
                type: "warning"
              });
            } else {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.searchList(this.searchPram, this.searchPram.currentPage);
            }
          },
          response => {
            this.$notify.error({
              title: "错误",
              message: "请求失败"
            });
          }
        );
    }
  },

  mounted() {
    this.searchPram.currentPage = this.$route.query.pageIndex
      ? this.$route.query.pageIndex
      : 1;
    this.searchList(this.searchPram, this.searchPram.currentPage);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#app {
  .el-table {
    td:nth-of-type(10) {
      text-align: initial;
      text-align: right;
    }
  }
}
</style>
