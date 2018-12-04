<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="报名类别" prop="level">
        <el-select v-model="dataForm.type"  placeholder="请选择类别">
          <el-option
            v-for="item in 	RENT_TYPE_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="公司名称/个人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号码" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!--<el-button v-if="isAuth('bunk:tmerchantsbidrent:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <el-button v-if="isAuth('bunk:tmerchantsbidrent:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
 <!--     <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="用户账号">
      </el-table-column>-->
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        width="80"
        label="报名类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1" size="small" type="danger">个人</el-tag>
          <el-tag v-else-if="scope.row.type == 2" size="small">商户</el-tag>
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
            <b v-show="scope.row.type == 2">1、营业执照:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.businessLicense }}</p>
            <b v-show="scope.row.type == 2">2、社会统一信用号码:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.socialUnifiedCreditNumber }}</p>
            <b v-show="scope.row.type == 2">3、法人姓名:</b><p v-show="scope.row.type == 2" class="breakword">{{ scope.row.legalPersonName }}</p>
            <div slot="reference">
              <el-button icon="el-icon-info" type="info" plain size="mini">{{ scope.row.objectName }}</el-button>
            </div>
          </el-popover>
        </template>
        </el-table-column>



      <!-- <el-table-column  header-align="center" label="个人">
        <el-table-column
          prop="realName"
          header-align="center"
          align="center"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="idNumber"
          header-align="center"
          align="center"
          label="身份证号码">
        </el-table-column>
      </el-table-column>
      <el-table-column  header-align="center" label="商户">
        <el-table-column
          prop="companyName"
          header-align="center"
          align="center"
          label="公司名称">
        </el-table-column>
        <el-table-column
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
      </el-table-column> -->
      <el-table-column
        prop="isFirst"
        header-align="center"
        align="center"
        width="80"
        label="首次开店">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isFirst == 1" size="small" type="small">是</el-tag>
          <el-tag v-else-if="scope.row.isFirst == 0" size="danger">否</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="experience"
        header-align="center"
        align="center"
        label="经验履历">
      </el-table-column> -->
      <el-table-column
        prop="contactName"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="联系人姓名">
      </el-table-column>
      <el-table-column
        prop="contactPhone"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="联系人电话">
      </el-table-column>
      <el-table-column
        prop="contactAddress"
        header-align="center"
        align="left"
        showOverflowTooltip
        label="联系地址">
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

        RENT_TYPE_Options: [{
          value: '1',
          label: '个人'
        }, {
          value: '2',
          label: '商家'
        }],

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

    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        var params = {
          page: this.pageIndex,
		      limit: this.pageSize,
          name: this.dataForm.name,
          contactPhone: this.dataForm.phone,
          type: this.dataForm.type,
          key: this.dataForm.key
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tmerchantsbidrent/list`),
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
            url: this.$http.adornUrl(`/bunk/tmerchantsbidrent/delete`),
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
