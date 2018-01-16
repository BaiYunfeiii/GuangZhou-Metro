<template>
    <f7-block id="route-block">
    <f7-card v-if="showPrice">
        <f7-block class="price-card">
                <f7-grid>
                    <f7-col class="label-cell" width="50">预计耗时：<span class="float-right">{{spendTime}}分钟</span></f7-col>
                    <f7-col width="5" style="color:rgb(200,200,200)">|</f7-col>
                    <f7-col class="label-cell" width="45">票价：<span class="float-right">{{price}}元</span></f7-col>
                </f7-grid>
        </f7-block>
    </f7-card>
    <f7-card id="searchCard">
        <f7-grid>
            <f7-col width="60">
                <div class="list-block">
                    <ul>
                        <li>
                            <!-- Smart select, will be opened in Picker -->
                            <a href="#" class="item-link smart-select" data-back-on-select="true" data-open-in="picker" data-picker-close-text="确认">
                            <!-- select -->
                            <select name="startLine" v-model="startLine" v-on:change="loadStations" >
                                <option v-bind:value="l.ln" v-for="l in lineList">{{l.ln}}</option>
                            </select>
                            <div class="item-content">
                                <div class="item-inner">
                                <!-- Select label -->
                                <div class="item-title">起点</div>
                                <!-- Selected value, not required -->
                                <div class="item-after" >{{startLine}}</div>
                                </div>
                            </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </f7-col>
            <f7-col width="40">
                <div class="list-block">
                    <ul>
                        <li>
                            <!-- Smart select, will be opened in Picker -->
                            <a href="#" class="item-link smart-select" data-back-on-select="true" data-open-in="picker" data-picker-close-text="确认">
                            <!-- select -->
                            <select name="startStation" v-model="startStation" v-on:change="setStart">
                                <option v-bind:value="s.n" v-for="s in startStationList">{{s.n}}</option>
                            </select>
                            <div class="item-content">
                                <div class="item-inner">
                                    <!-- Selected value, not required -->
                                    <div class="item-after" >{{startStation}}</div>
                                </div>
                            </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </f7-col>
        </f7-grid>
        <f7-grid>
            <f7-col width="60">
                <div class="list-block">
                    <ul>
                        <li>
                            <!-- Smart select, will be opened in Picker -->
                            <a href="#" class="item-link smart-select" data-back-on-select="true" data-open-in="picker" data-picker-close-text="确认">
                            <!-- select -->
                            <select name="endLine" v-model="endLine" v-on:change="loadStations">
                                <option v-bind:value="l.ln" v-for="l in lineList" >{{l.ln}}</option>
                            </select>
                            <div class="item-content">
                                <div class="item-inner">
                                <!-- Select label -->
                                <div class="item-title">终点</div>
                                <!-- Selected value, not required -->
                                <div class="item-after" >{{endLine}}</div>
                                </div>
                            </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </f7-col>
            <f7-col width="40">
                <div class="list-block">
                    <ul>
                        <li>
                            <!-- Smart select, will be opened in Picker -->
                            <a href="#" class="item-link smart-select" data-back-on-select="true" data-open-in="picker" data-picker-close-text="确认">
                            <!-- select -->
                            <select name="endStation" v-model="endStation" v-on:change="setEnd">
                                <option v-bind:value="s.n" v-for="s in endStationList">{{s.n}}</option>
                            </select>
                            <div class="item-content">
                                <div class="item-inner">
                                    <!-- Selected value, not required -->
                                    <div class="item-after" >{{endStation}}</div>
                                </div>
                            </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </f7-col>
        </f7-grid>
        <f7-button raised v-on:click="route">规划路线</f7-button>
    </f7-card>  
    </f7-block>
</template>

<script>
import LineData from '../service/metroData.js'
import $ from 'jquery'

export default {
    data(){
        return {
            startLine : '',
            startStation : '',
            endLine : '',
            endStation : '',
            lineList : [],
            startStationList : [],
            endStationList : [],
            spendTime:'',
            price:'',
            showPrice:false
        }
    },
    created(){
        this.lineList = LineData.getLineList();
        this.startLine = this.lineList[0].ln;
        this.endLine = this.lineList[0].ln;
        this.loadStations();
    },
    methods:{
      loadStations(){
        this.loadStartStations();
        this.loadEndStations();
      },
      loadStartStations(){
          this.startStationList = LineData.getStationListByLineName(this.startLine);
          this.startStation = this.startStationList[0].n;
      },
      loadEndStations(){
          this.endStationList = LineData.getStationListByLineName(this.endLine);
          this.endStation = this.endStationList[0].n;
      },
      setStart(){
          window.metro.setStart(this.startStation);
      },
      setEnd(){
          window.metro.setEnd(this.endStation);
      },
      route(){
          if(this.startStation == this.endStation){

          }else{
            let _this = this;
            window.metro.route(this.startStation,this.endStation);

            $(".route_close_btn").on('touchend',function(){
                _this.showPrice = false;
                window.metro.scale(0.8);
            });

            LineData.getRouteInfo(this.startStation, this.endStation, function(data){
                _this.spendTime = data.spendTime;
                _this.price = data.price;
                _this.showPrice = true;
            });
          }
      },
      setStartByMap(info){
          this.startLine = info.referlines[0].name;
          this.loadStartStations();
          this.startStation = info.name;
      },
      setEndByMap(info){
          this.endLine = info.referlines[0].name;
          this.loadEndStations();
          this.endStation = info.name;
      }
  }
}
</script>

<style scope>
.item-after{
    max-width: 110% !important;
}

.float-right{
    display:block;
    float:right;
}

.price-card{
    height:2.5em
}

.price-card .row{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width:90%;
    height:1.5em;
}

#route-block {
  z-index: 11;
  position: fixed;
  bottom: -2.4em;
  left: -5%;
  width: 110%;
}
</style>
