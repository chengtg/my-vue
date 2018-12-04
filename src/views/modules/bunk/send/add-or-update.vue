<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
	     <el-form-item label="消息标题" prop="messageTemplateId">
	          <el-input v-model="dataForm.messageTemplateId" placeholder="消息标题"></el-input>
      </el-form-item>
	     <el-form-item label="接收人" prop="recipientId">
	          <el-input v-model="dataForm.recipientId" placeholder="接收人"></el-input>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime">
           <el-input v-model="dataForm.sendTime" placeholder="发送时间"></el-input>
      </el-form-item>
	     <el-form-item label="是否已阅读" prop="isRead">
           <el-select v-model="dataForm.isRead"   placeholder="是否已阅读">
              <el-option
                v-for="item in YES_OR_NO_Options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
      </el-form-item>
	     <el-form-item label="阅读时间" prop="readTime">
	          <el-input v-model="dataForm.readTime" placeholder="阅读时间"></el-input>
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
        YES_OR_NO_Options: [{
          value: '1',
          label: '是'
        },
          {
            value: '0',
            label: '否'
          }
        ],
        visible: false,
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          messageTemplateId: '',
          recipientId: '',
          isRead: '0',
          sendTime: '',
          readTime: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          companyId: ''
        },
        dataRule: {
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
              url: this.$http.adornUrl(`/bunk/tmessagesend/info/${this.dataForm.id}`),
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
              'messageTemplateId': this.dataForm.messageTemplateId,
              'recipientId': this.dataForm.recipientId,
              'isRead': this.dataForm.isRead,
              'sendTime': this.dataForm.sendTime,
              'readTime': this.dataForm.readTime,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'companyId': this.dataForm.companyId
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tmessagesend/${!this.dataForm.id ? 'save' : 'update'}`),
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
