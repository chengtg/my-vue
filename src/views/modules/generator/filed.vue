<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="表名" clearable></el-input>
      </el-form-item>
  
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button  type="danger" @click="genertate()" :disabled="dataListSelections.length <= 0">生成代码</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
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
        label="表名">
      </el-table-column>
      <el-table-column
        prop="engine"
        header-align="center"
        align="center"
        label="Engine"
        width="70">
      </el-table-column>
      <el-table-column
        prop="tableComment"
        header-align="center"
        align="left"
        label="字段描述">
      </el-table-column>
      <el-table-column
          prop="ishow"
          header-align="center"
          align="center"
          label="是否显示"
          width="80">
          <template slot-scope="scope">
              <el-checkbox v-model="scope.row.ishow" placeholder="" >
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"  data-ng-selected="true"></el-option>
              </el-checkbox>
          </template>
     </el-table-column>
     <el-table-column
          prop="ismust"
          header-align="center"
          align="center"
          label="是否必填"
          width="80">
          <template slot-scope="scope">
              <el-checkbox v-model="scope.row.ismust" placeholder="" >
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"  data-ng-selected="true"></el-option>
              </el-checkbox>
          </template>
     </el-table-column>
      <el-table-column
        prop="auth"
        header-align="center"
        align="center"
        label="数据权限"
        width="80">
        <template slot-scope="scope">
            <el-checkbox v-model="scope.row.auth" placeholder="" >
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"  data-ng-selected="true"></el-option>
            </el-checkbox>
        </template>
    </el-table-column>
    <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="控件类型"
        width="145">
        <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="" >
                <el-option label="下拉列表" :value="3"  data-ng-selected="true"></el-option>
                <el-option label="日期控件" :value="2"  data-ng-selected="true"></el-option>
                <el-option label="文本" :value="1" data-ng-selected="true"></el-option>
            </el-select>
        </template>
    </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataForm: {
          key: ''
        },
        areaList: [],
        flags: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      };
    },
    activated() {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList() {
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          tableName: this.dataForm.key
        };
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl(`/sys/generator/list`),
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

      // 生成代码
      genertate(tableName) {
        var tables = tableName ? [tableName] : this.dataListSelections.map(item => {
          return item.tableName;
        });
        this.$http({
            url: this.$http.adornUrl(`/sys/generator/code`),
            method: 'post',
            responseType: 'arraybuffer',
            data: this.$http.adornData(tables, false)
          }).then((data) => {
            console.log(data.data);
  
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

<style scoped>
  .u-tag{
    margin: 5px 10px 5px 0;
  }
  .u-enabled{
    width: 110px;
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