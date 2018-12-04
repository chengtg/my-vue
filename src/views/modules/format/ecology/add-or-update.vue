<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="商业项目" prop="projectId">
        <el-select v-model="dataForm.projectId" filterable  placeholder="请选择所属项目">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id"
            :label="item.cbdName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业态分类" prop="type">
        <el-select v-model="dataForm.type"  placeholder="请选择业态分类">
          <el-option
            v-for="item in ECOLOGY_TYPE_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业态名称" prop="name">
	     <el-input v-model="dataForm.name" placeholder="业态名称"></el-input>
      </el-form-item>

	     <el-form-item label="地址" prop="address">
         <el-input v-model="dataForm.address"  placeholder="地址">
           <el-button slot="append" icon="el-icon-search" @click="getMapPosition"></el-button>
         </el-input>
      </el-form-item>
      <el-form-item label="经度" prop="longitude" v-show="false">
        <el-input v-model="dataForm.longitude" :disabled="true" placeholder="经度"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="latitude" v-show="false">
        <el-input v-model="dataForm.latitude" :disabled="true" placeholder="纬度"></el-input>
      </el-form-item>
	     <el-form-item label="介绍描述" prop="desc">
	     <el-input type="textarea" v-model="dataForm.desc" placeholder="介绍描述"></el-input>
      </el-form-item>
	<!--     <el-form-item label="标签" prop="tags">
	     <el-input v-model="dataForm.tags" placeholder="标签"></el-input>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

    <!--地图-->
    <map-view v-if="mapVisible" ref="mapView" @mapinfo="setAddress"></map-view>
  </el-dialog>
</template>

<script>
  import MapView from '../project/map-view';
  export default {
    data() {
      return {
        ProjectIdListOptions: [],
        ECOLOGY_TYPE_Options: [],
        mapVisible: false, // 新地图弹窗,

        visible: false,
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          projectId: '',
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
            { required: true, message: '地址不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '经度不能为空', trigger: 'blur' }
          ],
          latitude: [
            { required: true, message: '纬度不能为空', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
            { max: 1000, message: '长度在 1000 个字符之内', trigger: 'blur' }
          ]
        }
      };
    },
    components: {
      MapView
    },
    created: function() {
      this.selectPorjectList();
      this.selectDictList('ECOLOGY_TYPE');
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
      // 打开地图获取坐标
      getMapPosition() {
        this.mapVisible = true;
        this.$nextTick(() => {
          this.$refs.mapView.init({
            'keyword': this.dataForm.address,
            'lng': this.dataForm.longitude,
            'lat': this.dataForm.latitude
          });
        });
      },
      // 设置位置内容
      setAddress(data) {
        this.dataForm.address = data.keyword;
        this.dataForm.longitude = data.lng;
        this.dataForm.latitude = data.lat;
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
      },
      // 项目查询
      selectPorjectList() {
        let paramsV = {
        };
        this.$http({
          url: this.$http.adornUrl(`/format/tproject/select`),
          method: 'get',
          params: paramsV
        }).then(({data}) => {
          if (data) {
            this.ProjectIdListOptions = data.select;
          }
        });
      },
      selectDictList(dictType) {
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdict/select/` + dictType),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
            this.ECOLOGY_TYPE_Options = data;
          }
        });
      }

    }
  };
  </script>
