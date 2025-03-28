---
createTime: 2025/3/16
tag: '工程化,SDK'
---
# 从0到1搭建前端监控平台

文章分成以下六部分来介绍：

* 自研监控平台解决了哪些痛点，实现了什么亮点功能？

* 相比sentry等监控方案，自研监控的优势有哪些？

* 前端监控的设计方案、监控的目的

* 数据的采集方式：错误信息、性能数据、用户行为、加载资源、个性化指标等

* 设计开发一个完整的监控SDK

* 监控后台错误还原演示示例

痛点
--

某⼀天用户：xx商品无法下单！  
⼜⼀天运营：xx广告在手机端打开不了！

大家反馈的bug，怎么都复现不出来，尴尬的要死！😢

如何记录项目的错误，并将错误还原出来，这是监控平台要解决的痛点之一

错误还原
----

[web-see](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fxy-sea%2Fweb-see "https://github.com/xy-sea/web-see") 监控提供三种错误还原方式：定位源码、播放录屏、记录用户行为

### 定位源码

项目出错，要是能定位到源码就好了，可线上的项目都是打包后的代码，也不能把 .map 文件放到线上

监控平台通过 [source-map](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmozilla%2Fsource-map "https://github.com/mozilla/source-map") 可以实现该功能

最终效果：

![errorCode.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/026bbc81cf4843b6a0671c89a52e8513~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

### 播放录屏

多数场景下，定位到具体的源码，就可以定位bug，但如果是用户做了异常操作，或者是在某些复杂操作下才出现的bug，仅仅通过定位源码，还是不能还原错误

要是能把用户的操作都录制下来，然后通过回放来还原错误就好了

监控平台通过 [rrweb](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Frrweb-io%2Frrweb "https://github.com/rrweb-io/rrweb") 可以实现该功能

最终效果： ![record.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0eb30a82a89e457182b9fde875757e80~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

回放的录屏中，记录了用户的所有操作，红色的线代表了鼠标的移动轨迹

前端录屏确实是件很酷的事情，但是不能走极端，如果把用户的所有操作都录制下来，是没有意义的

我们更关注的是，页面报错的时候用户做了哪些操作，所以监控平台只把报错前10s的视频保存下来（单次录屏时长也可以自定义）

### 记录用户行为

通过 定位源码 + 播放录屏 这套组合，还原错误应该够用了，同时监控平台也提供了 记录用户行为 这种方式

假如用户做了很多操作，操作的间隔超过了单次录屏时长，录制的视频可能是不完整的，此时可以借助用户行为来分析用户的操作，帮助复现bug

最终效果： ![userlist.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30f7c0f6e99d4f1d81def0c37a86e1ca~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

用户行为列表记录了：鼠标点击、接口调用、资源加载、页面路由变化、代码报错等信息

通过 `定位源码、播放录屏、记录用户行为` 这三板斧，解决了复现bug的痛点

自研监控的优势
-------

为什么不直接用sentry私有化部署，而选择自研前端监控？

这是优先要思考的问题，sentry作为前端监控的行业标杆，有很多可以借鉴的地方

相比sentry，自研监控平台的优势在于：

1、可以将公司的SDK统一成一个，包括但不限于：监控SDK、埋点SDK、录屏SDK、广告SDK等

2、提供了更多的错误还原方式，同时错误信息可以和埋点信息联动，便可拿到更细致的用户行为栈，更快的排查线上错误

3、监控自定义的个性化指标：如 long task、memory页面内存、首屏加载时间等。过多的长任务会造成页面丢帧、卡顿；过大的内存可能会造成低端机器的卡死、崩溃

4、统计资源缓存率，来判断项目的缓存策略是否合理，提升缓存率可以减少服务器压力，也可以提升页面的打开速度

设计思路
----

一个完整的前端监控平台包括三个部分：数据采集与上报、数据分析和存储、数据展示

![system.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2111ab12f74546a9b570ea8f5fd52cc9~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

### 监控目的

![title.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b17a43984e3945199c6c4fcad74ec6f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

### 异常分析

按照 5W1H 法则来分析前端异常，需要知道以下信息

1. What，发⽣了什么错误：JS错误、异步错误、资源加载、接口错误等
2. When，出现的时间段，如时间戳
3. Who，影响了多少用户，包括报错事件数、IP
4. Where，出现的页面是哪些，包括页面、对应的设备信息
5. Why，错误的原因是为什么，包括错误堆栈、⾏列、SourceMap、异常录屏
6. How，如何定位还原问题，如何异常报警，避免类似的错误发生

错误数据采集
------

错误信息是最基础也是最重要的数据，错误信息主要分为下面几类：

* JS 代码运行错误、语法错误等
* 异步错误等
* 静态资源加载错误
* 接口请求报错

### 错误捕获方式

1）try/catch

只能捕获代码常规的运行错误，语法错误和异步错误不能捕获到

示例：

```
// 示例1：常规运行时错误，可以捕获 ✅
 try {
   let a = undefined;
   if (a.length) {
     console.log('111');
   }
 } catch (e) {
   console.log('捕获到异常：', e);
}

// 示例2：语法错误，不能捕获 ❌  
try {
  const notdefined,
} catch(e) {
  console.log('捕获不到异常：', 'Uncaught SyntaxError');
}
  
// 示例3：异步错误，不能捕获 ❌
try {
  setTimeout(() => {
    console.log(notdefined);
  }, 0)
} catch(e) {
  console.log('捕获不到异常：', 'Uncaught ReferenceError');
}

```

2） window.onerror

window.onerror 可以捕获常规错误、异步错误，但不能捕获资源错误

```
/**
* @param { string } message 错误信息
* @param { string } source 发生错误的脚本URL
* @param { number } lineno 发生错误的行号
* @param { number } colno 发生错误的列号
* @param { object } error Error对象
*/
window.onerror = function(message, source, lineno, colno, error) {
   console.log('捕获到的错误信息是：', message, source, lineno, colno, error )
}

```

示例：

```
window.onerror = function(message, source, lineno, colno, error) {
  console.log("捕获到的错误信息是：", message, source, lineno, colno, error);
};

// 示例1：常规运行时错误，可以捕获 ✅
console.log(notdefined);

// 示例2：语法错误，不能捕获 ❌
const notdefined;

// 示例3：异步错误，可以捕获 ✅
setTimeout(() => {
  console.log(notdefined);
}, 0);

// 示例4：资源错误，不能捕获 ❌
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://www.test.com/index.js";
document.body.appendChild(script);

```

3） window.addEventListener

当静态资源加载失败时，会触发 error 事件， 此时 window.onerror 不能捕获到

示例：

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
</head>
<script>
  window.addEventListener('error', (error) => {
    console.log('捕获到异常：', error);
  }, true)
</script>

<!-- 图片、script、css加载错误，都能被捕获 ✅ -->
<img src="https://test.cn/×××.png">
<script src="https://test.cn/×××.js"></script>
<link href="https://test.cn/×××.css" rel="stylesheet" />

<script>
  // new Image错误，不能捕获 ❌
  // new Image运用的比较少，可以自己单独处理
  new Image().src = 'https://test.cn/×××.png'
</script>
</html>

```

4）Promise错误

Promise中抛出的错误，无法被 window.onerror、try/catch、 error 事件捕获到，可通过 unhandledrejection 事件来处理

示例：

```
try {
  new Promise((resolve, reject) => {
    JSON.parse("");
    resolve();
  });
} catch (err) {
  // try/catch 不能捕获Promise中错误 ❌
  console.error("in try catch", err);
}

// error事件 不能捕获Promise中错误 ❌
window.addEventListener(
  "error",
  error => {
    console.log("捕获到异常：", error);
  },
  true
);

// window.onerror 不能捕获Promise中错误 ❌
window.onerror = function(message, source, lineno, colno, error) {
  console.log("捕获到异常：", { message, source, lineno, colno, error });
};

// unhandledrejection 可以捕获Promise中的错误 ✅
window.addEventListener("unhandledrejection", function(e) {
  console.log("捕获到异常", e);
  // preventDefault阻止传播，不会在控制台打印
  e.preventDefault();
});


```

### Vue 错误

Vue项目中，window.onerror 和 error 事件不能捕获到常规的代码错误

异常代码：

```
export default {
  created() {
    let a = null;
    if(a.length > 1) {
        // ...
    }
  }
};

```

main.js中添加捕获代码：

```
window.addEventListener('error', (error) => {
  console.log('error', error);
});
window.onerror = function (msg, url, line, col, error) {
  console.log('onerror', msg, url, line, col, error);
};

```

控制台会报错，但是 window.onerror 和 error 不能捕获到

![error.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a466fa1a02fb44b6b03f476a4bd066b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

vue 通过 `Vue.config.errorHander` 来捕获异常：

```
Vue.config.errorHandler = (err, vm, info) => {
    console.log('进来啦~', err);
}

```

控制台打印:

![error2.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60cea7b4e84d4f699f11854feac23639~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

**errorHandler源码分析**

在`src/core/util`目录下，有一个`error.js`文件

```
function globalHandleError (err, vm, info) {
  // 获取全局配置，判断是否设置处理函数，默认undefined
  // 配置config.errorHandler方法
  if (config.errorHandler) {
    try {
      // 执行 errorHandler
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // 如果开发者在errorHandler函数中，手动抛出同样错误信息throw err，判断err信息是否相等，避免log两次
      if (e !== err) {
        logError(e, null, 'config.errorHandler')
      }
    }
  }
  // 没有配置，常规输出
  logError(err, vm, info)
}

function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(`Error in ${info}: "${err.toString()}"`, vm)
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err)
  } else {
    throw err
  }
}

```

通过源码明白了，vue 使用 try/catch 来捕获常规代码的报错，被捕获的错误会通过 console.error 输出而避免应用崩溃

可以在 Vue.config.errorHandler 中将捕获的错误上报

```
Vue.config.errorHandler = function (err, vm, info) { 
  // handleError方法用来处理错误并上报
  handleError(err);
}

```

### React 错误

从 react16 开始，官方提供了 ErrorBoundary 错误边界的功能，被该组件包裹的子组件，render 函数报错时会触发离当前组件最近父组件的ErrorBoundary

生产环境，一旦被 ErrorBoundary 捕获的错误，也不会触发全局的 window.onerror 和 error 事件

父组件代码：

```
import React from 'react';
import Child from './Child.js';

// window.onerror 不能捕获render函数的错误 ❌
window.onerror = function (err, msg, c, l) {
  console.log('err', err, msg);
};

// error 不能render函数的错误 ❌
window.addEventListener( 'error', (error) => {
    console.log('捕获到异常：', error);
  },true
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // componentDidCatch 可以捕获render函数的错误 
    console.log(error, errorInfo)
    
    // 同样可以将错误日志上报给服务器
    reportError(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // 自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function Parent() {
  return (
    <div>
      父组件
      <ErrorBoundary>
        <Child />
      </ErrorBoundary>
    </div>
  );
}

export default Parent;

```

子组件代码：

```
// 子组件 渲染出错
function Child() {
  let list = {};
  return (
    <div>
      子组件
      {list.map((item, key) => (
        <span key={key}>{item}</span>
      ))}
    </div>
  );
}
export default Child;

```

同vue项目的处理类似，react项目中，可以在 componentDidCatch 中将捕获的错误上报

```
componentDidCatch(error, errorInfo) {
  // handleError方法用来处理错误并上报
  handleError(err);
}

```

### 跨域问题

如果当前页面中，引入了其他域名的JS资源，如果资源出现错误，error 事件只会监测到一个 `script error` 的异常。

示例：

```
window.addEventListener("error", error => { 
  console.log("捕获到异常：", error);
}, true );

// 当前页面加载其他域的资源，如https://www.test.com/index.js
<script src="https://www.test.com/index.js"></script>

// 加载的https://www.test.com/index.js的代码
function fn() {
  JSON.parse("");
}
fn();

```

报错信息：

![scriptError.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d3a64682d05414e9e4c7a17a78895f4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

只能捕获到 `script error` 的原因：

是由于浏览器基于`安全考虑`，故意隐藏了其它域JS文件抛出的具体错误信息，这样可以有效避免敏感信息无意中被第三方(不受控制的)脚本捕获到，因此，浏览器只允许同域下的脚本捕获具体的错误信息

解决方法：

前端script加crossorigin，后端配置 Access-Control-Allow-Origin

```
<script src="https://www.test.com/index.js" crossorigin></script>

```

添加 crossorigin 后可以捕获到完整的报错信息：

![ScriptError1.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f78998ae48140bebbae82ce6f073536~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

如果不能修改服务端的请求头，可以考虑通过使用 try/catch 绕过，将错误抛出

```
<!doctype html>
<html>
<body>
  <script src="https://www.test.com/index.js"></script>
  <script>
  window.addEventListener("error", error => { 
    console.log("捕获到异常：", error);
  }, true );
  
  try {
    // 调用https://www.test.com/index.js中定义的fn方法
    fn(); 
  } catch (e) {
    throw e;
  }
  </script>
</body>
</html>

```

### 接口错误

接口监控的实现原理：针对浏览器内置的 XMLHttpRequest、fetch 对象，利用 AOP 切片编程重写该方法，实现对请求的接口拦截，从而获取接口报错的情况并上报

1）拦截XMLHttpRequest请求示例：

```
function xhrReplace() {
  if (!("XMLHttpRequest" in window)) {
    return;
  }
  const originalXhrProto = XMLHttpRequest.prototype;
  // 重写XMLHttpRequest 原型上的open方法
  replaceAop(originalXhrProto, "open", originalOpen => {
    return function(...args) {
      // 获取请求的信息
      this._xhr = {
        method: typeof args[0] === "string" ? args[0].toUpperCase() : args[0],
        url: args[1],
        startTime: new Date().getTime(),
        type: "xhr"
      };
      // 执行原始的open方法
      originalOpen.apply(this, args);
    };
  });
  // 重写XMLHttpRequest 原型上的send方法
  replaceAop(originalXhrProto, "send", originalSend => {
    return function(...args) {
      // 当请求结束时触发，无论请求成功还是失败都会触发
      this.addEventListener("loadend", () => {
        const { responseType, response, status } = this;
        const endTime = new Date().getTime();
        this._xhr.reqData = args[0];
        this._xhr.status = status;
        if (["", "json", "text"].indexOf(responseType) !== -1) {
          this._xhr.responseText =
            typeof response === "object" ? JSON.stringify(response) : response;
        }
        // 获取接口的请求时长
        this._xhr.elapsedTime = endTime - this._xhr.startTime;

        // 上报xhr接口数据
        reportData(this._xhr);
      });
      // 执行原始的send方法
      originalSend.apply(this, args);
    };
  });
}

/**
 * 重写指定的方法
 * @param { object } source 重写的对象
 * @param { string } name 重写的属性
 * @param { function } fn 拦截的函数
 */
function replaceAop(source, name, fn) {
  if (source === undefined) return;
  if (name in source) {
    var original = source[name];
    var wrapped = fn(original);
    if (typeof wrapped === "function") {
      source[name] = wrapped;
    }
  }
}

```

2）拦截fetch请求示例：

```
function fetchReplace() {
  if (!("fetch" in window)) {
    return;
  }
  // 重写fetch方法
  replaceAop(window, "fetch", originalFetch => {
    return function(url, config) {
      const sTime = new Date().getTime();
      const method = (config && config.method) || "GET";
      let handlerData = {
        type: "fetch",
        method,
        reqData: config && config.body,
        url
      };

      return originalFetch.apply(window, [url, config]).then(
        res => {
          // res.clone克隆，防止被标记已消费
          const tempRes = res.clone();
          const eTime = new Date().getTime();
          handlerData = {
            ...handlerData,
            elapsedTime: eTime - sTime,
            status: tempRes.status
          };
          tempRes.text().then(data => {
            handlerData.responseText = data;
            // 上报fetch接口数据
            reportData(handlerData);
          });

          // 返回原始的结果，外部继续使用then接收
          return res;
        },
        err => {
          const eTime = new Date().getTime();
          handlerData = {
            ...handlerData,
            elapsedTime: eTime - sTime,
            status: 0
          };
          // 上报fetch接口数据
          reportData(handlerData);
          throw err;
        }
      );
    };
  });
}

```

性能数据采集
------

谈到性能数据采集，就会提及加载过程模型图：

![timing.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d47107de71349518cf4f43e6508fa3a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

以Spa页面来说，页面的加载过程大致是这样的：

![spa.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93ee1530332a432b904eb3f6af65cc7a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

包括dns查询、建立tcp连接、发送http请求、返回html文档、html文档解析等阶段

最初，可以通过 `window.performance.timing` 来获取加载过程模型中各个阶段的耗时数据

```
// window.performance.timing 各字段说明
{
    navigationStart,  // 同一个浏览器上下文中，上一个文档结束时的时间戳。如果没有上一个文档，这个值会和 fetchStart 相同。
    unloadEventStart,  // 上一个文档 unload 事件触发时的时间戳。如果没有上一个文档，为 0。
    unloadEventEnd, // 上一个文档 unload 事件结束时的时间戳。如果没有上一个文档，为 0。
    redirectStart, // 表示第一个 http 重定向开始时的时间戳。如果没有重定向或者有一个非同源的重定向，为 0。
    redirectEnd, // 表示最后一个 http 重定向结束时的时间戳。如果没有重定向或者有一个非同源的重定向，为 0。
    fetchStart, // 表示浏览器准备好使用 http 请求来获取文档的时间戳。这个时间点会在检查任何缓存之前。
    domainLookupStart, // 域名查询开始的时间戳。如果使用了持久连接或者本地有缓存，这个值会和 fetchStart 相同。
    domainLookupEnd, // 域名查询结束的时间戳。如果使用了持久连接或者本地有缓存，这个值会和 fetchStart 相同。
    connectStart, // http 请求向服务器发送连接请求时的时间戳。如果使用了持久连接，这个值会和 fetchStart 相同。
    connectEnd, // 浏览器和服务器之前建立连接的时间戳，所有握手和认证过程全部结束。如果使用了持久连接，这个值会和 fetchStart 相同。
    secureConnectionStart, // 浏览器与服务器开始安全链接的握手时的时间戳。如果当前网页不要求安全连接，返回 0。
    requestStart, // 浏览器向服务器发起 http 请求(或者读取本地缓存)时的时间戳，即获取 html 文档。
    responseStart, // 浏览器从服务器接收到第一个字节时的时间戳。
    responseEnd, // 浏览器从服务器接受到最后一个字节时的时间戳。
    domLoading, // dom 结构开始解析的时间戳，document.readyState 的值为 loading。
    domInteractive, // dom 结构解析结束，开始加载内嵌资源的时间戳，document.readyState 的状态为 interactive。
    domContentLoadedEventStart, // DOMContentLoaded 事件触发时的时间戳，所有需要执行的脚本执行完毕。
    domContentLoadedEventEnd,  // DOMContentLoaded 事件结束时的时间戳
    domComplete, // dom 文档完成解析的时间戳， document.readyState 的值为 complete。
    loadEventStart, // load 事件触发的时间。
    loadEventEnd // load 时间结束时的时间。
}

```

后来 window.performance.timing 被废弃，通过 [PerformanceObserver](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FPerformanceObserver "https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FPerformanceObserver") 来获取。旧的 api，返回的是一个 `UNIX` 类型的绝对时间，和用户的系统时间相关，分析的时候需要再次计算。而新的 api，返回的是一个相对时间，可以直接用来分析

现在 chrome 开发团队提供了 [web-vitals](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fweb-vitals "https://www.npmjs.com/package/web-vitals") 库，方便来计算各性能数据（注意：web-vitals 不支持safari浏览器）

关于 FP、FCP、LCP、CLS、TTFB、FID 等性能指标的含义和计算方式，我在 [「历时8个月」10万字前端知识体系总结（工程化篇）🔥](https://juejin.cn/post/7146976516692410376/#heading-63 "https://juejin.cn/post/7146976516692410376/#heading-63") 中有详细的讲解，这里不再赘述

用户行为数据采集
--------

用户行为包括：页面路由变化、鼠标点击、资源加载、接口调用、代码报错等行为

### 设计思路

1、通过Breadcrumb类来创建用户行为的对象，来存储和管理所有的用户行为

2、通过重写或添加相应的事件，完成用户行为数据的采集

用户行为代码示例：

```
// 创建用户行为类
class Breadcrumb {
  // maxBreadcrumbs控制上报用户行为的最大条数
  maxBreadcrumbs = 20;
  // stack 存储用户行为
  stack = [];
  constructor() {}
  // 添加用户行为栈
  push(data) {
    if (this.stack.length >= this.maxBreadcrumbs) {
      // 超出则删除第一条
      this.stack.shift();
    }
    this.stack.push(data);
    // 按照时间排序
    this.stack.sort((a, b) => a.time - b.time);
  }
}

let breadcrumb = new Breadcrumb();

// 添加一条页面跳转的行为，从home页面跳转到about页面
breadcrumb.push({
  type: "Route",
  form: '/home',
  to: '/about'
  url: "http://localhost:3000/index.html",
  time: "1668759320435"
});

// 添加一条用户点击行为
breadcrumb.push({
  type: "Click",
  dom: "<button id='btn'>按钮</button>",
  time: "1668759620485"
});

// 添加一条调用接口行为
breadcrumb.push({
  type: "Xhr",
  url: "http://10.105.10.12/monitor/open/pushData",
  time: "1668760485550"
});

// 上报用户行为
reportData({
  uuid: "a6481683-6d2e-4bd8-bba1-64819d8cce8c",
  stack: breadcrumb.getStack()
});

```

### 页面跳转

通过监听路由的变化来判断页面跳转，路由有`history、hash`两种模式，history模式可以监听`popstate`事件，hash模式通过重写 `pushState和 replaceState`事件

vue项目中不能通过 `hashchange` 事件来监听路由变化，`vue-router` 底层调用的是 `history.pushState` 和 `history.replaceState`，不会触发 hashchange

vue-router源码：

```
function pushState (url, replace) {
  saveScrollPosition();
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}
...

// this.$router.push时触发
function pushHash (path) { 
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

```

通过重写 pushState、replaceState 事件来监听路由变化

```
// lastHref 前一个页面的路由
let lastHref = document.location.href;
function historyReplace() {
  function historyReplaceFn(originalHistoryFn) {
    return function(...args) {
      const url = args.length > 2 ? args[2] : undefined;
      if (url) {
        const from = lastHref;
        const to = String(url);
        lastHref = to;
        // 上报路由变化
        reportData("routeChange", {
          from,
          to
        });
      }
      return originalHistoryFn.apply(this, args);
    };
  }
  // 重写pushState事件
  replaceAop(window.history, "pushState", historyReplaceFn);
  // 重写replaceState事件
  replaceAop(window.history, "replaceState", historyReplaceFn);
}

function replaceAop(source, name, fn) {
  if (source === undefined) return;
  if (name in source) {
    var original = source[name];
    var wrapped = fn(original);
    if (typeof wrapped === "function") {
      source[name] = wrapped;
    }
  }
}

```

### 用户点击

给 document 对象添加click事件，并上报

```
function domReplace() {
  document.addEventListener("click",({ target }) => {
      const tagName = target.tagName.toLowerCase();
      if (tagName === "body") {
        return null;
      }
      let classNames = target.classList.value;
      classNames = classNames !== "" ? ` class="${classNames}"` : "";
      const id = target.id ? ` id="${target.id}"` : "";
      const innerText = target.innerText;
      // 获取包含id、class、innerTextde字符串的标签
      let dom = `<${tagName}${id}${
        classNames !== "" ? classNames : ""
      }>${innerText}</${tagName}>`;
      // 上报
      reportData({
        type: 'Click',
        dom
      });
    },
    true
  );
}

```

### 资源加载

获取页面中加载的资源信息，比如它们的 url 是什么、加载了多久、是否来自缓存等，最终生成 [资源加载瀑布图](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fcsdn_girl%2Farticle%2Fdetails%2F54911632 "https://blog.csdn.net/csdn_girl/article/details/54911632")

![waterfall .png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e92b04772b2044e5a2cc21b1b73c9acb~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

瀑布图展现了浏览器为渲染网页而加载的所有的资源，包括加载的顺序和每个资源的加载时间

分析这些资源是如何加载的, 可以帮助我们了解究竟是什么原因拖慢了网页，从而采取对应的措施来提升网页速度

可以通过 [performance.getEntriesByType('resource')](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FPerformance%2FgetEntriesByType "https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/getEntriesByType") 获取页面加载的资源列表，同时可以结合 initiatorType 字段来判断资源类型，对资源进行过滤

其中 [PerformanceResourceTiming](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FPerformance%2FgetEntriesByType "https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/getEntriesByType") 来分析资源加载的详细数据

```
// PerformanceResourceTiming 各字段说明
{
  connectEnd, // 表示浏览器完成建立与服务器的连接以检索资源之后的时间
  connectStart, // 表示浏览器开始建立与服务器的连接以检索资源之前的时间
  decodedBodySize, // 表示在删除任何应用的内容编码之后，从*消息主体*的请求（HTTP 或缓存）中接收到的大小（以八位字节为单位）
  domainLookupEnd, // 表示浏览器完成资源的域名查找之后的时间
  domainLookupStart, // 表示在浏览器立即开始资源的域名查找之前的时间
  duration, // 返回一个timestamp，即 responseEnd 和 startTime 属性的差值
  encodedBodySize, // 表示在删除任何应用的内容编码之前，从*有效内容主体*的请求（HTTP 或缓存）中接收到的大小（以八位字节为单位）
  entryType, // 返回 "resource"
  fetchStart, // 表示浏览器即将开始获取资源之前的时间
  initiatorType, // 代表启动性能条目的资源的类型，如 PerformanceResourceTiming.initiatorType 中所指定
  name, // 返回资源 URL
  nextHopProtocol, // 代表用于获取资源的网络协议
  redirectEnd, // 表示收到上一次重定向响应的发送最后一个字节时的时间
  redirectStart, // 表示上一次重定向开始的时间
  requestStart, // 表示浏览器开始向服务器请求资源之前的时间
  responseEnd, // 表示在浏览器接收到资源的最后一个字节之后或在传输连接关闭之前（以先到者为准）的时间
  responseStart, // 表示浏览器从服务器接收到响应的第一个字节后的时间
  secureConnectionStart, // 表示浏览器即将开始握手过程以保护当前连接之前的时间
  serverTiming, // 一个 PerformanceServerTiming 数组，包含服务器计时指标的PerformanceServerTiming 条目
  startTime, // 表示资源获取开始的时间。该值等效于 PerformanceEntry.fetchStart
  transferSize, // 代表所获取资源的大小（以八位字节为单位）。该大小包括响应标头字段以及响应有效内容主体
  workerStart // 如果服务 Worker 线程已经在运行，则返回在分派 FetchEvent 之前的时间戳，如果尚未运行，则返回在启动 Service Worker 线程之前的时间戳。如果服务 Worker 未拦截该资源，则该属性将始终返回 0。
}

```

获取资源加载时长为 `duration` 字段，即 `responseEnd 与 startTime` 的差值

获取加载资源列表：

```
function getResource() {
  if (performance.getEntriesByType) {
    const entries = performance.getEntriesByType('resource');
    // 过滤掉非静态资源的 fetch、 xmlhttprequest、beacon
    let list = entries.filter((entry) => {
      return ['fetch', 'xmlhttprequest', 'beacon'].indexOf(entry.initiatorType) === -1;
    });

    if (list.length) {
      list = JSON.parse(JSON.stringify(list));
      list.forEach((entry) => {
        entry.isCache = isCache(entry);
      });
    }
    return list;
  }
}

// 判断资料是否来自缓存
// transferSize为0，说明是从缓存中直接读取的（强制缓存）
// transferSize不为0，但是`encodedBodySize` 字段为 0，说明它走的是协商缓存（`encodedBodySize 表示请求响应数据 body 的大小`）
function isCache(entry) {
  return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0);
}

```

一个真实的页面中，资源加载大多数是逐步进行的，有些资源本身就做了延迟加载，有些是需要用户发生交互后才会去请求一些资源

如果我们只关注首页资源，可以在 `window.onload` 事件中去收集

如果要收集所有的资源，需要通过定时器反复地去收集，并且在一轮收集结束后，通过调用 [clearResourceTimings](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FPerformance%2FclearResourceTimings "https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/API/Performance/clearResourceTimings") 将 performance entries 里的信息清空，避免在下一轮收集时取到重复的资源

个性化指标
-----

### long task

执行时间超过50ms的任务，被称为 [long task](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FLong_Tasks_API "https://developer.mozilla.org/zh-CN/docs/Web/API/Long_Tasks_API") 长任务

获取页面的长任务列表：

```
const entryHandler = list => {
  for (const long of list.getEntries()) {
    // 获取长任务详情
    console.log(long);
  }
};

let observer = new PerformanceObserver(entryHandler);
observer.observe({ entryTypes: ["longtask"] });

```

### memory页面内存

`performance.memory` 可以显示此刻内存占用情况，它是一个动态值，其中：

* jsHeapSizeLimit 该属性代表的含义是：内存大小的限制。

* totalJSHeapSize 表示总内存的大小。

* usedJSHeapSize 表示可使用的内存的大小。

通常，usedJSHeapSize 不能大于 totalJSHeapSize，如果大于，有可能出现了内存泄漏

```
// load事件中获取此时页面的内存大小
window.addEventListener("load", () => {
  console.log("memory", performance.memory);
});

```

### 首屏加载时间

首屏加载时间和首页加载时间不一样，首屏指的是屏幕内的dom渲染完成的时间

比如首页很长需要好几屏展示，这种情况下屏幕以外的元素不考虑在内

**计算首屏加载时间流程**

1）利用`MutationObserver`监听`document`对象，每当dom变化时触发该事件

2）判断监听的dom是否在首屏内，如果在首屏内，将该dom放到指定的数组中，记录下当前dom变化的时间点

3）在MutationObserver的callback函数中，通过防抖函数，监听`document.readyState`状态的变化

4）当`document.readyState === 'complete'`，停止定时器和 取消对document的监听

5）遍历存放dom的数组，找出最后变化节点的时间，用该时间点减去`performance.timing.navigationStart` 得出首屏的加载时间

监控SDK
-----

监控SDK的作用：数据采集与上报

### 整体架构

![sdkProcess.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca8db3058b2d49608a447dbc4dccbc0c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

整体架构使用 **发布-订阅** 设计模式，这样设计的好处是便于后续扩展与维护，如果想添加新的`hook`或事件，在该回调中添加对应的函数即可

### SDK 入口

`src/index.js`

对外导出init事件，配置了vue、react项目的不同引入方式

vue项目在Vue.config.errorHandler中上报错误，react项目在ErrorBoundary中上报错误

![entry.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0124fc1be85f43f8b6172f6bdb950218~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

### 事件发布与订阅

通过添加监听事件来捕获错误，利用 AOP 切片编程，重写接口请求、路由监听等功能，从而获取对应的数据

`src/load.js`

![replace.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/498c219e4d01449cac3be2c9a3f9db24~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

### 用户行为收集

`core/breadcrumb.js`

创建用户行为类，stack用来存储用户行为，当长度超过限制时，最早的一条数据会被覆盖掉，在上报错误时，对应的用户行为会添加到该错误信息中

![bread.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e5fcce29ac54bb1a2cede02b395bfbb~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

### 数据上报方式

支持图片打点上报和fetch请求上报两种方式

图片打点上报的优势：  
1）支持跨域，一般而言，上报域名都不是当前域名，上报的接口请求会构成跨域  
2）体积小且不需要插入dom中  
3）不需要等待服务器返回数据

图片打点缺点是：url受浏览器长度限制

`core/transportData.js`

![send.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a5c83e0ee5f41428e5bca3de2f7dd2c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

### 数据上报时机

优先使用 requestIdleCallback，利用浏览器空闲时间上报，其次使用微任务上报

![queue.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/293f0ce61c994a16aaf2ed2341803878~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

监控SDK，参考了 [sentry](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fgetsentry%2Fsentry-javascript "https://github.com/getsentry/sentry-javascript")、 [monitor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FclouDr-f2e%2Fmonitor "https://github.com/clouDr-f2e/monitor")、 [mitojs](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmitojs%2Fmitojs "https://github.com/mitojs/mitojs")

项目后台demo
--------

主要用来演示错误还原功能，方式包括：定位源码、播放录屏、记录用户行为

[](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fxy-sea%2Fweb-see-demo%23%25E5%258A%259F%25E8%2583%25BD "https://github.com/xy-sea/web-see-demo#%E5%8A%9F%E8%83%BD")
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

![web-see.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/179f1b31741443eab79be2a59eb62f28~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

后台demo功能介绍：

1、使用 express 开启静态服务器，模拟线上环境，用于实现定位源码的功能

2、server.js 中实现了 reportData（错误上报）、getmap（获取 map 文件）、getRecordScreenId（获取录屏信息）、 getErrorList（获取错误列表）的接口

3、用户可点击 'js 报错'、'异步报错'、'promise 错误' 按钮，上报对应的代码错误，后台实现错误还原功能

4、点击 'xhr 请求报错'、'fetch 请求报错' 按钮，上报接口报错信息

5、点击 '加载资源报错' 按钮，上报对应的资源报错信息

通过这些异步的捕获，了解监控平台的整体流程

安装与使用
-----

npm官网搜索 [web-see](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fweb-see "https://www.npmjs.com/package/web-see")

![install.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2577f7151904489283ffa5fd6fb0213a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

仓库地址
----

监控SDK： [web-see](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fxy-sea%2Fweb-see "https://github.com/xy-sea/web-see")

监控后台： [web-see-demo](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fxy-sea%2Fweb-see-demo "https://github.com/xy-sea/web-see-demo")
