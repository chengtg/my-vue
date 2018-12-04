<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="上级公司" prop="parentId">
        <template v-if="dataForm.id != null && dataForm.id != 0">
           <el-input v-model="dataForm.parentName" placeholder="上级公司" :disabled="true"></el-input>
        </template>
        <template  v-else>
            <el-cascader
            :options="options"
            v-model="valueCompany"
            filterable
            change-on-select
            clearable
            expand-trigger="click"
            @active-item-change="handleChange"
            style="width:100%"
          >
          </el-cascader>
         </template>
      </el-form-item>
      <el-form-item label="公司名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="公司名称"></el-input>
      </el-form-item>
      <el-form-item label="公司简称" prop="shortName">
          <el-input v-model="dataForm.shortName" placeholder="公司简称"></el-input>
        </el-form-item>
      <el-form-item label="序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="1" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark"  type="textarea"  :rows="4" placeholder="备注"></el-input>
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
        options: [],
        valueCompany: [],
        dataForm: {
          id: 0,
          parentId: '',
          fullName: '',
          shortName: '',
          icon: '',
          orderNum: '',
          remark: '',
          flag: '',
          status: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          createId: '',
          createTime: ''
        },
        dataRule: {
          parentId: [
            { required: true, message: '上级公司不能为空', trigger: 'blur' }
          ],
          fullName: [
            { required: true, message: '公司名称不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          shortName: [
            { required: true, message: '公司简称不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '序号不能为空', trigger: 'blur' }
          ],
          remark: [
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ]
        }
      };
    },
    mounted: function() {
        // this.selectCompany();
    },
    methods: {
      init(id) {
        this.selectCompany();
        this.options = [];// 清空select
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/sys/syscompany/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.data;
                  // alert(this.dataForm);
              }
            });
          }
        });
      },
      handleChange(val) {
        alert(val);
        this.dataForm.parentId = this.valueCompany.pop();
      },
      // 表单提交
      dataFormSubmit() {
        // 社会父节点id
        if (this.valueCompany.length > 0) {
          this.dataForm.parentId = this.valueCompany[this.valueCompany.length - 1];
        }

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'parentId': this.dataForm.parentId,
              'fullName': this.dataForm.fullName,
              'shortName': this.dataForm.shortName,
              'icon': this.dataForm.icon,
              'orderNum': this.dataForm.orderNum,
              'remark': this.dataForm.remark,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'type': 1// 公司
            };
            this.$http({
              url: this.$http.adornUrl(`/sys/syscompany/${!this.dataForm.id ? 'save' : 'update'}`),
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
      selectCompany() {
        var params = {
          type: 1
        };
        this.$http({
            url: this.$http.adornUrl('/sys/syscompany/select'),
            method: 'get',
            params: params
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.clearChildren(data.treeList);
              this.options = [];// 清空
              this.options = data.treeList;
              this.options.unshift({value: 0, label: '添加公司'});
            }
          }).then(() => {
          });
      },
      clearChildren(data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children.length === 0) {
            delete data[i].children;
          } else {
            this.clearChildren(data[i].children);
          }
        }
      }
    }
  };
</script>
