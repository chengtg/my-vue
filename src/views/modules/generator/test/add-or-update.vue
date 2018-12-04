<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
	     <el-form-item label="上级城市" prop="parentId">
	     <el-input v-model="dataForm.parentId" placeholder="上级城市"></el-input>
      </el-form-item>
	     <el-form-item label="城市名称" prop="areaName">
	     <el-input v-model="dataForm.areaName" placeholder="城市名称"></el-input>
      </el-form-item>
	     <el-form-item label="描述" prop="icon">
            <el-input v-model="dataForm.icon" type="textarea" placeholder="描述"></el-input>
      </el-form-item>
	     <el-form-item label="序号" prop="orderNum">
            <el-input-number v-model="dataForm.orderNum" :min="1" placeholder="请输入序号"></el-input-number>
      </el-form-item>
	     <el-form-item label="状态符号" prop="status">
            <el-select v-model="dataForm.status" placeholder="请选择状态符号">
                <el-option
                  v-for="item in StatusDictOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
      </el-form-item>
	     <el-form-item label="更新时间" prop="updateTime">
            <el-date-picker v-model="dataForm.updateTime"  type="date"  placeholder="选择日期"> </el-date-picker>
      </el-form-item>
	     <el-form-item label="公司名称" prop="companyId">
        <el-select v-model="dataForm.companyId" placeholder="请选择公司名称">
            <el-option
              v-for="item in CompanyIdListOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
	     <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="dataForm.createTime"  type="datetime"  placeholder="选择时间"> </el-date-picker>
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
        StatusDictOptions: [],
        CompanyIdListOptions: [],
        dataForm: {
          id: 0,
          parentId: '',
          areaName: '',
          icon: '描述',
          orderNum: '',
          flag: '1',
          status: '1',
          updateId: '',
          updateTime: new Date(),
          deptId: '',
          companyId: '',
          createId: '',
          createTime: new Date()
        },
        dataRule: {
          areaName: [
            { required: true, message: '城市名称不能为空', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '序号不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态符号不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ]
        }
      };
    },
  mounted: function() {
    this.selectDictList('STATUS_TYPE');
    this.selectTableList('sys_company_dept', 'id', 'full_name');
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/generator/test/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.test;
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
              url: this.$http.adornUrl(`/generator/test/${!this.dataForm.id ? 'save' : 'update'}`),
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
                     this.StatusDictOptions = data;
                }
            });
      },
      // 根据数据库列表
     selectTableList(tableName, value, label) {
        let paramsV = {
          tableName: tableName,
          value: value,
          label: label
        };
        this.$http({
          url: this.$http.adornUrl(`/sys/table/list`),
          method: 'get',
          params: paramsV
        }).then(({data}) => {
          if (data) {
            this.CompanyIdListOptions = data.list;
          }
        });
      }
  }
};
</script>
