<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
	     <el-form-item label="问题描述" prop="description">
	          <el-input type="textarea" v-model="dataForm.description" placeholder="问题描述"></el-input>
       </el-form-item>
	     <el-form-item label="问题答疑" prop="answer">
	          <el-input type="textarea" :rows="5"  v-model="dataForm.answer" placeholder="问题答疑"></el-input>
      </el-form-item>
      <el-form-item label="是否有效" prop="flag">
          <el-select v-model="dataForm.flag"  placeholder="请选择是否有效">
            <el-option
              v-for="item in FlagDictOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="1" label="排序"></el-input-number>
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
        FlagDictOptions: [
          {value: '1',
           label: '有效'},
          {value: '0',
            label: '无效'}
        ],
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          description: '',
          answer: '',
          orderNum: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          companyId: ''
        },
        dataRule: {
          description: [
            {required: true, message: '问题描述不能为空', trigger: 'blur'},
            { max: 1000, message: '长度在 1000 个字符之内', trigger: 'blur' }
          ],
          answer: [
            {required: true, message: '问题答疑不能为空', trigger: 'blur'},
            { max: 1000, message: '长度在 1000 个字符之内', trigger: 'blur' }
          ],
          flag: [
            {required: true, message: '是否有效不能为空', trigger: 'blur'}
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
              url: this.$http.adornUrl(`/bunk/tqainfo/info/${this.dataForm.id}`),
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
              'description': this.dataForm.description,
              'answer': this.dataForm.answer,
              'orderNum': this.dataForm.orderNum,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'companyId': this.dataForm.companyId
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tqainfo/${!this.dataForm.id ? 'save' : 'update'}`),
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
