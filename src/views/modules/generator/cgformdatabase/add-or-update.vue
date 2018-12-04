<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    top="8em">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="数据库名称" prop="database">
        <el-input v-model="dataForm.database" placeholder="数据库名称"></el-input>
      </el-form-item>
      <el-form-item label="公司/部门" prop="companyId">
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
      </el-form-item>
      <el-form-item label="系统名称" prop="appName">
        <el-input v-model="dataForm.appName" placeholder="应用系统名称"></el-input>
      </el-form-item>
      <el-form-item label="数据库类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="数据库类型" style="width:100%">
              <el-option label="SqlServer" value="SqlServer" ></el-option>
              <el-option label="Oracle" value="Oracle" ></el-option>
              <el-option label="MySQL" value="MySQL" ></el-option>
              <el-option label="PostgreSQL" value="PostgreSQL" ></el-option>
              <el-option label="Redis" value="Redis" ></el-option>
              <el-option label="Mongodb" value="Mongodb" ></el-option>
              <el-option label="Other" value="Other" ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="完整url" prop="url">
        <el-input v-model="dataForm.url" placeholder="数据库完整url"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="用户名称"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="生成新项目" prop="isApp">
        <el-radio-group v-model="dataForm.isApp">
          <el-radio :label="2">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="1" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="dataForm.desc" placeholder="备注"></el-input>
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
        visible: false,
        dataForm: {
          id: 0,
          database: '',
          appName: '',
          type: '',
          url: '',
          userName: '',
          password: '',
          orderNum: '',
          isApp: '',
          desc: '',
          status: '',
          flag: '',
          createId: '',
          companyId: ''
        },
        dataRule: {
          database: [
            { required: true, message: '数据库名称不能为空', trigger: 'blur' }
          ],
          appName: [
            { required: true, message: '应用系统名称不能为空', trigger: 'blur' }
          ],
          // type: [
          //   { required: true, message: '数据库类型不能为空', trigger: 'blur' }
          // ],
          url: [
            { required: true, message: '数据库完整url不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '序号不能为空', trigger: 'blur' }
          ],
          isApp: [
            { required: true, message: '是否生成新的项目不能为空', trigger: 'blur' }
          ]
          // desc: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          // ],
          // companyId: [
          //   { required: true, message: '公司/部门不能为空', trigger: 'blur' }
          // ]
        }
      };
    },
    mounted: function() {
      this.selectCompany();
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.companyValue = [];
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/generator/cgformdatabase/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.cgformDatabase;
                  this.companyValue = data.cgformDatabase.deptList; // 公司部门
              }
            });
          }
        });
      },
      // 获取公司或者部门
      handleChange(val) {
        // alert(111);
        this.selectcompanyId = this.companyValue[this.companyValue.length - 1];
        // this.dataForm.companyId(this.selectcompanyId);
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
              this.companyOptions = [];// 清空
              this.companyOptions = data.treeList;
            }
          });
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'database': this.dataForm.database,
              'appName': this.dataForm.appName,
              'type': this.dataForm.type,
              'url': this.dataForm.url,
              'userName': this.dataForm.userName,
              'password': this.dataForm.password,
              'orderNum': this.dataForm.orderNum,
              'isApp': this.dataForm.isApp,
              'desc': this.dataForm.desc,
              'status': this.dataForm.status || 1,
              'flag': this.dataForm.flag || 1,
              'createId': this.dataForm.createId,
              'companyId': this.dataForm.companyId || this.companyValue[this.companyValue.length - 1]
            };
            this.$http({
              url: this.$http.adornUrl(`/generator/cgformdatabase/${!this.dataForm.id ? 'save' : 'update'}`),
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
      }
    }
  };
</script>
