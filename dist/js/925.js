"use strict";(self["webpackChunkchronicle"]=self["webpackChunkchronicle"]||[]).push([[925,692,978],{4692:function(e,t,a){a.r(t),a.d(t,{default:function(){return _}});var i=function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{staticClass:"image-view",on:{click:function(t){return e.$emit("click",t)}}},[t("img",{class:{loading:e.is_loading,fit_width:e.image_aspect_ratio<1},attrs:{src:e.src},on:{load:e.handle_image_load}}),e.is_loading?t("Preloader",{attrs:{full:"",fill:"",loader_type:e.loader_type}}):e._e()],1)},n=[],s=a(7581),l=a(2375),r=a(4026),d=a(4806),o=(0,s.Z)(r.Z).extend({name:"ImageView",components:{Preloader:l.Z},data(){return{is_loading:!0,image_width:0,image_height:0,image_aspect_ratio:0}},props:{src:{type:String,required:!0},loader_type:{type:String,default:l.d.Alternate01}},mounted(){(0,d.debounce)(this.set_loading,1e3)},methods:{handle_image_load(e){this.set_loading(!1),this.image_width=e.target.naturalWidth,this.image_height=e.target.naturalHeight,this.image_aspect_ratio=this.image_width/this.image_height},set_loading(e){this.is_loading=e}}}),u=o,c=a(1001),p=(0,c.Z)(u,i,n,!1,null,null,null),_=p.exports},5256:function(e,t,a){a.r(t),a.d(t,{EFileType:function(){return n},EPackageExplorerMode:function(){return i},default:function(){return m}});var i,n,s=function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{ref:"root",staticClass:"package-explorer"},[e.package_data?t("div",{staticClass:"files"},e._l(e.package_data,(function(a,i){return t("a",{key:`file_${i}`,staticClass:"file",attrs:{title:a[1],target:"_blank","data-file-type":e.detect_file_type(a[1]),href:a[1]}},[t("ImageView",{attrs:{src:e.get_file_type_icon(e.detect_file_type(a[1]))}}),t("div",{staticClass:"data"},[t("p",{staticClass:"title",domProps:{innerHTML:e._s(a[0])}}),t("p",{staticClass:"path",domProps:{innerHTML:e._s(a[1])}})])],1)})),0):e._e()])},l=[],r=a(7581),d=a(1484),o=a(4026),u=a(4692),c=a(3185),p=a(4806);(function(e){e[e["Default"]=0]="Default",e[e["Lite"]=1]="Lite"})(i||(i={})),function(e){e["Link"]="link",e["Image"]="image",e["Video"]="video",e["Audio"]="audio",e["Text"]="text",e["Mail"]="mail",e["Markdown"]="markdown",e["GithubRepo"]="github-repo",e["WikipediaArticle"]="wikipedia-article",e["SketchfabModel"]="sketchfab-model",e["AndroidApk"]="android-apk",e["WindowsExe"]="windows-exe"}(n||(n={}));var _=(0,r.Z)(o.Z).extend({name:"PackageExplorer",components:{Showdown:d["default"],ImageView:u["default"]},data(){return{}},mounted(){this.update_data()},watch:{package(){this.update_data()}},computed:{package_data(){return(0,p.get)(c.B9,this.package,null)}},props:{package:null,mode:{type:Number,default:i.Default}},methods:{detect_file_type(e){if(!(0,p.isString)(e))throw new Error("url is not a string");console.dir(e);let t=n.Link;return e.endsWith(".md")?n.Markdown:e.startsWith("mailto:")?n.Mail:e.endsWith(".txt")?n.Text:e.endsWith(".jpg")||e.endsWith(".jpeg")||e.endsWith(".png")||e.endsWith(".gif")?n.Image:e.endsWith(".mp4")||e.endsWith(".webm")||e.endsWith(".ogg")?n.Video:e.endsWith(".mp3")||e.endsWith(".wav")||e.endsWith(".ogg")?n.Audio:e.endsWith(".apk")?n.AndroidApk:e.endsWith(".exe")?n.WindowsExe:e.includes("github.com")?n.GithubRepo:e.includes("wikipedia.org")?n.WikipediaArticle:e.includes("sketchfab.com")?n.SketchfabModel:t},get_file_type_icon(e){switch(e){case n.Text:return"assets/icons/file_txt_01.png";case n.Markdown:return"assets/icons/file_markdown_01.png";case n.Image:return"assets/icons/file_image_01.png";case n.Video:return"assets/icons/file_video_01.png";case n.Audio:return"assets/icons/file_audio_01.png";case n.Audio:return"assets/icons/file_audio_01.png";case n.Mail:return"assets/icons/file_mailto_01.png";default:return"assets/icons/file_unknown_03.png"}},update_data(){this.package&&(this.package_data=c.B9[this.package])}}}),f=_,g=a(1001),h=(0,g.Z)(f,s,l,!1,null,null,null),m=h.exports},2375:function(e,t,a){a.d(t,{d:function(){return i},Z:function(){return c}});var i,n=function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{staticClass:"preloader",class:{full:e.full,fill:e.fill}},[t("span",{staticClass:"loader",attrs:{"data-loader-type":e.loader_type}})])},s=[],l=a(6369);(function(e){e["Default"]="default",e["DefaultInner"]="default-inner",e["Alternate01"]="alternate-01",e["Alternate02"]="alternate-02",e["Coffee"]="coffee",e["Chiptune"]="chiptune"})(i||(i={}));var r=l.ZP.extend({name:"Preloader",data(){return{}},props:{full:{type:Boolean,default:!1},fill:{type:Boolean,default:!1},loader_type:{type:String,default:i.Alternate01}},mounted(){},methods:{}}),d=r,o=a(1001),u=(0,o.Z)(d,n,s,!1,null,"676665e7",null),c=u.exports}}]);
//# sourceMappingURL=925.js.map