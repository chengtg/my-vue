<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    top="2vh"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="服务包名" prop="packageName">
        <el-input v-model="dataForm.packageName" placeholder="服务包名"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea"  placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="选择附件" prop="fileList" class="apply-class">
        <div class="m-filebox" v-for="(file, index) in fileList" :key="file.fileId" >
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
          :limit=5
          multiple
          :on-change="fileChangeHandle"
          :on-exceed="exceed">
          <i class="u-addbox"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否生效" prop="flag">
        <el-radio-group v-model="dataForm.flag">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import md5 from 'browser-md5-file';                         // api: https://github.com/forsigner/browser-md5-file
  export default {
    data() {
      return {
        staticImg: 'static/img/',
        fileListLoading: false,
        visible: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        fileList: [],
        options: [],
        url: '',
        dataForm: {
          id: 0,
          packageName: '',
          tags: '',
          areaId: '',
          remark: '',
          flag: '1',
          status: '',
          createId: '',
          createTime: '',
          updateId: '',
          updateTime: '',
          deptId: '',
          companyId: '',
          realFileEntityList: []
        },
        dataRule: {
          packageName: [
            { required: true, message: '服务包名不能为空', trigger: 'blur' },
            { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '是否生效不能为空', trigger: 'change' }
          ],
          remark: [
            { max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
          ]
        }
      };
    },
    // components: {
    //   browserMD5File
    // },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.fileList = [];
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          // 重新初始化数组，控件初始化工具无法操作自定义对象，若再次进行新增操作，相应数据将被保留，不为空
          this.dataForm.realFileEntityList = [];
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/oss/tserverpackage/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.tServerPackage;
                // 文件分类与格式化
                for (let i = 0; i < this.dataForm.realFileEntityList.length; i++) {
                  this.fileList.push(this.modifytype({
                    'id': this.dataForm.realFileEntityList[i].id,
                    'fileId': this.dataForm.realFileEntityList[i].fileId,
                    'packageId': this.dataForm.realFileEntityList[i].packageId,
                    'url': this.dataForm.realFileEntityList[i].url,
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
              'packageName': this.dataForm.packageName,
              'tags': this.dataForm.tags,
              'areaId': this.dataForm.areaId,
              'remark': this.dataForm.remark,
              'flag': this.dataForm.flag,
              'status': this.dataForm.status,
              'createId': this.dataForm.createId,
              'createTime': this.dataForm.createTime,
              'updateId': this.dataForm.updateId,
              'updateTime': this.dataForm.updateTime,
              'deptId': this.dataForm.deptId,
              'companyId': this.dataForm.companyId,
              'realFileEntityList': fullFileList
            };

            this.$http({
              url: this.$http.adornUrl(`/oss/tserverpackage/${!this.dataForm.id ? 'save' : 'update'}`),
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
      clearChildren(data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children.length === 0) {
            delete data[i].children;
          } else {
            this.clearChildren(data[i].children);
          }
        }
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
