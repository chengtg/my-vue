<template>
    <el-row :gutter="10">
         <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
           <div class="grid-content">
            <el-input
              placeholder="公司名称"
              v-model="filterText"
              class="z-leftSideHeader">
              <el-button slot="append" @click="resetChecked">还原</el-button>
            </el-input>
            <el-tree
                class="filter-tree"
                :data="companyList"
                :props="defaultProps"
                default-expand-all
                highlight-current
                :filter-node-method="filterNode"
                node-key="id"
                @node-click="nodeClickFuncion"
                ref="tree">
            </el-tree>
          </div>
        </el-col>
        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
          <div class="grid-content">
          <div class="mod-config">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="z-rightform">
            <el-form-item>
              <el-input v-model="dataForm.key" placeholder="部门名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="regetDataList()">查询</el-button>
              <el-button v-if="isAuth('sys:sysdept:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
              <el-button v-if="isAuth('sys:sysdept:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              prop="id"
              header-align="center"
              align="center"
              label="部门ID"
              width="70">
            </el-table-column>
            <el-table-column
              prop="companyName"
              header-align="center"
              align="center"
              label="公司名称">
          </el-table-column>
            <table-tree-column
              prop="fullName"
              header-align="center"
              align="left"
              treeKey="id"
              label="部门名称">
            </table-tree-column>
            <el-table-column
              prop="shortName"
              header-align="center"
              align="left"
              label="部门简称">
            </el-table-column>
            <el-table-column
              prop="parentName"
              header-align="center"
              align="center"
              label="上级部门">
            </el-table-column>
            <el-table-column
              prop="orderNum"
              header-align="center"
              align="center"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="remark"
              header-align="center"
              align="center"
              label="备注">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="isAuth('sys:sysdept:update')"  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button v-if="isAuth('sys:sysdept:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
      </div>
    </el-col>
</el-row>
</template>

<script>
  import AddOrUpdate from './add-or-update';
  import TableTreeColumn from '@/components/table-tree-column';
  import { treeDataTranslate } from '@/utils';
  export default {
    data() {
      return {
        dataForm: {
          key: ''
        },
        companyId: '',
        companyList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label',
          key: ''
        }
      };
    },
    mounted: function() {
      this.selectCompany();
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated() {
      this.getDataList();
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          fullName: this.dataForm.key,
          type: 2,
          companyId: this.companyId
        };
        this.$http({
          url: this.$http.adornUrl(`/sys/syscompany/list`),
          method: 'get',
          params: params
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = treeDataTranslate(data.data, 'id');
          } else {
            this.dataList = [];
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
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id);
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
            url: this.$http.adornUrl(`/sys/syscompany/delete`),
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
      selectCompany() {
        var params = {
          type: 1
        };
        this.$http({
            url: this.$http.adornUrl('/sys/syscompany/select'),
            method: 'get',
            params: params
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.companyList = [];// 清空
              this.companyList = data.treeList;
            }
          });
      },
      nodeClickFuncion(data, node, list) {
        this.companyId = data.value;
        this.getDataList();
      },
      resetChecked() {
        this.companyId = '';
        console.log(this.$refs.tree);
        this.filterText = '';
        this.$refs.tree.setCurrentKey(null);
        this.getDataList();
      }
    }
  };
</script>
<style>
    .el-col {
      border-radius: 4px;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
    }

    .z-leftSideHeader{
      margin-bottom: 22px;
    }
    .z-rightform{
      float: right;
    }
  </style>
