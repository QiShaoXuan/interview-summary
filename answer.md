## 1. 解释 `event loop`

- Javascript是单线程的，所有的同步任务都会在主线程中执行。
- 主线程之外，还有一个任务队列。每当一个异步任务有结果了，就往任务队列里塞一个事件。
- 当主线程中的任务，都执行完之后，系统会 “依次” 读取任务队列里的事件。与之相对应的异步任务进入主线程，开始执行。
- 异步任务之间，会存在差异，所以它们执行的优先级也会有区别。大致分为 微任务（micro task，如：Promise、MutaionObserver等）和宏任务（macro task，如：setTimeout、setInterval、I/O等）。同一次事件循环中，微任务永远在宏任务之前执行。
- 主线程会不断重复上面的步骤，直到执行完所有任务。

### 注意
1. `Promise` 内部的语句是立即执行的，以上所说的微任务 `Promise` 指的是 `Promise.then`
2. - macro-task(宏任务)：包括整体代码script，setTimeout，setInterval
   - micro-task(微任务)：Promise，process.nextTick(nodejs)

## 2. 写出输出结果

```js
function p(){
  return new Promise(resolve => {
    console.log('resolve')
    resolve()
  })
}

p().then(() => {
  console.log('hello')
})

console.log('hi')

// 'resolve' 'hi' 'hello'
```

## 3. 写出输出结果
```js
let a = 0
let b = async () => {
  a = a + await 10
  console.log('2', a)
}
b()
a++
console.log('1', a)

// -> '1' 1
// -> '2' 10
```

## 4. `setTimeinterval` 和 `setTimeout` 准确吗，原因？

由于 javascript 的 `event loop` 机制，`setTimeinterval` 和 `setTimeout` 需要在主线程任务和微任务结束后执行，这就意味着如果主线程的处理时间超出了设置的时间时这两种方法肯定是不准确的

## 5. setTimeout、setInterval、requestAnimationFrame 各有什么特点？

`setTimeout`，`setInterval`在 `event loop` 的宏任务中，当主线程结束时才会按照任务队列加载

`requestAnimationFrame` 在主线程中执行，所以更加准确，以1秒钟60次（大约每16.7毫秒一次）的频率执行

## 6. setTimeout、setInterval、requestAnimationFrame 各有什么特点？

```js
function setInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)
```

## 7. 函数节流与防抖
[函数 & 防抖](https://qishaoxuan.github.io/blog/js/throttleDebounce.html)

## 8. 解释原型链

在 javascript 中，一切皆对象，而每个对象都会有一个 `__proto__` 属性， `__proto__` 指向实例化该对象的构造函数的 `prototype`，而该构造函数的 `__proto__` 又指向它的构造函数的 `__proto__` 如此往复向下，直到底层为 `null` 时停止，当调用一个对象的方法时，javascript 会顺着这条线寻找该方法。

## 9. 继承实现的方式

`prototype`,`class`

## 10. 为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？

- 解决命名冲突
- 提供复用性
- 提高代码可维护性

[特点](https://qishaoxuan.github.io/blog/js/module.html)

## 11. == 和 === 区别

使用 `==` 时，如果两边值的类型不同会触发类型转换，所以会出现 `Boolean('1' == 1) === true` ，使用 ```===``` 时则不会

## 12. 什么是闭包，作用？

### what
函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包

## 13. 写出输出结果

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
// 6个6
```

## 14. 浅拷贝？深拷贝？分别如何实现？

[深拷贝 & 浅拷贝](https://qishaoxuan.github.io/blog/js/copy.html)

## 15. javascript 中有哪些数据类型
- 原始数据类型: number, boolean, string, null, undefinded, symbol
- 引用数据类型: object

## 16. 箭头函数中的 this 指向
## 17. call，apply，bind 用法（如何改变 this 的指向）
## 18. 实现 call，apply，bind
```js
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result

  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const _this = this
  const args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```

## 20. 使用 new 关键字后发生了什么

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

### 实现
```js
function create() {
  let obj = {}
  let Con = [].shift.call(arguments)
  obj.__proto__ = Con.prototype
  let result = Con.apply(obj, arguments)
  return result instanceof Object ? result : obj
}
```

## 21. intanceof 原理？

`instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。

```js
function myInstanceof(left, right) {
  let prototype = right.prototype
  left = left.__proto__
  while (true) {
    if (left === null || left === undefined)
      return false
    if (prototype === left)
      return true
    left = left.__proto__
  }
}
```

## 22. 垃圾回收机制？

## 23. 解释冒泡，捕获事件

冒泡：由小及大，从子元素事件发出，向父元素，父元素的父元素...直至 `html` 为止

捕获：由大及小，从父元素发出，向其下的子元素...直至最小的元素为止

使用 `element.addEventListener(type,listener,options)` ,在 `options.capture` 设置使用冒泡还是捕获，默认冒泡

## 24. 解释事件代理

一般使用在有大量或者是动态渲染的html元素需要绑定事件时，以达到提高性能或动态绑定的目的。

将事件绑定在 html 元素的父元素上，通过事件流的冒泡属性，在父元素中获取到点击的子元素，加以判断后实行相应的事件。

## 25. 什么是跨域？为什么浏览器要使用同源策略？你有几种方式可以解决跨域问题？了解预检请求嘛？

### what

当协议、域名或者端口有一个不同即是跨域，浏览器会拦截 ajax 请求，目的是为了防止 CSRF 攻击。简单点说，CSRF 攻击是利用用户的登录态发起恶意请求。

浏览器拦截的是读取内容的请求，所以通过表单等方式的请求是不会被拦截的

### 解决
1. JSONP

- JSONP 的原理很简单，就是利用 `<script>` 标签没有跨域限制的漏洞。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时。

```js
function jsonp(url, jsonpCallback, success) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function(data) {
    success && success(data)
  }
  document.body.appendChild(script)
}
jsonp('http://xxx', 'callback', function(value) {
  console.log(value)
})
```

2. CORS

- 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。

3. document.domain

- 该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。

- 只需要给页面添加 document.domain = 'test.com' 表示二级域名都相同就可以实现跨域

4. MessageChannel

- [MessageChannel](https://qishaoxuan.github.io/blog/js/messageChannel.html)

- 主要用于页面和其下的 iframe 之间的通讯

## 26. 什么情况会造成阻塞渲染
1. 在 HTML 和 CSS 生成渲染树的过程中肯定会造成阻塞渲染
  - 解决方案：文件大小，并且扁平层级，优化选择器

2. 在浏览器解析到 script 标签时，会加载并执行 script 的内容，直到结束后才会继续渲染，也会造成渲染阻塞
  - 解决方案：将 script 放在 body 底部，或者设置 `async` 属性为 `defer`

## 27. 重绘（Repaint）和回流（Reflow）

重绘仅改变节点的外观，不影响布局，如改变节点的 color 属性

回流指节点的大小或页面的布局发生改变

回流必定会发生重绘，重绘不一定会引发回流

### 如何减少

1. 使用 transform 替代 top
2. 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流（改变了布局）
3. 不要把节点的属性值放在一个循环里当成循环里的变量
4. 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局

## 28. 从用户输入URL到浏览器呈现页面经过了哪些过程

[参考](https://juejin.im/post/5bbaa549e51d450e827b6b13)

### DNS 解析
1. 浏览器根据地址去本身缓存中查找dns解析记录，如果有，则直接返回IP地址，否则浏览器会查找操作系统中（hosts文件）是否有该域名的dns解析记录，如果有则返回。
2. 如果浏览器缓存和操作系统hosts中均无该域名的dns解析记录，或者已经过期，此时就会向域名服务器发起请求来解析这个域名。
3. 请求会先到LDNS（本地域名服务器），让它来尝试解析这个域名，如果LDNS也解析不了，则直接到根域名解析器请求解析
4. 根域名服务器给LDNS返回一个所查询余的主域名服务器（gTLDServer）地址。
5. 此时LDNS再向上一步返回的gTLD服务器发起解析请求。
6. gTLD服务器接收到解析请求后查找并返回此域名对应的Name Server域名服务器的地址，这个Name Server通常就是你注册的域名服务器（比如阿里dns、腾讯dns等）
7. Name Server域名服务器会查询存储的域名和IP的映射关系表，正常情况下都根据域名得到目标IP记录，连同一个TTL值返回给DNS Server域名服务器
8. 返回该域名对应的IP和TTL值，Local DNS Server会缓存这个域名和IP的对应关系，缓存的时间有TTL值控制。
9. 把解析的结果返回给用户，用户根据TTL值缓存在本地系统缓存中，域名解析过程结束。

### HTTP请求发起和响应

1. 用户输入URL，浏览器获取到URL
2. 浏览器(应用层)进行DNS解析（如果输入的是IP地址，此步骤省略）
3. 根据解析出的IP地址+端口，浏览器（应用层）发起HTTP请求，请求中携带（请求头header（也可细分为请求行和请求头）、请求体body），

> header包含：
>
> > 请求的方法（get、post、put..）
> > 协议（http、https、ftp、sftp…）
> > 目标url（具体的请求路径已经文件名）
> > 一些必要信息（缓存、cookie之类）
> >
> > body包含：
> >
> > 请求的内容

4. 请求到达传输层，tcp协议为传输报文提供可靠的字节流传输服务，它通过三次握手等手段来保证传输过程中的安全可靠。通过对大块数据的分割成一个个报文段的方式提供给大量数据的便携传输。
5. 到网络层， 网络层通过ARP寻址得到接收方的Mac地址，IP协议把在传输层被分割成一个个数据包传送接收方。
6. 数据到达数据链路层，请求阶段完成
7. 接收方在数据链路层收到数据包之后，层层传递到应用层，接收方应用程序就获得到请求报文。
8. 接收方收到发送方的HTTP请求之后，进行请求文件资源（如HTML页面）的寻找并响应报文
9. 发送方收到响应报文后，如果报文中的状态码表示请求成功，则接受返回的资源（如HTML文件），进行页面渲染。

### 网页渲染

1. 浏览器通过HTMLParser根据深度遍历的原则把HTML解析成DOM Tree。
2. 将CSS解析成CSS Rule Tree（CSSOM Tree）。
3. 根据DOM树和CSSOM树来构造render Tree。
4. layout：根据得到的render tree来计算所有节点在屏幕的位置。
5. paint：遍历render树，并调用硬件图形API来绘制每个节点。
6. 当遇到 `script` 标签时会等待其中 `js` 代码执行完成后继续执行上述步骤(会造成阻塞)

## 29. 前端性能优化

### CSS
1. 优化选择器路径：健全的css选择器固然是能让开发看起来更清晰，然后对于css的解析来说却是个很大的性能问题，因此相比于 .a .b .c{} ，更倾向于大家写.c{}。
2. 压缩文件：尽可能的压缩你的css文件大小，减少资源下载的负担。
3. 选择器合并：把有共同的属性内容的一系列选择器组合到一起，能压缩空间和资源开销
4. 精准样式：尽可能减少不必要的属性设置，比如你只要设置{padding-left:10px}的值,那就避免{padding:0 0 0 10px}这样的写法
5. 雪碧图：在合理的地方把一些小的图标合并到一张图中，这样所有的图片只需要一次请求，然后通过定位的方式获取相应的图标，这样能避免一个图标一次请求的资源浪费。
6. 避免通配符：.a .b *{} 像这样的选择器，根据从右到左的解析顺序在解析过程中遇到通配符（*）回去遍历整个dom的，这样性能问题就大大的了。
7. 少用Float:Float在渲染时计算量比较大，尽量减少使用。
8. 0值去单位：对于为0的值，尽量不要加单位，增加兼容性

### HTML
1. 避免再HTML中直接写css代码。
2. 使用Viewport加速页面的渲染。
3. 使用语义化标签，减少css的代码，增加可读性和SEO。
4. 减少标签的使用，dom解析是一个大量遍历的过程，减少无必要的标签，能降低遍历的次数。
5. 避免src、href等的值为空。
6. 减少dns查询的次数。

### JS
1. 尽可能把script标签放到body之后，避免页面需要等待js执行完成之后dom才能继续执行，最大程度保证页面尽快的展示出来。
2. 尽可能合并script代码，
3. css能干的事情，尽量不要用JavaScript来干。毕竟JavaScript的解析执行过于直接和粗暴，而css效率更高。
4. 尽可能压缩的js文件，减少资源下载的负担
5. 尽可能避免在js中逐条操作dom样式，尽可能预定义好css样式，然后通过改变样式名来修改dom样式，这样集中式的操作能减少reflow或repaint的次数。
6. 尽可能少的在js中创建dom，而是预先埋到HTML中用display:none来隐藏，在js中按需调用，减少js对dom的暴力操作。

## 30. 强制缓存，跳过垃圾回收机制

## 31. Vue 实例中的 data 为什么使用函数

## 32. 实现 v-modal

## 33. 前端性能优化

## 34. 公司技术（组件）沉淀举例

## 35. get 和 post 区别（从报文角度）

## 36.  ES5 写 原型拓展（实现 extend）

## 36. 虚拟 dom 相比 原生 dom 好处

