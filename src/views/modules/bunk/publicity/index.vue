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
        <el-select v-model="dataForm.shopId" clearable  placeholder="请选择铺位">
          <el-option
            v-for="item in ShopListOptions"
            :key="item.id"
            :label="item.shopNum"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名类型" prop="name">
        <el-select v-model="dataForm.type"  clearable placeholder="请选择铺位">
          <el-option
            v-for="item in TYPE_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人名称" prop="phone">
        <el-input v-model="dataForm.key" placeholder="个人姓名/公司名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('bunk:tmerchantsapplypublicity:save')" type="primary" @click="addOrUpdateHandle('',false)">新增</el-button>
        <el-button v-if="isAuth('bunk:tmerchantsapplypublicity:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="objectName"
        header-align="center"
        align="left"
        label="竞租对象">
      </el-table-column>
      <el-table-column
        prop="applyTime"
        header-align="center"
        align="left"
        label="报名时间">
      </el-table-column>
   <!--   <el-table-column
        prop="startTime"
        header-align="center"
        align="left"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="结束时间">
      </el-table-column>-->
      <el-table-column
        prop="modeType"
        header-align="center"
        align="center"
        label="经营模式"
        width="100">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.modeType == 2" size="small" type="small">代理加盟</el-tag>
            <el-tag v-else-if="scope.row.modeType == 1" size="danger">自主品牌</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="bigTypeName"
        header-align="center"
        align="center"
        label="品牌大类"
        width="80">
      </el-table-column>
      <el-table-column
        prop="subTypeName"
        header-align="center"
        align="center"
        label="品牌小类">
      </el-table-column>
<!--      <el-table-column
        prop="idNumber"
        header-align="center"
        align="center"
        label="身份证号码">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="公司名称">
      </el-table-column>-->
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="竞租类型"
        width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 2" size="small" type="small">商家</el-tag>
          <el-tag v-else-if="scope.row.type == 1" size="danger">个人</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column
        prop="businessLicense"
        header-align="center"
        align="center"
        label="营业执照">
      </el-table-column>
      <el-table-column
        prop="socialUnifiedCreditNumber"
        header-align="center"
        align="center"
        label="社会统一信用号码">
      </el-table-column>
      <el-table-column
        prop="legalPersonName"
        header-align="center"
        align="center"
        label="法人姓名">
      </el-table-column>
      <el-table-column
        prop="isFirst"
        header-align="center"
        align="center"
        label="是否首次开店">
      </el-table-column>-->
<!--      <el-table-column
        prop="experience"
        header-align="center"
        align="center"
        label="经验履历">
      </el-table-column>-->
 <!--     <el-table-column
        prop="contactName"
        header-align="center"
        align="center"
        label="联系人姓名">
      </el-table-column>
      <el-table-column
        prop="contactPhone"
        header-align="center"
        align="center"
        label="联系人电话">
      </el-table-column>
      <el-table-column
        prop="contactAddress"
        header-align="center"
        align="center"
        label="联系地址">
      </el-table-column>-->
<!--      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="商户id">
      </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id,true)">修改</el-button>
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
        TYPE_Options: [
          {
            value: '1',
            label: '个人'
          }, {
            value: '2',
            label: '商家'
          }
        ],
        dataForm: {
          key: '',
          projectId: '',
          shopId: '',
          type: '',
          name: '',
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
          projectId: this.dataForm.projectId,
          shopId: this.dataForm.shopId,
          type: this.dataForm.type,
          key: this.dataForm.key
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tmerchantsapplypublicity/list`),
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
        this.clearShopList();
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshopinfo/selectByProjectIdAndOther/` + projectId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
            this.ShopListOptions = data.list;
          }
        });
      },
      clearShopList() {
        this.ShopListOptions = [];
        this.dataForm.shopId = '';
      },
      // 新增 / 修改
      addOrUpdateHandle(id, isUpdate) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, isUpdate);
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
            url: this.$http.adornUrl(`/bunk/tmerchantsapplypublicity/delete`),
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
      }
    }
  };
</script>
