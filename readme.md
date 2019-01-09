## 1. 解释 `event loop`
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

// 输出为 'resolve' 'hi' 'hello'
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
```
## 4. setTimeinterval 和 setTimeout 准确吗，原因？
## 5. setTimeout、setInterval、requestAnimationFrame 各有什么特点？
## 6. 用 requestAnimationFram 实现 setInterval
## 7. 函数节流与防抖
## 8. 解释原型链
## 9. 继承实现的方式
## 10. 为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？
## 11. == 和 === 区别
## 11. == 和 === 区别
## 12. 什么是闭包，作用？
## 13. 写出输出结果
```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```
## 14. 浅拷贝？深拷贝？分别如何实现？
## 15. javascript 中有哪些数据类型
## 16. 箭头函数中的 this 指向
## 17. call，apply 用法（如何改变 this 的指向）
## 18. 实现 call，apply，bind 
## 20. 使用 new 关键字后发生了什么，通过 new 的方式创建对象和通过字面量创建有什么区别
## 21. intanceof 原理？
## 22. 垃圾回收机制？
## 23. 解释冒泡，捕获事件
## 24. 解释事件代理
## 25. 什么是跨域？为什么浏览器要使用同源策略？你有几种方式可以解决跨域问题？了解预检请求嘛？
## 26. 什么情况会造成阻塞渲染
## 27. 重绘（Repaint）和回流（Reflow）


### 未写答案记录
16，17，22，23，24
