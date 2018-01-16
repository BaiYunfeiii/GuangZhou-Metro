<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Right Panel -->
    <f7-panel right cover layout="dark">
      <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar v-if="$theme.ios" title="Right Panel" sliding></f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-navbar v-if="$theme.material" title="所有线路" sliding></f7-navbar>
            <f7-list>
              <f7-list-item v-bind:title="l.ln" class="close-panel" v-on:click="showLine(l.ln)" v-for="l in lineList"></f7-list-item>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-panel>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
        <!-- Pages -->
        <f7-pages>
          <f7-page>
            <!-- Material Theme Navbar -->
            <f7-navbar v-if="$theme.material">
              <f7-nav-center sliding>广州地铁</f7-nav-center>
              <f7-nav-right>
                <f7-link open-panel="right" style="font-size:0.8em">线路</f7-link>
              </f7-nav-right>
            </f7-navbar>
            <!-- Page Content -->
            <f7-block>
              <amap-metro ref="metro" v-on:showStationDetails="showStationDetails" v-on:setStart="setStart" v-on:setEnd="setEnd"></amap-metro>
            </f7-block>
            <route-selector ref="routeSelector"></route-selector>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>

    <!-- Popup -->
    <f7-popup class="stationDetails">
      <f7-view navbar-fixed>
        <f7-pages>
          <f7-page>
            <f7-navbar v-bind:title="currentStation">
              <f7-nav-right>
                <f7-link close-popup>返回</f7-link>
              </f7-nav-right>
            </f7-navbar>
            <!-- 服务时间 -->
            <div v-for="l in currentStationTimeList.lineList">
            <f7-block-title>{{l.name}}</f7-block-title>
            <div class="data-table card" >
              <table>
                <thead>
                  <tr>
                    <th>方向</th>
                    <th>首班车</th>
                    <th>末班车</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in l.timeList">
                    <td>{{t.direction}}</td>
                    <td>{{t.start}}</td>
                    <td>{{t.end}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
            <!-- 出口详情 -->
            <f7-block-title>出口详情</f7-block-title>
            <div class="list-block accordion-list">
              <ul>
                <li class="accordion-item" v-for="e in currentStationObj.entrys">
                  <a class="item-link item-content">
                    <div class="item-inner">
                      <div class="item-title">{{e.entryname}}&nbsp;<span style="color:rgba(0,0,0,0.4);">出口</span></div>
                      <div class="item-after">{{e.resources[0].namecn}}</div>
                    </div>
                  </a>
                  <div class="accordion-item-content">
                    <f7-list>
                      <f7-list-item v-for="r in e.resources" v-bind:title="r.namecn" v-bind:link="'/placeInfo/'+r.namecn+'/'"></f7-list-item>
                    </f7-list>
                  </div>
                </li>
              </ul>
            </div>

          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-popup>

  </div>
</template>

<script>
import MetroData from './service/metroData.js'

export default {
  data(){
    return{
      metro:'',
      startStation: '植物园',
      lineList: [],
      f7: {},
      currentStation:'',
      currentStationObj:{},
      currentStationTimeList:[]
    }
  },
  created(){
    this.lineList = MetroData.getLineList();
  },
  components:{
    "amap-metro":require('./components/amap-metro'),
    "route-selector":require('./components/route-selector')
  },
  methods:{
    setStart(info){
      this.$refs.routeSelector.setStartByMap(info);
    },
    setEnd(info){
      this.$refs.routeSelector.setEndByMap(info);
    },
    showLine(lineName){
      const id = window.metro.getIdByName(lineName,'line');
      window.metro.showLine(id);
      const center = window.metro.getSelectedLineCenter();
      window.metro.setCenter(center);
    },
    showStationDetails(stationName){
      this.currentStation = stationName;
      this.currentStationTimeList = [];
      let _this = this;
      MetroData.getStationInfo(stationName, function(data){
        _this.currentStationObj = data;
      });
      MetroData.getStationTime(stationName, function(timeList){
        // let line = '-1';
        // let time = {};
        // for(let i = 0; i < timeList.length ; i++){
        //   if(timeList[i].lineid == line){
        //     time.timeList.push(timeList[i]);
        //   }else{
        //     line = timeList[i].lineid;
        //     time = {
        //       lineName : MetroData.parseLineIdToName(line) ,
        //       timeList : [timeList[i]]
        //     };
        //     _this.currentStationTimeList.push(time);
        //   }
        // }
        _this.currentStationTimeList = timeList
      });
      this.$f7.popup('.stationDetails');
    }
  }
}
</script>

<style>

</style>
