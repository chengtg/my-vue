<template>
    <el-row :gutter="10">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="mod-config">
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
              <el-form-item>
                <el-input v-model="dataForm.key" placeholder="字典类型/类型标签" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="regetDataList()">查询</el-button>
                <el-button v-if="isAuth('sys:sysdict:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <!-- <el-button v-if="isAuth('sys:sysdict:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
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
              <el-table-column
                header-align="center"
                align="center"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
              prop="dictType"
              header-align="center"
              align="left"
              label="数据字典类型">
            </el-table-column>
              <el-table-column
                prop="label"
                header-align="center"
                align="left"
                label="类型标签">
              </el-table-column>
              <el-table-column
                prop="orderNum"
                header-align="center"
                align="center"
                label="排序"
                width="50">
              </el-table-column>
              <el-table-column
                prop="desc"
                header-align="center"
                align="left"
                label="描述">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('sys:sysdict:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                  <el-button v-if="isAuth('sys:sysdict:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataListR="getDataListR" @refreshDataList="getDataList"></add-or-update>
          </div> 
        </el-col>

        <!--右边列表-->
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="mod-config">
              <el-form :inline="true" :model="dataFormR" @keyup.enter.native="getDataListR()">
                <el-form-item>
                  <el-input v-model="dataFormR.key" placeholder="字典类型/类型标签" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="regetDataListR()">查询</el-button>
                  <el-button v-if="isAuth('sys:sysdict:save')" type="primary" @click="addOrUpdateHandleR()">新增</el-button>
                  <el-button v-if="isAuth('sys:sysdict:delete')" type="danger" @click="deleteHandleR()" :disabled="dataListSelectionsR.length <= 0">批量删除</el-button>
                </el-form-item>
              </el-form>
              <el-table
                :data="dataListR"
                border
                v-loading="dataListLoadingR"
                @selection-change="selectionChangeHandleR"
                style="width: 100%;">
                <el-table-column
                  type="selection"
                  header-align="center"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  type="index"
                  width="50">
                </el-table-column>
                <!-- <el-table-column
                  prop="dictType"
                  header-align="center"
                  align="center"
                  label="数据字典类型">
                </el-table-column> -->
                <el-table-column
                  prop="value"
                  header-align="center"
                  align="left"
                  label="类型值">
                </el-table-column>
                <el-table-column
                  prop="label"
                  header-align="center"
                  align="left"
                  label="类型标签">
                </el-table-column>
                <el-table-column
                  prop="orderNum"
                  header-align="center"
                  align="center"
                  label="排序"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="desc"
                  header-align="center"
                  align="left"
                  label="描述">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  header-align="center"
                  align="center"
                  width="150"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="isAuth('sys:sysdict:update')" type="text" size="small" @click="addOrUpdateHandleR(scope.row.id)">修改</el-button>
                    <el-button v-if="isAuth('sys:sysdict:delete')" type="text" size="small" @click="deleteHandleR(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @size-change="sizeChangeHandleR"
                @current-change="currentChangeHandleR"
                :current-page="pageIndexR"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSizeR"
                :total="totalPageR"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div> 
          </el-col>
    </el-row>
</template>

<script>
  import AddOrUpdate from './add-or-update';
  export default {
    data() {
      return {
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
        currentRow: '',

        dataFormR: {
          key: ''
        },
        dataListR: [],
        pageIndexR: 1,
        pageSizeR: 10,
        totalPageR: 0,
        dataListLoadingR: false,
        dataListSelectionsR: [],
        addOrUpdateVisibleR: false
      };
    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        this.currentRow = '';
        let params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          parent_id: 0,
          type: 1
        };
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdict/list`),
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
            url: this.$http.adornUrl(`/sys/sysdict/delete`),
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
      // 左侧列表点击事件
      handleCurrentChange(val) {
        console.log(val);
        if (val) {
          this.currentRow = val;
          this.getDataListR();
        } else {
          this.dataListR = [];
          this.totalPageR = 0;
        }
      },
      // 获取数据列表-右边列表
      getDataListR() {
        this.dataListLoadingR = true;
        let params = {
          page: this.pageIndexR,
          limit: this.pageSizeR,
          label: this.dataFormR.key,
          parent_id: this.currentRow.id,
          type: 2
        };
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdict/list`),
          method: 'get',
          params: params
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataListR = data.page.list;
            this.totalPageR = data.page.totalCount;
          } else {
            this.dataListR = [];
            this.totalPageR = 0;
          }
          this.dataListLoadingR = false;
        });
      },
      // 点击查询时，将当前页码重置
      regetDataListR() {
        this.pageIndex = 1;
        this.getDataListR();
      },
      // 每页数
      sizeChangeHandleR(val) {
        this.pageSizeR = val;
        this.pageIndexR = 1;
        this.getDataListR();
      },
      // 当前页
      currentChangeHandleR(val) {
        this.pageIndexR = val;
        this.getDataListR();
      },
      // 多选
      selectionChangeHandleR(val) {
        this.dataListSelectionsR = val;
      },
      // 新增 / 修改
      addOrUpdateHandleR(id) {
        if (this.currentRow) {
          this.addOrUpdateVisible = true;
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id, this.currentRow);
          });
        } else {
          this.$message.error('请点击选择左侧数据字典类型');
        }
      },
      // 删除
      deleteHandleR(id) {
        var ids = id ? [id] : this.dataListSelectionsR.map(item => {
          return item.id;
        });
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/sysdict/delete`),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataListR();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        });
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
