<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="公司名称" prop="companyId">
          <template v-if="dataForm.companyId != null && dataForm.companyId != 0">
              <el-input v-model="dataForm.companyName" placeholder="公司名称" :disabled="true"></el-input>
           </template>
           <template  v-else>
                <el-cascader
                  :options="companyOptions"
                  v-model="companyValue"
                  filterable
                  change-on-select
                  clearable
                  expand-trigger="click"
                  @change="handleChange"
                  style="width:100%"
                >
                </el-cascader>
            </template>
          </el-form-item>
         
      <el-form-item label="上级部门" prop="parentId">
          <template v-if="dataForm.id != null && dataForm.id != 0">
              <el-input v-model="dataForm.parentName" placeholder="上级部门" :disabled="true"></el-input>
           </template>
           <template  v-else>
               <el-cascader
               :options="deptOptions"
               v-model="deptValue"
               filterable
               change-on-select
               clearable
               expand-trigger="click"
               @change="handleChangeDept"
               style="width:100%"
             >
             </el-cascader>
            </template>
      </el-form-item>
      <el-form-item label="部门名称" prop="fullName">
        <el-input v-model="dataForm.fullName" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="部门简称" prop="shortName">
          <el-input v-model="dataForm.shortName" placeholder="部门简称"></el-input>
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
        companyOptions: [], // 公司列表
        companyValue: [],
        selectdeptId: '',
        selectcompanyId: '',
        deptOptions: [], // 公司列表
        deptValue: [],
        visible: false,
        dataForm: {
          id: 0,
          parentId: '',
          fullName: '',
          icon: '',
          orderNum: '',
          remark: '',
          flag: '',
          status: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          companyId: '',
          createId: '',
          createTime: '',
          shortName: ''
        },
        dataRule: {
          companyId: [
            { required: true, message: '公司名称不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '上级部门不能为空', trigger: 'blur' }
          ],
          fullName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          shortName: [
            { required: true, message: '部门简称不能为空', trigger: 'blur' },
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
      // this.selectDept();
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.selectCompany();
          this.selectDept();
          this.$refs['dataForm'].resetFields();
          this.companyValue = [];
          this.deptValue = [];
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/sys/syscompany/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.data;
              }
            });
          }
        });
      },
      handleChange(val) {
        // alert(111);
        this.selectcompanyId = this.companyValue[this.companyValue.length - 1];
        this.selectDept(this.selectcompanyId);
      },
      handleChangeDept(val) {
        this.selectdeptId = this.deptValue[this.deptValue.length - 1];
      },
      // 表单提交
      dataFormSubmit() {
        // 部门父节点id
        if (this.deptValue.length > 0) {
          this.dataForm.parentId = this.deptValue[this.deptValue.length - 1];
        }
        // 公司ID
        if (this.companyValue.length > 0) {
          this.dataForm.companyId = this.companyValue[this.companyValue.length - 1];
        }
  
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'parentId': this.dataForm.parentId || this.selectdeptId,
              'fullName': this.dataForm.fullName,
              'icon': this.dataForm.icon,
              'orderNum': this.dataForm.orderNum,
              'shortName': this.dataForm.shortName,
              'remark': this.dataForm.remark,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'companyId': this.dataForm.companyId || this.selectcompanyId,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'type': 2
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
      // 查询公司
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
              this.companyOptions = [];// 清空
              this.companyOptions = data.treeList;
              // this.options.unshift({value: 0, label: '添加公司'});
            }
          });
      },
      // 上级部门
      selectDept(companyId) {
        var params = {
          companyId: companyId || '-1',
          type: 2// 部门
        };
        this.$http({
            url: this.$http.adornUrl('/sys/syscompany/select'),
            method: 'get',
            params: params
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.clearChildren(data.treeList);
              this.deptOptions = [];// 清空
              this.deptOptions = data.treeList;
              this.deptOptions.unshift({value: 0, label: '无上级部门  '});
            }
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
