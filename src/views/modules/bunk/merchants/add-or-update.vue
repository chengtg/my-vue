<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
	     <el-form-item label="用户名" prop="name">
	     <el-input v-model="dataForm.name" placeholder="用户名"></el-input>
      </el-form-item>
	     <el-form-item label="手机号" prop="phone">
	     <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
	     <el-form-item label="邮箱" prop="email">
	     <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>


      <el-form-item label="用户等级" prop="level">
         <el-select v-model="dataForm.level"  placeholder="请选择用户等级">
           <el-option
             v-for="item in 	LEAVEL_TYPE_Options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
      </el-form-item>
	     <el-form-item label="QQ" prop="qq">
	     <el-input v-model="dataForm.qq" placeholder="QQ"></el-input>
      </el-form-item>
	     <el-form-item label="真实姓名" prop="realName">
	     <el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
      </el-form-item>
	     <el-form-item label="性别" prop="sex">
         <el-radio-group v-model="dataForm.sex">
           <el-radio :label="'1'">男</el-radio>
           <el-radio :label="'2'">女</el-radio>
         </el-radio-group>
      </el-form-item>
	     <el-form-item label="联系地址" prop="address">
	     <el-input v-model="dataForm.address" placeholder="联系地址"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate';
  export default {
    data() {
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
        LEAVEL_TYPE_Options: [], // 会员等级
        visible: false,
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          name: '',
          phone: '',
          email: '',
          password: '',
          level: '',
          qq: '',
          msn: '',
          realName: '',
          sex: '',
          address: '',
          desc: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          companyId: '',
          photo: ''
        },
        dataRule: {
          name:[
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          phone:[
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          email:[
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          realName:[
            { required: true, message: '真实姓名不能为空', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
          ],
          address:[
            { required: true, message: '联系地址不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          sex:[
            { required: true, message: '性别不能为空', trigger: 'change' }
          ],
          level:[
            { required: true, message: '用户等级不能为空', trigger: 'change' }
          ]
        }
      };
    },
	mounted: function() {
    this.selectDictList('LEAVEL_TYPE');
    this.selectDictList('SEX_TYPE');
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.entity;
              }
            });
          }
        });
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'name': this.dataForm.name,
              'phone': this.dataForm.phone,
              'email': this.dataForm.email,
              'password': this.dataForm.password,
              'level': this.dataForm.level,
              'qq': this.dataForm.qq,
              'msn': this.dataForm.msn,
              'realName': this.dataForm.realName,
              'sex': this.dataForm.sex,
              'address': this.dataForm.address,
              'desc': this.dataForm.desc,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'companyId': this.dataForm.companyId,
              'photo': this.dataForm.photo
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsinfo/${!this.dataForm.id ? 'save' : 'update'}`),
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
            this.LEAVEL_TYPE_Options = data;
          }
        });
      }

    }
  };
  </script>
