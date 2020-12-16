import { digits } from "./digits.js";
(() => {
  var window_width = document.getElementsByClassName("header")[0].offsetWidth;
  var window_height = document.getElementsByClassName("header")[0].offsetHeight;
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var radius = Math.round((window_width * 4) / 5 / 108) - 1;
  var margin_top = Math.round(window_height / 5);
  var margin_left = Math.round(window_width / 10);
  const endTime = new Date(); //月份0 - 11
  endTime.setTime(endTime.getTime() + 86400 * 1000);
  var curShowTimeSeconds = 0;

  //小球
  var balls = [];
  const colors = ["#33b5e5", "#0099cc", "#a6c", "#93c", "#9c0", "#690", "#fb3", "#f80", "#f44", "#c00"];

  canvas.width = window_width;
  canvas.height = window_height;
  curShowTimeSeconds = getTimeSec();
  //开始绘制,设置定时器
  setInterval(function () {
    render(context);
    update();
  }, 50);

  //把获得的毫秒转换为秒,结束时间与现在时间的差值
  function getTimeSec() {
    var ret = endTime.getTime() - new Date().getTime();
    ret = Math.round(ret / 1000);
    return ret > 0 ? ret : 0;
  }

  function update() {
    var nextShowTimeSeconds = getTimeSec();
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    if (nextSeconds != curSeconds) {
      //对小时的个位十位进行判断是否更改
      if (parseInt(curHours / 10 != parseInt(nextHours / 10))) {
        addBalls(margin_left + 0, margin_top, parseInt(curHours / 10));
      }
      if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
        addBalls(margin_left + 15 * (radius + 1), margin_top, parseInt(curHours % 10));
      }
      //对分钟判断
      if (parseInt(curMinutes / 10 != parseInt(nextMinutes / 10))) {
        addBalls(margin_left + 39 * (radius + 1), margin_top, parseInt(curMinutes / 10));
      }
      if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
        addBalls(margin_left + 54 * (radius + 1), margin_top, parseInt(curMinutes % 10));
      }
      //对秒进行判断
      if (parseInt(curSeconds / 10 != parseInt(nextSeconds / 10))) {
        addBalls(margin_left + 78 * (radius + 1), margin_top, parseInt(curSeconds / 10));
      }
      if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
        addBalls(margin_left + 93 * (radius + 1), margin_top, parseInt(curSeconds % 10));
      }

      curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
  }
  //小球的运动
  function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
      let b = balls[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.g;
      if (b.y >= window_height - radius) {
        b.y = window_height - radius;
        b.vy = -b.vy * 0.75;
      }
    }
    //维护小球数组
    var cnt = 0;
    for (var j = 0; j < balls.length; j++) {
      if (balls[j].x + radius > 0 && balls[j].x - radius < window_width) {
        balls[cnt++] = balls[j];
      }
    }
    while (balls.length > Math.min(300, cnt)) {
      balls.pop();
    }
  }
  //生成小球
  function addBalls(x, y, num) {
    for (let i = 0; i < digits[num][i].length; i++) {
      for (let j = 0; j < digits[num][j].length; j++) {
        if (digits[num][i][j] == 1) {
          var aBall = {
            x: x + j * 2 * (radius + 1) + (radius + 1),
            y: y + i * 2 * (radius + 1) + (radius + 1),
            g: 1.5 + Math.random(),
            vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
            vy: -5,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
          balls.push(aBall);
        }
      }
    }
  }
  function render(cxt) {
    //clearRect 对一个矩形空间内的图像进行刷新操作
    cxt.clearRect(0, 0, window_width, window_height);

    //把秒转换为时, 分, 秒
    const date = new Date();
    var hours = parseInt(date.getHours());
    var minutes = parseInt(date.getMinutes());
    var seconds = date.getSeconds();

    renderDigit(margin_left, margin_top, parseInt(hours / 10), cxt);
    renderDigit(margin_left + 15 * (radius + 1), margin_top, parseInt(hours % 10), cxt);
    renderDigit(margin_left + 30 * (radius + 1), margin_top, 10, cxt);
    renderDigit(margin_left + 39 * (radius + 1), margin_top, parseInt(minutes / 10), cxt);
    renderDigit(margin_left + 54 * (radius + 1), margin_top, parseInt(minutes % 10), cxt);
    renderDigit(margin_left + 69 * (radius + 1), margin_top, 10, cxt);
    renderDigit(margin_left + 78 * (radius + 1), margin_top, parseInt(seconds / 10), cxt);
    renderDigit(margin_left + 93 * (radius + 1), margin_top, parseInt(seconds % 10), cxt);

    //渲染小球
    for (var i = 0; i < balls.length; i++) {
      cxt.fillStyle = balls[i].color;
      cxt.beginPath();
      cxt.arc(balls[i].x, balls[i].y, radius, 0, 2 * Math.PI, true);
      cxt.closePath();

      cxt.fill();
    }
  }

  //遍历数组绘制需要的数字
  function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = "rgb(0, 102, 153)";
    for (let i = 0; i < digits[num].length; i++) {
      for (let j = 0; j < digits[num][i].length; j++) {
        if (digits[num][i][j] == 1) {
          cxt.beginPath();
          cxt.arc(x + j * 2 * (radius + 1), y + i * 2 * (radius + 1) + (radius + 1), radius, 0, 2 * Math.PI);
          cxt.closePath();

          cxt.fill();
        }
      }
    }
  }
})();
