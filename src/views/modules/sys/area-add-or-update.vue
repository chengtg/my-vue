<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item  label="上级区域" prop="valueArea">
        <el-cascader
          :options="options"
          v-model="valueArea"
          filterable
          change-on-select
          clearable
          expand-trigger="click"  >
          <!--@active-item-change="handleChange"-->

        </el-cascader>
      </el-form-item>
      <el-form-item label="区域名称" prop="areaName">
        <el-input v-model="dataForm.areaName" placeholder="区域名称"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="1" label="排序号"></el-input-number>
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
        valueArea: [],
        dataForm: {
          id: 0,
          parentId: '',
          areaName: '',
          icon: '',
          orderNum: '',
          flag: '',
          status: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          companyId: '',
          createId: '',
          createTime: ''
        },
        dataRule: {
          parentId: [
            { required: true, message: '上级区域不能为空', trigger: 'blur' }
          ],
          areaName: [
            { required: true, message: '区域名称不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '序号不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    mounted: function() {
      this.areaList();
    },
    methods: {
      init(id) {
        this.options = [];// 清空
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/sysarea/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.parentId = data.sysArea.parentId;
                this.dataForm.areaName = data.sysArea.areaName;
                this.dataForm.icon = data.sysArea.icon;
                this.dataForm.orderNum = data.sysArea.orderNum;
                this.dataForm.flag = data.sysArea.flag;
                this.dataForm.status = data.sysArea.status;
                this.dataForm.updateId = data.sysArea.updateId;
                this.dataForm.updateTime = data.sysArea.updateTime;
                this.dataForm.deptId = data.sysArea.deptId;
                this.dataForm.companyId = data.sysArea.companyId;
                this.dataForm.createId = data.sysArea.createId;
                this.dataForm.createTime = data.sysArea.createTime;
                data.valueArea.pop();
                this.valueArea = data.valueArea;
              }
            });
          }
        });
      },
      areaList() {
        this.$http({
          url: this.$http.adornUrl('/sys/sysarea/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = [];// 清空
            this.options = data.treeList;
            this.options.unshift({value: 0, label: '添加省份'});
          }
        });
      },
      // handleChange(val) {
      //   this.dataForm.parentId = this.valueArea.pop();
      // },
      // 表单提交
      dataFormSubmit() {
        this.dataForm.parentId = this.valueArea[this.valueArea.length - 1];
        // alert(this.dataForm.parentId);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'parentId': this.dataForm.parentId,
              'areaName': this.dataForm.areaName,
              'icon': this.dataForm.icon,
              'orderNum': this.dataForm.orderNum,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'companyId': this.dataForm.companyId,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime
            };
            this.$http({
              url: this.$http.adornUrl(`/sys/sysarea/${!this.dataForm.id ? 'save' : 'update'}`),
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
