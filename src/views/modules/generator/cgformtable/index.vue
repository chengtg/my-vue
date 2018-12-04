<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="regetDataList()">查询</el-button>
        <el-button v-if="isAuth('generator:cgformtable:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('generator:cgformtable:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button  type="danger" @click="genertate()" :disabled="dataListSelections.length <= 0">生成代码</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      size="mini" highlight-current-row border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @current-change="handleCurrentChange"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="tableName"
        header-align="center"
        align="left"
        label="表名称">
      </el-table-column>
      <el-table-column
        prop="tableComment"
        header-align="center"
        align="left"
        label="表描述">
      </el-table-column>
      <el-table-column
        prop="jformPkType"
        header-align="center"
        align="center"
        label="主键类型"
        width="130">
        <template slot-scope="scope">
            <el-select v-model="scope.row.jformPkType" placeholder="" :disabled="true">
                <el-option
                  v-for="item in jformPkTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
         </template>
      </el-table-column>
      <el-table-column
        prop="isCheckbox"
        header-align="center"
        align="center"
        label="checkbox">
          <template slot-scope="scope">
            <el-checkbox  :checked="scope.row.isCheckbox === 'YES'" :disabled="true"></el-checkbox>
          </template>
      </el-table-column>
      <el-table-column
        prop="isPagination"
        header-align="center"
        align="center"
        label="分页">
          <template slot-scope="scope">
            <el-checkbox  :checked="scope.row.isPagination === 'YES'" :disabled="true"></el-checkbox>
          </template>
      </el-table-column>
      <el-table-column
        prop="isTree"
        header-align="center"
        align="center"
        label="树">
          <template slot-scope="scope">
            <el-checkbox  :checked="scope.row.isTree === 'YES'" :disabled="true"></el-checkbox>
          </template>
      </el-table-column>
      <!-- <el-table-column
        prop="treeParentidFieldname"
        header-align="center"
        align="center"
        label="树形表单父id">
      </el-table-column>
      <el-table-column
        prop="treeIdFieldname"
        header-align="center"
        align="center"
        label="树表主键字段">
      </el-table-column>
      <el-table-column
        prop="treeFieldname"
        header-align="center"
        align="center"
        label="树开表单列字段">
      </el-table-column> -->
      <el-table-column
        prop="isAuth"
        header-align="center"
        align="center"
        label="组织权限">
          <template slot-scope="scope">
              <el-checkbox  :checked="scope.row.isAuth === 'YES'" :disabled="true"></el-checkbox>
          </template>
      </el-table-column>
      <el-table-column
        prop="packName"
        header-align="center"
        align="center"
        label="代码包名">
      </el-table-column>
      <el-table-column
        prop="moduleName"
        header-align="center"
        align="center"
        label="模块名称">
      </el-table-column>
      <!-- <el-table-column
        prop="tableVersion"
        header-align="center"
        align="center"
        label="表单版本">
      </el-table-column> -->
      <el-table-column
        prop="jformVersion"
        header-align="center"
        align="center"
        label="版本号">
      </el-table-column>
      <el-table-column
        prop="isDbsynch"
        header-align="center"
        align="center"
        label="同步状态">
        <template slot-scope="scope">
            <el-checkbox  :checked="scope.row.isDbsynch === 'Y'"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('generator:cgformtable:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('generator:cgformtable:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="menusqlHandle(scope.row.id)">菜单SQL</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 菜单sql-->
    <mensql v-if="menusqlVisible" ref="mensql" ></mensql>
  </div>
</template>

<script>
  import AddOrUpdate from './add-or-update';
  import Mensql from './mensql';
  export default {
    data() {
      return {
        jformCategoryList: [{
          value: '1',
          label: '单表'
         }, {
          value: '2',
          label: '多表'
        }],
        jformPkTypeList: [{
          value: '1',
          label: '自增'
         }, {
          value: '2',
          label: 'UUID'
        }],
        checkList: [{
          value: 'Y',
          label: '是'
         }],
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        menusqlVisible: false
      };
    },
    components: {
      AddOrUpdate,
      Mensql
    },
    activated() {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        };
        this.$http({
          url: this.$http.adornUrl(`/generator/cgformtable/list`),
          method: 'get',
          params: params
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list;
            this.totalPage = data.page.totalCount;
          } else {
            this.dataList = [];
            this.totalPage = 0;
          }
          this.dataListLoading = false;
        });
      },
      // 点击查询时，将当前页码重置
      regetDataList() {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val;
        this.pageIndex = 1;
        this.getDataList();
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val;
        this.getDataList();
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val;
      },
      handleCurrentChange(val) {
          this.currentRow = val;
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id);
        });
      },
      menusqlHandle(id) {
        this.menusqlVisible = true;
        this.$nextTick(() => {
          this.$refs.mensql.init(id);
        });
      },
      // 删除
      deleteHandle(id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id;
        });
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/generator/cgformtable/delete`),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      },

      // 生成代码
      genertate(id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id;
        });
        this.$http({
          url: this.$http.adornUrl(`/generator/cgformtable/code`),
          method: 'post',
          responseType: 'arraybuffer',
          data: this.$http.adornData(ids, false)
        }).then((data) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList();
            }
          });
          // console.log(data.data);
          //
          // alert(data.data);
          // console.log(data.data)
          // 创建一个blob对象,file的一种
          let blob = new Blob([data.data], {type: 'application/octet-stream'});
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'renren.zip';
          link.click();
        });
      }
    }
  };
</script>
    <style>
        * {
            margin: 0;
            padding: 0;
            padding-top: 0px;
            padding-right: 0px;
            padding-bottom: 0px;
            padding-left: 0px;
        }

        body {
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #495060;
            background-color: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
				    background-color: #fff;
        }

        /* 可编辑表格 */

        .el-tb-edit .el-input,
        .el-tb-edit .el-input-number,
        .el-tb-edit .el-select {
            display: none;
            width: 100%;
        }

        .el-tb-edit .current-row .el-input,
        .el-tb-edit .current-row .el-input-number,
        .el-tb-edit .current-row .el-select {
            display: inherit;
        }

        .el-tb-edit .current-row .el-input+span,
        .el-tb-edit .current-row .el-input-number+span,
        .el-tb-edit .current-row .el-select+span {
            display: none;
        }
    </style>
