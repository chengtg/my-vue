<template>
  <el-dialog
    :title="pageTitle"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
	     <el-form-item label="发布标题" prop="title">
            <el-input v-model="dataForm.title" :disabled="isDisabled"  placeholder="发布标题"></el-input>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="dataForm.projectId" @change="selectShopList" clearable @clear="clearShopList" filterable :disabled="isDisabled" placeholder="请选择商业项目" style="width:100%;">
          <el-option
            v-for="item in ProjectIdListOptions"
            :key="item.id +''"
            :label="item.cbdName"
            :value="item.id +''">
          </el-option>
        </el-select>
      </el-form-item>
	     <el-form-item label="铺位编号" prop="shopId">
         <!--@visible-change="dropShopList"-->
         <el-select v-model="dataForm.shopId"  @change="defaultShopType"  :disabled="isDisabled" placeholder="请选择铺位">
         <el-option
           v-for="item in ShopListOptions"
           :key="item.id"
           :label="item.shopNum"
           :value="item.id">
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
        <el-select v-model="dataForm.subTypeList" multiple :disabled="isDisabled" placeholder="铺位小类" style="width:100%;">
          <el-option
            v-for="item in SubTypeListOptions"
            :key="item.id +''"
            :label="item.brandName"
            :value="item.id +''">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="报名开始时间" prop="applyStartTime">
        <el-date-picker v-model="dataForm.applyStartTime"  type="datetime"   placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="isDisabled" style="width:200px;"> </el-date-picker>
      </el-form-item>
      <el-form-item label="报名结束时间" prop="applyEndTime">
            <el-date-picker v-model="dataForm.applyEndTime"  type="datetime"  placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss"  :disabled="isDisabled" style="width:200px;"> </el-date-picker>
      </el-form-item>-->
      <el-form-item label="报名时间" prop="dataTime">
          <el-date-picker
            v-model="dataForm.dataTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:00:00', '17:30:00']">
          </el-date-picker>
      </el-form-item>
	     <el-form-item label="最短租期" prop="shortestLease">
         <el-input-number v-model="dataForm.shortestLease" :step="1" :disabled="isDisabled" placeholder="最短租期/月" style="width:200px;"></el-input-number>
       <span style="color:gray; font-size:12px; margin-left:10px;">月</span>
      </el-form-item>
	     <el-form-item label="底价" prop="floorPrice">
          <el-input-number v-model="dataForm.floorPrice" :precision="2" :step="0.01" :disabled="isDisabled" placeholder="最短租期/月" style="width:200px;"></el-input-number>
          <span style="color:gray; font-size:12px; margin-left:10px;">元/天/平</span>
      </el-form-item>
	     <el-form-item label="物业费" prop="propertyPrice">
         <el-input-number v-model="dataForm.propertyPrice" :precision="2" :step="0.01" :disabled="isDisabled" placeholder="最短租期/月" style="width:200px;"></el-input-number>
         <span style="color:gray; font-size:12px; margin-left:10px;">元/月/平</span>
      </el-form-item>
	     <el-form-item label="其他费用" prop="otherPrice">
            <el-input v-model="dataForm.otherPrice" placeholder="其他费用" :disabled="isDisabled" ></el-input>
      </el-form-item>
	     <el-form-item label="付款周期" prop="paymentCycle">
            <el-input v-model="dataForm.paymentCycle" placeholder="付款周期" :disabled="isDisabled" ></el-input>
      </el-form-item>
      <el-form-item label="招商要求" prop="investRequired">
	     <el-input v-model="dataForm.investRequired" type="textarea" placeholder="招商要求" :disabled="isDisabled" ></el-input>
      </el-form-item>
	     <el-form-item label="发布内容" prop="content">
            <el-input v-model="dataForm.content" type="textarea" :autosize="{ minRows:3, maxRows: 6}" placeholder="发布内容" :disabled="isDisabled" ></el-input>
      </el-form-item>
	     <el-form-item label="是否是法人" prop="isLegal">
          <el-checkbox  v-model="dataForm.isLegal" true-label="1" false-label="0" :disabled="isDisabled" ></el-checkbox>
      </el-form-item>
	     <el-form-item label="是否有经营履历" prop="isBusinessHistory">
         <el-checkbox  v-model="dataForm.isBusinessHistory" true-label="1" false-label="0" :disabled="isDisabled" ></el-checkbox>
      </el-form-item>
	     <el-form-item label="是否是代理加盟" prop="isProxy">
         <el-checkbox  v-model="dataForm.isProxy" true-label="1" false-label="0" :disabled="isDisabled" ></el-checkbox>
      </el-form-item>
      <el-form-item label="是否热门铺位" prop="isHot">
        <el-checkbox  v-model="dataForm.isHot" true-label="1" false-label="0" :disabled="isDisabled" ></el-checkbox>
      </el-form-item>
      <el-form-item label="是否有效" prop="flag">
        <el-select v-model="dataForm.flag" placeholder="请选择是否有效" :disabled="isDisabled" >
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
      <el-form-item  label="标签"  prop="dynamicTags" :disabled="isDisabled" >
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
  </el-dialog>
</template>

<script>
export default {
  data() {
    // var validateStartTime = (rule, value, callback) => {
    //   if (!this.dataForm.applyStartTime && !/\S/.test(value)) {
    //     callback(new Error('报名开始时间不能为空1'));
    //   } else if (this.dataForm.applyEndTime) {
    //     if (this.dataForm.applyStartTime >= this.dataForm.applyEndTime) {
    //       callback(new Error('报名开始时间不能大于结束时间'));
    //     }
    //   } else {
    //     callback();
    //   }
    // };
    // var validateEndTime = (rule, value, callback) => {
    //   if (!this.dataForm.applyEndTime && !/\S/.test(value)) {
    //     callback(new Error('报名结束时间不能为空'));
    //   } else if (this.dataForm.applyStartTime) {
    //     if (this.dataForm.applyStartTime >= this.dataForm.applyEndTime) {
    //       callback(new Error('报名结束时间不能小于开始时间'));
    //     }
    //   } else {
    //     callback();
    //   }
    // };
    return {
      // 弹出框标题
      pageTitle: '',
      // 如果是审核页面,其他字段不可编辑
      isDisabled: false,
      isState: false,
      // 审核状态
      StateOptions: [
        {
          value: '0',
          label: '未审核'
        },
        {
          value: '1',
          label: '通过'
        },
        {
          value: '2',
          label: '不通过'
        }
      ],
      visible: false,
      FlagDictOptions: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },
        { label: '结束', value: '2' }
      ],
      ProjectIdListOptions: [],
      ShopListOptions: [],
      BigTypeListOptions: [],
      SubTypeListOptions: [],
      inputVisible: false, // 标签控制
      inputValue: '', // 标签值
      dataForm: {
        id: 0,
        title: '',
        projectId: '',
        status: '1',
        shopId: '',
        no: '',
        bigType: '',
        subType: '',
        applyEndTime: '',
        applyStartTime: '',
        shortestLease: '0',
        floorPrice: '0.00',
        propertyPrice: '',
        otherPrice: '',
        paymentCycle: '',
        isLegal: '1',
        isBusinessHistory: '',
        isProxy: '',
        flag: '1',
        investRequired: '',
        isHot: '0',
        tags: '',
        content: '',
        createId: '',
        createTime: '',
        updateId: '',
        updateTime: '',
        companyId: '',
        state: '0',
        auditInfo: '',
        orderNum: 1,
        dynamicTags: [],
        subTypeList: [],
        dataTime: []
      },
      dataRule: {
        title: [
          { required: true, message: '发布标题不能为空', trigger: 'blur' },
          { max: 100, message: '长度在 100 个字符之内', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '商业项目能为空', trigger: 'change' }
        ],
        shopId: [
          { required: true, message: '铺位编号不能为空', trigger: 'change' }
        ],
        bigType: [
          { required: true, message: '铺位类型(大类)不能为空', trigger: 'change' }
        ],
        // subType: [
        //   { required: true, message: '铺位类型(小类)不能为空', trigger: 'blur' }
        // ],
        // applyEndTime: [
        //   { required: true, message: '报名结束时间不能为空', trigger: 'blur' }
        // ],
        // applyStartTime: [
        //   { required: true, message: '报名开始时间不能为空', trigger: 'blur' }
        // ],
        dataTime: [
          { required: true, message: '报名时间不能为空', trigger: 'blur' }
        ],
        shortestLease: [
          { required: true, message: '最短租期/月不能为空', trigger: 'blur' }
        ],
        floorPrice: [
          { required: true, message: '底价(元)/天/平不能为空', trigger: 'blur'}
        ],
        dynamicTags: [
          { required: true, message: '标签不能为空', trigger: 'blur' }
        ],
        flag: [
          { required: true, message: '是否有效不能为空', trigger: 'blur' }
        ],
        otherPrice: [
          { max: 20, message: '长度在 20 个字符之内', trigger: 'blur' }
        ],
        paymentCycle: [
          { max: 255, message: '长度在 255 个字符之内', trigger: 'blur' }
        ],
        investRequired: [
          { max: 500, message: '长度在 500 个字符之内', trigger: 'blur' }
        ],
        content: [
          { max: 1000, message: '长度在 1000 个字符之内', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function() {
    // this.selectDictList('FLAG_TYPE');
    // this.selectTableList('t_project', 'id', 'cbd_name');
    // this.selectShopType(0);
  },

  created: function() {
    this.selectPorjectList()
    this.selectShopType(0)
  },
  methods: {
    // isState = 2查看，4审核后/pageTitle弹出框标题
    init(id, isState, pageTitle) {
      this.dataForm.id = id || 0
      this.pageTitle = pageTitle
      this.isState = isState

      this.isDisabled = isState
      this.dataForm.subTypeList = [] // 默认情空
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 重新初始化数组，控件初始化工具无法操作自定义对象，若再新增，将保留数据
        this.dataForm.dynamicTags = []
        // this.SubTypeListOptions = [];
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/bunk/tshoppublish/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.entity
              this.dataForm.projectId = data.entity.projectId + ''
              // this.selectSubType(data.entity.bigType);
              this.ShopListOptions = data.entity.shopListOptions
              this.SubTypeListOptions = data.entity.subTypeListOptions
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // console.log("-----"+this.dataForm.dataTime);
          // this.dataForm.applyStartTime = this.dataForm.dataTime.split(",")[0];
          // this.dataForm.applyEndTime = this.dataForm.dataTime.split(",")[1];
          // console.log("--start---"+this.dataForm.applyStartTime);
          var params = {
            id: this.dataForm.id || undefined,
            title: this.dataForm.title,
            projectId: this.dataForm.projectId,
            status: this.dataForm.status,
            shopId: this.dataForm.shopId,
            no: this.dataForm.no,
            bigType: this.dataForm.bigType,
            subType: this.dataForm.subType,
            applyEndTime: this.dataForm.dataTime[1],
            applyStartTime: this.dataForm.dataTime[0],
            shortestLease: this.dataForm.shortestLease,
            floorPrice: this.dataForm.floorPrice,
            propertyPrice: this.dataForm.propertyPrice,
            otherPrice: this.dataForm.otherPrice,
            paymentCycle: this.dataForm.paymentCycle,
            isLegal: this.dataForm.isLegal,
            isBusinessHistory: this.dataForm.isBusinessHistory,
            isProxy: this.dataForm.isProxy,
            flag: this.dataForm.flag,
            investRequired: this.dataForm.investRequired,
            isHot: this.dataForm.isHot,
            tags: this.dataForm.tags,
            content: this.dataForm.content,
            createId: this.dataForm.createId,
            createTime: this.dataForm.createTime,
            updateId: this.dataForm.updateId,
            updateTime: this.dataForm.updateTime,
            companyId: this.dataForm.companyId,
            orderNum: this.dataForm.orderNum,
            dynamicTags: this.dataForm.dynamicTags,
            subTypeList: this.dataForm.subTypeList,
            state: this.dataForm.state,
            auditInfo: this.dataForm.auditInfo,
            dataTime: this.dataForm.dataTime
          }
          if (this.isState) {
            var params2 = {
              id: this.dataForm.id,
              state: this.dataForm.state,
              auditInfo: this.dataForm.auditInfo
            }
            this.auditHandle(params2)
          } else {
            this.saveOrUpdate(params)
          }
        }
      })
    },
    // 保存或者更新
    saveOrUpdate(params) {
      this.$http({
        url: this.$http.adornUrl(
          `/bunk/tshoppublish/${!this.dataForm.id ? 'save' : 'update'}`
        ),
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 项目查询
    selectPorjectList() {
      let paramsV = {}
      this.$http({
        url: this.$http.adornUrl(`/format/tproject/select`),
        method: 'get',
        params: paramsV
      }).then(({ data }) => {
        if (data) {
          this.ProjectIdListOptions = data.select
        }
      })
    },
    auditHandle(params) {
      this.$http({
        url: this.$http.adornUrl(`/bunk/tshoppublish/audit`),
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 根据数据字典类型 查询数据字典列表
    selectDictList(dictType) {
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdict/select/` + dictType),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.FlagDictOptions = data
        }
      })
    },
    handleClose(tag) {
      this.dataForm.dynamicTags.splice(
        this.dataForm.dynamicTags.indexOf(tag),
        1
      )
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      // 最多输入5个标签
      if (this.dataForm.dynamicTags.length >= 5) {
        this.$message({
          message: '最多能添加5个标签',
          type: 'warning'
        })
        this.inputVisible = false
        this.inputValue = ''
      }
      // 验证重复性
      let inputValue = this.inputValue
      if (inputValue) {
        inputValue = inputValue.trim()
        if (inputValue.length > 4) {
          this.$message({
            message: '标签长度不能超过4',
            type: 'warning'
          })
          this.inputVisible = false
          this.inputValue = ''
          return
        }
        for (var i = 0; i < this.dataForm.dynamicTags.length; i++) {
          if (this.dataForm.dynamicTags[i] === inputValue) {
            this.$message({
              message: '该标签已存在',
              type: 'warning'
            })
            this.inputVisible = false
            this.inputValue = ''
            return
          }
        }
        this.dataForm.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    defaultShopType(shopId) {
      if (!this.dataForm.subType) {
        this.$http({
          url: this.$http.adornUrl(`/bunk/tshopinfo/info/` + shopId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data) {

            this.dataForm.bigType = data.entity.bigType
            this.selectShopType(this.dataForm.bigType);
            this.dataForm.subTypeList = data.entity.subTypeList
            this.dataForm.content = data.entity.situation
            this.dataForm.dynamicTags = data.entity.dynamicTags
          }
        })
      }
    },
    selectShopType(parentId) {
      let paramsV = {
        parentId: parentId
      }
      this.$http({
        url: this.$http.adornUrl(`/format/tformatshoptype/select2`),
        method: 'get',
        params: paramsV
      }).then(({ data }) => {
        if (data) {
          if (parentId == 0) {
            this.BigTypeListOptions = data.list
          } else {
            this.SubTypeListOptions = data.list
          }
        }
      })
    },
    selectSubType(val) {
      // alert(val);
      // this.SubTypeListOptions = [];
      this.selectShopType(val)
      this.dataForm.subTypeList = []
    },
    // 情况铺位小类
    clearSubType() {
      this.dataForm.subTypeList = []
    },
    // 根据数据库列表
    selectTableList(tableName, value, label) {
      let paramsV = {
        tableName: tableName,
        value: value,
        label: label
      }
      this.$http({
        url: this.$http.adornUrl(`/sys/table/list`),
        method: 'get',
        params: paramsV
      }).then(({ data }) => {
        if (data) {
          this.ProjectIdListOptions = data.list
        }
      })
    },
    selectShopList(projectId) {
      this.clearShopList()
      let paramV = { state: '1' }
      this.$http({
        url: this.$http.adornUrl(
          `/bunk/tshopinfo/selectByProjectId/` + projectId
        ),
        method: 'get',
        params: paramV
      }).then(({ data }) => {
        if (data) {
          this.ShopListOptions = data.list
        }
      })
    },
    // dropShopList(val){
    //   if (val == true) {
    //     this.$http({
    //       url: this.$http.adornUrl(`/bunk/tshopinfo/selectByProjectId/`+this.dataForm.projectId),
    //       method: 'get',
    //       params: this.$http.adornParams()
    //     }).then(({data}) => {
    //       if (data) {
    //         this.ShopListOptions = data.list;
    //       }
    //     });
    //   }
    // },
    // 情况铺位列表
    clearShopList() {
      this.ShopListOptions = []
      this.dataForm.shopId = ''
    }
  }
}
</script>
<style scoped>
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
.el-tag {
  margin-right: 10px;
}
</style>
