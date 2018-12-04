<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
	     <el-form-item label="项目ID" prop="projectId">
	     <el-input v-model="dataForm.projectId" placeholder="项目ID"></el-input>
      </el-form-item>
	     <el-form-item label="名称" prop="name">
	     <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
	     <el-form-item label="分类：1地铁、2公交、3小区、4学校、5银行" prop="type">
	     <el-input v-model="dataForm.type" placeholder="分类：1地铁、2公交、3小区、4学校、5银行"></el-input>
      </el-form-item>
	     <el-form-item label="地址" prop="address">
	     <el-input v-model="dataForm.address" placeholder="地址"></el-input>
      </el-form-item>
	     <el-form-item label="经度" prop="longitude">
	     <el-input v-model="dataForm.longitude" placeholder="经度"></el-input>
      </el-form-item>
	     <el-form-item label="纬度" prop="latitude">
	     <el-input v-model="dataForm.latitude" placeholder="纬度"></el-input>
      </el-form-item>
	     <el-form-item label="介绍描述" prop="desc">
	     <el-input v-model="dataForm.desc" placeholder="介绍描述"></el-input>
      </el-form-item>
	     <el-form-item label="标签" prop="tags">
	     <el-input v-model="dataForm.tags" placeholder="标签"></el-input>
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
          projectId: '0',
          name: '',
          type: '',
          address: '',
          longitude: '0.00000000',
          latitude: '0.00000000',
          coverImage: '',
          desc: '',
          tags: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          companyId: ''
        },
        dataRule: {
          projectId: [
            { required: true, message: '项目ID不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '分类：1地铁、2公交、3小区、4学校、5银行不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '地址不能为空', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '经度不能为空', trigger: 'blur' }
          ],
          latitude: [
            { required: true, message: '纬度不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/bunk/tprojectformats/info/${this.dataForm.id}`),
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
              'projectId': this.dataForm.projectId,
              'name': this.dataForm.name,
              'type': this.dataForm.type,
              'address': this.dataForm.address,
              'longitude': this.dataForm.longitude,
              'latitude': this.dataForm.latitude,
              'coverImage': this.dataForm.coverImage,
              'desc': this.dataForm.desc,
              'tags': this.dataForm.tags,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'companyId': this.dataForm.companyId
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tprojectformats/${!this.dataForm.id ? 'save' : 'update'}`),
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
