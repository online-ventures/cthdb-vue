(function(t){function e(e){for(var r,o,s=e[0],c=e[1],u=e[2],d=0,f=[];d<s.length;d++)o=s[d],a[o]&&f.push(a[o][0]),a[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);l&&l(e);while(f.length)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,s=1;s<n.length;s++){var c=n[s];0!==a[c]&&(r=!1)}r&&(i.splice(e--,1),t=o(o.s=n[0]))}return t}var r={},a={app:0},i=[];function o(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=r,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var l=c;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var r=n("1356"),a=n.n(r);a.a},1356:function(t,e,n){},"4a00":function(t,e,n){"use strict";var r=n("b2f3"),a=n.n(r);a.a},"50ce":function(t,e,n){"use strict";var r=n("b862"),a=n.n(r);a.a},"56d7":function(t,e,n){"use strict";n.r(e);n("28a5"),n("a481"),n("ac6a"),n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("nav-bar",{attrs:{links:t.topNavLinks}}),n("div",{staticClass:"view-container"},[n("transition",{attrs:{name:t.viewTransition}},[n("router-view")],1)],1)],1)},i=[],o=(n("20d6"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("nav",{staticClass:"navbar",attrs:{role:"navigation","aria-label":"main navigation"}},[n("div",{staticClass:"navbar-brand"},[n("router-link",{staticClass:"navbar-item",attrs:{to:{path:"/"}}},[n("img",{attrs:{src:"/images/icons/icon-144x144.png"}})]),n("router-link",{staticClass:"navbar-item",attrs:{to:{path:"/"}}},[n("b",[t._v("CTH")]),n("span",[t._v("Stars")])]),t._m(0)],1),n("div",{staticClass:"navbar-menu",attrs:{id:"topNavBar"}},[n("div",{staticClass:"navbar-start"},t._l(t.links,function(e){return n("router-link",{key:e.text,staticClass:"navbar-item",attrs:{to:{path:e.path}}},[t._v(t._s(e.text))])}),1),n("div",{staticClass:"navbar-end"},[n("div",{staticClass:"navbar-item"},[n("div",{staticClass:"buttons"},[t.isAuthenticated?t._e():n("a",{staticClass:"button is-primary",on:{click:t.login}},[t._v("Login")]),t.isAuthenticated?n("a",{staticClass:"button",on:{click:t.logout}},[t._v("Logout")]):t._e()])])])])])}),s=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("a",{staticClass:"navbar-burger burger",attrs:{role:"button","aria-label":"menu","aria-expanded":"false","data-target":"topNavBar"}},[n("span",{attrs:{"aria-hidden":"true"}}),n("span",{attrs:{"aria-hidden":"true"}}),n("span",{attrs:{"aria-hidden":"true"}})])}],c=(n("8e6e"),n("456d"),n("bd86")),u=n("2f62");function l(t,e){var n=Object.keys(t);return Object.getOwnPropertySymbols&&n.push.apply(n,Object.getOwnPropertySymbols(t)),e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n}function d(t){for(var e=1;e<arguments.length;e++)if(e%2){var n=null!=arguments[e]?arguments[e]:{};l(n,!0).forEach(function(e){Object(c["a"])(t,e,n[e])})}else Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(arguments[e])):l(n).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(arguments[e],n))});return t}var f={computed:d({},Object(u["c"])({authStatus:function(t){return t.auth.status},profile:function(t){return t.auth.profile}}),{},Object(u["b"])(["isAuthenticated","isIdTokenValid"])),methods:{login:function(){this.$store.dispatch("login")},logout:function(){this.$store.dispatch("logout")}}},h={name:"nav-bar",mixins:[f],props:{links:Array}},p=h,m=n("2877"),v=Object(m["a"])(p,o,s,!1,null,"e805cf28",null),b=v.exports,g={name:"App",components:{NavBar:b},data:function(){return{viewTransition:"",topNavLinks:[{text:"Home",path:"/"},{text:"Shows",path:"/shows"},{text:"Jobs",path:"/jobs"},{text:"Volunteers",path:"/volunteers"},{text:"Profile",path:"/profile"}]}},methods:{},watch:{$route:function(t,e){var n=this.topNavLinks.findIndex(function(t){return t.path===e.path}),r=this.topNavLinks.findIndex(function(e){return e.path===t.path}),a=n<r?"right":"left";this.viewTransition="slide-"+a}}},_=g,w=(n("034f"),Object(m["a"])(_,a,i,!1,null,null,null)),y=w.exports,C=n("8c4f"),$=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t._m(0),n("section",{staticClass:"content"},[n("div",{staticClass:"container"},[t._l(t.allShows,function(e){return n("list-row",{key:e.id,attrs:{title:e.name,subtitle:t._f("prettyMonth")(e.occurred_at),icon:"calendar-week",item:e,onClick:t.editModal}})}),n("div",{staticClass:"buttons"},[t.displayMore?n("b-button",{on:{click:t.moreShows}},[t._v("See more")]):t._e(),n("b-button",{attrs:{type:"is-primary","icon-left":"plus"},on:{click:t.newModal}},[t._v("Add show")])],1)],2)])])},j=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"hero is-primary"},[n("div",{staticClass:"hero-body"},[n("div",{staticClass:"container"},[n("p",{staticClass:"title"},[t._v("Show Listings")]),n("p",{staticClass:"subtitle"},[t._v("View and manage shows")])])])])}],k=(n("7514"),n("aede")),S=(n("6b54"),n("9530")),x=n.n(S),O=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"columns is-6"},[n("div",{staticClass:"column row",on:{click:t.action}},[n("p",{staticClass:"title is-4"},[t._v(t._s(t.title))]),n("div",{staticClass:"subtitle is-6 level is-mobile"},[n("div",{staticClass:"level-left"},[t.icon?n("div",{staticClass:"level-item"},[n("b-icon",{attrs:{icon:t.icon,size:"is-small",type:t.iconTypeOrDefault}})],1):t._e(),n("div",{staticClass:"level-item"},[n("span",[t._v(t._s(t.subtitle))])])])])])])},T=[],E={data:function(){return{}},props:{title:String,subtitle:String,icon:String,iconType:String,item:Object,onClick:Function},computed:{iconTypeOrDefault:function(){return this.iconType||"is-grey-lighter"}},methods:{action:function(){this.onClick(this.item)}}},R=E,M=(n("50ce"),Object(m["a"])(R,O,T,!1,null,"32aa9536",null)),P=M.exports,A=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",[n("div",{staticClass:"modal-card"},[n("header",{staticClass:"modal-card-head"},[n("p",{staticClass:"modal-card-title"},[t._v(t._s(t.title))])]),n("section",{staticClass:"modal-card-body"},[n("b-field",{attrs:{label:"Name"}},[n("b-input",{model:{value:t.show.name,callback:function(e){t.$set(t.show,"name",e)},expression:"show.name"}})],1),n("b-field",{attrs:{label:"Month"}},[n("div",{staticClass:"buttons"},t._l(t.months,function(e){return n("b-radio-button",{key:e.value,attrs:{"native-value":e.value},model:{value:t.month,callback:function(e){t.month=e},expression:"month"}},[n("span",[t._v(t._s(e.text))])])}),1)]),n("b-field",{attrs:{label:"Year"}},[n("b-input",{attrs:{type:"number"},model:{value:t.year,callback:function(e){t.year=e},expression:"year"}})],1)],1),n("footer",{staticClass:"modal-card-foot"},[n("button",{staticClass:"button",attrs:{type:"button"},on:{click:function(e){return e.preventDefault(),t.$parent.close()}}},[t._v("Close")]),n("button",{staticClass:"button is-primary",class:{"is-loading":t.isSaving},on:{click:function(e){return e.preventDefault(),t.saveShow()}}},[t._v("Save")])])])])},J=[],I=(n("96cf"),n("3b8d"));n("7f7f");function N(){var t=Object(k["a"])(["mutation updateShow($id:Int!, $name:String!, $occurred_at:date!) {\n          update_shows(where: {id: {_eq: $id}}, _set: {name: $name, occurred_at: $occurred_at}) {\n            affected_rows\n          }\n        }"]);return N=function(){return t},t}function D(){var t=Object(k["a"])(["mutation createShow($name:String!, $occurred_at:date!) {\n          insert_shows(objects: {name: $name, occurred_at: $occurred_at}) {\n            returning {\n              id\n              name\n              occurred_at\n            }\n          }\n        }"]);return D=function(){return t},t}var V={props:{title:{type:String,default:"New Show"},item:{type:Object}},data:function(){return{show:{},savingCounter:0,year:null,month:null,months:[{text:"January",value:"01"},{text:"February",value:"02"},{text:"March",value:"03"},{text:"April",value:"04"},{text:"May",value:"05"},{text:"June",value:"06"},{text:"July",value:"07"},{text:"August",value:"08"},{text:"September",value:"09"},{text:"October",value:"10"},{text:"November",value:"11"},{text:"December",value:"12"}]}},created:function(){Object.assign(this.show,this.item),this.year=this.occurredDate[0],this.month=this.occurredDate[1]},computed:{occurredDate:function(){return this.show.occurred_at.split("-")},newOccurredAt:function(){return this.year+"-"+this.month+"-01"},isSaving:function(){return this.savingCounter>0},newShow:function(){return{id:this.show.id,name:this.show.name,occurred_at:this.newOccurredAt}}},methods:{close:function(){var t=this;this.dialog=!1,setTimeout(function(){t.newItem()},300)},prepareItem:function(){var t=this.show,e=t.year,n=t.month;return this.editedItem.occurred_at=e+"-"+n+"-01",this.editedItem},saveShow:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!this.show.id){t.next=5;break}return t.next=3,this.updateShow();case 3:t.next=7;break;case 5:return t.next=7,this.createShow();case 7:this.$parent.close();case 8:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),createShow:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apollo.mutate({mutation:x()(D()),variables:{name:this.show.name,occurred_at:this.newOccurredAt},loadingKey:"savingCounter"}).then(function(t){var n=t.data.insert_shows.returning[0];e.$parent.$parent.addShow(n)});case 2:this.$parent.close();case 3:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),updateShow:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apollo.mutate({mutation:x()(N()),variables:{id:this.show.id,name:this.show.name,occurred_at:this.newOccurredAt},loadingKey:"savingCounter"});case 2:this.$parent.$parent.updateShow(this.newShow),this.$parent.close();case 4:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}()}},q=V,L=Object(m["a"])(q,A,J,!1,null,"5414b9c3",null),U=L.exports;function X(){var t=Object(k["a"])(["query showCount {\n        shows_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }"]);return X=function(){return t},t}function H(){var t=Object(k["a"])(["query currentShows($offset: Int!, $limit: Int!, $ignore: [Int!]) {\n        shows(where: {id: {_nin: $ignore}},\n          order_by: {occurred_at: desc, name: asc},\n          limit: $limit,\n          offset: $offset) {\n          id\n          name\n          occurred_at\n        }\n      }"]);return H=function(){return t},t}var F={components:{ListRow:P,EditShowModal:U},data:function(){return{shows:[],showCount:0,allShows:[],ignoreShows:[],page:1,rowsPerPage:5}},computed:{today:function(){var t=new Date,e=t.getMonth()+1,n=(e>9?"":"0")+e;return[t.getFullYear(),n,"01"].join("-")},years:function(){for(var t=[],e=(new Date).getFullYear()+1;e>=2e3;e--)t.push({text:e.toString(),value:e.toString()});return t},offset:function(){return(this.page-1)*this.rowsPerPage},displayMore:function(){return this.allShows.length<this.showCount}},apollo:{shows:{query:x()(H()),variables:function(){return{ignore:this.ignoreShows,offset:this.offset,limit:this.rowsPerPage}}},showCount:{query:x()(X()),update:function(t){return t.shows_aggregate.aggregate.count}}},filters:{prettyMonth:function(t){var e=new Date(t+"T12:00:00"),n={year:"numeric",month:"long"};return e.toLocaleDateString("en-US",n)}},watch:{shows:function(t){var e=this;t.forEach(function(t){e.allShows.every(function(e){return t.id!==e.id})&&e.allShows.push(Object.assign({},t))})}},methods:{moreShows:function(){this.page++},addShow:function(t){this.ignoreShows.push(t.id),this.allShows.push(t),this.showCount++},updateShow:function(t){var e=this.allShows.find(function(e){return e.id===t.id});Object.assign(e,t)},openModal:function(t){this.$modal.open({parent:this,component:U,hasModalCard:!0,props:t})},newModal:function(){this.openModal({title:"New Show",item:{name:"",occurred_at:this.today}})},editModal:function(t){this.openModal({title:"Edit Show",item:t})}}},K=F,z=(n("6d18"),Object(m["a"])(K,$,j,!1,null,"0434cc78",null)),B=z.exports,W=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t._m(0),n("section",[n("div",{staticClass:"content"},[n("div",{staticClass:"container"},[t._l(t.allJobs,function(e){return n("list-row",{key:e.id,attrs:{title:e.name,subtitle:t._f("prettyPoints")(e.points),icon:"coins",iconType:"is-warning",item:e,onClick:t.editModal}})}),n("div",{staticClass:"buttons"},[t.displayMore?n("b-button",{on:{click:t.moreJobs}},[t._v("See more")]):t._e(),n("b-button",{attrs:{type:"is-primary","icon-left":"plus"},on:{click:t.newModal}},[t._v("Add job")])],1)],2)])])])},G=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"hero is-primary"},[n("div",{staticClass:"hero-body"},[n("div",{staticClass:"container"},[n("p",{staticClass:"title"},[t._v("Jobs")]),n("p",{staticClass:"subtitle"},[t._v("View and manage jobs")])])])])}],Y=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",[n("div",{staticClass:"modal-card"},[n("header",{staticClass:"modal-card-head"},[n("p",{staticClass:"modal-card-title"},[t._v(t._s(t.title))])]),n("section",{staticClass:"modal-card-body"},[n("b-field",{attrs:{label:"Name"}},[n("b-input",{model:{value:t.job.name,callback:function(e){t.$set(t.job,"name",e)},expression:"job.name"}})],1),n("b-field",{attrs:{label:"Points"}}),n("b-field",t._l(t.pointOptions,function(e){return n("b-radio-button",{key:e.value,attrs:{"native-value":e.value},model:{value:t.job.points,callback:function(e){t.$set(t.job,"points",e)},expression:"job.points"}},[n("span",[t._v(t._s(e.text))])])}),1)],1),n("footer",{staticClass:"modal-card-foot"},[n("button",{staticClass:"button",attrs:{type:"button"},on:{click:function(e){return e.preventDefault(),t.$parent.close()}}},[t._v("Close")]),n("button",{staticClass:"button is-primary",class:{"is-loading":t.isSaving},on:{click:function(e){return e.preventDefault(),t.saveJob()}}},[t._v("Save")])])])])},Q=[];function Z(){var t=Object(k["a"])(["mutation updateJob($id:Int!, $name:String!, $points:Int!) {\n          update_jobs(where: {id: {_eq: $id}}, _set: {name: $name, points: $points}) {\n            affected_rows\n          }\n        }"]);return Z=function(){return t},t}function tt(){var t=Object(k["a"])(["mutation createJob($name:String!, $points:Int!) {\n          insert_jobs(objects: {name: $name, points: $points}) {\n            returning {\n              id\n              name\n              points\n            }\n          }\n        }"]);return tt=function(){return t},t}var et={props:{title:{type:String,default:"New Job"},item:{type:Object}},data:function(){return{job:{},savingCounter:0,pointOptions:[{text:"0",value:0},{text:"0.5",value:1},{text:"1",value:2},{text:"2",value:4},{text:"3",value:6}]}},created:function(){this.job={id:this.item.id,name:this.item.name,points:this.item.points}},computed:{isSaving:function(){return this.savingCounter>0},newJob:function(){return{id:this.job.id,name:this.job.name,points:this.job.points}}},methods:{saveJob:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!this.job.id){t.next=5;break}return t.next=3,this.updateJob();case 3:t.next=7;break;case 5:return t.next=7,this.createJob();case 7:this.$parent.close();case 8:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),createJob:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apollo.mutate({mutation:x()(tt()),variables:{name:this.job.name,points:this.job.points},loadingKey:"savingCounter"}).then(function(t){var n=t.data.insert_jobs.returning[0];e.$parent.$parent.addJob(n)});case 2:this.$parent.close();case 3:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),updateJob:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apollo.mutate({mutation:x()(Z()),variables:{id:this.job.id,name:this.job.name,points:this.job.points},loadingKey:"savingCounter"});case 2:this.$parent.$parent.updateJob(this.newJob),this.$parent.close();case 4:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}()}},nt=et,rt=Object(m["a"])(nt,Y,Q,!1,null,"d0eb8898",null),at=rt.exports;function it(){var t=Object(k["a"])(["query jobCount {\n        jobs_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }"]);return it=function(){return t},t}function ot(){var t=Object(k["a"])(["query currentJobs($offset: Int!, $limit: Int!, $ignore: [Int!]) {\n        jobs(where: {id: {_nin: $ignore}},\n          order_by: {name: asc, points: asc},\n          limit: $limit,\n          offset: $offset) {\n          id\n          name\n          points\n        }\n      }"]);return ot=function(){return t},t}var st={components:{ListRow:P,EditJobModal:at},data:function(){return{jobs:[],jobCount:0,allJobs:[],ignoreJobs:[],page:1,rowsPerPage:5}},computed:{offset:function(){return(this.page-1)*this.rowsPerPage},displayMore:function(){return this.allJobs.length<this.jobCount}},apollo:{jobs:{query:x()(ot()),variables:function(){return{ignore:this.ignoreJobs,offset:this.offset,limit:this.rowsPerPage}}},jobCount:{query:x()(it()),update:function(t){return t.jobs_aggregate.aggregate.count}}},filters:{prettyPoints:function(t){var e=t>2?"s":"";return(.5*t).toFixed(1)+" point"+e}},watch:{jobs:function(t){var e=this;t.forEach(function(t){e.allJobs.every(function(e){return t.id!==e.id})&&e.allJobs.push(Object.assign({},t))})}},methods:{moreJobs:function(){this.page++},addJob:function(t){this.ignoreJobs.push(t.id),this.allJobs.push(t),this.jobCount++},updateJob:function(t){var e=this.allJobs.find(function(e){return e.id===t.id});Object.assign(e,t)},openModal:function(t){this.$modal.open({parent:this,component:at,hasModalCard:!0,props:t})},newModal:function(){this.openModal({title:"New Job",item:{name:"",points:0}})},editModal:function(t){this.openModal({title:"Edit Job",item:t})}}},ct=st,ut=(n("fd71"),Object(m["a"])(ct,W,G,!1,null,"3b3c533e",null)),lt=ut.exports,dt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t._m(0),n("section",[n("div",{staticClass:"content"},[n("div",{staticClass:"container"},[n("form",{staticClass:"search-form",on:{submit:function(t){t.preventDefault()}}},[n("b-field",[n("b-input",{attrs:{icon:"search",placeholder:"search",type:"search"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.performSearch(e)}},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1)],1),t._l(t.volunteerList,function(e){return n("list-row",{key:e.id,attrs:{title:t._f("name")(e),subtitle:"",icon:"",item:e,onClick:t.editModal}})}),n("div",{staticClass:"buttons"},[t.displayMore?n("b-button",{on:{click:t.moreVolunteers}},[t._v("See more")]):t._e(),n("b-button",{attrs:{type:"is-primary","icon-left":"plus"},on:{click:t.newModal}},[t._v("Add volunteer")])],1)],2)])])])},ft=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"hero is-primary"},[n("div",{staticClass:"hero-body"},[n("div",{staticClass:"container"},[n("p",{staticClass:"title"},[t._v("Volunteers")]),n("p",{staticClass:"subtitle"},[t._v("View and manage volunteers")])])])])}],ht=(n("386d"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",{ref:"volunteerForm",on:{submit:function(e){return e.preventDefault(),t.saveRecord()}}},[n("div",{staticClass:"modal-card"},[n("header",{staticClass:"modal-card-head"},[n("p",{staticClass:"modal-card-title"},[t._v(t._s(t.title))])]),n("section",{staticClass:"modal-card-body"},[n("div",{staticClass:"columns"},[n("div",{staticClass:"column"},[n("b-field",{attrs:{label:"First name"}},[n("b-input",{attrs:{required:""},model:{value:t.record.first_name,callback:function(e){t.$set(t.record,"first_name",e)},expression:"record.first_name"}})],1)],1),n("div",{staticClass:"column"},[n("b-field",{attrs:{label:"Last name"}},[n("b-input",{attrs:{required:""},model:{value:t.record.last_name,callback:function(e){t.$set(t.record,"last_name",e)},expression:"record.last_name"}})],1)],1)]),n("div",{staticClass:"columns"},[n("div",{staticClass:"column"},[n("b-field",{attrs:{label:"Email"}},[n("b-input",{attrs:{type:"email"},model:{value:t.record.email,callback:function(e){t.$set(t.record,"email",e)},expression:"record.email"}})],1)],1),n("div",{staticClass:"column"},[n("b-field",{attrs:{label:"Phone"}},[n("b-input",{attrs:{pattern:"[0-9]{3}-[0-9]{3}-[0-9]{4}",placeholder:"XXX-XXX-XXXX","validation-message":"Please provide this in the format XXX-XXX-XXXX"},model:{value:t.record.phone,callback:function(e){t.$set(t.record,"phone",e)},expression:"record.phone"}})],1)],1)]),n("div",{staticClass:"columns"},[n("div",{staticClass:"column"},[n("b-field",{attrs:{label:"Street"}},[n("b-input",{model:{value:t.record.street,callback:function(e){t.$set(t.record,"street",e)},expression:"record.street"}})],1)],1),n("div",{staticClass:"column"},[n("b-field",{attrs:{label:"City"}},[n("b-input",{model:{value:t.record.city,callback:function(e){t.$set(t.record,"city",e)},expression:"record.city"}})],1)],1)])]),n("footer",{staticClass:"modal-card-foot"},[n("button",{staticClass:"button",attrs:{type:"button"},on:{click:function(e){return e.preventDefault(),t.$parent.close()}}},[t._v("Close")]),n("button",{staticClass:"button is-primary",class:{"is-loading":t.isSaving},on:{click:function(e){return e.preventDefault(),t.saveRecord()}}},[t._v("Save")])])])])}),pt=[];function mt(){var t=Object(k["a"])(["mutation updateRecord(\n          $id:Int!,\n          $first_name:String!,\n          $last_name:String!,\n          $email:String,\n          $phone:String,\n          $street:String,\n          $city:String\n        ) {\n          update_volunteers(where: {id: {_eq: $id}}, _set: {\n            first_name: $first_name,\n            last_name: $last_name,\n            email: $email,\n            phone: $phone,\n            street: $street,\n            city: $city\n          }) {\n            affected_rows\n          }\n        }"]);return mt=function(){return t},t}function vt(){var t=Object(k["a"])(["mutation createRecord(\n          $first_name:String!,\n          $last_name:String!,\n          $email:String,\n          $phone:String,\n          $street:String,\n          $city:String\n        ) {\n          insert_volunteers(objects: {\n            first_name: $first_name,\n            last_name: $last_name,\n            email: $email,\n            phone: $phone,\n            street: $street,\n            city: $city\n          }) {\n            returning {\n              id\n              first_name\n              last_name\n              email\n              phone\n              street\n              city\n            }\n          }\n        }"]);return vt=function(){return t},t}var bt={props:{title:{type:String,default:"New Volunteer"},item:{type:Object}},data:function(){return{record:{},attributes:["id","first_name","last_name","email","phone","street","city"],savingCounter:0}},created:function(){var t=this;this.attributes.forEach(function(e){t.record[e]=t.item[e]})},computed:{isSaving:function(){return this.savingCounter>0},newRecord:function(){return this.buildRecord()}},methods:{buildRecord:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.attributes.forEach(function(n){e[n]=t.item[n]}),e},saveRecord:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(this.validateRecord()){t.next=4;break}return t.abrupt("return");case 4:if(!this.record.id){t.next=9;break}return t.next=7,this.updateRecord();case 7:t.next=11;break;case 9:return t.next=11,this.createRecord();case 11:this.$parent.close();case 12:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),validateRecord:function(){return!!this.$refs.volunteerForm.checkValidity()||(this.$refs.volunteerForm.reportValidity(),!1)},createRecord:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apollo.mutate({mutation:x()(vt()),variables:this.record,loadingKey:"savingCounter"}).then(function(t){var n=t.data.insert_volunteers.returning[0];e.$parent.$parent.addRecord(n)});case 2:this.$parent.close();case 3:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),updateRecord:function(){var t=Object(I["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$apollo.mutate({mutation:x()(mt()),variables:this.record,loadingKey:"savingCounter"});case 2:this.$parent.$parent.updateRecord(this.record),this.$parent.close();case 4:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}()}},gt=bt,_t=Object(m["a"])(gt,ht,pt,!1,null,"6e6a6a24",null),wt=_t.exports;function yt(){var t=Object(k["a"])(["query volunteerCount {\n        volunteers_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }"]);return yt=function(){return t},t}function Ct(){var t=Object(k["a"])(["query currentVolunteers($offset: Int!,\n        $limit: Int!, $ignore: [Int!], $first_name: String, $last_name: String) {\n          volunteers(where: {\n            _and: [\n              {id: {_nin: $ignore}},\n              {_or: [\n                {first_name: {_ilike: $first_name}},\n                {last_name: {_ilike: $first_name}}\n              ]},\n              {_or: [\n                {first_name: {_ilike: $last_name}},\n                {last_name: {_ilike: $last_name}}\n              ]},\n            ]},\n            order_by: {last_name: asc, first_name: asc},\n            limit: $limit,\n            offset: $offset) {\n              id\n              first_name\n              last_name\n              email\n              phone\n              street\n              city\n            }\n      }"]);return Ct=function(){return t},t}var $t={components:{ListRow:P,EditVolunteerModal:wt},created:function(){this.$apollo.queries.volunteers.refetch(),this.$apollo.queries.volunteerCount.refetch()},data:function(){return{volunteers:[],volunteerCount:0,allVolunteers:[],ignoreVolunteers:[],search:"",page:1,rowsPerPage:5}},computed:{offset:function(){return this.searching?0:(this.page-1)*this.rowsPerPage},searching:function(){return""!==this.search},displayMore:function(){return!this.searching&&this.allVolunteers.length<this.volunteerCount},names:function(){return this.search.split(/\s+/)},firstName:function(){return(this.names[0]||"")+"%"},lastName:function(){return(this.names[1]||"")+"%"},volunteerList:function(){return this.searching?this.volunteers:this.allVolunteers}},apollo:{volunteers:{query:x()(Ct()),variables:function(){return{ignore:this.ignoreVolunteers,offset:this.offset,limit:this.rowsPerPage,first_name:this.firstName,last_name:this.lastName}}},volunteerCount:{query:x()(yt()),update:function(t){return t.volunteers_aggregate.aggregate.count}}},filters:{name:function(t){return t.first_name+" "+t.last_name}},watch:{volunteers:function(t){var e=this;console.log(t),this.searching||t.forEach(function(t){e.allVolunteers.every(function(e){return t.id!==e.id})&&e.allVolunteers.push(Object.assign({},t))})}},methods:{moreVolunteers:function(){this.page++},addRecord:function(t){this.ignoreVolunteers.push(t.id),this.allVolunteers.push(t),this.volunteerCount++},updateRecord:function(t){var e=this.allVolunteers.find(function(e){return e.id===t.id});Object.assign(e,t)},openModal:function(t){this.$modal.open({parent:this,component:wt,hasModalCard:!0,props:t})},newModal:function(){this.openModal({title:"New Volunteer",item:{name:"",points:0}})},editModal:function(t){this.openModal({title:"Edit Volunteer",item:t})},performSearch:function(){}}},jt=$t,kt=(n("4a00"),Object(m["a"])(jt,dt,ft,!1,null,"22f80456",null)),St=kt.exports,xt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",t._l(t.stats,function(e){return n("div",{staticClass:"columns"},t._l(e,function(e){return n("div",{key:e.id,staticClass:"column is-one-half-desktop"},[n("div",{staticClass:"box"},[n("p",{staticClass:"title is-2 has-text-centered"},[t._v(t._s(e.value))]),n("p",{staticClass:"subtitle is-4 has-text-centered"},[t._v(t._s(e.subtitle))])])])}),0)}),0)},Ot=[];function Tt(){var t=Object(k["a"])(["query showCount {\n      shows_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }"]);return Tt=function(){return t},t}function Et(){var t=Object(k["a"])(["query jobCount {\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }"]);return Et=function(){return t},t}var Rt={data:function(){return{jobs_aggregate:{aggregate:{count:"-"}},shows_aggregate:{aggregate:{count:"-"}}}},computed:{stats:function(){return[[{id:"show-count",subtitle:"Total shows",value:this.shows_aggregate.aggregate.count},{id:"job-count",subtitle:"Total jobs",value:this.jobs_aggregate.aggregate.count}]]}},apollo:{jobs_aggregate:x()(Et()),shows_aggregate:x()(Tt())}},Mt=Rt,Pt=Object(m["a"])(Mt,xt,Ot,!1,null,null,null),At=Pt.exports,Jt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("div",{staticClass:"row align-items-center profile-header"},[n("div",{staticClass:"col-md-2"},[n("img",{staticClass:"rounded-circle img-fluid profile-picture",attrs:{src:t.profile.picture,alt:"User's profile picture"}})]),n("div",{staticClass:"col-md"},[n("h2",[t._v(t._s(t.profile.name))]),n("p",{staticClass:"lead text-muted"},[t._v(t._s(t.profile.email))])])]),n("div",{staticClass:"row"},[n("pre",{directives:[{name:"highlightjs",rawName:"v-highlightjs"}],staticClass:"rounded"},[n("code",{staticClass:"json"},[t._v(t._s(JSON.stringify(t.profile,null,2)))])])])])},It=[],Nt={mixins:[f],data:function(){return{}},methods:{}},Dt=Nt,Vt=Object(m["a"])(Dt,Jt,It,!1,null,null,null),qt=Vt.exports,Lt=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("b-loading",{attrs:{active:!0}})},Ut=[],Xt={mixins:[f],created:function(){this.$store.dispatch("handleAuthentication")},watch:{authStatus:function(t,e){"authenticated"===t&&this.$router.push({name:"profile"})}}},Ht=Xt,Ft=Object(m["a"])(Ht,Lt,Ut,!1,null,"11eb7f75",null),Kt=Ft.exports,zt=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},Bt=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"user"},[n("h1",[t._v("The page you selected was not found")])])}],Wt={},Gt=Object(m["a"])(Wt,zt,Bt,!1,null,null,null),Yt=Gt.exports;r["default"].use(C["a"]);var Qt=new C["a"]({mode:"history",base:"/",routes:[{path:"/",name:"home",component:At},{path:"/shows",name:"show-list",component:B},{path:"/jobs",name:"job-list",component:lt},{path:"/volunteers",name:"volunteers",component:St},{path:"/profile",name:"profile",component:qt},{path:"/callback",name:"callback",component:Kt},{path:"*",component:Yt}]}),Zt=n("b0af"),te=new Zt["a"].WebAuth({domain:"cth.auth0.com",redirectUri:"".concat(window.location.origin,"/callback"),clientID:"mtu5IF30h4sLwgwOo4C7HrGy3HGz8NIA",responseType:"token id_token",scope:"openid profile email",audience:"https://cth-api.wov.io"}),ee="loggedIn",ne=function(){return{idToken:null,expiry:null,profile:{},accessToken:null,status:"",renewing:!1}},re={isAuthenticated:function(t){return Date.now()<t.expiry&&"true"===localStorage.getItem(ee)},isIdTokenValid:function(t){return t.idToken&&t.expiry&&Date.now()<t.expiry}},ae={CLEAR_AUTH:function(t){t.idToken=null,t.expiry=null,t.profile={},t.accessToken=null},SET_AUTH:function(t,e){t.idToken=e.idToken,t.expiry=e.expiry,t.profile=e.profile,t.accessToken=e.accessToken},SET_AUTH_STATUS:function(t,e){t.status=e,"error"!==e&&(t.error=null)},SET_AUTH_ERROR:function(t,e){t.error=e,t.status="error"},SET_TOKEN_RENEWAL:function(t,e){t.tokenRenewal=e},SET_RENEWING:function(t,e){t.renewing=e}},ie={login:function(t,e){var n=t.commit;n("SET_AUTH_STATUS","authorizing"),te.authorize({appState:e})},logout:function(t){var e=t.commit;localStorage.removeItem(ee),e("CLEAR_AUTH"),e("SET_AUTH_STATUS","logout"),te.logout({returnTo:"".concat(window.location.origin)})},handleAuthentication:function(t){var e=t.commit,n=t.dispatch;te.parseHash(function(t,r){t?e("SET_AUTH_ERROR",t):n("localLogin",r)})},localLogin:function(t,e){var n=t.commit,r=t.dispatch,a={idToken:e.idToken,accessToken:e.accessToken,expiry:new Date(1e3*e.idTokenPayload.exp),profile:e.idTokenPayload};n("SET_AUTH",a),n("SET_AUTH_STATUS","authenticated"),localStorage.setItem(ee,"true"),console.log(a),r("scheduleRenewal")},renewTokens:function(t){var e=t.state,n=t.getters,r=t.commit,a=t.dispatch,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return new Promise(function(t,o){if(!n.isIdTokenValid)return"true"!==localStorage.getItem(ee)?(r("SET_AUTH_ERROR","Not logged in"),void o(new Error("not logged in"))):void te.checkSession({},function(n,s){n?(r("SET_AUTH_ERROR",n),i&&a("login"),o(n)):(a("localLogin",s),t(e.accessToken))});t(e.accessToken)})},scheduleRenewal:function(t){var e=t.state,n=t.commit,r=t.dispatch,a=e.expiry-Date.now();if(a>0){var i=setTimeout(function(){r("renewTokens")},a);n("SET_TOKEN_RENEWAL",i)}}},oe={state:ne,getters:re,mutations:ae,actions:ie};r["default"].use(u["a"]);var se=new u["a"].Store({modules:{auth:oe},state:{},mutations:{},actions:{}}),ce=n("9483");Object(ce["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}});var ue=n("8103"),le=n.n(ue),de=n("bba4"),fe=n.n(de),he=n("522d"),pe=n("c2c3"),me=n("74ca"),ve=n("478e"),be=n("2bf2"),ge=new ve["a"]({uri:"https://cth-api.wov.io/v1/graphql"}),_e=Object(pe["a"])(function(t){return new Promise(function(t,e){se.dispatch("renewTokens").then(function(e){t({headers:{authorization:"Bearer ".concat(e)}})},function(t){e(t),console.log(t)})})}),we=_e.concat(ge),ye=new me["a"]({link:we,cache:new be["a"]({addTypename:!0,freezeResults:!0}),assumeImmutableResults:!0,connectToDevTools:!1}),Ce=new he["a"]({defaultClient:ye});r["default"].use(he["a"]);var $e=Ce,je=n("8a03"),ke=n.n(je),Se=(n("5abe"),n("ecee")),xe=n("c074"),Oe=n("ad3d");Se["c"].add(xe["a"],xe["f"],xe["e"],xe["b"],xe["c"],xe["d"],xe["g"]);var Te=Oe["a"];r["default"].component("font-awesome-icon",Te);var Ee=n("ef13");Ee.keys().forEach(function(t){var e=Ee(t),n=le()(fe()(t.split("/").pop().replace(/\.\w+$/,"")));r["default"].component(n,e.default||e)}),r["default"].config.productionTip=!1,r["default"].use(ke.a,{defaultIconPack:"fas",defaultIconComponent:Te}),new r["default"]({router:Qt,store:se,apolloProvider:$e,render:function(t){return t(y)}}).$mount("#app")},"6d18":function(t,e,n){"use strict";var r=n("d9b1"),a=n.n(r);a.a},"9e6d":function(t,e,n){},b2f3:function(t,e,n){},b862:function(t,e,n){},d9b1:function(t,e,n){},ef13:function(t,e){function n(t){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}n.keys=function(){return[]},n.resolve=n,t.exports=n,n.id="ef13"},fd71:function(t,e,n){"use strict";var r=n("9e6d"),a=n.n(r);a.a}});
//# sourceMappingURL=app.be86dbce.js.map