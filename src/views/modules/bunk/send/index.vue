<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="商业项目" prop="projectId">
        <el-select v-model="dataForm.projectId" @change="selectShopList" clearable @clear="clearShopList" filterable   placeholder="请选择商业项目">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id"
            :label="item.cbdName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="铺位编号" prop="shopId">
        <!--@visible-change="dropShopList"-->
        <el-select v-model="dataForm.shopId"   clearable placeholder="请选择铺位">
          <el-option
            v-for="item in ShopListOptions"
            :key="item.id"
            :label="item.shopNum"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息标题" prop="key">
        <el-input v-model="dataForm.title" placeholder="消息标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否已阅读" prop="isRead">
        <el-select v-model="dataForm.isRead"  clearable  placeholder="是否已阅读">
          <el-option
            v-for="item in YES_OR_NO_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
       <!-- <el-button v-if="isAuth('bunk:tmessagesend:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <el-button v-if="isAuth('bunk:tmessagesend:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        align="left"
        label="ID"
        width="50">
      </el-table-column>
      <el-table-column
        prop="projectName"
        header-align="center"
        align="left"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="shopNum"
        header-align="center"
        align="left"
        label="铺位编号">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="left"
        label="消息标题">
      </el-table-column>
      <el-table-column
        prop="sendTime"
        header-align="center"
        align="left"
        label="发送时间">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="left"
        label="接收账号">
      </el-table-column>
      <el-table-column
        prop="objectName"
        header-align="center"
        align="left"
        label="报名对象">
      </el-table-column>
      <el-table-column
        prop="isRead"
        header-align="center"
        align="center"
        label="是否已阅读">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isRead == 1" size="small" type="small">是</el-tag>
          <el-tag v-else-if="scope.row.isRead == 0" size="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="readTime"
        header-align="center"
        align="left"
        label="阅读时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
         <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>-->
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
        ProjectIdListOptions: [],
        ShopListOptions: [],
        YES_OR_NO_Options: [{
            value: '1',
            label: '是'
          },
          {
            value: '0',
            label: '否'
          }
        ],
        dataForm: {
          key: '',
          title: '',
          isRead: '',
          projectId: '',
          shopId: ''
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
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
		      limit: this.pageSize,
          key: this.dataForm.key,
          title: this.dataForm.title,
          isRead: this.dataForm.isRead,
          projectId: this.dataForm.projectId,
          shopId: this.dataForm.shopId
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tmessagesend/list`),
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
            url: this.$http.adornUrl(`/bunk/tmessagesend/delete`),
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
      selectShopList(projectId) {
        let paramV = {projectId: projectId, state: '1', isPush: '2'};
        this.clearShopList();
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshopinfo/selectByProjectIdAndOther/` + projectId),
          method: 'get',
          params: paramV
        }).then(({data}) => {
          if (data) {
            this.ShopListOptions = data.list;
          }
        });
      },
      clearShopList() {
        this.ShopListOptions = [];
        this.dataForm.shopId = '';
      }
    }
  };
</script>
