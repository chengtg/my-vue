<template>
  <el-dialog
    :title="'菜单SQL'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"   label-width="80px">
	     <el-form-item label="" prop="menusql">
            <el-input v-model="menusql" type="textarea" placeholder="描述" autosize="true"></el-input>
      </el-form-item>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        menusql: '',
        dataRule: {
        }
      };
    },
    methods: {
      init(id) {
        this.visible = true;
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`/generator/cgformtable/mensql/` + id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.menusql = data.data;
            }
          });
        });
      }
    }
  };
  </script>
