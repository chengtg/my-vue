<template>
    <el-dialog
    :title="title"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="visible">
    <!-- ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key  -->
      <baidu-map center="苏州"  class="map" ak='ePG1y13bPHrycC0ZPO6pgvpv9OwP5Hvn'
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        @click="getClickInfo"
        @moving="syncCenterAndZoom"
        @moveend="syncCenterAndZoom"
        @zoomend="syncCenterAndZoom"
        >
         <bm-view style="width: 100%; height:500px;"></bm-view>
        <bm-marker :position="{lng: position.lng, lat: position.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker>
        <bm-control offset="{width: '10px', height: '10px'}">
          <bm-auto-complete v-model="position.keyword" :sugStyle="{zIndex: 999999}">
            <input v-model="position.keyword" type="text" placeholder="请输入搜索关键字" class="serachinput">
          </bm-auto-complete>
        </bm-control>
        <bm-local-search :keyword="position.keyword" :auto-viewport="true" style="width:0px;height:0px;overflow: hidden;"></bm-local-search>
      </baidu-map>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map';

export default {
    data() {
      return {
        title: '地图',
        visible: true,
        position: {
           keyword: '',
           lat: 0,
           lng: 0
        },
        center: {lng: 116.404, lat: 39.915},
        zoom: 15
      };
    },
    components: {
      BaiduMap,
      BmControl,
      BmView,
      BmAutoComplete,
      BmLocalSearch,
      BmMarker
    },
    methods: {
      init(data) {
        // this.dataForm.id = id || 0;
        this.visible = true;
        console.log('init--' + data);
        console.log('keyword' + data.keyword);
        this.$nextTick(() => {
            this.position.keyword = data.keyword;
            this.position.lng = data.lng;
            this.position.lat = data.lat;
         });
      },
      resetkeyword() {
          this.$set(this.position, 'keyword', this.position.keyword);
      },
      dataFormSubmit() {
            if (!this.position.lng || !this.position.lat || this.position.lng == 0 || this.position.lat == 0) {
              this.$message.error('请在地图中点击位置');
              return;
            }
            this.$emit('mapinfo', this.position);
            this.visible = false;
      },
        /** *
       * 地图点击事件。
       */
      getClickInfo(e) {
        // console.log("e:"+e.point.keyword);
        this.position.lng = e.point.lng;
        this.position.lat = e.point.lat;
        },
      syncCenterAndZoom(e) {
        const {lng, lat} = e.target.getCenter();
        this.center.lng = lng;
        this.center.lat = lat;
        this.zoom = e.target.getZoom();
      }
    }
};
</script>

<style scoped>
  .map {
    width: 100%;
    height: 500px;
  }
  .serachinput{
  width: 300px;
  box-sizing: border-box;
  padding: 9px;
  border: 1px solid #dddee1;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 4px;
  -webkit-box-shadow: #666 0px 0px 10px;
  -moz-box-shadow: #666 0px 0px 10px;
  box-shadow: #666 0px 0px 10px;
}
</style>
