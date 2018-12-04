<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
      <el-form-item label="报名类型" prop="type">
        <el-radio-group v-model="dataForm.type"  readonly="true" >
          <el-radio :label="'1'">个人</el-radio>
          <el-radio :label="'2'">商户</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="dataForm.type == '1'">
         <el-form-item label="真实姓名" prop="realName" >
           <el-input v-model="dataForm.realName" placeholder="真实姓名" readonly="true" ></el-input>
         </el-form-item>
         <el-form-item label="身份证号码" prop="idNumber">
           <el-input v-model="dataForm.idNumber" placeholder="身份证号码" readonly="true" ></el-input>
         </el-form-item>
      </template>
      <template v-else>
          <el-form-item label="公司名称" prop="companyName">
                 <el-input v-model="dataForm.companyName" placeholder="公司名称" readonly="true" ></el-input>
          </el-form-item>
          <el-form-item label="营业执照" prop="businessLicense">
               <el-input v-model="dataForm.businessLicense" placeholder="营业执照" readonly="true" ></el-input>
          </el-form-item>
          <el-form-item label="社会统一信用号码" prop="socialUnifiedCreditNumber">
               <el-input v-model="dataForm.socialUnifiedCreditNumber" placeholder="社会统一信用号码" readonly="true" ></el-input>
          </el-form-item>
          <el-form-item label="法人姓名" prop="legalPersonName">
              <el-input v-model="dataForm.legalPersonName" placeholder="法人姓名" readonly="true" ></el-input>
          </el-form-item>
      </template>
      <el-form-item label="是否首次开店" prop="isFirst">
           <el-radio-group v-model="dataForm.isFirst" readonly="true" >
             <el-radio :label="'1'">是</el-radio>
             <el-radio :label="'0'">否</el-radio>
           </el-radio-group>
      </el-form-item>
      <!--<el-form-item label="经验履历" prop="experience">
	     <el-input v-model="dataForm.experience" placeholder="经验履历"></el-input>
      </el-form-item>-->
      <el-form-item label="经营模式" prop="bigType">
        <el-select v-model="dataForm.modeType" :disabled="isDisabled"  placeholder="经营模式">
          <el-option
            v-for="item in MODE_TYPE_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌大类" prop="bigTypeName">
        <el-input v-model="dataForm.bigTypeName" placeholder="品牌大类" readonly="true" ></el-input>
      </el-form-item>
      <el-form-item label="品牌小类" prop="subTypeName">
        <el-input v-model="dataForm.subTypeName" placeholder="品牌小类" readonly="true" ></el-input>
      </el-form-item>
      <el-form-item label="经营履历" prop="isFirst">
            <el-table
              :data="dataForm.businessHistory"
              class="special-table"
              border>
              <el-table-column
                prop="brandName"
                label="品牌名称"
                width="120">
              </el-table-column>
  <!--            <el-table-column
                prop="date"
                label="时间"
                width="180">
              </el-table-column>-->
              <el-table-column
                prop="bigTypeName"
                label="品牌大类"
                width="80">
              </el-table-column>
              <el-table-column
                prop="subTypeName"
                label="品牌小类"
                width="80">
              </el-table-column>
              <el-table-column
                prop="modeType"
                label="经营模式"
                width="180">
              </el-table-column>
              <el-table-column
                prop="address"
                label="门店地址/首次开店">
              </el-table-column>
            </el-table>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contactName">
        <el-input v-model="dataForm.contactName" readonly="true" placeholder="联系人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactPhone">
        <el-input v-model="dataForm.contactPhone" readonly="true" placeholder="联系人电话"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="contactAddress">
        <el-input v-model="dataForm.contactAddress" readonly="true" placeholder="联系地址"></el-input>
      </el-form-item>

      <el-form-item label="个人资料" prop="fileList" v-if="fileList.length !== 0" class="apply-class">
        <div class="m-filebox" v-for="(file, index) in fileList" :key="file.fileId" >
          <div class="u-showfile" @click="showFile(file.url)" :style="{'background-image': 'url(' + file.imgurl + ')'}"  title="预览"></div>
          <div class="u-filename" :title="file.name">
            <span>{{file.name}}</span>
          </div>
          <a v-if="file.packageType === '6-1'" class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">营业执照</a>
          <a v-if="file.packageType === '6-2'" class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">计划书/方案</a>
          <a v-if="file.packageType === '6-3'" class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">特许经营许可</a>
          <a v-if="file.packageType === '6-4'" class="u-tagname" @click="downloadFile(file.fileId,file.name)" title="下载">其他</a>
        </div>
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
        staticImg: './static/img/',
        fileListLoading: false,
        fileList: [],
        visible: false,
        MODE_TYPE_Options: [],
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          userId: '',
          realName: '',
          idNumber: '',
          companyName: '',
          type: '1',
          businessLicense: '',
          socialUnifiedCreditNumber: '',
          legalPersonName: '',
          isFirst: '',
          experience: '',
          contactName: '',
          contactPhone: '',
          contactAddress: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          companyId: '',
          businessHistory: []
        },
        dataRule: {
          userId: [
            { required: true, message: '用户ID不能为空', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ]
        }
      };
    },
	  mounted: function() {

    },
    created: function() {
      this.selectDictList_MODE_TYPE('MODEL_TYPE');
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.fileList = [];// 清空之前的文件数据
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsbidrent/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.entity;
                  // 文件分类与格式化
                  for (let i = 0; i < this.dataForm.realFileEntityList.length; i++) {
                  this.fileList.push(this.modifytype({
                    'id': this.dataForm.realFileEntityList[i].id,
                    'fileId': this.dataForm.realFileEntityList[i].fileId,
                    'packageId': this.dataForm.realFileEntityList[i].packageId,
                    'url': this.dataForm.realFileEntityList[i].url,
                    'packageType': this.dataForm.realFileEntityList[i].packageType,
                    'name': this.dataForm.realFileEntityList[i].fileName,
                    'md5': this.dataForm.realFileEntityList[i].md5
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
            var params = {
              'id': this.dataForm.id || undefined,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'userId': this.dataForm.userId,
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
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'companyId': this.dataForm.companyId
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsbidrent/${!this.dataForm.id ? 'save' : 'update'}`),
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
      selectDictList_MODE_TYPE(dictType) {
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdict/select/` + dictType),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data) {
            this.MODE_TYPE_Options = data;
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
  .special-table >>> table th{
    height: 36px;
    padding: 0;
    background-color: #c8c8c8;
    line-height: 36px;
    color: #606266;
  }
</style>
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
