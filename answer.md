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
## 24. 解释事件代理
## 25. 什么是跨域？为什么浏览器要使用同源策略？你有几种方式可以解决跨域问题？了解预检请求嘛？

### what 

当协议、域名或者端口有一个不同即是跨域，浏览器会拦截 ajax 请求，目的是为了防止 CSRF 攻击。简单点说，CSRF 攻击是利用用户的登录态发起恶意请求。

浏览器拦截的是读取内容的请求，所以通过表单等方式的请求是不会被拦截的

### 解决
1. JSONP

- JSONP 的原理很简单，就是利用 <script> 标签没有跨域限制的漏洞。通过 <script> 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时。

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


