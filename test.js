function jsonp(url, jsonpCallback, success) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function (data) {
    success && success(data)
  }
  document.body.appendChild(script)
}

jsonp('http://xxx', 'callback', function (value) {
  console.log(value)
})


function t(fn, timehold) {
  let startTime = new Date().getTime()
  const context = this

  return function () {
    const currentTime = new Date().getTime()
    if(currentTime - startTime >= timehold){
      fn.apply(context,[...arguments])

      startTime = currentTime
    }
  }
}
