import $ from 'jquery'

let baike_search_api = 'http://api.cooode.cn/baike/api/openapi/BaikeLemmaCardApi'

export default{
    search(key, callback){
        $.ajax({
            url:baike_search_api,
            type:'GET',
            data:{
                'scope' : '103',
                'format' : 'json',
                'appid' : '379020',
                'bk_key' : key.replace(/（.*）/,''),
                'bk_length' : '600'
            },
            success: function(resp){
                callback(resp);
            }
        })
    }
}