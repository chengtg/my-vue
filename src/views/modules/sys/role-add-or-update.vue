<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="公司/部门" prop="companyId">
        <template v-if="dataForm.companyId != null && dataForm.companyId != 0" >
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
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="菜单授权" class="z-harfside">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
      </el-form-item>
      <el-form-item size="mini" label="数据授权" class="z-harfside">
        <el-tree
          :data="authList"
          :props="authListTreeProps"
          node-key="id"
          ref="authListTree"
          :default-expand-all="true"
          check-strictly
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils';
  export default {
    data() {
      return {
        visible: false,
        selectcompanyId: '',
        companyOptions: [], // 公司列表
        companyValue: [],
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        authList: [],
        authListTreeProps: {
          label: 'shortName',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          companyId: '',
          remark: ''
        },
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' },
            { max: 100, message: '长度在 100 个字符之内', trigger: 'blur' }
          ],
          remark: [
            { max: 100, message: '长度在 100 个字符之内', trigger: 'blur' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      };
    },
    mounted: function() {
      this.selectCompany();
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId');
        }).then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
            this.$refs.menuListTree.setCheckedKeys([]);
            this.companyValue = [];
          });
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.companyValue = data.role.deptList; // 公司部门
                this.dataForm.roleName = data.role.roleName;
                this.dataForm.remark = data.role.remark;
                this.dataForm.flag = data.role.flag;
                this.dataForm.status = data.role.status;
                this.dataForm.type = data.role.type;
                var idx = data.role.menuIdList.indexOf(this.tempKey);
                if (idx !== -1) {
                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx);
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList);
              }
            });
          }
        });

        this.selectDept();
      },
      // 获取公司或者部门
      handleChange(val) {
        // alert(111);
        this.selectcompanyId = this.companyValue[this.companyValue.length - 1];
        // this.dataForm.companyId(this.selectcompanyId);
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'companyId': this.companyValue[this.companyValue.length - 1],
                'remark': this.dataForm.remark,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
                'authIdList': [].concat(this.$refs.authListTree.getCheckedKeys(), [this.tempKey], this.$refs.authListTree.getHalfCheckedKeys()),
                'flag': this.dataForm.flag || undefined,
                'status': this.dataForm.status || undefined,
                'type': this.dataForm.type || 3
              })
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
    // 公司部门树
    selectDept() {
        var params = {
        };
        this.$http({
          url: this.$http.adornUrl('/sys/syscompany/authtreeList'),
          method: 'get',
          params: params
        }).then(({data}) => {
          this.authList = treeDataTranslate(data.data, 'id');
        }).then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
            this.$refs.authListTree.setCheckedKeys([]);
          });
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                var idx = data.role.authIdList.indexOf(this.tempKey);
                if (idx !== -1) {
                  data.role.authIdList.splice(idx, data.role.authIdList.length - idx);
                }
                this.$refs.authListTree.setCheckedKeys(data.role.authIdList);
              }
            });
          }
        });
      },
      // 查询公司-部门
      selectCompany() {
        var params = {
        };
        this.$http({
            url: this.$http.adornUrl('/sys/syscompany/authtree'),
            method: 'get',
            params: params
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.clearChildren(data.treeList);
              this.companyOptions = [];// 清空
              this.companyOptions = data.treeList;
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

<style scoped>
  .z-harfside{
    display: inline-block;
    width: 49%;    
    vertical-align: top;
  }
</style>
