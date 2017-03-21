require.config({
    baseUrl: './lib',
    map: {
        '*': {
            'css': ['./css.min']
        }
    },
    paths: {
        'text': ['http://cdn.bootcss.com/require-text/2.0.12/text.min', './text.min'],
        'Animate': ['./animate.min'],
        'lodash': ['https://cdn.css.net/libs/lodash.js/3.10.1/lodash.min'],
        'vue': ['http://cdn.bootcss.com/vue/2.0.1/vue.min', './vue.min'],
        'vueTap': ['./vue-tap'],
        'infiniteScroll': './infiniteScroll',
        'inobounce': './inobounce',
        'Tween': ['https://cdn.css.net/libs/tween.js/16.3.5/Tween.min', './Tween.min'],
        'Vuex': ['https://cdn.css.net/libs/vuex/2.1.1/vuex.min', './vue-vuex.min'],
        'VueRouter': ['https://cdn.css.net/libs/vue-router/2.1.1/vue-router.min', './vue-router'],
        'VueResource': ['https://cdn.css.net/libs/vue-resource/1.0.0/vue-resource.min', './vue-resource.min'],
        'axios': ['https://cdn.css.net/libs/axios/0.9.0/axios.min', './axios.min'],
        'swiper': ['./swiper/swiper.min']
    },
    shim: {
        'infiniteScroll': {
            deps: ['vue', 'inobounce']
        },
        'Vuex': {
            desps: ['vue'],
            exports: 'Vuex'
        },
        'VueRouter': {
            deps: ['vue'],
            exports: 'VueRouter'
        }

    }
});

require(['css!Animate', 'lodash', 'infiniteScroll', 'vue', 'Tween', 'vueTap', 'Vuex', 'VueRouter', 'axios', 'swiper'],
    function(Animate, _, infiniteScroll, Vue, Tween, vueTap, Vuex, VueRouter, axios, Swiper) {
        Vue.use(infiniteScroll); //自定义scoll指令
        Vue.use(vueTap); //自定义tap指令
        Vue.use(Vuex); //状态管理
        Vue.use(VueRouter); //路由
        //AJAX    axios

        var store = new Vuex.Store({
            state: {
                year: 2016,
                today: {
                    year: 2016,
                    month: 1,
                    date: 1,
                    day: 2
                },
                listarr: [],
                upcount: 0, //向上翻页次数,
                showfooter: false,
                selectedDate: [] //所选择的日期
            },
            mutations: {
                goup: function(state) {
                    state.upcount++;
                },
                changeYear: function(state, y) {
                    state.year = y;
                },
                editToday: function(state, obj) {
                    state.today = obj;
                },
                pushToListarr: function(state, arr) {
                    state.listarr.push(arr);
                },
                unshiftToListarr: function(state, arr) {
                    state.listarr.unshift(arr);
                },
                switchFooter: function(state, arr) {
                    state.showfooter = !state.showfooter;
                },
                changeSelectedDate: function(state, obj) {
                    state.selectedDate = obj;
                },
                changeYear: function(state,num){
                  state.year = num ;
                }
            }
        });

        //定义组件 － 顶部组件
        var clheader = {
            template: '\
          <div class="cl-header">\
            <span class="cl-year" id="clyear" v-cloak>{{year}}年</span>\
            <ul>\
              <li>日</li>\
              <li>一</li>\
              <li>二</li>\
              <li>三</li>\
              <li>四</li>\
              <li>五</li>\
              <li>六</li>\
            </ul>\
            <template v-if="show">\
              <div class="swiper-container">\
                <div class="swiper-wrapper">\
                    <router-link tag="div" :to="\'/manage/\'+ $route.params.year + \'/\' + $route.params.month + \'/\' + n + \'/\' + $route.params.days" class="swiper-slide" v-for="n in $store.state.selectedDate.days" replace :class="$route.params.date == n ? \'today\': \'\' ">{{n}}</router-link>\
                </div>\
              </div>\
              <div class="selectedTime">\
                {{day}}&nbsp;&nbsp;{{month}}.{{date}},&nbsp;&nbsp;{{year}}\
              </div>\
            </template>\
            <transition name=""\
            enter-active-class="animated bounceInDown"\>\
            </transition>\
          </div>\
            ',
            data: function() {
              return {
                  week: [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday"
                  ],
                  months: [
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'June',
                      'July',
                      'Aug',
                      'Sept',
                      'Oct',
                      'Nov',
                      'Dec'
                  ]
              }
            },
            mounted: function(){
              var self = this;
              setTimeout(function(){
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 7
                });
                if (self.date < 5 || self.date > 25) {
                  swiper.slideTo(self.date-1, 500, false);
                } else {
                  swiper.slideTo(self.date-4, 500, false);
                }
              },0)
            },
            computed: {
                year: function() {
                    return this.$store.state.year;
                },
                days: function() {
                  console.log(this.$store.state.days)
                  return this.$store.state.days;
                },
                date: function() {
                  return this.$route.params.date;
                },
                show: function() {
                    return !this.$store.state.showfooter;
                },
                day: function() {
                  var year = this.$route.params.year,
                    month = this.$route.params.month-1,
                    date = this.$route.params.date;
                  var day = new Date(year, month, date).getDay();
                  if (day == 7){
                    return this.week[0];
                  } else {
                    return this.week[day];
                  }
                },
                month: function () {
                  return this.months[this.$route.params.month - 1];
                }
            },
            watch: {
              show: function(newV,oldV){
                console.log(newV);
                var self = this;
                if(newV){
                  setTimeout(function(){
                    var swiper = new Swiper('.swiper-container', {
                        slidesPerView: 7
                    });
                    if (self.date < 5 || self.date > 25) {
                      swiper.slideTo(self.date-1, 500, false);
                    } else {
                      swiper.slideTo(self.date-4, 500, false);
                    }
                  },0)
                }
              }
            }
        };

        //定义组件 - calendar主体
        var calendar = {
            template: '\
            <div class="cl-main" id="clmain" @scroll="onScroll" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">\
              <template v-for="list in listarr" :key="list[0]+\'\'+list[1]" >\
                  <ul class="cl-list" :data-ym="list[0]+\'\'+list[1]" >\
                    <template  v-for="day in list[2]" :key="list[0]+\'\'+list[1]+\'\'+day">\
                      <router-link :to="\'/manage/\'+list[0]+\'/\'+list[1]+\'/\'+day+\'/\'+list[2]"  tag="li" v-if="day == 1" :style="list[3]" :data-y="list[0]" :data-m="list[1]" :data-date="day" >\
                        <span v-if="list[0] == today.year && list[1] == today.month && day == today.date"  id="cltoday" class="span-circle">{{day}}</span>\
                        <span v-else >{{day}}</span>\
                        <span class="train" v-show="list[4][(day-1)].train"></span>\
                        <span class="cl-month">{{list[1]}}月</span>\
                      </router-link>\
                      <router-link :to="\'/manage/\'+list[0]+\'/\'+list[1]+\'/\'+day+\'/\'+list[2]"  tag="li" v-else>\
                        <span v-if="list[0] == today.year && list[1] == today.month && day == today.date"  id="cltoday" class="span-circle">{{day}}</span>\
                        <span v-else >{{day}}</span>\
                        <span class="train" v-show="list[4][(day-1)].train"></span>\
                      </router-link>\
                    </template>\
                  </ul>\
              </template>\
            </div>\
            ',
            props: [],
            data: function() {
                return {
                    scrollTop: 0
                }
            },
            //计算属性
            computed: {
                today: function() {
                    return this.$store.state.today;
                },
                listarr: function() {
                    return this.$store.state.listarr;
                },
                upcount: function() {
                    return this.$store.state.upcount;
                }
            },
            watch: {
                upcount: function(newvalue, oldvalue) {
                  var that = this;
                    if (newvalue > oldvalue) {
                      setTimeout(function() {
                          that.prependlist(_.first(that.$store.state.listarr));
                      }, 500);

                    }
                }
            },
            created: function() {
                this.init();
            },
            mounted: function() {
                //初次挂载到元素上才调用这个勾子函数
            },
            //路由进入
            beforeRouteEnter: function(to, from, next) {
                next(function(vm) {
                    vm.$el.scrollTop = vm.scrollTop;
                    vm.$store.commit('switchFooter');
                });
            },
            //路由离开
            beforeRouteLeave: function(to, from, next) {
                this.$store.commit('switchFooter');
                this.scrollTop = this.$el.scrollTop;
                next();
            },
            methods: {

                //初始化
                init: function() {
                  var self = this;
                    if (self.$store.state.listarr.length > 0) {
                        return false;
                    }
                    var d = self.getToday();
                    self.$store.commit('changeYear', d.year);
                    self.$store.commit('editToday', d);
                    var year = d.year;
                    month = d.month;
                    self.createListArr(year, month, 'pushToListarr' , function(){
                      if(self.$store.state.listarr.length == 0) return;
                      self.appendlist(_.last(self.$store.state.listarr));
                      self.prependlist(_.first(self.$store.state.listarr));
                    });

                },
                onScroll: function() {
                    this.busy = true;
                    var that = this;
                    if(this.busy){
                      setTimeout(function(){
                        var nodelist = document.querySelectorAll("#clmain ul");
                        var a = _.slice(nodelist).map(function(item) {
                            return item.getBoundingClientRect().top;
                        });
                        var b = _.findIndex(a, function(value){
                          return value > 0 ;
                        });
                        if (b < 0) {
                          return false;
                        }
                        var y = that.$store.state.listarr[b][0];
                        that.$store.commit('changeYear', y);
                        that.busy = false;
                      },500);
                    }

                },
                //向下加载更多
                loadMore: function() {
                    this.busy = true;
                    var that = this;
                    if(that.$store.state.listarr.length == 0) return false;
                    setTimeout(function() {
                        that.appendlist(_.last(that.$store.state.listarr));
                        that.busy = false;
                    }, 500);
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
                    this.createListArr(year, month, 'unshiftToListarr')
                },
                //列表尾部添加一个月
                appendlist: function(arr) {
                    var year = arr[0];
                    var month = arr[1];
                    if (month == 12) {
                        year++;
                        month = 1;
                    } else {
                        month++;
                    }
                    this.createListArr(year, month, 'pushToListarr')

                },
                //生成单个月份的列表项数组
                createListArr: function(year, month, action, cb) {
                    var self = this;
                    var days = self.getdays(year, month);
                    var marginL = self.getday(year, month, 1) > 0 ? self.getday(year, month, 1) : 0;
                    marginL = {
                        marginLeft: marginL * 14 + '%'
                    };
                    //ajax获取当月培训课程信息(暂时是模拟的，需要去后台获取一个月的培训信息)
                    axios.get('./test.php')
                    .then(function(response){
                      /*
                      var infoarr = response.data.infoarr;
                      以下为 infoarr 数据结构（包含一个月每天的信息）
                      比如2017，1月，共28天，infoarr数据里有28个对象
                      ...
                      */

                      /*
                      infoarr = [
                        {
                          train: true,
                          practice: false
                        },
                        {
                          train: true,
                          practice: false
                        }
                      ];
                      */
                      var infoarr = [];
                      for(var i = 0; i<days; i++){
                        infoarr[i] = {
                          train: true, //培训
                          practice: false //练习
                        };
                        if(i > 15){
                          infoarr[i] = {
                            train: true, //培训
                            practice: true //练习
                          };
                        }
                      }
                      //var infoarr = response.data.infoarr;

                      if(action){
                        self.$store.commit(action, [year, month, days, marginL, infoarr] );
                      }

                      if(cb){
                        cb();
                      }
                    })
                    .catch(function(error){
                      console.log(error);
                    });
                },
                //当前日期信息
                getToday: function() {
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
                    var nowtime = this.formatTime(strdate);
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
        };
        //自定义组件 － 底部组件
        var clfooter = {
                template: '\
                <transition name=""\
                enter-active-class="animated bounceInUp"\
                leave-active-class="animated bounceOutDown">\
                  <div class="cl-footer" v-if="showfooter">\
                    <span class="col-left" v-tap="{ methods: addLastMonth }">▲上月</span>\
                    <span class=" col-left" v-tap="{ methods: gotoToday }">今天</span>\
                  </div>\
                  </transition>\
                ',
                computed: {
                    showfooter: function() {
                        return this.$store.state.showfooter;
                    }
                },
                methods: {
                    //tap事件，上个月
                    addLastMonth: function() {
                        //this.prependlist(_.first(this.$store.state.listarr));
                        this.$store.commit('goup');
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
                        if (!document.getElementById('cltoday')) {
                            return false;
                        }
                        var todayBoxOffsetTop = document.getElementById('cltoday').parentElement.parentElement.offsetTop;
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
            }
            //自定义组件 - 日程管理
        var clmanage = {
            template: '\
              <div class="clmanage" keep-alive>\
                  <div class="header">\
                  {{ $route.params.year }}年{{ $route.params.month }}月{{ $route.params.date }} 日\
                  </div>\
                  <template v-for="course in coursearr">\
                    <div class="course">\
                      <div class="course-time">\
                        时间: {{course.time}}\
                      </div>\
                      <div class="course-place" v-show="course.place">\
                        地点: {{course.place}}\
                      </div>\
                      <div class="course-ren" v-show="course.ren">\
                        讲师: {{course.ren}}\
                      </div>\
                      <div class="course-title">\
                        {{course.title}}\
                      </div>\
                      <div class="course-content">\
                        {{course.content}}\
                      </div>\
                    </div>\
                  </template>\
              </div>\
            ',
            data: function() {
                return {
                    coursearr: [],
                    week: [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                    ],
                    months: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'June',
                        'July',
                        'Aug',
                        'Sept',
                        'Oct',
                        'Nov',
                        'Dec'
                    ]
                }
            },
            computed: {
              date: function(){
                return this.$route.params.date;
              }
            },
            watch: {
              date: function(newV, oldV) {
                if (newV != oldV ) {
                  this.getcourse(this.$route.params);
                }
              }
            },
            created: function() {

            },
            beforeRouteEnter: function(to, from, next) {
                next(function(vm) {
                    var time = {};
                    time.year = parseInt(vm.$route.params.year);
                    time.month = parseInt(vm.$route.params.month);
                    time.days = parseInt(vm.$route.params.days)
                    time.date = parseInt(vm.$route.params.date);
                    time.day = (new Date(time.year, (time.month - 1), time.date)).getDay();
                    time.day = vm.week[time.day];
                    time.month = vm.months[(time.month - 1)];
                    vm.$store.commit('changeSelectedDate', time);
                    vm.$store.commit('changeYear', time.year);

                    vm.getcourse(vm.$route.params);

                });
            },
            methods: {
                getcourse: function (params) {
                  var self = this;
                  var time = {};
                  time.year = parseInt(params.year);//年
                  time.month = parseInt(params.month);//月
                  time.date = parseInt(params.date);//日
                  //ajax获取所点击的当天的所有课程；
                  axios.get('./test.php')
                  .then(function(response){
                    //以下是课程数据结构;
                    //self.coursearr ＝ response.data.courses；
                    self.coursearr = [
                      {
                          time: "11:00:00",
                          title: "人际交流的重要性",
                          content: "好的人际关系,可使工作成功率与个人幸福达成率达85%以上;一个人获得成功的因素中,85%决定于人际关系....."
                      },
                      {
                          time: "12:00:00",
                          title: "人际交流的重要性",
                          content: "好的人际关系,可使工作成功率与个人幸福达成率达85%以上;一个人获得成功的因素中,85%决定于人际关系....."
                      }
                    ]
                  })
                  .catch(function(error){
                    console.log(error);
                  })
                }
            }
        };

        //设置路由
        var routes = [{
            path: '/',
            component: calendar
        }, {
            path: '/manage/:year/:month/:date/:days',
            component: clmanage
        }];

        //路由实例
        var router = new VueRouter({
            routes: routes
        });

        //vue应用实例
        var cl = new Vue({
            data: {},
            router: router,
            store: store,
            components: {
                'clheader': clheader,
                'calendar': calendar,
                'clmanage': clmanage,
                'clfooter': clfooter
            },
            created: function() {}
        }).$mount("#cl");

    });
