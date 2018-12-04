<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <!-- <el-form-item label="父节点ID" prop="parentId">
        <el-input v-model="dataForm.parentId" placeholder="父节点ID"></el-input>
      </el-form-item> -->
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-if="dataForm.type === '2'" :disabled="true" v-model="dataForm.dictType" placeholder="数据字典类型"></el-input>
        <el-input v-else v-model="dataForm.dictType" placeholder="数据字典类型"></el-input>
      </el-form-item>
      <el-form-item label="类型标签" prop="label">
          <el-input v-model="dataForm.label" placeholder="类型标签"></el-input>
        </el-form-item>
      <template v-if="dataForm.type === '2'">
            <el-form-item label="类型值" prop="value">
                <el-input v-model="dataForm.value" placeholder="类型值"></el-input>
              </el-form-item>
      </template>
      <!-- <el-form-item label="1：数据字典类型 2，值" prop="type">
        <el-input v-model="dataForm.type" placeholder="1：数据字典类型 2，值"></el-input>
      </el-form-item> -->
      <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="1" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
          <el-input v-model="dataForm.desc" placeholder="描述"></el-input>
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
          parentId: '',
          dictType: '',
          value: '',
          label: '',
          type: '',
          orderNum: '',
          desc: '',
          status: '',
          delFlag: ''
        },
        dataRule: {
          // parentId: [
          //   { required: true, message: '父节点ID不能为空', trigger: 'blur' },
          //   { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          // ],
          dictType: [
            { required: true, message: '数据字典类型不能为空', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '类型值不能为空', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
          ],
          label: [
            { required: true, message: '类型标签不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          // type: [
          //   { required: true, message: '1：数据字典类型 2，值不能为空', trigger: 'blur' }
          // ],
          orderNum: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          delFlag: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      init(id, parent) {
        console.log(parent);
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (typeof (parent) === 'undefined') {
            this.dataForm.parentId = 0;
            this.dataForm.type = '1';
          } else {
            this.dataForm.parentId = parent.id;
            this.dataForm.dictType = parent.dictType;
            this.dataForm.type = '2';
          }
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/sys/sysdict/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.sysDict;
                  if (this.dataForm.parentId !== 0) {
                    this.dataForm.type = '2';
                  }
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
              'dictType': this.dataForm.dictType,
              'value': this.dataForm.value,
              'label': this.dataForm.label,
              'type': this.dataForm.type,
              'orderNum': this.dataForm.orderNum,
              'desc': this.dataForm.desc,
              'status': this.dataForm.status,
              'delFlag': this.dataForm.delFlag
            };
            this.$http({
              url: this.$http.adornUrl(`/sys/sysdict/${!this.dataForm.id ? 'save' : 'update'}`),
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
                    if (this.dataForm.type === '1') {
                      this.$emit('refreshDataList');
                    } else {
                      this.$emit('refreshDataListR');
                    }
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
