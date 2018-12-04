<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item  prop="projectId">
        <el-select v-model="dataForm.projectId" @change="selectShopList" clearable @clear="clearShopList" filterable   placeholder="请选择商业项目">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id"
            :label="item.cbdName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.shopNum" placeholder="铺位名称/编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.bigType" clearable filterable placeholder="请选择分类">
          <el-option
            v-for="item in BigTypeListOptions"
            :key="item.id"
            :label="item.brandName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.tags" placeholder="标签"  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('bunk:tshopinfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('bunk:tshopinfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      @sort-change='sortChange'
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
        prop="cbdName"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="项目">
      </el-table-column>
      <el-table-column
        prop="shopNum"
        header-align="center"
        align="left"
        label="铺位">
        <template slot-scope="scope">
          <el-popover trigger="situation" placement="top">
            <b>1、铺位概况:</b><p class="breakword">{{ scope.row.situation }}</p>
            <b>2、铺位地址:</b><p class="breakword">{{ scope.row.address }}</p>
            <b>3、配套设施:</b><p class="breakword">{{ scope.row.propertyInfo }}</p>
            <b>4、所属公司:</b><p class="breakword">{{ scope.row.companyName }}</p>
            <div slot="reference">
              <el-button icon="el-icon-info" type="info" plain size="mini">{{ scope.row.shopNum }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="address"
        header-align="center"
        align="center"
        showOverflowTooltip
        label="地址">
      </el-table-column> -->
      <el-table-column
        prop="area"
        sortable="custom"
        header-align="center"
        align="center"
        width="80"
        label="面积">
      </el-table-column>
      <el-table-column
        prop="floor"
        sortable="custom"
        header-align="center"
        align="center"
        width="80"
        label="楼层">
      </el-table-column>
      <el-table-column
        prop="bigTypeName"
        header-align="center"
        align="center"
        width="100"
        label="铺位大类">
      </el-table-column>
      <el-table-column
        prop="subType"
        header-align="center"
        align="left"
        label="铺位小类">
        <template slot-scope="scope">
          <el-tag class="u-tag" v-for="type in scope.row.subType" :key=type>{{type}}</el-tag>
        </template>
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
      <el-table-column
        prop="tags"
        header-align="center"
        align="left"
        label="标签">
        <template slot-scope="scope">
          <el-tag class="u-tag" v-for="tag in scope.row.tags" :key=tag>{{tag}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="situation"
        header-align="center"
        align="center"
        width="100"
        label="铺位概况">
        <template slot-scope="scope">
          <el-popover trigger="situation" placement="top">
            铺位概况: <p class = "breakword">{{ scope.row.situation }}</p>
            物业信息: <p class = "breakword">{{ scope.row.propertyInfo }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.shopNum }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        showOverflowTooltip
        label="公司名称">
      </el-table-column> -->
      <!-- <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column> -->
      <el-table-column
        prop="state"
        header-align="center"
        align="center"
        width="100"
        label="审核状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 0" size="small" type="danger">未审核</el-tag>
          <el-tag v-else-if="scope.row.state == 1" size="small" type="small">审核通过</el-tag>
          <el-tag v-else size="danger">审核不通过</el-tag>
        </template>
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
          <el-button type="text" size="small" v-if="isAuth('bunk:tshopinfo:update')" @click="addOrUpdateHandle(scope.row.id,false)">修改</el-button>
          <el-button type="text" size="small" v-if="isAuth('bunk:tshopinfo:audit')" @click="auditHandle(scope.row.id,true)">审核</el-button>
          <el-button type="text" size="small" v-if="isAuth('bunk:tshopinfo:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        ProjectIdListOptions: [],
        BigTypeListOptions: [],
        dataForm: {
          key: '',
          projectId: '',
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
      //this.selectTableList('t_project', 'id', 'cbd_name');
      this.selectPorjectList();
      this.selectShopType('0');
    },
    methods: {
      // 获取数据列表
      getDataList(sort) {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
		      limit: this.pageSize,
          shopNum: this.dataForm.shopNum,
          projectId: this.dataForm.projectId,
          bigType: this.dataForm.bigType,
          tags: this.dataForm.tags,
          key: this.dataForm.key,
          orderBy: sort
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshopinfo/list`),
          method: 'get',
          params: params
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list;
            this.totalPage = data.page.totalCount;
            for (let i = 0; i < this.dataList.length; i++) {
              // type内容格式化
              if (this.dataList[i].subType != null && this.dataList[i].subType.length > 0) {
                let typeStr = this.dataList[i].subType;
                let typeArray = typeStr.split(',');
                this.dataList[i].subType = typeArray;
              }
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
      sortChange: function(column) {
        let paramOrder = {
          prop: column.prop,
          order: column.order
        };
        this.getDataList(paramOrder);
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
      // 审核
      auditHandle(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, true);
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
            url: this.$http.adornUrl(`/bunk/tshopinfo/delete`),
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
                  this.ProjectIdListOptions = data.list;
                }
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
      selectShopType(parentId) {
        let paramsV = {
          parentId: parentId
        };
        this.$http({
          url: this.$http.adornUrl(`/format/tformatshoptype/select2`),
          method: 'get',
          params: paramsV
        }).then(({data}) => {
          if (data) {
            this.BigTypeListOptions = data.list;
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
