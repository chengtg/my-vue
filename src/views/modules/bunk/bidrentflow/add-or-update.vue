<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="流程名称" prop="flowDesc">
           <el-input v-model="dataForm.flowDesc" type="textarea" :rows="2"  placeholder="流程名称"></el-input>
       </el-form-item>
      <el-form-item label="序号" prop="orderNum">
           <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="1" label="序号"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="5"  placeholder="备注"></el-input>
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
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          remark: '',
          flowDesc: '',
          orderNum: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          companyId: ''
        },
        dataRule: {
          flowDesc: [
            {required: true, message: '流程名称不能为空', trigger: 'blur'},
            { max: 1000, message: '长度在 1000 个字符之内', trigger: 'blur' }
          ],
          remark: [
            { max: 1000, message: '长度在 1000 个字符之内', trigger: 'blur' }
          ]
        }
      };
    },
	mounted: function() {
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/bunk/tbidrentflow/info/${this.dataForm.id}`),
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
              'remark': this.dataForm.remark,
              'flowDesc': this.dataForm.flowDesc,
              'orderNum': this.dataForm.orderNum,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'companyId': this.dataForm.companyId
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tbidrentflow/${!this.dataForm.id ? 'save' : 'update'}`),
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
