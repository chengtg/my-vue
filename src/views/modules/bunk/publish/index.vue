<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item prop="projectId">
        <el-select v-model="dataForm.projectId" @change="selectShopList" clearable @clear="clearShopList" filterable   placeholder="请选择商业项目">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id"
            :label="item.cbdName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="shopId">
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
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="发布标题" clearable></el-input>
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
        <el-button v-if="isAuth('bunk:tshoppublish:save')" type="primary" @click="addOrUpdateHandle(0 ,'新增')">新增</el-button>
        <el-button v-if="isAuth('bunk:tshoppublish:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change='sortChange'
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
            <b>2、铺位标签:</b><p class="breakword">{{ scope.row.tags }}</p>
            <b>3、其他费用:</b><p class="breakword">{{ scope.row.otherPrice }}</p>
            <b>4、付款周期:</b><p class="breakword">{{ scope.row.paymentCycle }}</p>
            <b>5、招商要求:</b><p class="breakword">{{ scope.row.investRequired }}</p>
            <b>6、其他:</b><p class="breakword">
              要求法人：{{ scope.row.isLegal == 0 ? '否' : '是'}}；
              经营履历：{{ scope.row.isBusinessHistory == 0 ? '否' : '是'}}；
              代理加盟：{{ scope.row.isProxy == 0 ? '否' : '是'}}；
              是否热铺：{{ scope.row.isHot == 0 ? '否' : '是'}}</p>
            <b>7、所属公司:</b><p class="breakword">{{ scope.row.companyName }}</p>
            <div slot="reference">
              <el-button icon="el-icon-info" type="info" plain size="mini">{{ scope.row.shopNum }}</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="发布标题">
      </el-table-column>
      <!-- <el-table-column
        prop="bigTypeName"
        header-align="center"
        align="center"
        label="品牌大类">
      </el-table-column> -->
      <!-- <el-table-column
        prop="subType"
        header-align="center"
        align="center"
        label="品牌小类">
      </el-table-column> -->
      <el-table-column
        prop="applyStartTime"
        header-align="center"
        sortable="custom"
        align="center"
        width="160"
        label="报名开始时间">
      </el-table-column>
      <el-table-column
        prop="applyEndTime"
        sortable="custom"
        header-align="center"
        align="center"
        width="160"
        label="报名结束时间">
      </el-table-column>
      <el-table-column
        prop="shortestLease"
        header-align="center"
        align="center"
        width="110"
        label="最短租期">
      </el-table-column>
      <el-table-column
        prop="floorPrice"
        sortable="custom"
        header-align="center"
        align="center"
        width="100"
        label="底价">
      </el-table-column>
      <el-table-column
        prop="propertyPrice"
        sortable="custom"
        header-align="center"
        align="center"
        width="90"
        label="物业费">
      </el-table-column>
      <el-table-column
        prop="isHot"
        header-align="center"
        align="center"
        width="55"
        label="热铺">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isHot == 0" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="clickNum"
        sortable="custom"
        header-align="center"
        align="center"
        width="90"
        label="点击量">
      </el-table-column>
      <el-table-column
        prop="applyNum"
        sortable="custom"
        header-align="center"
        align="center"
        width="90"
        label="申请量">
      </el-table-column>
      <!-- <el-table-column
        prop="otherPrice"
        header-align="center"
        align="center"
        label="其他费用">
      </el-table-column> -->
      <!-- <el-table-column
        prop="paymentCycle"
        header-align="center"
        align="center"
        label="付款周期">
      </el-table-column> -->
      <!-- <el-table-column
        prop="isLegal"
        header-align="center"
        align="center"
        width="50"
        label="法人">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isLegal === 0" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isBusinessHistory"
        header-align="center"
        align="center"
        width="80"
        label="经营履历">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isBusinessHistory === 0" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isProxy"
        header-align="center"
        align="center"
        width="80"
        label="代理加盟">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isProxy === 0" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="investRequired"
        header-align="center"
        align="center"
        label="招商要求">
      </el-table-column> -->
      <!-- <el-table-column
        prop="isHot"
        header-align="center"
        align="center"
        width="50"
        label="热铺">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isHot === 0" size="small" type="danger">否</el-tag>
          <el-tag v-else size="small">是</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="tags"
        header-align="center"
        align="center"
        label="标签">
      </el-table-column> -->
<!--      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="发布内容">
      </el-table-column>-->
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
        prop="flagType"
        header-align="center"
        align="center"
        width="80"
        label="有效否">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.flag == '0'" size="small" type="danger">否</el-tag>
          <el-tag v-else-if="scope.row.flag == '1'" size="small">是</el-tag>
          <el-tag v-else-if="scope.row.flag == '2'" size="success">结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('bunk:tshoppublish:update')" @click="addOrUpdateHandle(scope.row.id, '修改')">修改</el-button>
          <el-button type="text" size="small" v-if="isAuth('bunk:tshoppublish:audit')" @click="auditHandle(scope.row.id, '审核')">审核</el-button>
          <el-button type="text" size="small" v-if="isAuth('bunk:tshoppublish:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        BigTypeListOptions: [],
        FlagDictOptions: [
          { label: '是', value: '1' },
          { label: '否', value: '0' },
          { label: '结束', value: '2' }
        ],
        dataForm: {
          key: '',
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
		    //this.selectDictList('FLAG_TYPE');
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
          title: this.dataForm.title,
          projectId: this.dataForm.projectId,
          shopId: this.dataForm.shopId,
          flag: this.dataForm.flag,
          isHot: this.dataForm.isHot,
          bigType: this.dataForm.bigType,
          key: this.dataForm.key,
          orderBy: sort
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshoppublish/list`),
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
      addOrUpdateHandle(id, pageTile) {
        if (!pageTile) {
          pageTile = '新增';
        }
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, false, pageTile);
        });
      },
      // 审核
      auditHandle(id, pageTile) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, true, pageTile);
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
            url: this.$http.adornUrl(`/bunk/tshoppublish/delete`),
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
  .breakword{width: 400px;word-wrap:break-word;}
  /* 断句时，不会把长单词挪到下一行，而是直接进行单词内的断句 */
  .breakAll{word-break:break-all;}
  /* 超出部分显示省略号 */
  .ellipsis{text-overflow:ellipsis;overflow:hidden;}
</style>
