<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
      <el-form-item label="铺位编号" prop="shopNum">
	        <el-input v-model="dataForm.shopNum" :disabled="isDisabled" placeholder="铺位编号"></el-input>
      </el-form-item>
      <el-form-item label="报名时间" prop="applyTime">
	         <el-input v-model="dataForm.applyTime" :disabled="isDisabled" placeholder="报名时间"></el-input>
      </el-form-item>
<!--      <el-form-item label="租金接受范围" prop="rentAcceptance">
	        <el-input v-model="dataForm.rentAcceptance" :disabled="isDisabled" placeholder="租金接受范围"></el-input>
      </el-form-item>
      <el-form-item label="期望租期时间" prop="expectedLeaseTime">
	         <el-input v-model="dataForm.expectedLeaseTime" :disabled="isDisabled" placeholder="期望租期时间"></el-input>
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
      <el-form-item label="铺位大类" prop="bigType">
        <!-- <el-input v-model="dataForm.bigType" placeholder="铺位大类"></el-input>-->
        <el-select v-model="dataForm.bigType" clearable filterable @change="selectSubType"  @clear="clearSubType"  :disabled="isDisabled"  placeholder="请选择分类">
          <el-option
            v-for="item in BigTypeListOptions"
            :key="item.id"
            :label="item.brandName"
            :value="item.id">
          </el-option>
        </el-select>
       </el-form-item>
       <el-form-item label="铺位小类" prop="subType" >
          <el-select v-model="dataForm.subTypeList"  multiple  :disabled="isDisabled"   placeholder="铺位小类">
            <el-option
              v-for="item in SubTypeListOptions"
              :key="item.id + ''"
              :label="item.brandName"
              :value="item.id +''">
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
        <el-form-item label="真实姓名"  prop="realName">
          <el-input v-model="dataForm.realName" :disabled="isDisabled"  placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码"   prop="idNumber">
          <el-input v-model="dataForm.idNumber"  :disabled="isDisabled" placeholder="身份证号码"></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="dataForm.companyName" :disabled="isDisabled"  placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item label="营业执照"   prop="businessLicense">
          <el-input v-model="dataForm.businessLicense"  :disabled="isDisabled" placeholder="营业执照"></el-input>
        </el-form-item>
        <el-form-item label="社会统一信用号码" prop="socialUnifiedCreditNumber">
          <el-input v-model="dataForm.socialUnifiedCreditNumber"  :disabled="isDisabled" placeholder="社会统一信用号码"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名" prop="legalPersonName">
          <el-input v-model="dataForm.legalPersonName" :disabled="isDisabled"  placeholder="法人姓名"></el-input>
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
     <!-- <el-form-item label="经验履历" prop="experience">
	     <el-input v-model="dataForm.experience" :disabled="isDisabled"  placeholder="经验履历"></el-input>
      </el-form-item>-->
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
	      <el-input v-model="dataForm.contactName" :disabled="isDisabled"  placeholder="联系人姓名"></el-input>
      </el-form-item>
	     <el-form-item label="联系人电话" prop="contactPhone">
	     <el-input v-model="dataForm.contactPhone" :disabled="isDisabled"  placeholder="联系人电话"></el-input>
      </el-form-item>
	     <el-form-item label="联系地址" prop="contactAddress">
	     <el-input v-model="dataForm.contactAddress"  :disabled="isDisabled" placeholder="联系地址"></el-input>
      </el-form-item>

      <el-form-item label="报名资料" prop="fileList" class="apply-class">
        <div class="m-filebox" v-for="(file, index) in fileList" :key="file.fileId" >
          <div class="u-showfile" @click="showFile(file.url)" :style="{'background-image': 'url(' + file.imgurl + ')'}"  title="预览"></div>
          <div class="u-filename" :title="file.name">
            <span>{{file.name}}</span>
          </div>
          <a v-if="file.packageType === '7-1'" class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">营业执照</a>
          <a v-if="file.packageType === '7-2'" class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">计划书/方案</a>
          <a v-if="file.packageType === '7-3'" class="u-tagname"  @click="downloadFile(file.fileId,file.name)" title="下载">特许经营许可</a>
          <a v-if="file.packageType === '7-4'" class="u-tagname" @click="downloadFile(file.fileId,file.name)" title="下载">其他</a>
        </div>
      </el-form-item>
      <el-form-item label="预审状态" prop="preAuditStatus">
        <el-select v-model="dataForm.preAuditStatus" :disabled="isDisabled"  placeholder="选择审核状态"  >
          <el-option
            v-for="item in AUDIT_TYPE_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预审审核人" prop="preAuditorName">
        <el-input v-model="dataForm.preAuditorName"  :disabled="isDisabled" placeholder="预审审核人"></el-input>
      </el-form-item>
      <el-form-item label="预审时间" prop="preAuditTime">
        <el-input v-model="dataForm.preAuditTime"  :disabled="isDisabled" placeholder="预审审核时间"></el-input>
      </el-form-item>
      <el-form-item label="预审信息" prop="preAuditInfo">
        <el-input v-model="dataForm.preAuditInfo" :disabled="isDisabled"  placeholder="预审审核信息"></el-input>
      </el-form-item>
      <el-form-item label="二审状态" prop="secondAuditStatus">
        <el-select v-model="dataForm.secondAuditStatus" :disabled="isDisabled"  placeholder="选择审核状态"  >
          <el-option
            v-for="item in AUDIT_TYPE_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二审审核人" prop="secondAuditorName">
        <el-input v-model="dataForm.secondAuditorName"  :disabled="isDisabled" placeholder="二审审核人"></el-input>
      </el-form-item>
      <el-form-item label="二审时间" prop="secondAuditTime">
        <el-input v-model="dataForm.secondAuditTime"  :disabled="isDisabled" placeholder="二审审核时间"></el-input>
      </el-form-item>
      <el-form-item label="二审信息" prop="secondAuditInfo">
        <el-input v-model="dataForm.secondAuditInfo" :disabled="isDisabled"  placeholder="二审审核信息"></el-input>
      </el-form-item>
      <el-form-item label="是否成功竞租" prop="isSucceed">
        <el-select v-model="dataForm.isSucceed" :disabled="isDisabled"  placeholder="是否成功竞租"  >
          <el-option
            v-for="item in YES_OR_NO_Options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="optState != 2" @click="dataFormSubmit()">确定</el-button>
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
        // 如果是审核页面,其他字段不可编辑
        isDisabled: false,
        optState: false,
        AUDIT_TYPE_Options: [],
        YES_OR_NO_Options: [{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
        BigTypeListOptions: [],
        SubTypeListOptions: [],

        visible: false,
        dataForm: {
          id: 0,
          flag: '1',
          status: '1',
          bidRentId: '',
          publishId: '',
          applyTime: '',
          rentAcceptance: '',
          expectedLeaseTime: '',
          bigType: '',
          subType: '',
          preAuditStatus: '',
          preAuditInfo: '',
          preAuditor: '',
          preAuditTime: '',
          secondAuditStatus: '',
          secondAuditInfo: '',
          secondAuditor: '',
          secondAuditTime: '',
          isSucceed: '0',
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
          subTypeList: []
        },
        dataRule: {
        }
      };
    },
	  mounted: function() {
      this.selectDictList('AUDIT_TYPE');
      this.selectShopType(0);
    },
    created: function() {
      this.selectDictList_MODE_TYPE('MODEL_TYPE');
    },
    methods: {
      init(id, optState) {
        this.dataForm.id = id || 0;

        this.optState = optState;
        this.isDisabled = optState == '2';// 0新增、1修改、2查看、3删除

        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          // 重新初始化数组，控件初始化工具无法操作自定义对象，若再次进行新增操作，相应数据将被保留，不为空
          this.dataForm.fileList = [];
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsapply/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.entity;
                  this.SubTypeListOptions = data.entity.subTypeListOptions;
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
              'bidRentId': this.dataForm.bidRentId,
              'publishId': this.dataForm.publishId,
              'applyTime': this.dataForm.applyTime,
              'rentAcceptance': this.dataForm.rentAcceptance,
              'expectedLeaseTime': this.dataForm.expectedLeaseTime,
              'bigType': this.dataForm.bigType,
              'subType': this.dataForm.subType,
              'preAuditStatus': this.dataForm.preAuditStatus,
              'preAuditInfo': this.dataForm.preAuditInfo,
              'preAuditor': this.dataForm.preAuditor,
              'preAuditTime': this.dataForm.preAuditTime,
              'secondAuditStatus': this.dataForm.secondAuditStatus,
              'secondAuditInfo': this.dataForm.secondAuditInfo,
              'secondAuditor': this.dataForm.secondAuditor,
              'secondAuditTime': this.dataForm.secondAuditTime,
              'isSucceed': this.dataForm.isSucceed,
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
              'subTypeList': this.dataForm.subTypeList
            };
            this.$http({
              url: this.$http.adornUrl(`/bunk/tmerchantsapply/${!this.dataForm.id ? 'save' : 'update'}`),
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
            this.AUDIT_TYPE_Options = data;
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
      defaultShopType(shopId) {
        if (this.dataForm.subType == '') {
          this.$http({
            url: this.$http.adornUrl(`/bunk/tshopinfo/info/` + shopId),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data) {
              this.dataForm.bigType = data.entity.bigType;
              this.dataForm.subTypeList = data.entity.subTypeList;
            }
          });
        }
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
            if (parentId == 0) {
              this.BigTypeListOptions = data.list;
            } else {
              this.SubTypeListOptions = data.list;
            }
          }
        });
      },
      selectSubType(val) {
        // alert(val);
        // this.SubTypeListOptions = [];
        this.selectShopType(val);
        this.dataForm.subTypeList = [];
      },
      // 情况铺位小类
      clearSubType() {
        this.dataForm.subTypeList = [];
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

