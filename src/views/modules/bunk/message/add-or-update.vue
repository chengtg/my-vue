<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="模板标题" prop="title">
          <el-input v-model="dataForm.title" placeholder="标题内容"></el-input>
        </el-form-item>
        <el-form-item label="消息类型" prop="type">
          <el-select v-model="dataForm.type" placeholder="消息类型">
            <el-option
              v-for="item in MESSAGE_TYPE_Options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容" prop="content">
            <el-input type="textarea"  :autosize="{ minRows:3, maxRows: 6}" v-model="dataForm.content" placeholder="消息内容"></el-input>
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
        MESSAGE_TYPE_Options: [], // 消息类型
        SHOP_PUSH_LIST_Options: [], // 审核通过的铺位发布列表
        MERCHANTS_Options: [], // 消息接受者

        visible: false,
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          bidRentPublicityId: '',
          pushTitle: '',
          type: '1',
          title: '',
          isSend: false,
          content: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          companyId: '',
          parentId: 0,
          recipientIdList: [] // 接收人
        },
        dataRule: {
          isSend: [
            { required: true, message: '是否立即发送不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '状消息类型不能为空', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '消息标题不能为空', trigger: 'blur' }
          ],
          bidRentPublicityId: [
            { required: true, message: '铺位发布消息不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '消息内容不能为空', trigger: 'blur' }
          ]
        }
      };
    },
	mounted: function() {
    this.selectDictList('MESSAGE_TYPE');
    this.selectShoppublish();
    },
    methods: {
      init(id) {
        //
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/bunk/tmessagetemplate/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.entity;
                  this.dataForm.isSend = data.entity.isSend == '1';
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
              'bidRentPublicityId': this.dataForm.bidRentPublicityId,
              'type': this.dataForm.type,
              'title': this.dataForm.title,
              'isSend': this.dataForm.isSend ? '1' : '0',
              'content': this.dataForm.content,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'companyId': this.dataForm.companyId,
              'parentId': this.dataForm.parentId,
              'recipientIdList': this.dataForm.recipientIdList
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tmessagetemplate/${!this.dataForm.id ? 'save' : 'update'}`),
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
            this.MESSAGE_TYPE_Options = data;
          }
        });
      },
      // 根据数据字典类型 查询数据字典列表
      selectShoppublish() {
        let param = {
           state: '1' // 审核通过
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshoppublish/messagelist`),
          method: 'get',
          params: param
        }).then(({data}) => {
          if (data) {
            this.SHOP_PUSH_LIST_Options = data;
          }
        });
      }

    }
  };
  </script>
