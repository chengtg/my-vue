<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
      <el-form-item label="公示标题" prop="title">
        <el-input v-model="dataForm.title"   placeholder="发布标题"></el-input>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="dataForm.projectId" @change="selectShopList" clearable @clear="clearShopList" filterable :disabled="isDisabled" placeholder="请选择商业项目">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id"
            :label="item.cbdName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <template v-if="dataForm.id == 0">
        <el-form-item label="铺位编号" prop="publishId">
          <el-select v-model="dataForm.publishId"  @change="changeShop"  :disabled="isDisabled" placeholder="请选择铺位">
            <el-option
              v-for="item in ShopListOptions"
              :key="item.id"
              :label="item.shopNum"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="铺位编号" prop="shopNum">
          <el-input v-model="dataForm.shopNum"  :disabled="true" placeholder="铺位编号"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="竞租人" prop="applyId">
        <el-select v-model="dataForm.applyId"  :disabled="isDisabled" placeholder="竞租人">
          <el-option
            v-for="item in ApplyListOptions"
            :key="item.id"
            :label="item.objectName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
     <!-- <el-form-item label="铺位大类" prop="bigType">
        &lt;!&ndash; <el-input v-model="dataForm.bigType" placeholder="铺位大类"></el-input>&ndash;&gt;
        <el-select v-model="dataForm.bigType" clearable filterable   :disabled="isDisabled"  placeholder="请选择分类">
          <el-option
            v-for="item in BigTypeListOptions"
            :key="item.id"
            :label="item.brandName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="铺位小类" prop="subType" >
        <el-select v-model="dataForm.subTypeList" multiple :disabled="isDisabled" placeholder="铺位小类" >
          <el-option
            v-for="item in SubTypeListOptions"
            :key="item.brandName"
            :label="item.brandName"
            :value="item.brandName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名类型" prop="type">
        <el-radio-group  :disabled="isDisabled" v-model="dataForm.type">
          <el-radio :label="'1'">个人</el-radio>
          <el-radio :label="'2'">商户</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.type == 1">
           <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
          </el-form-item>
           <el-form-item label="身份证号码" prop="idNumber">
                <el-input v-model="dataForm.idNumber" placeholder="身份证号码"></el-input>
          </el-form-item>
      </template>
      <template v-else>
         <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="dataForm.companyName" placeholder="公司名称"></el-input>
        </el-form-item>
         <el-form-item label="营业执照" prop="businessLicense">
              <el-input v-model="dataForm.businessLicense" placeholder="营业执照"></el-input>
        </el-form-item>
         <el-form-item label="社会统一信用号=码" prop="socialUnifiedCreditNumber">
              <el-input v-model="dataForm.socialUnifiedCreditNumber" placeholder="社会统一信用码"></el-input>
        </el-form-item>
         <el-form-item label="法人姓名" prop="legalPersonName">
              <el-input v-model="dataForm.legalPersonName" placeholder="法人姓名"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="是否首次开店" prop="isFirst">
        <el-select v-model="dataForm.isFirst"  :disabled="isDisabled" placeholder="是否首次开店"  >
          <el-option
            v-for="item in YES_OR_NO_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
	     <el-form-item label="经验履历" prop="experience">
	          <el-input v-model="dataForm.experience" placeholder="经验履历"></el-input>
      </el-form-item>-->
<!--      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="dataForm.startTime"  type="datetime"  placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss"  style="width:200px;"> </el-date-picker>
      </el-form-item>
      <el-form-item label="开始时间" prop="endTime">
        <el-date-picker v-model="dataForm.endTime"  type="datetime"  placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss"   style="width:200px;"> </el-date-picker>
      </el-form-item>-->
      <el-form-item label="公示文档" prop="fileList" class="apply-class">
        <div class="m-filebox" v-for="(file, index) in fileList" :key="file.fileId">
          <div class="u-showfile" @click="showFile(file.url)" :style="{'background-image': 'url(' + file.imgurl + ')'}"  title="预览"></div>
          <div class="u-closebutton" @click="deletePackage(index, fileList)"></div>
          <div class="u-filename" :title="file.name">
            <span>{{file.name}}</span>
          </div>
          <a class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">点击下载</a>
        </div>
        <el-upload
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :file-list="fileList"
          :limit=1
          :beforeUpload="beforeAvatarUpload"
          :on-change="fileChangeHandle"
          :on-exceed="exceed">
          <i class="u-addbox"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="dataForm.desc"  type="textarea"  placeholder="备注" > </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import md5 from 'browser-md5-file';
  export default {
    data() {
      return {
        staticImg: './static/img/',
        visible: false,
        isDisabled: false,
        fileListLoading: false,
        url: '',
        fileList: [],
        ProjectIdListOptions: [],
        ShopListOptions: [],
        BigTypeListOptions: [],
        SubTypeListOptions: [],
        ApplyListOptions: [],
        YES_OR_NO_Options: [{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          title: '',
          publishId: '',
          applyTime: '',
          rentAcceptance: '',
          expectedLeaseTime: '',
          bigType: '',
          subType: '',
          realName: '',
          idNumber: '',
          companyName: '',
          type: '',
          businessLicense: '',
          socialUnifiedCreditNumber: '',
          legalPersonName: '',
          isFirst: '0',
          experience: '',
          contactName: '',
          contactPhone: '',
          contactAddress: '',
          createId: '',
          updateId: '',
          createTime: '',
          updateTime: '',
          companyId: '',
          userId: '',
          projectId: '',
          shopId: '',
          startTime: '',
          endTime: '',
          desc: '',
          title: '',
          applyId: '',
          realFileList: []
        },
        dataRule: {
          title: [
            { required: true, message: '公示标题不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          applyId: [
            { required: true, message: '竞租人不能为空', trigger: 'change' }
          ],
          projectId: [
            { required: true, message: '项目id不能为空', trigger: 'change' }
          ],
          publishId: [
            { required: true, message: '铺位id不能为空', trigger: 'change' }
          ],
          startTime: [
            { required: true, message: '租用开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '租用结束时间不能为空', trigger: 'blur' }
          ],
          desc:[
            { max: 1000, message: '长度在 1000 个字符之内', trigger: 'blur' }
          ]
        }
      };
    },
    // mounted: function() {
    // //this.selectTableList('t_project', 'id', 'cbd_name');
    // this.selectPorjectList();
    // },
    created: function() {
      this.selectPorjectList();
    },
    methods: {
      init(id, isUpdate) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.isDisabled = isUpdate;
        this.fileList = [];
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          // 重新初始化数组，控件初始化工具无法操作自定义对象，若再次进行新增操作，相应数据将被保留，不为空
          this.dataForm.realFileList = [];
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsapplypublicity/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.selectShopList(data.entity.projectId);
              this.selectApplyList(data.entity.projectId, data.entity.publishId ,1);
              if (data && data.code === 0) {
                  this.dataForm = data.entity;
                // 文件分类与格式化
                for (let i = 0; i < this.dataForm.realFileList.length; i++) {
                  this.fileList.push(this.modifytype({
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
            // 合并文件列表
            let fullFileList = [];
            for (let i = 0; i < this.fileList.length; i++) {
              fullFileList.push({
                'id': this.fileList[i].id,
                'fileId': this.fileList[i].fileId,
                'packageId': this.fileList[i].packageId,
                'fileName': this.fileList[i].name,
                'md5': this.fileList[i].md5,
                'type': 2
              });
            }
            var params = {
              'id': this.dataForm.id || undefined,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'publishId': this.dataForm.publishId,
              'applyTime': this.dataForm.applyTime,
              'rentAcceptance': this.dataForm.rentAcceptance,
              'expectedLeaseTime': this.dataForm.expectedLeaseTime,
              'bigType': this.dataForm.bigType,
              'subType': this.dataForm.subType,
              'realName': this.dataForm.realName,
              'idNumber': this.dataForm.idNumber,
              'companyName': this.dataForm.companyName,
              'type': this.dataForm.type,
              'businessLicense': this.dataForm.businessLicense,
              'socialUnifiedCreditNumber': this.dataForm.socialUnifiedCreditNumber,
              'legalPersonName': this.dataForm.legalPersonName,
              'isFirst': this.dataForm.isFirst,
              'experience': this.dataForm.experience,
              'contactName': this.dataForm.contactName,
              'contactPhone': this.dataForm.contactPhone,
              'contactAddress': this.dataForm.contactAddress,
              'createId': this.dataForm.createId,
              'updateId': this.dataForm.updateId,
              'createTime': this.dataForm.createTime,
              'updateTime': this.dataForm.updateTime,
              'companyId': this.dataForm.companyId,
              'userId': this.dataForm.userId,
              'projectId': this.dataForm.projectId,
              'shopId': this.dataForm.shopId,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'desc': this.dataForm.desc,
              'title': this.dataForm.title,
              'applyId': this.dataForm.applyId,
              'realFileList': fullFileList
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsapplypublicity/${!this.dataForm.id ? 'save' : 'update'}`),
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
      fileChangeHandle(file, List) {
        this.changeHandle(file, this.fileList);
      },
      //  根据类型进行md5查重，
      changeHandle(file, list) {
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
            this.fileUpload(file);
          }
        });
      },

      // 重定义文件上传
      fileUpload(file) {
        let fileFormData = new FormData();
        fileFormData.append('file', file.raw); // 第一个参数是键，第二个参数是值，就是要传的文件
        this.$http({
          url: this.$http.adornUrl(`/sys/oss/upload2?token=${this.$cookie.get('token')}`),
          method: 'post',
          data: fileFormData
        }).then((response) => {
          let data = response.data;
          if (data && data.code === 0) {
            this.successHandle(data, file.raw, this.fileList);
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

      // 文件达到最大数量
      exceed() {
        this.$message({
          message: '此类文件已达到最大上传量！',
          type: 'warning'
        });
      },
      changeShop(pushId) {
        this.ApplyListOptions = [];//先清空
        this.selectApplyList(this.dataForm.projectId, pushId,0);
      },
      // selectShopType(parentId) {
      //   let paramsV = {
      //     parentId: parentId
      //   };
      //   this.$http({
      //     url: this.$http.adornUrl(`/format/tformatshoptype/select2`),
      //     method: 'get',
      //     params: paramsV
      //   }).then(({data}) => {
      //     if (data) {
      //       if (parentId == 0) {
      //         this.BigTypeListOptions = data.list;
      //       } else {
      //         this.SubTypeListOptions = data.list;
      //       }
      //     }
      //   });
      // },
      // 情况铺位小类
      // clearSubType() {
      //   this.dataForm.subTypeList = [];
      // },
      // 根据数据库列表
      // selectTableList(tableName, value, label) {
      //   let paramsV = {
      //     tableName: tableName,
      //     value: value,
      //     label: label
      //   };
      //   this.$http({
      //     url: this.$http.adornUrl(`/sys/table/list`),
      //     method: 'get',
      //     params: paramsV
      //   }).then(({data}) => {
      //     if (data) {
      //       this.ProjectIdListOptions = data.list;
      //     }
      //   });
      // },

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

      selectShopList(projectId) {
        this.clearShopList();
        let paramV = {state: '1'};
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshoppublish/selectPulicity/` + projectId),
          method: 'get',
          params: paramV
        }).then(({data}) => {
          if (data) {
            this.ShopListOptions = data.list;
          }
        });
      },
      // //清空铺位列表
      clearShopList() {
        this.ShopListOptions = [];
        this.dataForm.shopId = '';
      },

      // 查询二审通过的信息 isSuccess = 1竞租成功，0二审通过
      selectApplyList(projectId, pushId , isSuccess) {
        let paramV = {
          projectId: projectId,
          pushId: pushId,
          isSuccess: isSuccess
        };
        this.$http({
          url: this.$http.adornUrl(`/bunk/tmerchantsapply/second/success`),
          method: 'get',
          params: paramV
        }).then(({data}) => {
          if (data) {
            this.ApplyListOptions = data;
          }
        });
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
