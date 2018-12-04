<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item  label="上级品牌" prop="parentId">
          <el-cascader
            :options="options"
            v-model="valueList"
            filterable
            change-on-select
            clearable="true"
            expand-trigger="click"
            @active-item-change="handleChange"
          >
          </el-cascader>
        </el-form-item>
      <el-form-item label="品牌名称" prop="brandName">
        <el-input v-model="dataForm.brandName" placeholder="品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="是否有效" prop="flag">
        <el-select v-model="dataForm.flag" placeholder="请选择是否有效">
          <el-option
            v-for="item in FlagDictOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="序号" prop="orderNum">
            <el-input-number v-model="dataForm.orderNum" :min="1" placeholder="请输入序号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        FlagDictOptions: [],
        valueList: [],
        dataForm: {
          id: 0,
          parentId: '',
          flag: '1',
          status: '1',
          brandName: '',
          orderNum: '',
          note: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          companyId: ''
        },
        dataRule: {
          parentId: [
            { required: true, message: '上级ID不能为空', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ],
          brandName: [
            { required: true, message: '品牌名称不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '序号不能为空', trigger: 'blur' }
          ]
        }
      };
    },
	mounted: function() {
		this.selectDictList('FLAG_TYPE');
    },
    methods: {
      init(id) {
        // 查询树
        this.selectTree();
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/format/tformatshoptype/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.tFormatShopType;
                  data.valueList.pop();
                  this.valueList = data.valueList;
              }
            });
          }
        });
      },
      handleChange(val) {
        // alert(val);
        this.dataForm.parentId = this.valueList.pop();
      },
      // 表单提交
      dataFormSubmit() {
        this.dataForm.parentId = this.valueList[this.valueList.length - 1];
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'parentId': this.dataForm.parentId,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'brandName': this.dataForm.brandName,
              'orderNum': this.dataForm.orderNum,
              'note': this.dataForm.note,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'companyId': this.dataForm.companyId
            };
            this.$http({
              url: this.$http.adornUrl(`/format/tformatshoptype/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: params
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit('refreshDataList');
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          }
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
      },
      selectTree() {
        this.$http({
          url: this.$http.adornUrl('/format/tformatshoptype/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = [];// 清空
            this.options = data.treeList;
            this.options.unshift({value: 0, label: '品牌类型'});
          }
        });
      }
    }
  };
  </script>
