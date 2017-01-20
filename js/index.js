require.config({
    baseUrl: './lib',
    paths: {
        'text': ['http://cdn.bootcss.com/require-text/2.0.12/text.min', './text.min'],
        'jquery': ['http://apps.bdimg.com/libs/jquery/1.8.3/jquery.min', 'https://cdn.css.net/libs/jquery/1.8.3/jquery.min', './jquery'],
        'underscore': ['http://apps.bdimg.com/libs/underscore.js/1.7.0/underscore-min', './underscore.min'],
        'vue': ['http://cdn.bootcss.com/vue/2.0.1/vue.min', './vue.min'],
        'vueTap': ['./vue-tap'],
        'infiniteScroll': './infiniteScroll',
        'Tween': ['https://cdn.css.net/libs/tween.js/16.3.5/Tween.min', './Tween.min'],
        'Vuex': ['https://cdn.css.net/libs/vuex/2.1.1/vuex.min', './vue-vuex.min'],
        'VueRouter': ['https://cdn.css.net/libs/vue-router/2.1.1/vue-router.min', './vue-router'],
        'VueResource': ['https://cdn.css.net/libs/vue-resource/1.0.0/vue-resource.min', './vue-resource.min']
    },
    shim: {
        'infiniteScroll': {
            deps: ['vue'],
            exports: 'Vue'
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

require(['underscore', 'infiniteScroll', 'vue', 'Tween', 'vueTap', 'Vuex', 'VueRouter', 'VueResource'],
    function(_, infiniteScroll, Vue, Tween, vueTap, Vuex, VueRouter, VueResource) {
        Vue.use(infiniteScroll); //自定义scoll指令
        Vue.use(vueTap); //自定义tap指令
        Vue.use(Vuex); //状态管理
        Vue.use(VueRouter); //路由
        Vue.use(VueResource); //AJAX

        var store = new Vuex.Store({
            state: {
                year: 2016,
                today: {
                    year: 2016,
                    month: 1,
                    date: 1,
                    day: 1
                },
                listarr: [],
                upcount: 0, //向上翻页次数,
                showfooter: false
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
            <div class="selectedTime" v-if="show">\
              时间\
            </div>\
          </div>\
            ',
            data: function() {

            },
            computed: {
                year: function() {
                    return this.$store.state.year;
                },
                show: function(){
                  return !this.$store.state.showfooter;
                }
            }
        };

        //定义组件 - calendar主体
        var calendar = {
            template: '\
            <div class="cl-main" id="clmain"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" keep-alive>\
              <template v-for="list in listarr" :key="list[0]+\'\'+list[1]" >\
                  <ul class="cl-list" :data-ym="list[0]+\'\'+list[1]" >\
                    <template  v-for="day in list[2]" :key="list[0]+\'\'+list[1]+\'\'+day">\
                      <router-link :to="\'/manage/\'+list[0]+\'/\'+list[1]+\'/\'+day" tag="li" v-if="day == 1" :style="list[3]" :data-y="list[0]" :data-m="list[1]" :data-date="day" >\
                        <span v-if="list[0] == today.year && list[1] == today.month && day == today.date"  id="cltoday" class="span-circle">{{day}}</span>\
                        <span v-else >{{day}}</span>\
                        <span class="cl-month">{{list[1]}}月</span>\
                      </router-link>\
                      <router-link :to="\'/manage/\'+list[0]+\'/\'+list[1]+\'/\'+day" tag="li" v-else>\
                        <span v-if="list[0] == today.year && list[1] == today.month && day == today.date"  id="cltoday" class="span-circle">{{day}}</span>\
                        <span v-else >{{day}}</span>\
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
                    if (newvalue > oldvalue) {
                        this.prependlist(_.first(this.$store.state.listarr));
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
                    if (this.$store.state.listarr.length > 0) {
                        return false;
                    }
                    var d = this.getToday();
                    this.$store.commit('changeYear', d.year);
                    this.$store.commit('editToday', d);
                    var year = d.year;
                    month = d.month;
                    this.$store.commit('pushToListarr', this.createListArr(year, month));
                    this.appendlist(_.last(this.$store.state.listarr));
                    this.prependlist(_.first(this.$store.state.listarr));
                },

                //向下加载更多
                loadMore: function() {
                    this.busy = true;
                    var that = this;
                    setTimeout(function() {
                        for (var i = 0, j = 6; i < j; i++) {
                            that.appendlist(_.last(that.$store.state.listarr));
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
                    this.$store.commit('unshiftToListarr', this.createListArr(year, month));
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
                    this.$store.commit('pushToListarr', this.createListArr(year, month));
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
                    <span class="col-left" v-tap="{ methods: addLastMonth }">向上翻</span>\
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
            data: function(){
              return {
                coursearr:[
                  {time:"12:00:00",title:"人际交流的重要性", content:"好的人际关系,可使工作成功率与个人幸福达成率达85%以上;一个人获得成功的因素中,85%决定于人际关系....."}
                ]
              }
            },
            created: function(){

            },
            methods: {

            }
        };

        //设置路由
        var routes = [{
            path: '/',
            component: calendar,
            beforeEnter: function(to, from, next) {
                //console.log(from);
                next();
            }
        }, {
            path: '/manage/:year/:month/:date',
            component: clmanage
        }];

        //路由实例
        var router = new VueRouter({
            routes: routes
        });

        //vue应用实例
        var cl = new Vue({
            el: "#cl",
            data: {

            },
            router,
            store,
            components: {
                'clheader': clheader,
                'calendar': calendar,
                'clmanage': clmanage,
                'clfooter': clfooter
            },
            created: function() {},
            methods: {

            }

        });

    });
