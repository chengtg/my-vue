<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.cbdName" placeholder="项目名称" clearable></el-input>
      </el-form-item>
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
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('format:tproject:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('format:tproject:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        width="50"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="left"
        label="区域">
      </el-table-column>
      <el-table-column
        prop="cbdName"
        header-align="center"
        align="left"
        label="项目名称">
        <template slot-scope="scope">
          <el-popover trigger="situation" placement="top">
            <b>1、项目介绍:</b><p class="breakword">{{ scope.row.projectIntroduction }}</p>
            <b>2、所属公司:</b><p class="breakword">{{ scope.row.companyName }}</p>
            <div slot="reference">
              <el-button icon="el-icon-info" type="info" plain size="mini">{{ scope.row.cbdName }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        header-align="center"
        align="left"
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
        prop="coverImage"
        header-align="center"
        align="center"
        label="封面图片">
      </el-table-column> -->
      <el-table-column
        prop="tags"
        header-align="center"
        align="left"
        label="标签">
        <template slot-scope="scope">
          <el-tag class="u-tag" v-for="tag in scope.row.tags" :key=tag>{{tag}}</el-tag>
        </template>
      </el-table-column>
   <!--   <el-table-column
        prop="projectIntroduction"
        header-align="center"
        align="center"
        label="项目介绍">
      </el-table-column>-->
      <el-table-column
        prop="flag"
        header-align="center"
        align="center"
        width="80"
        label="有效否">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.flag == '0'" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="公司/部门">
      </el-table-column> -->
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

<style scoped>
  .u-tag{
    margin: 5px 10px 5px 0;
  }
  .u-enabled{
    width: 110px;
  }
</style>

<script>
  import AddOrUpdate from './add-or-update';
  export default {
    data() {
      return {
        FlagDictOptions: [],
        AreaIdListOptions: [],
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
		this.selectDictList('FLAG_TYPE');

		this.selectTableList('sys_area', 'id', 'area_name');
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
		  limit: this.pageSize,
          cbdName: this.dataForm.cbdName,
          areaId: this.dataForm.areaId,
          tags: this.dataForm.tags,
          flag: this.dataForm.flag,
          key: this.dataForm.key
        };
        this.$http({
          url: this.$http.adornUrl(`/format/tproject/list`),
          method: 'get',
          params: params
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list;
            this.totalPage = data.page.totalCount;
            for (let i = 0; i < this.dataList.length; i++) {
              // tags内容格式化
              if (this.dataList[i].tags != null && this.dataList[i].tags.length > 0) {
                let tagStr = this.dataList[i].tags;
                let tagArray = tagStr.split(',');
                this.dataList[i].tags = tagArray;
              }
            }
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
            url: this.$http.adornUrl(`/format/tproject/delete`),
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
                     this.FlagDictOptions = data;
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
                     this.AreaIdListOptions = data.list;
                     this.CompanyIdListOptions = data.list;
                }
            });
      }
    }
  };
</script>
<style>
  .word{background:#E4FFE9;width:250px;margin:50px auto;padding:20px;font-family:"microsoft yahei";}
  /* 强制不换行 */
  .nowrap{white-space:nowrap;}
  /* 允许单词内断句，首先会尝试挪到下一行，看看下一行的宽度够不够，
  不够的话就进行单词内的断句 */
  .breakword{width: 400px; word-wrap:break-word;}
  /* 断句时，不会把长单词挪到下一行，而是直接进行单词内的断句 */
  .breakAll{word-break:break-all;}
  /* 超出部分显示省略号 */
  .ellipsis{text-overflow:ellipsis;overflow:hidden;}
</style>
