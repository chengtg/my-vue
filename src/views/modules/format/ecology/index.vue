<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="商业项目" prop="projectId">
        <el-select v-model="dataForm.projectId" clearable filterable placeholder="请选择所属项目">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id"
            :label="item.cbdName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业态分类" prop="type">
        <el-select v-model="dataForm.type" clearable placeholder="请选择业态分类">
          <el-option
            v-for="item in ECOLOGY_TYPE_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业态名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="业态名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('bunk:tprojectformats:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('bunk:tprojectformats:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="projectName"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="业态名称">
        <template slot-scope="scope">
          <el-popover trigger="situation" placement="top">
            <b>1、介绍描述:</b><p class="breakword">{{ scope.row.desc }}</p>
            <div slot="reference">
              <el-button icon="el-icon-info" type="info" plain size="mini">{{ scope.row.name }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="typeName"
        header-align="center"
        align="left"
        label="业态分类">
      </el-table-column>
      <el-table-column
        prop="address"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="地址">
      </el-table-column>
      <!-- <el-table-column
        prop="longitude"
        header-align="center"
        align="center"
        label="经度">
      </el-table-column>
      <el-table-column
        prop="latitude"
        header-align="center"
        align="center"
        label="纬度">
      </el-table-column> -->
      <!-- <el-table-column
        prop="desc"
        header-align="center"
        align="center"
        label="介绍描述">
      </el-table-column> -->
     <!-- <el-table-column
        prop="tags"
        header-align="center"
        align="center"
        label="标签">
        <template slot-scope="scope">
          <el-tag class="u-tag" v-for="tag in scope.row.tags" :key=tag>{{tag}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="isAuth('bunk:tprojectformats:update')" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" v-if="isAuth('bunk:tprojectformats:delete')" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        ProjectIdListOptions: [],
        ECOLOGY_TYPE_Options: [],

        dataForm: {
          key: '',
          projectId: '',
          type: ''
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
    created: function() {
      this.selectPorjectList();
      this.selectDictList('ECOLOGY_TYPE');
    },
    // mounted: function() {
    //   // this.selectPorjectList();
    //   // this.selectDictList('ECOLOGY_TYPE');
    // },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
		      limit: this.pageSize,
          projectId: this.dataForm.projectId,
          name: this.dataForm.name,
          key: this.dataForm.key,
          type: this.dataForm.type
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tprojectformats/list`),
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
          this.$refs.addOrUpdate.selectPorjectList();
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
            url: this.$http.adornUrl(`/bunk/tprojectformats/delete`),
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
      // 项目查询
      selectPorjectList() {
        let paramsV = {
        };
        this.$http({
          url: this.$http.adornUrl(`/format/tproject/select`),
          method: 'get',
          params: paramsV
        }).then(({data}) => {
          if (data) {
            this.ProjectIdListOptions = data.select;
          }
        });
      },
      selectDictList(dictType) {
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdict/select/` + dictType),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
            this.ECOLOGY_TYPE_Options = data;
          }
        });
      }
    }
  };
</script>
