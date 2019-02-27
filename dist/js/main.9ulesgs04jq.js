"use strict";

// 对象合并方法
function assign(a, b) {
  var newObj = {};

  for (var key in a) {
    newObj[key] = a[key];
  }

  for (var key in b) {
    newObj[key] = b[key];
  }

  return newObj;
} // 运行页面所属的方法


function runPageFunction(pageName, entryDom) {
  // ozzx-name处理
  window.ozzx.domList = {};
  pgNameHandler(entryDom); // 判断页面是否有自己的方法

  var newPageFunction = window.ozzx.script[pageName];
  if (!newPageFunction) return; // console.log(newPageFunction)
  // 如果有created方法则执行

  if (newPageFunction.created) {
    // 注入运行环境
    newPageFunction.created.apply(assign(newPageFunction, {
      $el: entryDom,
      data: newPageFunction.data,
      activePage: window.ozzx.activePage,
      domList: window.ozzx.domList
    }));
  } // 判断页面是否有下属模板,如果有运行所有模板的初始化方法


  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key];

    if (templateScript.created) {
      // 获取到当前配置页的DOM
      // 待修复,临时获取方式,这种方式获取到的dom不准确
      var domList = entryDom.getElementsByClassName('ox-' + key);

      if (domList.length !== 1) {
        console.error('我就说会有问题吧!');
        console.log(domList);
      } // 为模板注入运行环境


      templateScript.created.apply(assign(newPageFunction.template[key], {
        $el: domList[0].children[0],
        data: templateScript.data,
        activePage: window.ozzx.activePage,
        domList: window.ozzx.domList
      }));
    }
  }
} // ozzx-name处理


function pgNameHandler(dom) {
  // 遍历每一个DOM节点
  for (var i = 0; i < dom.children.length; i++) {
    var tempDom = dom.children[i]; // 判断是否存在@name属性

    var pgName = tempDom.attributes['@name'];

    if (pgName) {
      // console.log(pgName.textContent)
      // 隐藏元素
      tempDom.hide = function () {
        this.style.display = 'none';
      };

      window.ozzx.domList[pgName.textContent] = tempDom;
    } // 判断是否有点击事件


    var clickFunc = tempDom.attributes['@click'];

    if (clickFunc) {
      tempDom.onclick = function (event) {
        var clickFor = this.attributes['@click'].textContent; // 判断页面是否有自己的方法

        var newPageFunction = window.ozzx.script[window.ozzx.activePage]; // console.log(this.attributes)
        // 判断是否为模板

        var templateName = this.attributes['template']; // console.log(templateName)

        if (templateName) {
          newPageFunction = newPageFunction.template[templateName.textContent];
        } // console.log(newPageFunction)
        // 取出参数


        var parameterArr = [];
        var parameterList = clickFor.match(/[^\(\)]+(?=\))/g);

        if (parameterList && parameterList.length > 0) {
          // 参数列表
          parameterArr = parameterList[0].split(','); // 进一步处理参数

          for (var i = 0; i < parameterArr.length; i++) {
            var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, ""); // console.log(parameterValue)
            // 判断参数是否为一个字符串

            if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
            }

            if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
              parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
            } // console.log(parameterArr[i])

          }

          clickFor = clickFor.replace('(' + parameterList + ')', '');
        } // console.log(newPageFunction)
        // 如果有方法,则运行它


        if (newPageFunction[clickFor]) {
          // 绑定window.ozzx对象
          // console.log(tempDom)
          // 待测试不知道这样合并会不会对其它地方造成影响
          newPageFunction.$el = this;
          newPageFunction.$event = event;
          newPageFunction.domList = window.ozzx.domList;
          newPageFunction[clickFor].apply(newPageFunction, parameterArr);
        }
      };
    } // 递归处理所有子Dom结点


    if (tempDom.children.length > 0) {
      pgNameHandler(tempDom);
    }
  }
} // 获取URL #后面内容


function getarg(url) {
  var arg = url.split("#");
  return arg[1];
} // 页面资源加载完毕事件


window.onload = function () {
  // 取出URL地址判断当前所在页面
  var pageArg = getarg(window.location.href); // 从配置项中取出程序入口

  var page = pageArg ? pageArg.split('&')[0] : globalConfig.entry;

  if (page) {
    var entryDom = document.getElementById('ox-' + page);

    if (entryDom) {
      // 显示主页面
      entryDom.style.display = 'block';
      window.ozzx.activePage = page;
      runPageFunction(page, entryDom);
    } else {
      console.error('入口文件设置错误!');
    }
  } else {
    console.error('未设置程序入口!');
  }
}; // url发生改变事件


window.onhashchange = function (e) {
  var oldUrlParam = getarg(e.oldURL);
  var newUrlParam = getarg(e.newURL); // 如果没有跳转到任何页面则跳转到主页

  if (newUrlParam === undefined) {
    newUrlParam = globalConfig.entry;
  } // 如果没有发生页面跳转则不需要进行操作
  // 切换页面特效


  switchPage(oldUrlParam, newUrlParam);
}; // 页面切换效果
// 获取URL参数


function getQueryString(newUrlParam, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = newUrlParam.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
} // 无特效翻页


function dispalyEffect(oldDom, newDom) {
  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none';
  } // 查找页面跳转后的page


  newDom.style.display = 'block';
} // 切换页面动画


function animation(oldDom, newDom, animationIn, animationOut) {
  oldDom.addEventListener("animationend", oldDomFun);
  newDom.addEventListener("animationend", newDomFun);
  oldDom.style.position = 'absolute';
  newDom.style.display = 'block';
  newDom.style.position = 'absolute'; // document.body.style.overflow = 'hidden'

  animationIn.split(',').forEach(function (value) {
    console.log('add:' + value);
    oldDom.classList.add('ox-page-' + value);
  });
  animationOut.split(',').forEach(function (value) {
    console.log('add:' + value);
    newDom.classList.add('ox-page-' + value);
  }); // 旧DOM执行函数

  function oldDomFun() {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none'; // console.log(oldDom)

    oldDom.style.position = ''; // 清除临时设置的class

    animationIn.split(',').forEach(function (value) {
      console.log('del:' + value);
      oldDom.classList.remove('ox-page-' + value);
    }); // 移除监听

    oldDom.removeEventListener('animationend', oldDomFun, false);
  } // 新DOM执行函数


  function newDomFun() {
    // 清除临时设置的style
    newDom.style.position = '';
    animationOut.split(',').forEach(function (value) {
      console.log('del:' + value);
      newDom.classList.remove('ox-page-' + value);
    }); // 移除监听

    newDom.removeEventListener('animationend', newDomFun, false);
  }
} // 切换页面前的准备工作


function switchPage(oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam;
  var newPage = newUrlParam;
  var newPagParamList = newPage.split('&');
  if (newPage) newPage = newPagParamList[0]; // 查找页面跳转前的page页(dom节点)
  // console.log(oldUrlParam)
  // 如果源地址获取不到 那么一般是因为源页面为首页

  if (oldPage === undefined) {
    oldPage = globalConfig.entry;
  } else {
    oldPage = oldPage.split('&')[0];
  }

  var oldDom = document.getElementById('ox-' + oldPage);
  var newDom = document.getElementById('ox-' + newPage);

  if (!newDom) {
    console.error('页面不存在!');
    return;
  } // 判断是否有动画效果


  if (newPagParamList.length > 1) {
    var animationIn = getQueryString(newUrlParam, 'in');
    var animationOut = getQueryString(newUrlParam, 'out'); // 如果没用动画参数则使用默认效果

    if (!animationIn || !animationOut) {
      dispalyEffect(oldDom, newDom);
      return;
    }

    animation(oldDom, newDom, animationIn, animationOut);
  } else {
    dispalyEffect(oldDom, newDom);
  }

  window.ozzx.activePage = newPage;
  runPageFunction(newPage, newDom);
}

window.ozzx = {
  script: {},
  tool: {}
};
var globalConfig = {
  "root": "/src",
  "entry": "card",
  "title": "学习有声",
  "outFolder": "./dist",
  "watcher": {
    "enable": true,
    "folder": "./src",
    "ignored": "./dist/*",
    "depth": 99
  },
  "outPut": {
    "minifyCss": false,
    "minifyJs": false,
    "choiceAnimation": true,
    "globalStyle": "./src/main.css",
    "globalScript": "./src/main.js",
    "outFileAddVersion": true
  },
  "serverPort": 8000,
  "server": true,
  "autoReload": false,
  "headList": [{
    "http-equiv": "content-type",
    "content": "text/html; charset=UTF-8"
  }, {
    "name": "viewport",
    "content": "height=device-height,initial-scale=1,user-scalable=no,maximum-scale=1,,user-scalable=no"
  }],
  "scriptList": [{
    "name": "jquery-3.3.1",
    "src": "https://code.jquery.com/jquery-3.3.1.min.js"
  }, {
    "name": "modernizr",
    "src": "./src/modernizr.custom.js"
  }, {
    "name": "draggabilly",
    "src": "./src/draggabilly.pkgd.min.js"
  }, {
    "babel": true,
    "name": "elastiStack",
    "src": "./src/elastiStack.js"
  }, {
    "name": "html2canvas",
    "src": "./src/html2canvas.min.js"
  }],
  "styleList": [{
    "name": "component",
    "src": "./src/component.css"
  }, {
    "name": "normalize",
    "src": "./src/normalize.css"
  }],
  "pageList": [{
    "main": true,
    "isPage": true,
    "name": "card",
    "src": "./src/page/card.page",
    "temple": "<temple name=\"card\" src=\"./src/page/card.page\" isPage=\"true\"></temple>"
  }, {
    "isPage": true,
    "name": "share",
    "src": "./src/page/share.page",
    "temple": "<temple name=\"share\" src=\"./src/page/share.page\" isPage=\"true\"></temple>"
  }]
};
window.ozzx.script = {
  "card": {
    "data": {
      "audio": null,
      "control": null,
      "ElastiStack": null,
      "activeDateIndex": 0,
      "readList": [],
      "isPC": true
    },
    "created": function created() {
      var _this = this;

      // 解决返回上一页不会退回到学习页面
      this.closeHistory(); // 读取出打卡记录

      var readList = localStorage.getItem("readList");

      if (readList) {
        this.data.readList = JSON.parse(readList);
      }

      document.addEventListener('touchmove', function (e) {
        e.preventDefault();
      }, false); // 检查是电脑还是移动端

      this.checkIsPC();
      this.changeDeteList(0); // 高亮第一个分页

      this.changeCard(0); // 延时设置打卡页面元素dom

      setTimeout(function () {
        if (_this.data.isPC) {
          _this.domList.cardBox.style.width = 41 * (_this.domList.cardBox.childNodes.length - 1) + 'px';
        } else {
          _this.domList.cardBox.style.height = 41 * (_this.domList.cardBox.childNodes.length - 1) + 'px';
        }
      }, 1000); // 刷新dom节点

      pgNameHandler(document.getElementById('dataBox'));
    },
    "changeDeteList": function changeDeteList(dataIndex) {
      // 计算并设置dataBox宽度 or 高度
      if (this.data.isPC) {
        this.domList.dataBox.style.width = dateList[dataIndex].length * 76 - 20 + 'px';
      } else {
        this.domList.dataBox.style.height = dateList[dataIndex].length * 76 - 20 + 'px';
      } // 生成dom


      var dataBoxTemple = '';
      var historyTemple = '';

      for (var ind in dateList[dataIndex]) {
        var index = parseInt(ind) + 1;

        if (ind == 0) {
          // console.log('ssss')
          dataBoxTemple += "<div class=\"date-item active\" @click=\"changeCard(".concat(ind, ")\">").concat(index, "</div>");
        } else {
          dataBoxTemple += "<div class=\"middle-line\"></div><div class=\"date-item\" @click=\"changeCard(".concat(ind, ")\">").concat(index, "</div>");
        } // historyTemple += `<div class="item"><div class="num">${ind}</div><div class="text">${dateName[ind].name}</div><div class="icon-box"></div></div>`

      }

      document.getElementById('dataBox').innerHTML = dataBoxTemple; // this.domList.cardBox.innerHTML = historyTemple + '<div class="clear"></div>'
    },
    "checkIsPC": function checkIsPC() {
      // 判断是手机页面还是电脑页面
      this.data.screenInfo = ozzx.tool.getScreenInfo();
      console.log(this.data.screenInfo); // 先计算宽高比是否大于1

      if (this.data.screenInfo.ratio > 1) {
        document.body.classList.add('pc');
        this.data.isPC = true;
      } else {
        document.body.classList.add('h5');
        this.data.isPC = false;
      }
    },
    "changeCard": function changeCard(index) {
      var domTemple = '';

      for (var key in dateList) {
        var element = dateList[key][index];
        var nextIndex = parseInt(index) + 1;
        console.log(key, index); // 添加期目录
        // 如果没有title，则title为空

        if (!element.title) element.title = ""; // 判断是否有image

        if (element.img) {
          domTemple += "<li id=\"slideItem".concat(nextIndex, "\"><div class=\"handle\"></div><div class=\"content-left\"><div class=\"num\">").concat(nextIndex, "</div></div><div class=\"title\">").concat(element.title, "</div><div class=\"image-box\"><img src=\"").concat(element.img, "\"/></div><div class=\"content mini\">").concat(element.content, "</div>");
        } else {
          domTemple += "<li id=\"slideItem".concat(nextIndex, "\"><div class=\"handle\"></div><div class=\"content-left\"><div class=\"num\">").concat(nextIndex, "</div></div><div class=\"title\">").concat(element.title, "</div><div class=\"content\">").concat(element.content, "</div>");
        }

        if (element.music) {
          domTemple += "<audio src=\"".concat(element.music, "\"></audio><div class=\"audio-box\"  @click=\"changeAudioprogress\"><div class=\"audio-image\"></div><div class=\"audio-bar\"><div class=\"spot\"></div><div class=\"progress\"></div></div></div>");
        }

        domTemple += "</li>";
      }

      document.getElementById('elasticstack').style.display = 'none';
      document.getElementById('elasticstack').innerHTML = domTemple;
      this.calculation();
      setTimeout(function () {
        // 刷新dom节点
        pgNameHandler(document.getElementById('elasticstack'));
      }, 100); // 高亮对应的页号

      this.changeDete(parseInt(index * 2));
    },
    "changeDete": function changeDete(dete) {
      // 取消掉所有子页码的活跃状态
      for (var ind = 0; ind < document.getElementById('dataBox').children.length; ind++) {
        var dom = document.getElementById('dataBox').children[ind];
        dom.classList.remove('active');
      }

      document.getElementById('dataBox').children[dete].classList.add('active'); // 判断是否为PC

      if (this.data.isPC) {
        // 允许下一页,禁止上一页
        this.domList.last.style.display = 'none';
        this.domList.next.style.display = 'block';
      }
    },
    "saveReadInfo": function saveReadInfo() {
      this.data.readList[this.data.activeDateIndex] = true;
      localStorage;

      if (window.localStorage) {
        localStorage.setItem('readList', JSON.stringify(this.data.readList));
      } else {
        console.error("不支持localStorage!");
      }

      console.log(localStorage.getItem("readList"));
    },
    "calculation": function calculation() {
      var _this2 = this;

      setTimeout(function () {
        // console.log(this.data.screenInfo.clientHeight)
        _this2.data.ElastiStack = new ElastiStack(document.getElementById('elasticstack'), {
          loop: false,
          handle: ".handle",
          ratioX: parseInt(_this2.data.screenInfo.clientWidth * 0.02),
          ratioZ: parseInt(_this2.data.screenInfo.clientWidth * -0.02),
          distDragBack: 100,
          distDragMax: 200,
          // pc端禁止拖拽
          enable: !_this2.data.isPC,
          onUpdateStack: function onUpdateStack(activeIndex) {
            // ------------------------------
            _this2.changeDeteList(activeIndex); // 设置活跃日期


            _this2.data.activeDateIndex = activeIndex; // ------------------------------
            // 如果阅读了就标记这一页为已阅读
            // this.saveReadInfo()
            // console.log(activeIndex)
            // 只有PC才有左右箭头

            if (_this2.data.isPC) {
              // 第一页的时候隐藏左箭头
              if (activeIndex === 0) {
                // console.log(this.data.ElastiStack.itemsCount - 1)
                _this2.domList.last.style.display = 'none';
              } else {
                _this2.domList.last.style.display = 'block';
              } // 最后一页的时候没有向右箭头


              if (activeIndex === dateList.length - 1) {
                _this2.domList.next.style.display = 'none';
              } else {
                _this2.domList.next.style.display = 'block';
              }
            } // 有记者按的关系需要加1


            activeIndex++; // 停止当前播放的音乐

            if (_this2.data.audio !== null) {
              _this2.data.audio.pause();

              _this2.data.audio.src = '';
            } // 停止上一个动画


            if (_this2.data.control !== null) {
              _this2.data.control.next = false;
            } // 查找文字区域


            var textBox = $("#slideItem".concat(activeIndex, " .content")); // 查找音频区域

            var audio = $("#slideItem".concat(activeIndex, " audio")); // console.log(textBox)
            // console.log(audio, activeIndex)

            if (audio.length > 0) {
              // 播放音乐
              _this2.data.audio = audio[0];
              var musicSrc = dateList[activeIndex][activeIndex - 1].music;

              if (musicSrc) {
                _this2.data.audio.src = musicSrc;

                _this2.data.audio.play();
              } // 播放拖动块


              var spot = $("#slideItem".concat(activeIndex, " .spot"));
              var progress = $("#slideItem".concat(activeIndex, " .progress"));

              _this2.data.audio.addEventListener("timeupdate", function (e) {
                var value = (e.target.currentTime / e.target.duration).toFixed(4) * 100; // console.log((e.target.currentTime / e.target.duration).toFixed(4) * 100 + '%')

                spot[0].style.left = value + '%';
                progress[0].style.width = value + '%';
              });

              if (textBox.length > 0) {
                // 滚动条长度
                var scrollHeight = textBox[0].scrollHeight; // 超出长度

                var overflow = scrollHeight - textBox[0].clientHeight;

                _this2.data.audio.ontimeupdate = function (e) {
                  textBox.scrollTop(_this2.data.audio.currentTime / _this2.data.audio.duration * overflow);
                };
              }
            }

            setTimeout(function () {
              // 刷新dom节点
              pgNameHandler(document.getElementById('dataBox'));
            }, 100);
          }
        });
        document.getElementById('elasticstack').style.display = 'block';
      }, 0);
    },
    "activeCard": function activeCard(index) {
      this.changeDete(index * 2);
    },
    "nextCard": function nextCard() {
      this.data.ElastiStack.next();
    },
    "lastCard": function lastCard() {
      this.data.ElastiStack.last();
    },
    "openHistory": function openHistory() {
      // 生成打卡记录
      var historyTemple = '';
      var times = 0;

      for (var ind in dateList) {
        if (this.data.readList[ind]) times++;
        historyTemple += "<div class=\"item ".concat(this.data.readList[ind] ? 'isread' : '', "\"><div class=\"num\">").concat(dateName[ind].stage, "</div><div class=\"text\">").concat(dateName[ind].name, "</div><div class=\"icon-box\"></div></div>");
      } // 累计打卡次数


      this.domList.times.innerHTML = times;
      this.domList.cardBox.innerHTML = historyTemple + '<div class="clear"></div>';
      this.domList.history.style.display = 'block';
      this.domList.showBox.style.display = 'none';
      this.domList.dataBox.style.display = 'none';
      this.domList.record.style.display = 'none';
    },
    "closeHistory": function closeHistory() {
      this.domList.history.style.display = 'none';
      this.domList.showBox.style.display = 'block';
      this.domList.dataBox.style.display = 'block';
      this.domList.record.style.display = 'block';
    },
    "changeAudioprogress": function changeAudioprogress(e) {
      var ratio = this.$event.offsetX / this.$event.target.offsetWidth; // 设置时间
      // console.log(this.data.audio.duration, ratio)

      this.data.audio.currentTime = this.data.audio.duration * ratio;
    },
    "hiddenMain": function hiddenMain(e) {
      this.domList.main.style.top = "-100%";
    }
  },
  "copyright": {},
  "share": {
    "created": function created() {
      var _this3 = this;

      // console.log(this.domList)
      // 获取到屏幕信息
      var screenInfo = ozzx.tool.getScreenInfo(); // console.log(screenInfo)
      // this.domList.learnInfo.style.width = '20%'
      // this.domList.learnInfo.style.height = 20 * screenInfo.ratio + '%'
      // console.log(this.domList.number.style)
      // this.domList.number.style.lineHight = screenInfo.clientWidth * 0.2 + 'px'
      // 避免阻塞

      setTimeout(function () {
        // 将dom导出为图片
        html2canvas(_this3.domList.share, {
          scale: 2,
          async: false
        }).then(function (canvas) {
          console.log(canvas);
          _this3.domList.shareImg.src = canvas.toDataURL();
          _this3.domList.shareImg.style.display = 'block'; // document.body.appendChild(canvas)
        });
      }, 1000);
    }
  }
};
/**
* 获取屏幕信息
* @return {object} 屏幕信息
*/

ozzx.tool.getScreenInfo = function () {
  return {
    clientWidth: document.body.clientWidth,
    clientHeight: document.body.clientHeight,
    ratio: document.body.clientWidth / document.body.clientHeight,
    // 缩放比例
    devicePixelRatio: window.devicePixelRatio || 1
  };
};