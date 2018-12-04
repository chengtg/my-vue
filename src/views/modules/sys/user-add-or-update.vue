<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" :disabled="dataForm.id != 0 " placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="真实名称" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="真实名称"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-if="!dataForm.id" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" v-if="!dataForm.id" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
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
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="所属平台" prop="appId">
        <el-input v-model="dataForm.appId" placeholder="BASE-ADMIN" ></el-input>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import { isMobile } from '@/utils/validate';
  import { isEmail, isMobile } from '@/utils/validate';
  export default {
    data() {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'));
        } else if (value.length < 3) {
          callback(new Error('密码长度至少为三位'));
        } else {
          callback();
        }
      };
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'));
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'));
        } else {
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'));
        } else {
          callback();
        }
      };
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'));
        } else {
          callback();
        }
      };
      return {
        visible: false,
        roleList: [],
        companyOptions: [], // 公司列表
        companyValue: [],
        dataForm: {
          id: 0,
          userName: '',
          realName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          appId: 'BASE-ADMIN'
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实名称不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 100 个字符之内', trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 100 个字符之内', trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' },
            { max: 100, message: '长度在 100 个字符之内', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          appId: [
            { required: true, message: '所属平台不能为空', trigger: 'blur' },
            { max: 100, message: '长度在 100 个字符之内', trigger: 'blur' }
          ]
        }
      };
    },
    mounted: function() {
      this.selectCompany();
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.roleList = data && data.code === 0 ? data.list : [];
        }).then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
            this.companyValue = [];
          });
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.companyValue = data.user.deptList; // 公司部门
                this.dataForm.userName = data.user.username;
                this.dataForm.realName = data.user.realName;
                this.dataForm.salt = data.user.salt;
                this.dataForm.email = data.user.email;
                this.dataForm.mobile = data.user.mobile;
                this.dataForm.roleIdList = data.user.roleIdList;
                this.dataForm.status = data.user.status;
                this.dataForm.appId = data.user.appId;
              }
            });
          }
        });
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'realName': this.dataForm.realName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                'appId': this.dataForm.appId,
                'companyId': this.companyValue[this.companyValue.length - 1]
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
      },   // 查询公司-部门
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
      },
      // 获取公司或者部门
      handleChange(val) {
        // alert(111);
        this.selectcompanyId = this.companyValue[this.companyValue.length - 1];
        // this.dataForm.companyId(this.selectcompanyId);
      }
    }
  };
</script>
