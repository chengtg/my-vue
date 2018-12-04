<template>
      <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="消息标题" prop="key">
             <el-input v-model="dataForm.key" placeholder="消息标题" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="regetDataList()">查询</el-button>
            <el-button v-if="isAuth('bunk:tmessagetemplate:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
<!--
            <el-button v-if="isAuth('bunk:tmessagetemplate:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
-->
          </el-form-item>
        </el-form>
        <el-table
          ref="singleTable"
          :data="dataList"
          border
          highlight-current-row
          v-loading="dataListLoading"
          @current-change="handleCurrentChange"
          style="width: 100%;">
       <!--   <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>-->
          <el-table-column
            header-align="center"
            align="center"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="title"
            header-align="center"
            align="left"
            showOverflowTooltip
            label="模板标题">
          </el-table-column>
         <el-table-column
            prop="typeName"
            header-align="center"
            align="center"
            width="120"
            label="消息类型">
          </el-table-column>
         <el-table-column
            prop="content"
            header-align="center"
            align="left"
            showOverflowTooltip
            label="模板内容">
          </el-table-column>
         <!-- <el-table-column
            prop="isSend"
            header-align="center"
            align="center"
            width="100"
            label="立即发送">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isSend == 1" size="small" type="small">是</el-tag>
              <el-tag v-else-if="scope.row.isSend == 0" size="danger">否</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataListR="getDataListR"  @refreshDataList="getDataList"></add-or-update>
      </div>
</template>

<script>
  import AddOrUpdate from './add-or-update';
  export default {
    data() {
      return {
        MESSAGE_TYPE_Options: [],

        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      };
    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getDataList();
    },
		mounted: function() {
      this.selectDictList('MESSAGE_TYPE');
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        this.currentRow = '';
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          parentId: 0
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tmessagetemplate/list`),
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
      // 左侧列表点击事件
      handleCurrentChange(val) {
        // alert(11);
        console.log(val);
        if (val) {
          this.currentRow = val;
          this.getDataListR();
        } else {
          this.dataListR = [];
          this.totalPageR = 0;
        }
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
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true;
        if (typeof (id) === 'undefined' || id == null) { // 添加
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id);
          });
        } else {
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id, this.currentRow);
          });
        }
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
            url: this.$http.adornUrl(`/bunk/tmessagetemplate/delete`),
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
      // 根据数据字典类型 查询数据字典列表
      selectDictList(dictType) {
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdict/select/` + dictType),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
            this.MESSAGE_TYPE_Options = data;
          }
        });
      }
    }
  };
</script>
