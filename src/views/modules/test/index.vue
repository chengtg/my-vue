<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.areaName" placeholder="城市名称" clearable></el-input>
      </el-form-item>
	 <el-form-item>
		<el-select v-model="dataForm.status" placeholder="请选择状态符号"  clearable>
            <el-option
              v-for="item in StatusDictOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
	 <el-form-item>
	    <el-select v-model="dataForm.companyId" placeholder="请选择公司名称">
            <el-option
              v-for="item in CompanyIdListOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('test:test:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('test:test:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        label="城市ID">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="城市名称">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态符号">
      </el-table-column>
      <el-table-column
        prop="companyId"
        header-align="center"
        align="center"
        label="公司名称">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="statusType"
        header-align="center"
        align="center"
        label="状态符号">
      </el-table-column>
      <el-table-column
        prop="fullName"
        header-align="center"
        align="center"
        label="公司名称">
      </el-table-column>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './add-or-update';
  export default {
    data() {
      return {
        StatusDictOptions: [],
        CompanyIdListOptions: [],
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
		this.selectDictList('STATUS_TYPE');

		this.selectTableList('sys_company_dept', 'id', 'full_name');
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
		  limit: this.pageSize,
          areaName: this.dataForm.areaName,
          status: this.dataForm.status,
          companyId: this.dataForm.companyId,
          key: this.dataForm.key
        };
        this.$http({
          url: this.$http.adornUrl(`/test/test/list`),
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
            url: this.$http.adornUrl(`/test/test/delete`),
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
				   // this.${column.attrname}DictOptions = data;
                     this.StatusDictOptions = data;
                }
            });
      },
	  // 根据数据库列表
   selectTableList(tableName, value, label) {
	       let paramsV = {
    		   tableName: tableName,
    		   value: value,
           label: label
         };

            this.$http({
                url: this.$http.adornUrl(`/sys/table/list`),
                method: 'get',
                params: paramsV
              }).then(({data}) => {
                if (data) {
                     this.CompanyIdListOptions = data.list;
                }
            });
      }
    }
  };
</script>
