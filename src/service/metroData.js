import $ from 'jquery'

var lineList = require('../assets/4401_drw_guangzhou.json');
const station_info = require('../assets/station_info.json')

const gz_metro_line_url = 'http://api.cooode.cn/gzmtr/base/doSearchPathLine.do';
const callback_text = 'jQuery180015845114182523234_1514692233000';

const service = {
    getLineList(){
        return lineList.l
    },
    getStationListByLineName(lineName){
        var line =  lineList.l.find(function(element){
            if(element.ln == lineName || element.ls == lineName){
                return true;
            }
        })
        if(line != undefined){
            return line.st;
        }
        return [];
    },
    getLineListByStation(info){

    },
    getRouteInfo(startStation, endStation,callback){
        let s = encodeURI(startStation);
        let e = encodeURI(endStation);
        let data = {};
        $.ajax({
            url:gz_metro_line_url,
            data:{
                'callback':callback_text,
                'startStation':s,
                'endStation':e,
                '_' : Date.parse(new Date())
            },
            type:'GET',
            success: function(resp){
                let json = new String(resp).replace(callback_text,'').replace(/^\(/,'').replace(/\)$/,'');
                callback(JSON.parse(json));
            }
        });
    },
    getStationTime(name, callback){
        // let stationList = this.getLineList()[0].st;
        // let endStation = stationList[0].n;
        // if(name == endStation){
        //     endStation = stationList[1].n;
        // }
        // this.getRouteInfo(name, endStation, function(info){
        //     callback(info.stations);
        // });
        window.metro.stationSearch(name,(info)=>{
            let station = info.stationList[0]

            let result = {
                lineList:station.referlines
            }

            for(let i = 0; i<result.lineList.length;i++){
                let lineItem = result.lineList[i]

                let lineId = lineItem.id
                let line = getLineById(lineId)
                let station = getTimeByStationId(window.metro.getIdByName(name,'station'), line)

                lineItem.timeList = []

                for(let j = 0; j < station.d.length; j++){
                    if(lineId == station.d[j].ls){
                        let d = {
                            direction:getStationNameById(station.d[j].n, lineId),
                            start:station.d[j].ft,
                            end:station.d[j].lt
                        }
                        if(d.start == '--:--' && d.end == '--:--'){
                            continue
                        }
                        lineItem.timeList.push(d)
                    }
                }
            }
            callback(result)
        });
    },
    getStationInfo(name, callback){
        let s = encodeURI(name);
        $.ajax({
            url:'http://api.cooode.cn/gzmtr/base/doSearchEntryAndResource.do',
            data:{
                'callback' : callback_text,
                'station' : s,
                '_' : Date.parse(new Date())
            },
            type:'GET',
            success: function(resp){
                let json = new String(resp).replace(callback_text,'').replace(/^\(/,'').replace(/\)$/,'');
                callback(JSON.parse(json));
            }
        })
    },
    parseLineIdToName(id){
        if(id == '3zx'){
            return '3号线(北延段)'
        }
        if(id == 'gf'){
            return '广佛线'
        }
        return id + '号线'
    }
}

function getLineById(id){
    for(let j=0 ;j<station_info.l.length;j++){
        if(id == station_info.l[j].ls){
            return station_info.l[j]
        }
    }
}

function getTimeByStationId(stId,line){
    for(let i = 0; i < line.st.length; i++){
        if(stId == line.st[i].si){
            return line.st[i]
        }
    }
}

function getStationNameById(id,lineId){
        let stList = service.getStationListByLineName(lineId);
        for(let i = 0; i < stList.length; i++){
            if(stList[i].sid == id){
                return stList[i].n
            }
        }
    }

export default service