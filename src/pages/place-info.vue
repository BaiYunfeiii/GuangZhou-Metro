<template>
  <f7-page>
    <f7-navbar v-bind:title="$route.params.key" back-link="Back" sliding></f7-navbar>
    <div v-if="article.abstract != undefined">
      <f7-block v-if="article.image != undefined">
          <img v-bind:src="article.image" width="100%" />
      </f7-block>
      <div v-for="c in article.card">
        <f7-block-title>{{c.name}}</f7-block-title>
        <f7-block>{{c.value[0].replace(/<\/?[^>]*>/g,'')}}</f7-block>
      </div>
      <f7-block-title>简介</f7-block-title>
      <f7-block>
        <p>{{article.abstract}}</p>
      </f7-block>
    </div>
    <div v-if="article.abstract == undefined">
      <div class="content-block" style="text-align:center;color:rgba(0,0,0,0.4)">
        <h3>暂未收录</h3>
      </div>
    </div>
  </f7-page>
</template>

<script>
import Wenku from '../service/BaiduBaikeSerivce'

export default {
    data(){
        return{
            article:{}
        }
    },
    mounted(){
        let key = this.$route.params.key;
        let _this = this;
        Wenku.search(key, function(info){
            if(info.image != undefined){
              info.image = 'https://www.cooode.cn/proxy/baidu/wenku?target=' + info.image
            }
            _this.article = info;
        })
    }
}
</script>