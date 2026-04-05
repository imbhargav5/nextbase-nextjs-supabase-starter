module.exports=[42804,a=>{"use strict";let b,c,d,e,f,g,h,i,j;var k,l=a.i(53083),m={setTimeout:(a,b)=>setTimeout(a,b),clearTimeout:a=>clearTimeout(a),setInterval:(a,b)=>setInterval(a,b),clearInterval:a=>clearInterval(a)},n=new class{#a=m;#b=!1;setTimeoutProvider(a){this.#a=a}setTimeout(a,b){return this.#a.setTimeout(a,b)}clearTimeout(a){this.#a.clearTimeout(a)}setInterval(a,b){return this.#a.setInterval(a,b)}clearInterval(a){this.#a.clearInterval(a)}};function o(){}function p(a,b){return"function"==typeof a?a(b):a}function q(a,b){let{type:c="all",exact:d,fetchStatus:e,predicate:f,queryKey:g,stale:h}=a;if(g){if(d){if(b.queryHash!==s(g,b.options))return!1}else if(!u(b.queryKey,g))return!1}if("all"!==c){let a=b.isActive();if("active"===c&&!a||"inactive"===c&&a)return!1}return("boolean"!=typeof h||b.isStale()===h)&&(!e||e===b.state.fetchStatus)&&(!f||!!f(b))}function r(a,b){let{exact:c,status:d,predicate:e,mutationKey:f}=a;if(f){if(!b.options.mutationKey)return!1;if(c){if(t(b.options.mutationKey)!==t(f))return!1}else if(!u(b.options.mutationKey,f))return!1}return(!d||b.state.status===d)&&(!e||!!e(b))}function s(a,b){return(b?.queryKeyHashFn||t)(a)}function t(a){return JSON.stringify(a,(a,b)=>x(b)?Object.keys(b).sort().reduce((a,c)=>(a[c]=b[c],a),{}):b)}function u(a,b){return a===b||typeof a==typeof b&&!!a&&!!b&&"object"==typeof a&&"object"==typeof b&&Object.keys(b).every(c=>u(a[c],b[c]))}var v=Object.prototype.hasOwnProperty;function w(a){return Array.isArray(a)&&a.length===Object.keys(a).length}function x(a){if(!y(a))return!1;let b=a.constructor;if(void 0===b)return!0;let c=b.prototype;return!!y(c)&&!!c.hasOwnProperty("isPrototypeOf")&&Object.getPrototypeOf(a)===Object.prototype}function y(a){return"[object Object]"===Object.prototype.toString.call(a)}function z(a,b,c=0){let d=[...a,b];return c&&d.length>c?d.slice(1):d}function A(a,b,c=0){let d=[b,...a];return c&&d.length>c?d.slice(0,-1):d}var B=Symbol();function C(a,b){return!a.queryFn&&b?.initialPromise?()=>b.initialPromise:a.queryFn&&a.queryFn!==B?a.queryFn:()=>Promise.reject(Error(`Missing queryFn: '${a.queryHash}'`))}var D=(b=[],c=0,d=a=>{a()},e=a=>{a()},f=function(a){setTimeout(a,0)},{batch:a=>{let g;c++;try{g=a()}finally{let a;--c||(a=b,b=[],a.length&&f(()=>{e(()=>{a.forEach(a=>{d(a)})})}))}return g},batchCalls:a=>(...b)=>{g(()=>{a(...b)})},schedule:g=a=>{c?b.push(a):f(()=>{d(a)})},setNotifyFunction:a=>{d=a},setBatchNotifyFunction:a=>{e=a},setScheduler:a=>{f=a}}),E=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(a){return this.listeners.add(a),this.onSubscribe(),()=>{this.listeners.delete(a),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},F=new class extends E{#c;#d;#e;constructor(){super(),this.#e=a=>{}}onSubscribe(){this.#d||this.setEventListener(this.#e)}onUnsubscribe(){this.hasListeners()||(this.#d?.(),this.#d=void 0)}setEventListener(a){this.#e=a,this.#d?.(),this.#d=a(a=>{"boolean"==typeof a?this.setFocused(a):this.onFocus()})}setFocused(a){this.#c!==a&&(this.#c=a,this.onFocus())}onFocus(){let a=this.isFocused();this.listeners.forEach(b=>{b(a)})}isFocused(){return"boolean"==typeof this.#c?this.#c:globalThis.document?.visibilityState!=="hidden"}},G=new class extends E{#f=!0;#d;#e;constructor(){super(),this.#e=a=>{}}onSubscribe(){this.#d||this.setEventListener(this.#e)}onUnsubscribe(){this.hasListeners()||(this.#d?.(),this.#d=void 0)}setEventListener(a){this.#e=a,this.#d?.(),this.#d=a(this.setOnline.bind(this))}setOnline(a){this.#f!==a&&(this.#f=a,this.listeners.forEach(b=>{b(a)}))}isOnline(){return this.#f}},H=(h=()=>!0,{isServer:()=>h(),setIsServer(a){h=a}});function I(a){return Math.min(1e3*2**a,3e4)}function J(a){return(a??"online")!=="online"||G.isOnline()}var K=class extends Error{constructor(a){super("CancelledError"),this.revert=a?.revert,this.silent=a?.silent}};function L(a){let b,c=!1,d=0,e=function(){let a,b,c=new Promise((c,d)=>{a=c,b=d});function d(a){Object.assign(c,a),delete c.resolve,delete c.reject}return c.status="pending",c.catch(()=>{}),c.resolve=b=>{d({status:"fulfilled",value:b}),a(b)},c.reject=a=>{d({status:"rejected",reason:a}),b(a)},c}(),f=()=>F.isFocused()&&("always"===a.networkMode||G.isOnline())&&a.canRun(),g=()=>J(a.networkMode)&&a.canRun(),h=a=>{"pending"===e.status&&(b?.(),e.resolve(a))},i=a=>{"pending"===e.status&&(b?.(),e.reject(a))},j=()=>new Promise(c=>{b=a=>{("pending"!==e.status||f())&&c(a)},a.onPause?.()}).then(()=>{b=void 0,"pending"===e.status&&a.onContinue?.()}),k=()=>{let b;if("pending"!==e.status)return;let g=0===d?a.initialPromise:void 0;try{b=g??a.fn()}catch(a){b=Promise.reject(a)}Promise.resolve(b).then(h).catch(b=>{if("pending"!==e.status)return;let g=a.retry??3*!H.isServer(),h=a.retryDelay??I,l="function"==typeof h?h(d,b):h,m=!0===g||"number"==typeof g&&d<g||"function"==typeof g&&g(d,b);c||!m?i(b):(d++,a.onFail?.(d,b),new Promise(a=>{n.setTimeout(a,l)}).then(()=>f()?void 0:j()).then(()=>{c?i(b):k()}))})};return{promise:e,status:()=>e.status,cancel:b=>{if("pending"===e.status){let c=new K(b);i(c),a.onCancel?.(c)}},continue:()=>(b?.(),e),cancelRetry:()=>{c=!0},continueRetry:()=>{c=!1},canStart:g,start:()=>(g()?k():j().then(k),e)}}var M=class{#g;destroy(){this.clearGcTimeout()}scheduleGc(){var a;this.clearGcTimeout(),"number"==typeof(a=this.gcTime)&&a>=0&&a!==1/0&&(this.#g=n.setTimeout(()=>{this.optionalRemove()},this.gcTime))}updateGcTime(a){this.gcTime=Math.max(this.gcTime||0,a??(H.isServer()?1/0:3e5))}clearGcTimeout(){this.#g&&(n.clearTimeout(this.#g),this.#g=void 0)}},N=class extends M{#h;#i;#j;#k;#l;#m;#n;constructor(a){super(),this.#n=!1,this.#m=a.defaultOptions,this.setOptions(a.options),this.observers=[],this.#k=a.client,this.#j=this.#k.getQueryCache(),this.queryKey=a.queryKey,this.queryHash=a.queryHash,this.#h=P(this.options),this.state=a.state??this.#h,this.scheduleGc()}get meta(){return this.options.meta}get promise(){return this.#l?.promise}setOptions(a){if(this.options={...this.#m,...a},this.updateGcTime(this.options.gcTime),this.state&&void 0===this.state.data){let a=P(this.options);void 0!==a.data&&(this.setState(O(a.data,a.dataUpdatedAt)),this.#h=a)}}optionalRemove(){this.observers.length||"idle"!==this.state.fetchStatus||this.#j.remove(this)}setData(a,b){var c,d;let e=(c=this.state.data,"function"==typeof(d=this.options).structuralSharing?d.structuralSharing(c,a):!1!==d.structuralSharing?function a(b,c,d=0){if(b===c)return b;if(d>500)return c;let e=w(b)&&w(c);if(!e&&!(x(b)&&x(c)))return c;let f=(e?b:Object.keys(b)).length,g=e?c:Object.keys(c),h=g.length,i=e?Array(h):{},j=0;for(let k=0;k<h;k++){let h=e?k:g[k],l=b[h],m=c[h];if(l===m){i[h]=l,(e?k<f:v.call(b,h))&&j++;continue}if(null===l||null===m||"object"!=typeof l||"object"!=typeof m){i[h]=m;continue}let n=a(l,m,d+1);i[h]=n,n===l&&j++}return f===h&&j===f?b:i}(c,a):a);return this.#o({data:e,type:"success",dataUpdatedAt:b?.updatedAt,manual:b?.manual}),e}setState(a,b){this.#o({type:"setState",state:a,setStateOptions:b})}cancel(a){let b=this.#l?.promise;return this.#l?.cancel(a),b?b.then(o).catch(o):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return this.#h}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some(a=>{var b;return!1!==(b=a.options.enabled,"function"==typeof b?b(this):b)})}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===B||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0&&this.observers.some(a=>"static"===p(a.options.staleTime,this))}isStale(){return this.getObserversCount()>0?this.observers.some(a=>a.getCurrentResult().isStale):void 0===this.state.data||this.state.isInvalidated}isStaleByTime(a=0){return void 0===this.state.data||"static"!==a&&(!!this.state.isInvalidated||!Math.max(this.state.dataUpdatedAt+(a||0)-Date.now(),0))}onFocus(){let a=this.observers.find(a=>a.shouldFetchOnWindowFocus());a?.refetch({cancelRefetch:!1}),this.#l?.continue()}onOnline(){let a=this.observers.find(a=>a.shouldFetchOnReconnect());a?.refetch({cancelRefetch:!1}),this.#l?.continue()}addObserver(a){this.observers.includes(a)||(this.observers.push(a),this.clearGcTimeout(),this.#j.notify({type:"observerAdded",query:this,observer:a}))}removeObserver(a){this.observers.includes(a)&&(this.observers=this.observers.filter(b=>b!==a),this.observers.length||(this.#l&&(this.#n||this.#p()?this.#l.cancel({revert:!0}):this.#l.cancelRetry()),this.scheduleGc()),this.#j.notify({type:"observerRemoved",query:this,observer:a}))}getObserversCount(){return this.observers.length}#p(){return"paused"===this.state.fetchStatus&&"pending"===this.state.status}invalidate(){this.state.isInvalidated||this.#o({type:"invalidate"})}async fetch(a,b){let c;if("idle"!==this.state.fetchStatus&&this.#l?.status()!=="rejected"){if(void 0!==this.state.data&&b?.cancelRefetch)this.cancel({silent:!0});else if(this.#l)return this.#l.continueRetry(),this.#l.promise}if(a&&this.setOptions(a),!this.options.queryFn){let a=this.observers.find(a=>a.options.queryFn);a&&this.setOptions(a.options)}let d=new AbortController,e=a=>{Object.defineProperty(a,"signal",{enumerable:!0,get:()=>(this.#n=!0,d.signal)})},f=()=>{let a,c=C(this.options,b),d=(e(a={client:this.#k,queryKey:this.queryKey,meta:this.meta}),a);return(this.#n=!1,this.options.persister)?this.options.persister(c,d,this):c(d)},g=(e(c={fetchOptions:b,options:this.options,queryKey:this.queryKey,client:this.#k,state:this.state,fetchFn:f}),c);this.options.behavior?.onFetch(g,this),this.#i=this.state,("idle"===this.state.fetchStatus||this.state.fetchMeta!==g.fetchOptions?.meta)&&this.#o({type:"fetch",meta:g.fetchOptions?.meta}),this.#l=L({initialPromise:b?.initialPromise,fn:g.fetchFn,onCancel:a=>{a instanceof K&&a.revert&&this.setState({...this.#i,fetchStatus:"idle"}),d.abort()},onFail:(a,b)=>{this.#o({type:"failed",failureCount:a,error:b})},onPause:()=>{this.#o({type:"pause"})},onContinue:()=>{this.#o({type:"continue"})},retry:g.options.retry,retryDelay:g.options.retryDelay,networkMode:g.options.networkMode,canRun:()=>!0});try{let a=await this.#l.start();if(void 0===a)throw Error(`${this.queryHash} data is undefined`);return this.setData(a),this.#j.config.onSuccess?.(a,this),this.#j.config.onSettled?.(a,this.state.error,this),a}catch(a){if(a instanceof K){if(a.silent)return this.#l.promise;else if(a.revert){if(void 0===this.state.data)throw a;return this.state.data}}throw this.#o({type:"error",error:a}),this.#j.config.onError?.(a,this),this.#j.config.onSettled?.(this.state.data,a,this),a}finally{this.scheduleGc()}}#o(a){let b=b=>{switch(a.type){case"failed":return{...b,fetchFailureCount:a.failureCount,fetchFailureReason:a.error};case"pause":return{...b,fetchStatus:"paused"};case"continue":return{...b,fetchStatus:"fetching"};case"fetch":var c;return{...b,...(c=b.data,{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:J(this.options.networkMode)?"fetching":"paused",...void 0===c&&{error:null,status:"pending"}}),fetchMeta:a.meta??null};case"success":let d={...b,...O(a.data,a.dataUpdatedAt),dataUpdateCount:b.dataUpdateCount+1,...!a.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return this.#i=a.manual?d:void 0,d;case"error":let e=a.error;return{...b,error:e,errorUpdateCount:b.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:b.fetchFailureCount+1,fetchFailureReason:e,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...b,isInvalidated:!0};case"setState":return{...b,...a.state}}};this.state=b(this.state),D.batch(()=>{this.observers.forEach(a=>{a.onQueryUpdate()}),this.#j.notify({query:this,type:"updated",action:a})})}};function O(a,b){return{data:a,dataUpdatedAt:b??Date.now(),error:null,isInvalidated:!1,status:"success"}}function P(a){let b="function"==typeof a.initialData?a.initialData():a.initialData,c=void 0!==b,d=c?"function"==typeof a.initialDataUpdatedAt?a.initialDataUpdatedAt():a.initialDataUpdatedAt:0;return{data:b,dataUpdateCount:0,dataUpdatedAt:c?d??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:c?"success":"pending",fetchStatus:"idle"}}var Q=class extends E{constructor(a={}){super(),this.config=a,this.#q=new Map}#q;build(a,b,c){let d=b.queryKey,e=b.queryHash??s(d,b),f=this.get(e);return f||(f=new N({client:a,queryKey:d,queryHash:e,options:a.defaultQueryOptions(b),state:c,defaultOptions:a.getQueryDefaults(d)}),this.add(f)),f}add(a){this.#q.has(a.queryHash)||(this.#q.set(a.queryHash,a),this.notify({type:"added",query:a}))}remove(a){let b=this.#q.get(a.queryHash);b&&(a.destroy(),b===a&&this.#q.delete(a.queryHash),this.notify({type:"removed",query:a}))}clear(){D.batch(()=>{this.getAll().forEach(a=>{this.remove(a)})})}get(a){return this.#q.get(a)}getAll(){return[...this.#q.values()]}find(a){let b={exact:!0,...a};return this.getAll().find(a=>q(b,a))}findAll(a={}){let b=this.getAll();return Object.keys(a).length>0?b.filter(b=>q(a,b)):b}notify(a){D.batch(()=>{this.listeners.forEach(b=>{b(a)})})}onFocus(){D.batch(()=>{this.getAll().forEach(a=>{a.onFocus()})})}onOnline(){D.batch(()=>{this.getAll().forEach(a=>{a.onOnline()})})}},R=class extends M{#k;#r;#s;#l;constructor(a){super(),this.#k=a.client,this.mutationId=a.mutationId,this.#s=a.mutationCache,this.#r=[],this.state=a.state||{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0},this.setOptions(a.options),this.scheduleGc()}setOptions(a){this.options=a,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(a){this.#r.includes(a)||(this.#r.push(a),this.clearGcTimeout(),this.#s.notify({type:"observerAdded",mutation:this,observer:a}))}removeObserver(a){this.#r=this.#r.filter(b=>b!==a),this.scheduleGc(),this.#s.notify({type:"observerRemoved",mutation:this,observer:a})}optionalRemove(){this.#r.length||("pending"===this.state.status?this.scheduleGc():this.#s.remove(this))}continue(){return this.#l?.continue()??this.execute(this.state.variables)}async execute(a){let b=()=>{this.#o({type:"continue"})},c={client:this.#k,meta:this.options.meta,mutationKey:this.options.mutationKey};this.#l=L({fn:()=>this.options.mutationFn?this.options.mutationFn(a,c):Promise.reject(Error("No mutationFn found")),onFail:(a,b)=>{this.#o({type:"failed",failureCount:a,error:b})},onPause:()=>{this.#o({type:"pause"})},onContinue:b,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>this.#s.canRun(this)});let d="pending"===this.state.status,e=!this.#l.canStart();try{if(d)b();else{this.#o({type:"pending",variables:a,isPaused:e}),this.#s.config.onMutate&&await this.#s.config.onMutate(a,this,c);let b=await this.options.onMutate?.(a,c);b!==this.state.context&&this.#o({type:"pending",context:b,variables:a,isPaused:e})}let f=await this.#l.start();return await this.#s.config.onSuccess?.(f,a,this.state.context,this,c),await this.options.onSuccess?.(f,a,this.state.context,c),await this.#s.config.onSettled?.(f,null,this.state.variables,this.state.context,this,c),await this.options.onSettled?.(f,null,a,this.state.context,c),this.#o({type:"success",data:f}),f}catch(b){try{await this.#s.config.onError?.(b,a,this.state.context,this,c)}catch(a){Promise.reject(a)}try{await this.options.onError?.(b,a,this.state.context,c)}catch(a){Promise.reject(a)}try{await this.#s.config.onSettled?.(void 0,b,this.state.variables,this.state.context,this,c)}catch(a){Promise.reject(a)}try{await this.options.onSettled?.(void 0,b,a,this.state.context,c)}catch(a){Promise.reject(a)}throw this.#o({type:"error",error:b}),b}finally{this.#s.runNext(this)}}#o(a){this.state=(b=>{switch(a.type){case"failed":return{...b,failureCount:a.failureCount,failureReason:a.error};case"pause":return{...b,isPaused:!0};case"continue":return{...b,isPaused:!1};case"pending":return{...b,context:a.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:a.isPaused,status:"pending",variables:a.variables,submittedAt:Date.now()};case"success":return{...b,data:a.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...b,data:void 0,error:a.error,failureCount:b.failureCount+1,failureReason:a.error,isPaused:!1,status:"error"}}})(this.state),D.batch(()=>{this.#r.forEach(b=>{b.onMutationUpdate(a)}),this.#s.notify({mutation:this,type:"updated",action:a})})}},S=class extends E{constructor(a={}){super(),this.config=a,this.#t=new Set,this.#u=new Map,this.#v=0}#t;#u;#v;build(a,b,c){let d=new R({client:a,mutationCache:this,mutationId:++this.#v,options:a.defaultMutationOptions(b),state:c});return this.add(d),d}add(a){this.#t.add(a);let b=T(a);if("string"==typeof b){let c=this.#u.get(b);c?c.push(a):this.#u.set(b,[a])}this.notify({type:"added",mutation:a})}remove(a){if(this.#t.delete(a)){let b=T(a);if("string"==typeof b){let c=this.#u.get(b);if(c)if(c.length>1){let b=c.indexOf(a);-1!==b&&c.splice(b,1)}else c[0]===a&&this.#u.delete(b)}}this.notify({type:"removed",mutation:a})}canRun(a){let b=T(a);if("string"!=typeof b)return!0;{let c=this.#u.get(b),d=c?.find(a=>"pending"===a.state.status);return!d||d===a}}runNext(a){let b=T(a);if("string"!=typeof b)return Promise.resolve();{let c=this.#u.get(b)?.find(b=>b!==a&&b.state.isPaused);return c?.continue()??Promise.resolve()}}clear(){D.batch(()=>{this.#t.forEach(a=>{this.notify({type:"removed",mutation:a})}),this.#t.clear(),this.#u.clear()})}getAll(){return Array.from(this.#t)}find(a){let b={exact:!0,...a};return this.getAll().find(a=>r(b,a))}findAll(a={}){return this.getAll().filter(b=>r(a,b))}notify(a){D.batch(()=>{this.listeners.forEach(b=>{b(a)})})}resumePausedMutations(){let a=this.getAll().filter(a=>a.state.isPaused);return D.batch(()=>Promise.all(a.map(a=>a.continue().catch(o))))}};function T(a){return a.options.scope?.id}function U(a){return{onFetch:(b,c)=>{let d=b.options,e=b.fetchOptions?.meta?.fetchMore?.direction,f=b.state.data?.pages||[],g=b.state.data?.pageParams||[],h={pages:[],pageParams:[]},i=0,j=async()=>{let c=!1,j=C(b.options,b.fetchOptions),k=async(a,d,e)=>{if(c)return Promise.reject();if(null==d&&a.pages.length)return Promise.resolve(a);let f=(()=>{var a,f;let g,h,i={client:b.client,queryKey:b.queryKey,pageParam:d,direction:e?"backward":"forward",meta:b.options.meta};return a=()=>b.signal,f=()=>c=!0,h=!1,Object.defineProperty(i,"signal",{enumerable:!0,get:()=>(g??=a(),h||(h=!0,g.aborted?f():g.addEventListener("abort",f,{once:!0})),g)}),i})(),g=await j(f),{maxPages:h}=b.options,i=e?A:z;return{pages:i(a.pages,g,h),pageParams:i(a.pageParams,d,h)}};if(e&&f.length){let a="backward"===e,b={pages:f,pageParams:g},c=(a?function(a,{pages:b,pageParams:c}){return b.length>0?a.getPreviousPageParam?.(b[0],b,c[0],c):void 0}:V)(d,b);h=await k(b,c,a)}else{let b=a??f.length;do{let a=0===i?g[0]??d.initialPageParam:V(d,h);if(i>0&&null==a)break;h=await k(h,a),i++}while(i<b)}return h};b.options.persister?b.fetchFn=()=>b.options.persister?.(j,{client:b.client,queryKey:b.queryKey,meta:b.options.meta,signal:b.signal},c):b.fetchFn=j}}}function V(a,{pages:b,pageParams:c}){let d=b.length-1;return b.length>0?a.getNextPageParam(b[d],b,c[d],c):void 0}var W=class{#w;#s;#m;#x;#y;#z;#A;#B;constructor(a={}){this.#w=a.queryCache||new Q,this.#s=a.mutationCache||new S,this.#m=a.defaultOptions||{},this.#x=new Map,this.#y=new Map,this.#z=0}mount(){this.#z++,1===this.#z&&(this.#A=F.subscribe(async a=>{a&&(await this.resumePausedMutations(),this.#w.onFocus())}),this.#B=G.subscribe(async a=>{a&&(await this.resumePausedMutations(),this.#w.onOnline())}))}unmount(){this.#z--,0===this.#z&&(this.#A?.(),this.#A=void 0,this.#B?.(),this.#B=void 0)}isFetching(a){return this.#w.findAll({...a,fetchStatus:"fetching"}).length}isMutating(a){return this.#s.findAll({...a,status:"pending"}).length}getQueryData(a){let b=this.defaultQueryOptions({queryKey:a});return this.#w.get(b.queryHash)?.state.data}ensureQueryData(a){let b=this.defaultQueryOptions(a),c=this.#w.build(this,b),d=c.state.data;return void 0===d?this.fetchQuery(a):(a.revalidateIfStale&&c.isStaleByTime(p(b.staleTime,c))&&this.prefetchQuery(b),Promise.resolve(d))}getQueriesData(a){return this.#w.findAll(a).map(({queryKey:a,state:b})=>[a,b.data])}setQueryData(a,b,c){let d=this.defaultQueryOptions({queryKey:a}),e=this.#w.get(d.queryHash),f=e?.state.data,g="function"==typeof b?b(f):b;if(void 0!==g)return this.#w.build(this,d).setData(g,{...c,manual:!0})}setQueriesData(a,b,c){return D.batch(()=>this.#w.findAll(a).map(({queryKey:a})=>[a,this.setQueryData(a,b,c)]))}getQueryState(a){let b=this.defaultQueryOptions({queryKey:a});return this.#w.get(b.queryHash)?.state}removeQueries(a){let b=this.#w;D.batch(()=>{b.findAll(a).forEach(a=>{b.remove(a)})})}resetQueries(a,b){let c=this.#w;return D.batch(()=>(c.findAll(a).forEach(a=>{a.reset()}),this.refetchQueries({type:"active",...a},b)))}cancelQueries(a,b={}){let c={revert:!0,...b};return Promise.all(D.batch(()=>this.#w.findAll(a).map(a=>a.cancel(c)))).then(o).catch(o)}invalidateQueries(a,b={}){return D.batch(()=>(this.#w.findAll(a).forEach(a=>{a.invalidate()}),a?.refetchType==="none")?Promise.resolve():this.refetchQueries({...a,type:a?.refetchType??a?.type??"active"},b))}refetchQueries(a,b={}){let c={...b,cancelRefetch:b.cancelRefetch??!0};return Promise.all(D.batch(()=>this.#w.findAll(a).filter(a=>!a.isDisabled()&&!a.isStatic()).map(a=>{let b=a.fetch(void 0,c);return c.throwOnError||(b=b.catch(o)),"paused"===a.state.fetchStatus?Promise.resolve():b}))).then(o)}fetchQuery(a){let b=this.defaultQueryOptions(a);void 0===b.retry&&(b.retry=!1);let c=this.#w.build(this,b);return c.isStaleByTime(p(b.staleTime,c))?c.fetch(b):Promise.resolve(c.state.data)}prefetchQuery(a){return this.fetchQuery(a).then(o).catch(o)}fetchInfiniteQuery(a){return a.behavior=U(a.pages),this.fetchQuery(a)}prefetchInfiniteQuery(a){return this.fetchInfiniteQuery(a).then(o).catch(o)}ensureInfiniteQueryData(a){return a.behavior=U(a.pages),this.ensureQueryData(a)}resumePausedMutations(){return G.isOnline()?this.#s.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#w}getMutationCache(){return this.#s}getDefaultOptions(){return this.#m}setDefaultOptions(a){this.#m=a}setQueryDefaults(a,b){this.#x.set(t(a),{queryKey:a,defaultOptions:b})}getQueryDefaults(a){let b=[...this.#x.values()],c={};return b.forEach(b=>{u(a,b.queryKey)&&Object.assign(c,b.defaultOptions)}),c}setMutationDefaults(a,b){this.#y.set(t(a),{mutationKey:a,defaultOptions:b})}getMutationDefaults(a){let b=[...this.#y.values()],c={};return b.forEach(b=>{u(a,b.mutationKey)&&Object.assign(c,b.defaultOptions)}),c}defaultQueryOptions(a){if(a._defaulted)return a;let b={...this.#m.queries,...this.getQueryDefaults(a.queryKey),...a,_defaulted:!0};return b.queryHash||(b.queryHash=s(b.queryKey,b)),void 0===b.refetchOnReconnect&&(b.refetchOnReconnect="always"!==b.networkMode),void 0===b.throwOnError&&(b.throwOnError=!!b.suspense),!b.networkMode&&b.persister&&(b.networkMode="offlineFirst"),b.queryFn===B&&(b.enabled=!1),b}defaultMutationOptions(a){return a?._defaulted?a:{...this.#m.mutations,...a?.mutationKey&&this.getMutationDefaults(a.mutationKey),...a,_defaulted:!0}}clear(){this.#w.clear(),this.#s.clear()}},X=a.i(11321),Y=X.createContext(void 0),Z=({client:a,children:b})=>(X.useEffect(()=>(a.mount(),()=>{a.unmount()}),[a]),(0,l.jsx)(Y.Provider,{value:a,children:b}));let $={data:""},_=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,aa=/\/\*[^]*?\*\/|  +/g,ab=/\n+/g,ac=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?ac(g,f):f+"{"+ac(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=ac(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=ac.p?ac.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},ad={},ae=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+ae(a[c]);return b}return a};function af(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let g=ae(a),h=ad[g]||(ad[g]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(g));if(!ad[h]){let b=g!==a?a:(a=>{let b,c,d=[{}];for(;b=_.exec(a.replace(aa,""));)b[4]?d.shift():b[3]?(c=b[3].replace(ab," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(ab," ").trim();return d[0]})(a);ad[h]=ac(e?{["@keyframes "+h]:b}:b,c?"":"."+h)}let i=c&&ad.g?ad.g:null;return c&&(ad.g=ad[h]),f=ad[h],i?b.data=b.data.replace(i,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),h})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":ac(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||$,d.g,d.o,d.k)}af.bind({g:1});let ag,ah,ai,aj=af.bind({k:1});function ak(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:ah&&ah()},h),c.o=/ *go\d+/.test(i),h.className=af.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),ai&&j[0]&&ai(h),ag(j,h)}return b?b(e):e}}var al=(a,b)=>"function"==typeof a?a(b):a,am=(i=0,()=>(++i).toString()),an="default",ao=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return ao(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},ap=[],aq={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},ar={},as=(a,b=an)=>{ar[b]=ao(ar[b]||aq,a),ap.forEach(([a,c])=>{a===b&&c(ar[b])})},at=a=>Object.keys(ar).forEach(b=>as(a,b)),au=(a=an)=>b=>{as(b,a)},av={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},aw=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||am()}))(b,a,c);return au(e.toasterId||(d=e.id,Object.keys(ar).find(a=>ar[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},ax=(a,b)=>aw("blank")(a,b);ax.error=aw("error"),ax.success=aw("success"),ax.loading=aw("loading"),ax.custom=aw("custom"),ax.dismiss=(a,b)=>{let c={type:3,toastId:a};b?au(b)(c):at(c)},ax.dismissAll=a=>ax.dismiss(void 0,a),ax.remove=(a,b)=>{let c={type:4,toastId:a};b?au(b)(c):at(c)},ax.removeAll=a=>ax.remove(void 0,a),ax.promise=(a,b,c)=>{let d=ax.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?al(b.success,a):void 0;return e?ax.success(e,{id:d,...c,...null==c?void 0:c.success}):ax.dismiss(d),a}).catch(a=>{let e=b.error?al(b.error,a):void 0;e?ax.error(e,{id:d,...c,...null==c?void 0:c.error}):ax.dismiss(d)}),a};var ay=1e3,az=aj`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,aA=aj`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,aB=aj`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,aC=ak("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${az} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${aA} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${aB} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,aD=aj`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,aE=ak("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${aD} 1s linear infinite;
`,aF=aj`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,aG=aj`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,aH=ak("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${aF} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${aG} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,aI=ak("div")`
  position: absolute;
`,aJ=ak("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,aK=aj`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,aL=ak("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${aK} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,aM=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?X.createElement(aL,null,b):b:"blank"===c?null:X.createElement(aJ,null,X.createElement(aE,{...d}),"loading"!==c&&X.createElement(aI,null,"error"===c?X.createElement(aC,{...d}):X.createElement(aH,{...d})))},aN=ak("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,aO=ak("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,aP=X.memo(({toast:a,position:b,style:c,children:d})=>{let e=a.height?((a,b)=>{let c=a.includes("top")?1:-1,[d,e]=j?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*c}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*c}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${aj(d)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${aj(e)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},f=X.createElement(aM,{toast:a}),g=X.createElement(aO,{...a.ariaProps},al(a.message,a));return X.createElement(aN,{className:a.className,style:{...e,...c,...a.style}},"function"==typeof d?d({icon:f,message:g}):X.createElement(X.Fragment,null,f,g))});k=X.createElement,ac.p=void 0,ag=k,ah=void 0,ai=void 0;var aQ=({id:a,className:b,style:c,onHeightUpdate:d,children:e})=>{let f=X.useCallback(b=>{if(b){let c=()=>{d(a,b.getBoundingClientRect().height)};c(),new MutationObserver(c).observe(b,{subtree:!0,childList:!0,characterData:!0})}},[a,d]);return X.createElement("div",{ref:f,className:b,style:c},e)},aR=af`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,aS=({reverseOrder:a,position:b="top-center",toastOptions:c,gutter:d,children:e,toasterId:f,containerStyle:g,containerClassName:h})=>{let{toasts:i,handlers:k}=((a,b="default")=>{let{toasts:c,pausedAt:d}=((a={},b=an)=>{let[c,d]=(0,X.useState)(ar[b]||aq),e=(0,X.useRef)(ar[b]);(0,X.useEffect)(()=>(e.current!==ar[b]&&d(ar[b]),ap.push([b,d]),()=>{let a=ap.findIndex(([a])=>a===b);a>-1&&ap.splice(a,1)}),[b]);let f=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||av[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:f}})(a,b),e=(0,X.useRef)(new Map).current,f=(0,X.useCallback)((a,b=ay)=>{if(e.has(a))return;let c=setTimeout(()=>{e.delete(a),g({type:4,toastId:a})},b);e.set(a,c)},[]);(0,X.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&ax.dismiss(c.id);return}return setTimeout(()=>ax.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let g=(0,X.useCallback)(au(b),[b]),h=(0,X.useCallback)(()=>{g({type:5,time:Date.now()})},[g]),i=(0,X.useCallback)((a,b)=>{g({type:1,toast:{id:a,height:b}})},[g]),j=(0,X.useCallback)(()=>{d&&g({type:6,time:Date.now()})},[d,g]),k=(0,X.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,X.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)f(a.id,a.removeDelay);else{let b=e.get(a.id);b&&(clearTimeout(b),e.delete(a.id))}})},[c,f]),{toasts:c,handlers:{updateHeight:i,startPause:h,endPause:j,calculateOffset:k}}})(c,f);return X.createElement("div",{"data-rht-toaster":f||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...g},className:h,onMouseEnter:k.startPause,onMouseLeave:k.endPause},i.map(c=>{let f,g,h=c.position||b,i=k.calculateOffset(c,{reverseOrder:a,gutter:d,defaultPosition:b}),l=(f=h.includes("top"),g=h.includes("center")?{justifyContent:"center"}:h.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:j?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${i*(f?1:-1)}px)`,...f?{top:0}:{bottom:0},...g});return X.createElement(aQ,{id:c.id,key:c.id,onHeightUpdate:k.updateHeight,className:c.visible?aR:"",style:l},"custom"===c.type?al(c.message,c):e?e(c):X.createElement(aP,{toast:c,position:h}))}))};let aT=new W;a.s(["ClientLayout",0,({children:a})=>(0,l.jsx)("main",{className:"flex-1",children:(0,l.jsxs)("div",{className:"",children:[(0,l.jsx)(Z,{client:aT,children:a}),(0,l.jsx)(aS,{})]})})],42804)}];

//# sourceMappingURL=apps_web_src_app_ClientLayout_tsx_0mzbebq._.js.map