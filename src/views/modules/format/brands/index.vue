<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
	 <el-form-item>
		<el-select v-model="dataForm.flag" placeholder="请选择是否有效"  clearable>
            <el-option
              v-for="item in FlagDictOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.brandName" placeholder="品牌类型" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('format:tformatshoptype:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
       <!-- <el-button v-if="isAuth('format:tformatshoptype:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <table-tree-column
        prop="brandName"
        header-align="center"
        treeKey="id"
        align="left"
        label="品牌类型">
      </table-tree-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="flag"
        header-align="center"
        align="center"
        width="80"
        label="有效否">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.flag == 0" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column';
  import { treeDataTranslate } from '@/utils';
  import AddOrUpdate from './add-or-update';
  export default {
    data() {
      return {
        FlagDictOptions: [],
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
      TableTreeColumn,
      AddOrUpdate
    },
    activated() {
      this.getDataList();
    },
		mounted: function() {
	  	this.selectDictList('FLAG_TYPE');
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          flag: this.dataForm.flag,
          brandName: this.dataForm.brandName,
          key: this.dataForm.key
        };
        this.$http({
          url: this.$http.adornUrl(`/format/tformatshoptype/list`),
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
      // formatterColumn(row, column) {
      //   switch (row.flag) {
      //     case 0:
      //       return '否';
      //       // break;
      //     case 1:
      //       return '是';
      //       // break;
      //     default:
      //       return '是';
      //   }
      // },
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
            url: this.$http.adornUrl(`/format/tformatshoptype/delete`),
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
                     this.FlagDictOptions = data;
                }
            });
      }
    }
  };
</script>
