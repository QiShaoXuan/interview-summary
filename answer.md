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

## 8. 解释原型链

在 javascript 中，一切皆对象，而每个对象都会有一个 `__proto__` 属性， `__proto__` 指向实例化该对象的构造函数，而该构造函数的 `__proto__` 又指向它的构造函数的 `__proto__` 如此向下，直到底层为 `null` 时停止，当调用一个对象的方法时，javascript 会顺着这条线寻找该方法。

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
