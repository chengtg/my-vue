<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item  label="区域" prop="areaId" >
        <el-cascader
          :options="options"
          v-model="dataForm.areaList"
          filterable
          change-on-select
          clearable
          expand-trigger="click"
          style="width:100%"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="公司/部门" prop="companyId">
          <el-cascader
            :options="companyOptions"
            v-model="companyValue"
            filterable
            change-on-select
            clearable
            expand-trigger="click"
            style="width:100%"
          >
          </el-cascader>
      </el-form-item>
	    <el-form-item label="项目名称" prop="cbdName">
            <el-input v-model="dataForm.cbdName" placeholder="项目名称"></el-input>
      </el-form-item>
	     <el-form-item label="地址" prop="address">
	     <el-input v-model="dataForm.address" placeholder="地址">
         <el-button slot="append" icon="el-icon-location" @click="getMapPosition"></el-button>
       </el-input>
      </el-form-item>
	     <el-form-item label="经度" prop="longitude" v-show="false">
	     <el-input v-model="dataForm.longitude" :disabled="true" placeholder="经度"></el-input>
      </el-form-item>
	     <el-form-item label="纬度" prop="latitude" v-show="false">
	     <el-input v-model="dataForm.latitude" :disabled="true" placeholder="纬度"></el-input>
      </el-form-item>
      <el-form-item label="项目介绍" prop="projectIntroduction">
            <el-input v-model="dataForm.projectIntroduction" type="textarea" :autosize="{ minRows:5, maxRows: 10}" placeholder="项目介绍"></el-input>
      </el-form-item>
      <!--el-form-item label="百度地图" prop="latitude2">
        <template>
          <baidu-map center="苏州"  class="map"></baidu-map>
        </template>
      </el-form-item>-->

      <!--<el-form-item label="封面图片" prop="coverImage">
	     <el-input v-model="dataForm.coverImage" placeholder="封面图片"></el-input>
      </el-form-item>-->
      <el-form-item label="选择图片" prop="coverImage" class="apply-class">
        <div class="m-filebox" v-for="(file, index) in imageList" :key="file.fileId" >
          <div class="u-showfile" @click="showFile(file.url)" :style="{'background-image': 'url(' + file.imgurl + ')'}"  title="预览"></div>
          <div class="u-closebutton" @click="deletePackage(index, imageList)"></div>
          <div class="u-filename" :title="file.name">
            <span>{{file.name}}</span>
          </div>
          <a class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">点击下载</a>
        </div>
        <el-upload
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :file-list="imageList"
          :limit=5
          multiple
          accept=".png,.jpg,.bmp,.gif"
          :on-change="imageChangeHandle"
          :on-exceed="exceed">
          <i class="u-addbox"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否有效" prop="flag">
            <el-select v-model="dataForm.flag" placeholder="请选择是否有效">
                <el-option
                  v-for="item in FlagDictOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
      </el-form-item>
      <el-form-item  label="标签">
        <el-tag
          :key="tag"
          v-for="tag in dataForm.dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 新增 / 修改 -->
    <map-view v-if="mapVisible" ref="mapView" @mapinfo="setAddress"></map-view>
  </el-dialog>
</template>

<script>
  import MapView from './map-view';
  import md5 from 'browser-md5-file';
  export default {
    data() {
      return {
        center: {lng: 0, lat: 0},
        zoom: 3,
        // 图标路径
        staticImg: './static/img/',
        visible: false,
        FlagDictOptions: [],
        companyOptions: [], // 公司列表
        companyValue: [],
        inputVisible: false, // 标签控制
        inputValue: '', // 标签值
        options: [],
        selectcompanyId: '', // 选择的公司/部门
        imageList: [], // 项目图片
        mapVisible: false, // 新地图弹窗
        dataForm: {
          areaList: [],
          dynamicTags: [],
          id: 0,
          cbdName: '',
          areaId: '0',
          tags: '',
          companyId: '',
          companyName: '',
          address: '',
          longitude: '0.00000000',
          latitude: '0.00000000',
          flag: '1',
          coverImage: '',
          projectIntroduction: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          status: '1'
        },
        dataRule: {
          cbdName: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
          ],
          areaId: [
            { required: true, message: '区域不能为空', trigger: 'blur' }
          ],
          // coverImage: [
          //   { required: true, message: '封面图片不能为空', trigger: 'blur' }
          // ],
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
          flag: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    components: {
      MapView
    },
    created: function() {
      this.selectAreaList();
      this.selectCompany();
      this.selectDictList('FLAG_TYPE');
    },
    // mounted: function() {
    // this.selectAreaList();
    // this.selectCompany();
		// this.selectDictList('FLAG_TYPE');
    // },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          // 重新初始化数组，控件初始化工具无法操作自定义对象，若再新增，将保留数据
          this.dataForm.dynamicTags = [];
          this.dataForm.areaList = [];// 清空值
          this.companyValue = [];// 清空值
          this.imageList = [];// 清空值
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/format/tproject/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.entity;
                this.companyValue = data.entity.companyValue;
                for (let i = 0; i < this.dataForm.realFileList.length; i++) {
                  this.imageList.push(this.modifytype({
                    'id': this.dataForm.realFileList[i].id,
                    'fileId': this.dataForm.realFileList[i].fileId,
                    'packageId': this.dataForm.realFileList[i].packageId,
                    'url': this.dataForm.realFileList[i].url,
                    'name': this.dataForm.realFileList[i].fileName,
                    'md5': this.dataForm.realFileList[i].md5
                  }));
                }
              }
            });
          }
        });
      },
      // 设置位置内容
      setAddress(data) {
        this.dataForm.address = data.keyword;
        this.dataForm.longitude = data.lng;
        this.dataForm.latitude = data.lat;
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
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let realFileList = [];
            for (let i = 0; i < this.imageList.length; i++) {
              realFileList.push({
                'id': this.imageList[i].id,
                'fileId': this.imageList[i].fileId,
                'packageId': this.imageList[i].packageId,
                'fileName': this.imageList[i].name,
                'md5': this.imageList[i].md5,
                'type': 1 // 项目图片
              });
            }
            var params = {
              'id': this.dataForm.id || undefined,
              'cbdName': this.dataForm.cbdName,
              'areaId': this.dataForm.areaList[this.dataForm.areaList.length - 1],
              'tags': this.dataForm.tags,
              'companyId': this.companyValue[this.companyValue.length - 1],
              'address': this.dataForm.address,
              'longitude': this.dataForm.longitude,
              'latitude': this.dataForm.latitude,
              'flag': this.dataForm.flag,
              'coverImage': this.dataForm.coverImage,
              'projectIntroduction': this.dataForm.projectIntroduction,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'status': this.dataForm.status,
              'realFileList': realFileList,
              'dynamicTags': this.dataForm.dynamicTags
            };
            this.$http({
              url: this.$http.adornUrl(`/format/tproject/${!this.dataForm.id ? 'save' : 'update'}`),
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
            this.FlagDictOptions = data;
          }
        });
      },

    handleClose(tag) {
        this.dataForm.dynamicTags.splice(this.dataForm.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        // 最多输入5个标签
        if (this.dataForm.dynamicTags.length >= 5) {
          this.$message({
            message: '最多能添加5个标签',
            type: 'warning'
          });
          this.inputVisible = false;
          this.inputValue = '';
        }
        // 验证重复性
        let inputValue = this.inputValue;
        if (inputValue) {
          inputValue = inputValue.trim();
          if (inputValue.length > 8) {
            this.$message({
              message: '标签长度不能超过8',
              type: 'warning'
            });
            this.inputVisible = false;
            this.inputValue = '';
            return;
          }
          for (var i = 0; i < this.dataForm.dynamicTags.length; i++) {
            if (this.dataForm.dynamicTags[i] === inputValue) {
              this.$message({
                message: '该标签已存在',
                type: 'warning'
              });
              this.inputVisible = false;
              this.inputValue = '';
              return;
            }
          }
          this.dataForm.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      clearChildren(data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children.length === 0) {
            delete data[i].children;
          } else {
            this.clearChildren(data[i].children);
          }
        }
      },
      // 查询区域
      selectAreaList() {
        this.$http({
          url: this.$http.adornUrl('/sys/sysarea/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.clearChildren(data.treeList);
            this.options = [];// 清空
            this.options = data.treeList;
            this.options.unshift({value: 0, label: '添加省份'});
          }
        });
      },
      // 查询公司-部门
      selectCompany() {
        this.$http({
          url: this.$http.adornUrl('/sys/syscompany/authtree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.companyOptions = [];// 清空
            this.clearChildren(data.treeList);
            this.companyOptions = data.treeList;
          }
        });
      },
      // 添加文件后调用函数
      imageChangeHandle(file, List) {
        let type = file.name.split('.').pop().toLowerCase();
        if (type === 'png' || type === 'jpg' || type === 'bmp' || type === 'gif') {
          this.changeHandle('image', file, this.imageList);
        } else {
          this.$message.error('上传文件类型错误！图片仅支持：png、jpg、bmp、gif格式。');
          List.pop();
        }
      },

      // 文件达到最大数量
      exceed() {
        this.$message({
          message: '此类文件已达到最大上传量！',
          type: 'warning'
        });
      },
      //  根据类型进行md5查重，
      changeHandle(type, file, list) {
        md5(file.raw, (text, md5code) => {
          let isOnly = true;  //  是否唯一表示
          for (let i = 0; i < list.length; i++) {
            if (list[i].md5 === md5code) {
              this.$message.error('文件（' + file.name + '）已重复添加!');
              isOnly = false;
              break;
            }
          }
          if (isOnly) {
            this.fileUpload(type, file);
          }
        });
      },
      // 删除文件
      deletePackage(index, list) {
        // 获取需要删除元素的 fileId
        let file = list.slice(index, (index + 1));
        let ids = [file[0].id];
        this.$http({
          url: this.$http.adornUrl(`/oss/trelationfile/delete`),
          method: 'post',
          data: ids
        }).then(({data}) => {
          if (data && data.code === 0) {
            list.splice(index, 1);
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      // 文件类型格式化
      modifytype(filepackage) {
        filepackage.type = filepackage.name.split('.').pop().toLowerCase();
        switch (filepackage.type) {
          case 'png':
          case 'jpg':
          case 'bmp':
          case 'gif':
            filepackage.imgurl = filepackage.url;
            break;
          case 'doc':
          case 'docx':
            filepackage.imgurl = this.staticImg + 'file_doc.png';
            break;
          case 'xls':
          case 'xlsx':
            filepackage.imgurl = this.staticImg + 'file_xls.png';
            break;
          // case 'bmp':
          // case 'def':
          // case 'doc':
          // case 'gif':
          // case 'jpg':
          // case 'png':
          // case 'xls':
          case 'aep':
          case 'ai':
          case 'archive':
          case 'as':
          case 'audio':
          case 'avi':
          case 'css':
          case 'eps':
          case 'epub':
          case 'fla':
          case 'flv':
          case 'html':
          case 'image':
          case 'indd':
          case 'js':
          case 'mdv':
          case 'midi':
          case 'mkv':
          case 'mp3':
          case 'mp4':
          case 'mpg':
          case 'ogg':
          case 'otf':
          case 'pdf':
          case 'php':
          case 'psd':
          case 'rar':
          case 'rtf':
          case 'sql':
          case 'svg':
          case 'swc':
          case 'swf':
          case 'tiff':
          case 'ttf':
          case 'txt':
          case 'video':
          case 'wav':
          case 'wma':
          case 'wmv':
          case 'xml':
          case 'zip':
            filepackage.imgurl = this.staticImg + 'file_' + filepackage.type + '.png';
            break;
          default:
            filepackage.imgurl = this.staticImg + 'file_def.png';
            break;
        }
        return filepackage;
      },
      // 重定义文件上传
      fileUpload(type, file) {
        let fileFormData = new FormData();
        fileFormData.append('file', file.raw); // 第一个参数是键，第二个参数是值，就是要传的文件
        this.$http({
          url: this.$http.adornUrl(`/sys/oss/upload2?token=${this.$cookie.get('token')}`),
          method: 'post',
          data: fileFormData
        }).then((response) => {
          let data = response.data;
          if (data && data.code === 0) {
            switch (type) {
              case 'image':
                this.successHandle(data, file.raw, this.imageList);
                break;
              default:
                break;
            }
          } else {
            this.$message.error(data.msg);
          }
        });
      },
      // 上传成功
      successHandle(response, file, list) {
        // 格式化文件结构，提交到相应列表
        let filepackage = {};
        filepackage.packageId = this.dataForm.id ? this.dataForm.id : 0;
        filepackage.id = '';
        filepackage.fileId = response.id;
        filepackage.md5 = response.md5;
        filepackage.url = response.url;
        filepackage.name = file.name;
        filepackage = this.modifytype(filepackage);
        list.push(filepackage);
      },
      showFile(url) {
        window.open(url, '_blank');
      },
      downloadFile(fileId, fileName) {
        // window.location.href= window.SITE_CONFIG['baseUrl'] +"/sys/oss/download?fileId=" + fileId;
        this.$http({
          url: this.$http.adornUrl(`/sys/oss/download?fileId=` + fileId),
          method: 'post',
          responseType: 'arraybuffer',
          data: {}
        }).then((data) => {
          this.$message({
            message: '下载成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
            }
          });
          let blob = new Blob([data.data], {type: 'application/octet-stream'});
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        });
      }

    }
  };
</script>
<style scoped>
  .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }

  .m-filebox, .u-addbox{
    float: left;
    position: relative;
    margin-right: 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 100px;
    height: 114px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .apply-class .m-filebox{
    border: 0;
  }
  .u-showfile{
    position: absolute;
    width: 100%;
    height: 100px;
    background-size: 100% 100%;
    border: 1px solid #ccc;
    border-radius: 10px;
    cursor: pointer;
  }

  .u-tagname{
    position: absolute;
    bottom: -15px;
    width: 100%;
    text-align: center;
    cursor: pointer;
  }

  .u-closebutton {
    position: absolute;
    right: -7px;
    top: -7px;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    line-height: 20px;
    background-color: rgba(202,27,27,0.8);
    font-size: 10px;
    cursor: pointer;
  }

  .u-closebutton::after, .u-closebutton::before{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -6px 0 0 -1px;
    width: 2px;
    height: 12px;
    border-radius: 5px;
    background: #fff;
  }
  .u-closebutton::before {
    transform: rotate(45deg);
  }
  .u-closebutton::after {
    transform: rotate(-45deg);
  }

  .u-closebutton:hover {
    background: rgba(202,27,27,0.7);
  }
  .u-closebutton:hover::before , .u-closebutton:hover::after {
    background: #f0f0f0;
  }

  .u-fileimage {
    width: 100%;
    height: 100%;
    display: block;
  }

  .u-filename{
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-radius: 0 0 10px 10px;
    color: #f0f0f0;
    background-color: rgba(77,77,77,0.5);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    text-align: center;
  }

  .u-addbox::after, .u-addbox::before{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -15px;
    width: 4px;
    height: 30px;
    border-radius: 5px;
    background: #333;
  }
  .u-addbox::after {
    transform: rotate(90deg);
  }
  .u-addbox:hover{
    background: #e6e6e6;
    border-color: #adadad;
    color: #333;
    cursor: pointer;
  }

  .z-harfside{
    display: inline-block;
    width: 49%;
  }
</style>
