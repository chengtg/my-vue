<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字段备注" prop="content">
        <el-input v-model="dataForm.content" placeholder="字段备注"></el-input>
      </el-form-item>
      <el-form-item label="字典code" prop="dictField">
        <el-input v-model="dataForm.dictField" placeholder="字典code"></el-input>
      </el-form-item>
      <el-form-item label="字典表" prop="dictTable">
        <el-input v-model="dataForm.dictTable" placeholder="字典表"></el-input>
      </el-form-item>
      <el-form-item label="字典Text" prop="dictText">
        <el-input v-model="dataForm.dictText" placeholder="字典Text"></el-input>
      </el-form-item>
      <el-form-item label="表字段默认值" prop="fieldDefault">
        <el-input v-model="dataForm.fieldDefault" placeholder="表字段默认值"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fieldLength" placeholder="表单控件长度"></el-input>
      </el-form-item>
      <el-form-item label="字段名字" prop="fieldName">
        <el-input v-model="dataForm.fieldName" placeholder="字段名字"></el-input>
      </el-form-item>
      <el-form-item label="表单字段校验规则" prop="fieldValidType">
        <el-input v-model="dataForm.fieldValidType" placeholder="表单字段校验规则"></el-input>
      </el-form-item>
      <el-form-item label="字段是否必填" prop="fieldMustInput">
        <el-input v-model="dataForm.fieldMustInput" placeholder="字段是否必填"></el-input>
      </el-form-item>
      <el-form-item label="是否主键" prop="isKey">
        <el-input v-model="dataForm.isKey" placeholder="是否主键"></el-input>
      </el-form-item>
      <el-form-item label="是否允许为空" prop="isNull">
        <el-input v-model="dataForm.isNull" placeholder="是否允许为空"></el-input>
      </el-form-item>
      <el-form-item label="是否查询条件" prop="isQuery">
        <el-input v-model="dataForm.isQuery" placeholder="是否查询条件"></el-input>
      </el-form-item>
      <el-form-item label="表单是否显示" prop="isShow">
        <el-input v-model="dataForm.isShow" placeholder="表单是否显示"></el-input>
      </el-form-item>
      <el-form-item label="列表是否显示" prop="isShowList">
        <el-input v-model="dataForm.isShowList" placeholder="列表是否显示"></el-input>
      </el-form-item>
      <el-form-item label="数据库字段长度" prop="length">
        <el-input v-model="dataForm.length" placeholder="数据库字段长度"></el-input>
      </el-form-item>
      <el-form-item label="外键主键字段" prop="mainField">
        <el-input v-model="dataForm.mainField" placeholder="外键主键字段"></el-input>
      </el-form-item>
      <el-form-item label="外键主表名" prop="mainTable">
        <el-input v-model="dataForm.mainTable" placeholder="外键主表名"></el-input>
      </el-form-item>
      <el-form-item label="原字段名" prop="oldFieldName">
        <el-input v-model="dataForm.oldFieldName" placeholder="原字段名"></el-input>
      </el-form-item>
      <el-form-item label="原排列序号" prop="orderNum">
        <el-input v-model="dataForm.orderNum" placeholder="原排列序号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="小数点" prop="pointLength">
        <el-input v-model="dataForm.pointLength" placeholder="小数点"></el-input>
      </el-form-item>
      <el-form-item label="查询模式" prop="queryMode">
        <el-input v-model="dataForm.queryMode" placeholder="查询模式"></el-input>
      </el-form-item> -->
      <el-form-item label="表单控件类型" prop="showType">
        <el-input v-model="dataForm.showType" placeholder="表单控件类型"></el-input>
      </el-form-item>
      <el-form-item label="数据库字段类型" prop="type">
        <el-input v-model="dataForm.type" placeholder="数据库字段类型"></el-input>
      </el-form-item>
      <!-- <el-form-item label="修改人" prop="updateBy">
        <el-input v-model="dataForm.updateBy" placeholder="修改人"></el-input>
      </el-form-item>
      <el-form-item label="修改时间" prop="updateDate">
        <el-input v-model="dataForm.updateDate" placeholder="修改时间"></el-input>
      </el-form-item>
      <el-form-item label="修改人名称" prop="updateName">
        <el-input v-model="dataForm.updateName" placeholder="修改人名称"></el-input>
      </el-form-item>
      <el-form-item label="表ID" prop="tableId">
        <el-input v-model="dataForm.tableId" placeholder="表ID"></el-input>
      </el-form-item>
      <el-form-item label="扩展参数JSON" prop="extendJson">
        <el-input v-model="dataForm.extendJson" placeholder="扩展参数JSON"></el-input>
      </el-form-item>
      <el-form-item label="填值规则code" prop="fillRuleCode">
        <el-input v-model="dataForm.fillRuleCode" placeholder="填值规则code"></el-input>
      </el-form-item> -->
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
          content: '',
          createBy: '',
          createDate: '',
          createName: '',
          dictField: '',
          dictTable: '',
          dictText: '',
          fieldDefault: '',
          fieldHref: '',
          fieldLength: '',
          fieldName: '',
          fieldValidType: '',
          fieldMustInput: '',
          isKey: '',
          isNull: '',
          isQuery: '',
          isShow: '',
          isShowList: '',
          length: '',
          mainField: '',
          mainTable: '',
          oldFieldName: '',
          orderNum: '',
          pointLength: '',
          queryMode: '',
          showType: '',
          type: '',
          updateBy: '',
          updateDate: '',
          updateName: '',
          tableId: '',
          extendJson: '',
          fillRuleCode: ''
        },
        dataRule: {
          content: [
            { required: true, message: '字段备注不能为空', trigger: 'blur' }
          ],
          createBy: [
            { required: true, message: '创建人不能为空', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          createName: [
            { required: true, message: '创建人名字不能为空', trigger: 'blur' }
          ],
          dictField: [
            { required: true, message: '字典code不能为空', trigger: 'blur' }
          ],
          dictTable: [
            { required: true, message: '字典表不能为空', trigger: 'blur' }
          ],
          dictText: [
            { required: true, message: '字典Text不能为空', trigger: 'blur' }
          ],
          fieldDefault: [
            { required: true, message: '表字段默认值不能为空', trigger: 'blur' }
          ],
          fieldHref: [
            { required: true, message: '跳转URL不能为空', trigger: 'blur' }
          ],
          fieldLength: [
            { required: true, message: '表单控件长度不能为空', trigger: 'blur' }
          ],
          fieldName: [
            { required: true, message: '字段名字不能为空', trigger: 'blur' }
          ],
          fieldValidType: [
            { required: true, message: '表单字段校验规则不能为空', trigger: 'blur' }
          ],
          fieldMustInput: [
            { required: true, message: '字段是否必填不能为空', trigger: 'blur' }
          ],
          isKey: [
            { required: true, message: '是否主键不能为空', trigger: 'blur' }
          ],
          isNull: [
            { required: true, message: '是否允许为空不能为空', trigger: 'blur' }
          ],
          isQuery: [
            { required: true, message: '是否查询条件不能为空', trigger: 'blur' }
          ],
          isShow: [
            { required: true, message: '表单是否显示不能为空', trigger: 'blur' }
          ],
          isShowList: [
            { required: true, message: '列表是否显示不能为空', trigger: 'blur' }
          ],
          length: [
            { required: true, message: '数据库字段长度不能为空', trigger: 'blur' }
          ],
          mainField: [
            { required: true, message: '外键主键字段不能为空', trigger: 'blur' }
          ],
          mainTable: [
            { required: true, message: '外键主表名不能为空', trigger: 'blur' }
          ],
          oldFieldName: [
            { required: true, message: '原字段名不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '原排列序号不能为空', trigger: 'blur' }
          ],
          pointLength: [
            { required: true, message: '小数点不能为空', trigger: 'blur' }
          ],
          queryMode: [
            { required: true, message: '查询模式不能为空', trigger: 'blur' }
          ],
          showType: [
            { required: true, message: '表单控件类型不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '数据库字段类型不能为空', trigger: 'blur' }
          ],
          updateBy: [
            { required: true, message: '修改人不能为空', trigger: 'blur' }
          ],
          updateDate: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ],
          updateName: [
            { required: true, message: '修改人名称不能为空', trigger: 'blur' }
          ],
          tableId: [
            { required: true, message: '表ID不能为空', trigger: 'blur' }
          ],
          extendJson: [
            { required: true, message: '扩展参数JSON不能为空', trigger: 'blur' }
          ],
          fillRuleCode: [
            { required: true, message: '填值规则code不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
               this.$http({
              url: this.$http.adornUrl(`/generator/cgformfield/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                  this.dataForm = data.cgformField;
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
              'content': this.dataForm.content,
              'createBy': this.dataForm.createBy,
              'createDate': this.dataForm.createDate,
              'createName': this.dataForm.createName,
              'dictField': this.dataForm.dictField,
              'dictTable': this.dataForm.dictTable,
              'dictText': this.dataForm.dictText,
              'fieldDefault': this.dataForm.fieldDefault,
              'fieldHref': this.dataForm.fieldHref,
              'fieldLength': this.dataForm.fieldLength,
              'fieldName': this.dataForm.fieldName,
              'fieldValidType': this.dataForm.fieldValidType,
              'fieldMustInput': this.dataForm.fieldMustInput,
              'isKey': this.dataForm.isKey,
              'isNull': this.dataForm.isNull,
              'isQuery': this.dataForm.isQuery,
              'isShow': this.dataForm.isShow,
              'isShowList': this.dataForm.isShowList,
              'length': this.dataForm.length,
              'mainField': this.dataForm.mainField,
              'mainTable': this.dataForm.mainTable,
              'oldFieldName': this.dataForm.oldFieldName,
              'orderNum': this.dataForm.orderNum,
              'pointLength': this.dataForm.pointLength,
              'queryMode': this.dataForm.queryMode,
              'showType': this.dataForm.showType,
              'type': this.dataForm.type,
              'updateBy': this.dataForm.updateBy,
              'updateDate': this.dataForm.updateDate,
              'updateName': this.dataForm.updateName,
              'tableId': this.dataForm.tableId,
              'extendJson': this.dataForm.extendJson,
              'fillRuleCode': this.dataForm.fillRuleCode
            };
  this.$http({
              url: this.$http.adornUrl(`/generator/cgformfield/${!this.dataForm.id ? 'save' : 'update'}`),
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
