require.config({
    baseUrl: './lib',
    paths: {
        'text': ['http://cdn.bootcss.com/require-text/2.0.12/text.min', './text.min'],
        'css': ['http://apps.bdimg.com/libs/require-css/0.1.8/css.min', './css.min'],
        'underscore': ['http://apps.bdimg.com/libs/underscore.js/1.7.0/underscore-min', './underscore.min'],
        'vue': ['http://cdn.bootcss.com/vue/2.0.1/vue.min', './vue.min'],
        'infiniteScroll': './infiniteScroll',
        'scrollUnique': './jquery-scrollunique',
        'jquery': './jquery',
        'Tween': ['./Tween.min', 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.3.5/Tween.min'],
        'vueTap': ['./vue-tap']
    },
    shim: {
        'infiniteScroll': {
            deps: ['vue'],
            exports: 'Vue'
        }
    }
});

require(['jquery', 'underscore', 'infiniteScroll', 'vue', 'Tween', 'vueTap'],
    function($, _, infiniteScroll, Vue, Tween, vueTap) {
        Vue.use(infiniteScroll);
        Vue.use(vueTap);
        //定义组件 -  calendar
        Vue.component('calendar', {
            template: '\
            <div class="cl-main" id="clmain"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >\
              <template v-for="list in listarr" :key="list[0]+\'\'+list[1]" >\
                  <ul class="cl-list" :data-ym="list[0]+\'\'+list[1]" >\
                    <template v-for="day in list[2]" :key="list[0]+\'\'+list[1]+\'\'+day">\
                      <li v-if="day == 1" :style="list[3]" :data-y="list[0]" :data-m="list[1]" :data-date="day" >\
                        <span v-if="list[0] == today.year && list[1] == today.month && day == today.date"  id="cltoday" class="span-circle">{{day}}</span>\
                        <span v-else >{{day}}</span>\
                        <span class="cl-month">{{list[1]}}月</span>\
                      </li>\
                      <li v-else>\
                        <span v-if="list[0] == today.year && list[1] == today.month && day == today.date"  id="cltoday" class="span-circle">{{day}}</span>\
                        <span v-else >{{day}}</span>\
                      </li>\
                    </template>\
                  </ul>\
              </template>\
            </div>\
            ',
            props :[],
            data: function(){
              return {
                today: {
                    year: '',
                    month: '',
                    date: '',
                    day: ''
                },
                listarr: [],
                busy: false
              }
            },
            created: function(){
                this.init();
            },
            methods: {
              //初始化
              init: function() {
                  this.today = this.today();
                  var year = this.today.year,
                      month = this.today.month;
                  this.year = year;
                  this.listarr.push(this.createListArr(year, month));
                  this.appendlist(_.last(this.listarr));
                  this.prependlist(_.first(this.listarr));
              },
              //向下加载更多
              loadMore: function() {
                  this.busy = true;
                  var that = this;
                  setTimeout(function() {
                      for (var i = 0, j = 6; i < j; i++) {
                          that.appendlist(_.last(that.listarr));
                      }
                      that.busy = false;
                  }, 1000);
              },
              //列表头部添加一个月
              prependlist: function(arr) {
                  var year = arr[0];
                  var month = arr[1];
                  if (month == 1) {
                      year--;
                      month = 12;
                  } else {
                      month--;
                  }
                  this.listarr.unshift(this.createListArr(year, month));
              },
              //列表尾部添加一个月
              appendlist: function(arr) {
                  var year = arr[0];
                  var month = arr[1];
                  if (month == 12) {
                      year++;
                      month = 0;
                  } else {
                      month++;
                  }
                  this.listarr.push(this.createListArr(year, month));
              },
              //生成单个月份的列表项数组
              createListArr: function(year, month) {
                  var days = this.getdays(year, month);
                  var marginL = this.getday(year, month, 1) > 0 ? this.getday(year, month, 1) : 0;
                  marginL = {
                      marginLeft: marginL * 14 + '%'
                  };
                  return [year, month, days, marginL];
              },
              //当前日期信息
              today: function() {
                  var today = {};
                  var now = new Date();
                  today.year = now.getFullYear();
                  today.month = now.getMonth() + 1;
                  today.date = now.getDate();
                  today.day = now.getDay();
                  return today;
              },
              //获取某一天是星期几
              //0是星期天
              getday: function(year, month, day) {
                  var month = month - 1;
                  var day = (new Date(year, month, day)).getDay();
                  return day;
              },
              //获取某月一共有多少天
              getdays: function(year, month) {
                  var month = month - 1;
                  var date = this.getDateDiff(this.formatTime(new Date(year, month, 01)), this.formatTime(new Date(year, (month + 1), 01)));
                  return date;
              },
              //时间间隔计算(间隔天数)
              getDateDiff: function(startDate, endDate) {
                  var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
                  var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
                  var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
                  return dates;
              },
              //分割日期和时间 返回数组
              splitDate: function(strdate) {
                  var nowtime = thihs.formatTime(strdate);
                  var timearr = nowtime.split(' ');
                  return timearr;
              },
              //格式化时间
              formatTime: function(date) {
                  var year = date.getFullYear();
                  var month = date.getMonth() + 1;
                  var day = date.getDate();

                  var hour = date.getHours();
                  var minute = date.getMinutes();
                  var second = date.getSeconds();

                  return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
              },
              formatNumber: function(n) {
                  n = n.toString();
                  return n[1] ? n : '0' + n;
              }
            }
        })

        //vue应用实例
        var cl = new Vue({
            el: "#cl",
            data: {
                year :''
            },
            created: function() {
            },
            methods: {
                //tap事件，上个月
                addLastMonth: function() {
                    this.prependlist(_.first(this.listarr));
                    var clmainScrollTop = document.getElementById('clmain').scrollTop;

                    function animate(time) {
                        requestAnimationFrame(animate)
                        TWEEN.update(time)
                    }
                    new TWEEN.Tween({
                            tweeningNumber: clmainScrollTop
                        })
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .to({
                            tweeningNumber: 0
                        }, 500)
                        .onUpdate(function() {
                            document.getElementById('clmain').scrollTop = this.tweeningNumber.toFixed(0)
                        })
                        .start();
                    animate();
                },
                //tap事件
                gotoToday: function() {
                    var todayBoxOffsetTop = document.getElementById('cltoday').parentElement.offsetTop;
                    var clmainScrollTop = document.getElementById('clmain').scrollTop;

                    function animate(time) {
                        requestAnimationFrame(animate)
                        TWEEN.update(time)
                    }
                    new TWEEN.Tween({
                            tweeningNumber: clmainScrollTop
                        })
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .to({
                            tweeningNumber: todayBoxOffsetTop
                        }, 500)
                        .onUpdate(function() {
                            document.getElementById('clmain').scrollTop = this.tweeningNumber.toFixed(0)
                        })
                        .start();
                    animate();
                }

            }

        });

    });
