<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    top="2em"
    width="80%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px" inline  class="m-relativebox">
      <el-form-item label="数据库" prop="database">
        <el-select v-model="dataForm.database" filterable placeholder="数据库" @change="databaseChange" class="u-textbox">
          <el-option
            v-for="item in databaseOptions"
            :key="item.id"
            :label="item.database"
            :value="item.database"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表名称" prop="tableName">
        <el-select v-model="dataForm.tableName" filterable placeholder="表名称" @change="tableChange" class="u-textbox">
          <el-option
            v-for="item in tableOptions"
            :key="item.id"
            :label="item.tableName"
            :value="item.tableName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input v-model="dataForm.tableComment" placeholder="表描述"  class="u-textbox"></el-input>
      </el-form-item>
      <el-form-item label="模块名称" prop="moduleName">
        <el-input v-model="dataForm.moduleName" placeholder="模块名称(英文)" class="u-textbox"></el-input>
      </el-form-item>
      <el-form-item label="代码包名" prop="packName">
        <el-input v-model="dataForm.packName" placeholder="io.renren(英文)" class="u-textbox"></el-input>
      </el-form-item>
      <el-form-item label="主键类型" prop="jformPkType">
        <el-select v-model="dataForm.jformPkType" placeholder="" class="u-textbox">
          <el-option label="自增" :value="'AUTO'" ></el-option>
          <el-option label="UUID" :value="'UUID'" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="前端代码路径" prop="frontUrl">
        <el-input v-model="dataForm.frontUrl" placeholder="根路径:加/" class="u-textbox"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="frontUrl">
        <el-input v-model="dataForm.frontMenu" placeholder="如：format/brands" class="u-textbox"></el-input>
      </el-form-item>
      <el-form-item label="是否带checkbox" prop="isCheckbox" class="u-checkbox">
        <el-checkbox v-model="dataForm.isCheckbox" true-label="YES" false-label="NO"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否分页" prop="isPagination" class="u-checkbox">
        <el-checkbox  v-model="dataForm.isPagination" true-label="YES" false-label="NO"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否是树" prop="isTree" class="u-checkbox">
        <el-checkbox  v-model="dataForm.isTree" true-label="YES" false-label="NO"></el-checkbox>
      </el-form-item>
      <el-form-item label="设置组织权限" prop="isAuth" class="u-checkbox">
        <el-checkbox   v-model="dataForm.isAuth" true-label="YES" false-label="NO"></el-checkbox>
      </el-form-item>
      <el-button type="primary" @click="appendTable()" class="u-floatbutton">新增</el-button>
    </el-form>
    <el-tabs  v-model="activeName" type="card">
      <el-tab-pane label="页面属性" name="first">
        <el-table
        ref="pageEnityList"
        :data="dataForm.pageEnityList"
        border
        :cell-style="getCellClass"
        :default-sort = "{prop: 'orderNum', order: 'ascending'}"
        >
          <el-table-column
            fixed
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            fixed
            prop="orderNum"
            header-align="center"
            align="center"
            label="序号">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.orderNum" :min="1" size="mini" controls-position="right" style="width:85px" @change="changeNum"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="fieldName"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="字段名字">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isOld === false"  v-model="scope.row.fieldName" size="mini"></el-input>
              <span v-else>{{scope.row.fieldName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="content"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="字段备注">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isOld === false"  v-model="scope.row.content" size="mini"></el-input>
              <span v-else>{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="type"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="类型"
            width="80">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isOld === false"  v-model="scope.row.type" size="mini"></el-input>
              <span v-else>{{scope.row.type}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="length"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="长度"
            width="70">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isOld === false"  v-model="scope.row.length" size="mini"></el-input>
              <span v-else>{{scope.row.length}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="isKey"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="主键"
            width="50">
            <template slot-scope="scope">
                <el-checkbox v-if="scope.row.isOld === false" :checked="scope.row.isKey === 'YES'"></el-checkbox>
                <el-checkbox v-else :checked="scope.row.isKey === 'YES'" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="fieldLabel"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="页面描述">
            <template slot-scope="scope">
                <el-input v-model="scope.row.fieldLabel" size="mini"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="pointLength"
            header-align="center"
            align="center"
            label="小数点">
          </el-table-column> -->
          <el-table-column
            prop="showType"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="控件类型"
            width="148">
            <template slot-scope="scope">
                <el-select v-model="scope.row.showType" placeholder="" size="mini">
                   <el-option
                      v-for="item in FORM_CONTROLS"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                   </el-option>
                </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="fieldLength"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="长度"
            width="80">
            <template slot-scope="scope">
                <el-input v-model="scope.row.fieldLength" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="isNull"
            header-align="center"
            align="center"
            label="必填"
            show-overflow-tooltip
            width="50">
            <template slot-scope="scope">
                <el-checkbox  v-model="scope.row.isNull" true-label="YES" false-label="NO"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="isQuery"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="查询"
            width="148">
            <template slot-scope="scope">
                  <el-select v-model="scope.row.isQuery" size="mini">
                    <el-option
                      v-for="item in 	QUERY_TYPE"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="isShow"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="表单"
            width="50">
            <template slot-scope="scope">
                <el-checkbox   v-model="scope.row.isShow" true-label="YES" false-label="NO"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="isShowList"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="列表"
            width="50">
            <template slot-scope="scope">
                <el-checkbox   v-model="scope.row.isShowList" true-label="YES" false-label="NO"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="fieldDefault"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="默认值">
            <template slot-scope="scope">
                <el-input v-model="scope.row.fieldDefault" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="fieldDefault"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="操作"
            width="50">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="deleteHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="索引字典" name="second">
        <el-table
          ref="dictEnityList"
          :data="dataForm.pageEnityList"
          border
          :cell-style="getCellClass"
          :default-sort = "{prop: 'orderNum', order: 'ascending'}"
        >
          <el-table-column
            fixed
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            fixed
            prop="orderNum"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            fixed
            prop="fieldName"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="字段名字">
          </el-table-column>
          <el-table-column
            prop="content"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="字段备注">
          </el-table-column>
          <el-table-column
            prop="mainTable"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="外键主表名">
            <template slot-scope="scope">
              <el-select v-model="scope.row.mainTable" filterable clearable  placeholder="" size="mini"
                @change="fieldTableChange(scope.row.mainTable,scope.row,-1)">
                  <el-option
                    v-for="item in tableOptions"
                    :key="item.tableName"
                    :label="item.tableComments"
                    :value="item.tableName">
                  </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="mainField"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="外键主键字段">
            <template slot-scope="scope">
              <el-select
                ref="mainField"
                v-model="scope.row.mainField"
                filterable
                clearable
                placeholder=""
                size="mini">
                  <el-option
                    v-for="item in scope.row.fieldTableOptions"
                    :key="item.fieldName"
                    :label="item.fieldLabel"
                    :value="item.fieldName">
                  </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="oldFieldName"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="外键显示字段">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.oldFieldName"
                filterable
                multiple
                clearable
                collapse-tags
                placeholder=""
                size="mini">
                  <el-option
                    v-for="item in scope.row.fieldTableOptions"
                    :key="item.fieldName"
                    :label="item.fieldLabel"
                    :value="item.fieldName">
                  </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="dictField"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="字典类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dictField" filterable  clearable placeholder="" size="mini">
                <el-option
                  v-for="item in dictTableOptions"
                  :key="item.dictType"
                  :label="item.label"
                  :value="item.dictType">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        <!--  <el-table-column
            prop="dictText"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="字典Text">
            <template slot-scope="scope">
                <el-input v-model="scope.row.dictText" size="mini"></el-input>
            </template>
          </el-table-column>-->
        </el-table>
      </el-tab-pane>
    </el-tabs>
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
        activeName: 'first',
        visible: false,
        FORM_CONTROLS: [],
        QUERY_TYPE: [],
        databaseOptions: [],
        tableOptions: [],
        dictTableOptions: [],
        fieldTableOptions: [],
        dictOptions: [],
        activerow: '',
        dataForm: {
          id: 0,
          tableComment: '',
          createBy: '',
          createDate: '',
          createName: '',
          isCheckbox: '',
          isDbsynch: '',
          isPagination: '',
          isTree: '',
          jformPkSequence: '',
          jformPkType: 'AUTO',
          jformType: '',
          jformVersion: '',
          querymode: '',
          relationType: '',
          subTableStr: '',
          tabOrder: '',
          tableName: '',
          updateBy: '',
          updateDate: '',
          updateName: '',
          treeParentidFieldname: '',
          treeIdFieldname: '',
          treeFieldname: '',
          jformCategory: '',
          formTemplate: '',
          formTemplateMobile: '',
          tableType: '',
          tableVersion: '',
          physiceId: '',
          isAuth: '',
          packName: 'io.renren.modules',
          moduleName: '',
          database: '',
          frontUrl: 'F:\\招租系统\\business-leasing\\business-leasing-vue\\',
          frontMenu: '',
          pageEnityList: [],
          dictEnityList: []
        },
        dataRule: {
          tableComment: [
            { required: true, message: '表描述不能为空', trigger: 'blur' }
          ],
          jformPkType: [
             { required: true, message: '主键类型不能为空', trigger: 'blur' }
           ],
          tableName: [
            { required: true, message: '表名不能为空', trigger: 'blur' }
          ],
          jformCategory: [
            { required: true, message: '表单分类不能为空', trigger: 'blur' }
          ],
          frontUrl: [
            { required: true, message: '前端代码路径', trigger: 'blur' }
          ],
          frontMenu: [
            { required: true, message: '菜单路径', trigger: 'blur' }
          ],
          packName: [
            { required: true, message: '代码包名不能为空', trigger: 'blur' }
          ],
          moduleName: [
            { required: true, message: '模块名称不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    created: function() {
      this.selectDict();
    },
    mounted: function() {
      this.selectDictList('FORM_CONTROLS');
      this.selectDictList('QUERY_TYPE');
    },
    methods: {
      init(id) {
        this.selectDict();
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.databaseOptions = [];
          this.tableOptions = [];
          this.dictTableOptions = [];
          this.fieldTableOptions = [];
          this.dataForm.pageEnityList = [];
          this.dataForm.dictEnityList = [];
          this.$http({
            url: this.$http.adornUrl(`/generator/cgformdatabase/fulllist`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.databaseOptions = data.list;
            if (this.dataForm.id) {
                this.$http({
                  url: this.$http.adornUrl(`/generator/cgformtable/info/${this.dataForm.id}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                if (data && data.code === 0) {
                    this.dataForm = data.cgformTable;
                    // this.dataForm.pageEnityList = data.cgformTable.pageEnityList;
                    for (let i = 0; i < this.dataForm.pageEnityList.length; i++) {
                      this.dataForm.pageEnityList[i].isOld = true;
                      this.dataForm.pageEnityList[i].fieldTableOptions = [];
                      if (this.dataForm.pageEnityList[i].mainTable && this.dataForm.pageEnityList[i].mainTable !== '') {
                        this.fieldTableChange(this.dataForm.pageEnityList[i].mainTable, '', i);
                      }
                      if (this.dataForm.pageEnityList[i].oldFieldName && this.dataForm.pageEnityList[i].oldFieldName !== '') {
                        let oldFieldNameArray = this.dataForm.pageEnityList[i].oldFieldName.split(',');
                        this.dataForm.pageEnityList[i].oldFieldName = oldFieldNameArray;
                      }
                    }
                    this.databaseChange(this.dataForm.database);
                }
              });
            }
          });
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
                  if (dictType === 'QUERY_TYPE') {
                    this.QUERY_TYPE = data;
                  }
                  if (dictType === 'FORM_CONTROLS') {
                    this.FORM_CONTROLS = data;
                  }
                }
            });
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            for (let i = 0; i < this.dataForm.pageEnityList.length; i++) {
              this.dataForm.pageEnityList[i].oldFieldName = this.dataForm.pageEnityList[i].oldFieldName.join();
            }
            var params = {
              'id': this.dataForm.id || undefined,
              'tableComment': this.dataForm.tableComment,
              'createBy': this.dataForm.createBy,
              'createDate': this.dataForm.createDate,
              'createName': this.dataForm.createName,
              'isCheckbox': this.dataForm.isCheckbox,
              'isDbsynch': this.dataForm.isDbsynch,
              'isPagination': this.dataForm.isPagination,
              'isTree': this.dataForm.isTree,
              'jformPkSequence': this.dataForm.jformPkSequence,
              'jformPkType': this.dataForm.jformPkType,
              'jformType': this.dataForm.jformType,
              'jformVersion': this.dataForm.jformVersion,
              'querymode': this.dataForm.querymode,
              'relationType': this.dataForm.relationType,
              'subTableStr': this.dataForm.subTableStr,
              'tabOrder': this.dataForm.tabOrder,
              'tableName': this.dataForm.tableName,
              'updateBy': this.dataForm.updateBy,
              'updateDate': this.dataForm.updateDate,
              'updateName': this.dataForm.updateName,
              'treeParentidFieldname': this.dataForm.treeParentidFieldname,
              'treeIdFieldname': this.dataForm.treeIdFieldname,
              'treeFieldname': this.dataForm.treeFieldname,
              'jformCategory': this.dataForm.jformCategory,
              'formTemplate': this.dataForm.formTemplate,
              'formTemplateMobile': this.dataForm.formTemplateMobile,
              'tableType': this.dataForm.tableType,
              'tableVersion': this.dataForm.tableVersion,
              'physiceId': this.dataForm.physiceId,
              'isAuth': this.dataForm.isAuth,
              'packName': this.dataForm.packName,
              'moduleName': this.dataForm.moduleName,
              'database': this.dataForm.database,
              'frontUrl': this.dataForm.frontUrl,
              'frontMenu': this.dataForm.frontMenu,
              'pageEnityList': this.dataForm.pageEnityList
              // 'dictEnityList': this.dataForm.dictEnityList
            };
           this.$http({
              url: this.$http.adornUrl(`/generator/cgformtable/${!this.dataForm.id ? 'save' : 'update'}`),
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
      databaseChange(val) {
        this.dataForm.database = val;
        let params = {
          'database': val
        };
        this.$http({
            url: this.$http.adornUrl(`/generator/cgformdatabase/table`),
            method: 'get',
            params: params
          }).then(({data}) => {
            this.tableOptions = data.data;
        });
      },
      tableChange(val) {
        let params = {
          'database': this.dataForm.database,
          'tableName': val
        };
        this.$http({
          url: this.$http.adornUrl(`/generator/cgformtable/tableInfo`),
          method: 'get',
          params: params
        }).then(({data}) => {
          if (data && data.code === 0) {
              this.dataForm.tableComment = data.cgformTable.tableComment || '';
              this.dataForm.pageEnityList = data.cgformTable.pageEnityList;
              // this.dataForm.dictEnityList = data.cgformTable.pageEnityList;
              for (let i = 0; i < this.dataForm.pageEnityList.length; i++) {
                this.dataForm.pageEnityList[i].isOld = true;
              }
          }
        });
      },
      fieldTableChange(val, row, index) {
        console.log(1);
        let listnum = index;
        this.fieldTableOptions = [];
        let params = {
          'database': this.dataForm.database,
          'tableName': val
        };
        this.$http({
          url: this.$http.adornUrl(`/generator/cgformtable/selectTableInfo`),
          method: 'get',
          params: params
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (index === -1) {
              for (let i = 0; i < this.dataForm.pageEnityList.length; i++) {
                if (this.dataForm.pageEnityList[i] === row) {
                  listnum = i;
                  break;
                }
              }
            }
            this.dataForm.pageEnityList[listnum].fieldTableOptions = data.fieldList;
            this.$set(this.dataForm.pageEnityList, listnum, this.dataForm.pageEnityList[listnum]);
          }
        });
      },
      getCellClass({row, column, rowIndex, columnIndex}) {
        return 'padding: 3px 0;';
      },
      changeNum() {
        this.$refs.pageEnityList.sort('orderNum', 'ascending');
        this.$refs.dictEnityList.sort('orderNum', 'ascending');
      },
      appendTable() {
        this.dataForm.pageEnityList.push({'isOld': false});
      },
      deleteHandle(enity) {
        for (let i = 0; i < this.dataForm.pageEnityList.length; i++) {
          if (this.dataForm.pageEnityList[i] === enity) {
            this.dataForm.pageEnityList.splice(i, 1);
          }
        }
        // this.dataForm.pageEnityList.push({});
      },
      selectDict() {
        let params = {
        };
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdict/select`),
          method: 'get',
          params: params
        }).then(({data}) => {
          // console.log("数据字典===" + data)
          this.dictTableOptions = data;
        });
      }
    }
  };
</script>
<style scoped>
  .el-form-item{
    margin-bottom: 10px;
  }
  .u-textbox{
    width: 300px;
  }
  .u-checkbox{
    margin-right: 64px;
  }
  .m-relativebox{
    position: relative;
    z-index: 1;
  }
  .u-floatbutton{
    position: absolute;
    left: 225px;
    bottom: -36px;
  }
</style>
