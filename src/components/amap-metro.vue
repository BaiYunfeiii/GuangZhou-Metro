<template>
  <div id="metro-map"></div>
</template>

<script>
import $ from 'jquery'

export default {
  data(){
    return {
      metro:'',
      startStation:''
    }
  },
  created () {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.src = 'http://webapi.amap.com/subway?v=1.0&key=5202adb11ccc6b2257d602df6651b5ed&callback=cbk'

    let _this = this;
    window.cbk = function(){
      
      var mySubway = subway('metro-map', {
        adcode: 4401,
        theme: 'colorful',
        client: 0,
        doubleclick: {
          switch: true
        }
      })

      _this.metro = mySubway;

      // 地铁加载完成，执行complete事件
      mySubway.event.on('subway.complete', (ev, info) => {
        const id = info.id
      })

      // 点击站点，显示此站点的信息窗体
      mySubway.event.on('station.touch', (ev, info) => {
        const id = info.id

        let c = '<div class="subway-tip subway-entity tip_wrap_out ust" data-id="';
        c += info.id;
        c += '" style="display:block"> ';
        c += ' <div class="tip_wrap"> <div class="tip_bady"> <div class="tip_name_detail"> <span class="tip_name" id="tip_name">';
        c += info.name;
        c += '</span> <span id="show-details-text" style="float:right;display:block;font-size:0.1em">查看详情></span> </div> <div class="tip_route"> <div class="tip_route_btn tip_route_start ust" data-type="start">设为起点</div> <div class="tip_route_btn tip_route_end ust" data-type="end">设为终点</div> </div> </div> <div class="tip_footer"> </div> </div> ';
        c += " </div>";

        mySubway.stopAnimation();
        mySubway.addInfoWindow(id, {
          content: c
        });

        $('#show-details-text').on('touchend',function(){
          _this.$emit('showStationDetails',info.name);
        });
        const center = mySubway.getStCenter(id)
        mySubway.setCenter(center)
      })

      // 点击线路名，高亮此线路
      mySubway.event.on('lineName.touch', (ev, info) => {
        mySubway.showLine(info.id)
        const center = mySubway.getSelectedLineCenter()
        mySubway.setCenter(center)
      })

      // 点击空白, 关闭infowindow
      mySubway.event.on('subway.touch', () => {
        mySubway.clearInfoWindow()
      })

      // 设置起点
      mySubway.event.on('startStation.touch', (ev, info) => {
        mySubway.stopAnimation()
        mySubway.clearInfoWindow()
        mySubway.setStart(info.id, {})
        startInfo = info

        _this.$emit('setStart',info);
        //route()
      })

      // 设置终点
      mySubway.event.on('endStation.touch', (ev, info) => {
        mySubway.stopAnimation()
        mySubway.clearInfoWindow()
        mySubway.setEnd(info.id, {})
        endInfo = info
        //route()

        _this.$emit('setEnd',info);
      })

      // 路线规划
      var startInfo = {},
        endInfo = {}
      function route () {
        if (startInfo.id && endInfo.id) {
          mySubway.route(startInfo.id, endInfo.id, {})
          startInfo = {}
          endInfo = {}
        }
      }

      window.metro = mySubway;
    };

    document.head.appendChild(script);
  }
}
</script>

<style>
.amap-subway-api .route_close_btn{
  top: 5em !important;
}
</style>
