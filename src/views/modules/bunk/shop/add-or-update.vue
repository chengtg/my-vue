<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
	     <el-form-item label="铺位名称" prop="shopNum">
            <el-input v-model="dataForm.shopNum" :disabled="isDisabled" placeholder="铺位名称/编号"></el-input>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="dataForm.projectId" :disabled="isDisabled" placeholder="请选择所属项目" style="width:100%;">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id +''"
            :label="item.cbdName"
            :value="item.id +''">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="公司编号" prop="companyId">
        <el-input v-model="dataForm.companyId" placeholder="公司编号"></el-input>
      </el-form-item>-->

	     <el-form-item label="面积" prop="area">
	      <el-input-number v-model="dataForm.area" :precision="2" :step="0.01" :disabled="isDisabled" placeholder="铺位建筑面积/平方(含公摊)" style="width:200px;"></el-input-number>
        <span style="color:gray; font-size:12px; margin-left:10px;">平方米（含公摊面积）</span>
      </el-form-item>
	     <el-form-item label="楼层" prop="floor">
	     <el-input v-model="dataForm.floor" :disabled="isDisabled" placeholder="楼层" style="width:200px;"></el-input>
      </el-form-item>
	     <el-form-item label="铺位大类" prop="bigType">
	    <!-- <el-input v-model="dataForm.bigType" placeholder="铺位大类"></el-input>-->
         <el-select v-model="dataForm.bigType" clearable filterable @change="selectSubType" @clear="clearSubType" :disabled="isDisabled"  placeholder="请选择分类">
           <el-option
             v-for="item in BigTypeListOptions"
             :key="item.id"
             :label="item.brandName"
             :value="item.id">
           </el-option>
         </el-select>
      </el-form-item>
	     <el-form-item label="铺位小类" prop="subType" >
         <el-select v-model="dataForm.subTypeList"  multiple  :disabled="isDisabled"  placeholder="铺位小类" style="width:100%;">
           <el-option
             v-for="item in SubTypeListOptions"
             :key="item.id+''"
             :label="item.brandName"
             :value="item.id+''">
           </el-option>
         </el-select>
      </el-form-item>
<!--	     <el-form-item label="铺位介绍描述" prop="description">
	     <el-input v-model="dataForm.description" placeholder="铺位介绍描述"></el-input>
      </el-form-item>-->
      <el-form-item label="地址" prop="address">
        <el-input v-model="dataForm.address" :disabled="isDisabled"  placeholder="地址">
          <el-button slot="append" icon="el-icon-search" @click="getMapPosition"></el-button>
        </el-input>
      </el-form-item>
	     <el-form-item label="经度" prop="longitude" v-show="false">
	     <el-input v-model="dataForm.longitude" :disabled="true" placeholder="经度"></el-input>
      </el-form-item>
	     <el-form-item label="纬度" prop="latitude" v-show="false">
	     <el-input v-model="dataForm.latitude" :disabled="true" placeholder="纬度"></el-input>
      </el-form-item>
      <el-form-item label="铺位概况" prop="situation">
        <el-input v-model="dataForm.situation" type="textarea" :autosize="{ minRows:3, maxRows: 6}" :disabled="isDisabled"  placeholder="铺位概况"></el-input>
      </el-form-item>
      <el-form-item label="配套设施" prop="propertyInfo">
        <el-checkbox-group v-model="dataForm.groupedEquipment">
          <el-checkbox v-for="item in GROUPED_EQUIPMENT_Options" :label="item.value" :key="item.value" :value="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择图片" prop="coverImage" class="apply-class">
        <div class="m-filebox" v-for="(file, index) in imageList" :key="file.fileId">
          <div class="u-showfile" @click="showFile(file.url)" :style="{'background-image': 'url(' + file.imgurl + ')'}"  title="预览"></div>
          <div class="u-closebutton" @click="deletePackage(index, imageList)"></div>
          <div class="u-filename" :title="file.name">
            <span>{{file.name}}</span>
          </div>
          <a class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">点击下载</a>
        </div>
        <el-upload
          :disabled="isDisabled"
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
        <el-select  v-model="dataForm.flag" :disabled="isDisabled"  placeholder="请选择是否有效">
          <el-option
            v-for="item in FlagDictOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" :min="1" :disabled="isDisabled"  placeholder="请输入排序"></el-input-number>
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
        <el-button v-else class="button-new-tag" size="small" :disabled="isDisabled"  @click="showInput">+ 添加标签</el-button>
      </el-form-item>
      <el-form-item label="审核" prop="flag" v-if="isState == true">
        <el-select v-model="dataForm.state" placeholder="选择审核状态"  >
          <el-option
            v-for="item in StateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核信息" prop="auditInfo" v-if="isState == true">
        <el-input v-model="dataForm.auditInfo" type="textarea" placeholder="审核信息" ></el-input>
      </el-form-item>
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
  import MapView from '../../format/project/map-view';
  import md5 from 'browser-md5-file';
  export default {
    data() {
      return {
        // 如果是审核页面,其他字段不可编辑
        isDisabled: false,
        isState: false,
        // 审核状态
        StateOptions: [
          {
            value: '0',
            label: '未审核'
          }, {
          value: '1',
          label: '通过'
        }, {
          value: '2',
          label: '不通过'
        }],
        GROUPED_EQUIPMENT_Options: [], // 配套设施
        mapVisible: false, // 新地图弹窗,
        visible: false,
        FlagDictOptions: [],
        ProjectIdListOptions: [],
        BigTypeListOptions: [],
        SubTypeListOptions: [],
        inputVisible: false, // 标签控制
        inputValue: '', // 标签值

        staticImg: './static/img/',
        imageList: [], // 铺位图片
        dataForm: {
          id: 0,
          shopNum: '',
          flag: '1',
          status: '1',
          projectId: '',
          situation: '',
          orderNum: '',
          area: '00000.00',
          floor: '',
          bigType: '',
          subType: '',
          description: '',
          address: '',
          longitude: '0.00000000',
          latitude: '0.00000000',
          tags: '',
          coverImage: '',
          propertyInfo: '',
          state: '',
          auditId: '',
          auditInfo: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          companyId: '',
          dynamicTags: [],
          subTypeList: [],
          groupedEquipment: []
        },
        dataRule: {
          shopNum: [
            { required: true, message: '铺位名称/编号不能为空', trigger: 'blur' },
            { max: 30, message: '长度在 30 个字符之内', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '是否有效不能为空', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '所属项目不能为空', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '面积/平方(含公摊)不能为空', trigger: 'blur' }
          ],
          floor: [
            { required: true, message: '楼层不能为空', trigger: 'blur' },
            { max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
          ],
          bigType: [
            { required: true, message: '铺位大类不能为空', trigger: 'change' }
          ],
          // subType: [
          //   { required: true, message: '铺位小类不能为空', trigger: 'change' }
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
          situation: [
            { max: 4000, message: '长度在 4000 个字符之内', trigger: 'blur' }
          ]
        }
      };
    },
    components: {
      MapView
    },
	mounted: function() {
		// this.selectTableList('t_project', 'id', 'cbd_name');
    this.selectDictList('FLAG_TYPE');
    this.selectDictList('GROUPED_EQUIPMENT');
    this.selectShopType('0');
    },
    created: function() {
      this.selectPorjectList();
    },
    methods: {
      init(id, isState) {
        this.dataForm.id = id || 0;
        this.visible = true;

        // 审核信息
        this.isState = isState;
        this.isDisabled = isState;

        this.$nextTick(() => {
          // this.$refs.resetFields();
          this.$refs['dataForm'].resetFields();
          // 重新初始化数组，控件初始化工具无法操作自定义对象，若再新增，将保留数据
          this.dataForm.dynamicTags = []; //清空标签
          this.imageList = [];// 清空值
          this.dataForm.subTypeList = []; //清空品牌小类
          this.dataForm.groupedEquipment = []; //清空配套设施
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/bunk/tshopinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.entity;
                  this.selectSubType(this.dataForm.bigType);
                  this.dataForm.projectId = data.entity.projectId + '';
                  // 图片
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
                'type': 1, // 项目图片
                'url': this.imageList[i].url
              });
            }
            var params = {
              'id': this.dataForm.id || undefined,
              'shopNum': this.dataForm.shopNum,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'projectId': this.dataForm.projectId,
              'situation': this.dataForm.situation,
              'orderNum': this.dataForm.orderNum,
              'area': this.dataForm.area,
              'floor': this.dataForm.floor,
              'bigType': this.dataForm.bigType,
              'subType': this.dataForm.subType,
              'description': this.dataForm.description,
              'address': this.dataForm.address,
              'longitude': this.dataForm.longitude,
              'latitude': this.dataForm.latitude,
              'tags': this.dataForm.tags,
              'coverImage': this.dataForm.coverImage,
              'propertyInfo': this.dataForm.propertyInfo,
              'state': this.dataForm.state,
              'auditId': this.dataForm.auditId,
              'auditInfo': this.dataForm.auditInfo,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'companyId': this.dataForm.companyId,
              'realFileList': realFileList,
              'dynamicTags': this.dataForm.dynamicTags,
              'subTypeList': this.dataForm.subTypeList,
              'groupedEquipment': this.dataForm.groupedEquipment
            };
            if (this.isState) {
              var params2 = {
                'id': this.dataForm.id,
                'state': this.dataForm.state,
                'auditInfo': this.dataForm.auditInfo
              };
              this.auditHandle(params2);
            } else {
              this.saveOrUpdate(params);
            }
          }
        });
      },
      // 保存或者更新
      saveOrUpdate(params) {
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshopinfo/${!this.dataForm.id ? 'save' : 'update'}`),
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
      },
      auditHandle(params) {
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshopinfo/audit`),
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
    // 根据数据字典类型 查询数据字典列表
    selectDictList(dictType) {
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdict/select/` + dictType),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data) {
          if (dictType == 'FLAG_TYPE') {
            this.FlagDictOptions = data;
          } else if (dictType == 'GROUPED_EQUIPMENT') {
            this.GROUPED_EQUIPMENT_Options = data;
          }
        }
      });
    },
      selectShopType(parentId) {
        let paramsV = {
          parentId: parentId
        };
        this.$http({
          url: this.$http.adornUrl(`/format/tformatshoptype/select2`),
          method: 'get',
          params: paramsV
        }).then(({data}) => {
          if (data) {
            if (parentId == '0') {
               this.BigTypeListOptions = data.list;
            } else {
               this.SubTypeListOptions = data.list;
            }
          }
        });
      },
      selectSubType(val) {
        // alert(val);
        this.SubTypeListOptions = [];
      //  this.dataForm.subTypeList = [];
        this.selectShopType(val);
      },
      // 情况铺位小类
      clearSubType() {
        this.dataForm.subTypeList = [];
        this.SubTypeListOptions = [];
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
                     this.ProjectIdListOptions = data.list;
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
              // case 'file':
              //   this.successHandle(data, file.raw, this.fileList);
              //   break;
              // case 'video':
              //   this.successHandle(data, file.raw, this.videoList);
              //   break;
              // case 'md':
              //   this.successHandle(data, file.raw, this.mdList);
              //  break;
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
  .map {
    width: 100%;
    height: 400px;
  }
</style>
