"use strict";(self["webpackChunkchronicle"]=self["webpackChunkchronicle"]||[]).push([[433],{2375:function(t,e,a){a.d(e,{d:function(){return n},Z:function(){return d}});var n,r=function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{staticClass:"preloader",class:{full:t.full,fill:t.fill}},[e("span",{staticClass:"loader",attrs:{"data-loader-type":t.loader_type}})])},l=[],s=a(6369);(function(t){t["Default"]="default",t["DefaultInner"]="default-inner",t["Alternate01"]="alternate-01",t["Alternate02"]="alternate-02",t["Coffee"]="coffee",t["Chiptune"]="chiptune"})(n||(n={}));var i=s.ZP.extend({name:"Preloader",data(){return{}},props:{full:{type:Boolean,default:!1},fill:{type:Boolean,default:!1},loader_type:{type:String,default:n.Alternate01}},mounted(){},methods:{}}),o=i,p=a(1001),u=(0,p.Z)(o,r,l,!1,null,"676665e7",null),d=u.exports},2433:function(t,e,a){a.r(e),a.d(e,{default:function(){return c}});var n=function(){var t=this,e=t._self._c;t._self._setupProxy;return e("div",{staticClass:"text-view"},[t._t("default"),t._l(t.paragraphs,(function(a,n){return e("p",{key:n,domProps:{innerHTML:t._s(a)}})})),t.is_loading?e("Preloader",{attrs:{full:"",fill:"",loader_type:t.loader_type}}):t._e()],2)},r=[],l=a(7581),s=a(2375),i=a(4026),o=a(4806),p=a(3889),u=(0,l.Z)(i.Z).extend({name:"ImageView",components:{Preloader:s.Z},data(){return{is_loading:!1,text_content:"",paragraphs:[]}},props:{src:{type:String},text:{type:String},loader_type:{type:String,default:s.d.Coffee}},mounted(){(0,o.debounce)(this.set_loading,1e3),this.init()},methods:{async init(){this.src?(this.set_loading(!0),this.text_content=await(0,p.fK)(this.src),this.set_loading(!1)):this.text&&(this.text_content=this.text),this.update_paragraphs()},update_paragraphs(){this.paragraphs=this.text_content.split("\n").filter((t=>t.trim().length>0))},filter_non_empty_paragraphs(){this.paragraphs=this.paragraphs.filter((t=>t.length>0))},set_loading(t){this.is_loading=t}}}),d=u,f=a(1001),h=(0,f.Z)(d,n,r,!1,null,"8d5e24a8",null),c=h.exports}}]);
//# sourceMappingURL=433.js.map