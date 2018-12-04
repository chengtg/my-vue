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
        <el-select v-model="dataForm.shopId"  clearable placeholder="请选择铺位">
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
      <el-form-item label="复审状态" prop="secondStatus">
        <el-select v-model="dataForm.secondStatus"  clearable placeholder="复审状态">
          <el-option
            v-for="item in STATUS_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="竞租成功" prop="isSucceed">
        <el-select v-model="dataForm.isSucceed"  clearable placeholder="竞租成功">
          <el-option
            v-for="item in SUCCEED_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="申请人名称" prop="phone">
        <el-input v-model="dataForm.key" placeholder="个人姓名/公司名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
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
            label="项目">
          </el-table-column>
          <el-table-column
            prop="shopNum"
            header-align="center"
            align="left"
            label="铺位">
            <template slot-scope="scope">
          <el-popover trigger="situation" placement="top">
            <b>1、品牌类别:</b><p class="breakword">{{ scope.row.bigTypeName }} - {{ scope.row.subTypeName }}</p>
            <div slot="reference">
              <el-button icon="el-icon-info" type="info" plain size="mini">{{ scope.row.shopNum }}</el-button>
            </div>
          </el-popover>
        </template>
          </el-table-column>
      <el-table-column
        prop="isSucceed"
        header-align="center"
        align="center"
        width="80"
        label="成功竞租">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSucceed == 0" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        width="80"
        label="报名类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1" size="small" type="danger">个人</el-tag>
          <el-tag v-else size="small">商家</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="objectName"
          header-align="center"
          align="left"
          label="报名对象">
          <template slot-scope="scope">
          <el-popover trigger="situation" placement="top">
            <b v-show="scope.row.type == 1">1、身份证号码:</b><p v-show="scope.row.type == 1" class="breakword">{{ scope.row.idNumber }}</p>
            <b v-show="scope.row.type == 1">2、联系人姓名:</b><p v-show="scope.row.type == 1" class="breakword">{{ scope.row.contactName }}</p>
            <b v-show="scope.row.type == 1">3、联系人电话:</b><p v-show="scope.row.type == 1" class="breakword">{{ scope.row.contactPhone }}</p>
            <b v-show="scope.row.type == 1">4、联系地址:</b><p v-show="scope.row.type == 1" class="breakword">{{ scope.row.contactAddress }}</p>
            <b v-show="scope.row.type == 1">5、报名时间:</b><p v-show="scope.row.type == 1" class="breakword">{{ scope.row.applyTime }}</p>
            <b v-show="scope.row.type == 2">1、营业执照:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.businessLicense }}</p>
            <b v-show="scope.row.type == 2">2、社会统一信用号码:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.socialUnifiedCreditNumber }}</p>
            <b v-show="scope.row.type == 2">3、法人姓名:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.legalPersonName }}</p>
            <b v-show="scope.row.type == 2">4、联系人姓名:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.contactName }}</p>
            <b v-show="scope.row.type == 2">5、联系人电话:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.contactPhone }}</p>
            <b v-show="scope.row.type == 2">6、联系地址:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.contactAddress }}</p>
            <b v-show="scope.row.type == 2">7、报名时间:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.applyTime }}</p>
            <div slot="reference">
              <el-button icon="el-icon-info" type="info" plain size="mini">{{ scope.row.objectName }}</el-button>
            </div>
          </el-popover>
        </template>
        </el-table-column>
          <el-table-column
            prop="isFirst"
            header-align="center"
            align="center"
            width="80"
            label="首次开店">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isFirst === 0" size="small" type="danger">否</el-tag>
              <el-tag v-else size="small">是</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="rentAcceptance"
            sortable="custom"
            header-align="center"
            align="center"
            width="110"
            label="接受租金">
          </el-table-column>
          <el-table-column
            prop="expectedLeaseTime"
            sortable="custom"
            header-align="center"
            align="center"
            width="110"
            label="期望租期">
          </el-table-column>
        <el-table-column
          prop="preAuditStatus"
          header-align="center"
          align="left"
          label="预审状态">
          <template slot-scope="scope">
            <el-popover trigger="situation" placement="top">
              <b>1、预审信息:</b><p class="breakword">{{ scope.row.preAuditInfo }}</p>
              <b>2、预审人:</b><p class="breakword">{{ scope.row.preUserName }}</p>
              <b>3、预审时间:</b><p class="breakword">{{ scope.row.preAuditTime }}</p>
              <div slot="reference">
                <el-button v-if="scope.row.preAuditStatus == 0" type="warning" plain icon="el-icon-warning" size="mini">未审核</el-button>
                <el-button v-else-if="scope.row.preAuditStatus == 1" type="success" plain icon="el-icon-success" size="mini">审核通过</el-button>
                <el-button v-else type="danger" icon="el-icon-danger" plain size="mini">审核失败</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="secondAuditStatus"
          header-align="center"
          align="left"
          label="复审状态">
          <template slot-scope="scope">
            <el-popover trigger="situation" placement="top">
              <b>1、复审信息:</b><p class="breakword">{{ scope.row.secondAuditInfo }}</p>
              <b>2、复审审核人:</b><p class="breakword">{{ scope.row.secondUserName }}</p>
              <b>3、复审时间:</b><p class="breakword">{{ scope.row.secondAuditTime }}</p>
              <div slot="reference">
                <el-button v-if="scope.row.secondAuditStatus == 0" type="warning" plain icon="el-icon-warning" size="mini">未审核</el-button>
                <el-button v-else-if="scope.row.secondAuditStatus == 1" type="success" plain icon="el-icon-success" size="mini">审核通过</el-button>
                <el-button v-else type="danger" icon="el-icon-danger" plain size="mini">审核不通过</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="isAuth('bunk:tmerchantsapply:info')" size="small" @click="viewHandle(scope.row.id)">查看</el-button>
          <el-button type="text" v-if="isAuth('bunk:tmerchantsapply:secondstate')" size="small" @click="auditHandle(scope.row.id)">审核</el-button>
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
        STATUS_Options: [
          {
            value: '0',
            label: '未审核'
          }, {
            value: '1',
            label: '审核成功'
          }, {
            value: '2',
            label: '审核不通过'
          }
        ],
        SUCCEED_Options: [
          {
            value: '1',
            label: '成功'
          }, {
            value: '0',
            label: '失败'
          }
        ],

        dataForm: {
          key: '',
          projectId: '',
          shopId: '',
          type: '',
          name: '',
          perStatus: '',
          secondStatus: '',
          isSucceed: ''
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
          preAuditStatus: 1,
          secondAuditStatus: this.dataForm.secondStatus, // 复审审核状态
          isSucceed: this.dataForm.isSucceed,
          type: this.dataForm.type,
          isFirst: this.dataForm.isFirst,
          key: this.dataForm.key
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tmerchantsapply/list`),
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
          this.$refs.addOrUpdate.init(id, '0');
        });
      },
      // 查询
      viewHandle(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, 2, '查看');
        });
      },
      // 审核
      auditHandle(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, 4, '审核');
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
            url: this.$http.adornUrl(`/bunk/tmerchantsapply/delete`),
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
      }
    }
  };
</script>
