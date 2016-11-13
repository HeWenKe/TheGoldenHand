/**
 * Created by wk on 2016/10/25.
 */

//url参数截取
function queryUrlPromete(url) {
    var url = url || window.location.href;
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]+)/g;
    url.replace(reg, function () {
        var arg = arguments;
        obj[arg[1]] = arg[2];
    })
    return obj;

}
var urlObj = queryUrlPromete();
var token = urlObj.token;
$.each($('#sidebar').find('a'), function (i, n) {
    var url = $(this).attr('href');
    $(this).attr('href', url + '?token=' + token);

});
//根据条件获取数据ajax请求
var PaginationObj = {};
var PaginationResult = {};
function getTableData(options) {
    var loading = layer.load(1, {shade: [0.8, '#393D49']}); //0代表加载的风格，支持0-2
    var dataObj = null;
    // PaginationObj= $.extend({
    //     pageNo: "1", //页数
    //     pageSize: "10" //每页显示条数
    //     //userType: ""用户类型 1-普通用户，2-vip用户
    // },options);
    // var jsonDatas =JSON.stringify(PaginationObj);
    $.ajax({
        url: 'http://www.gushidianjin.com/webapp/user/queryUserInfoList?pageNo=1&pageSize=10',
        type: 'post',
        async: false,
        // data: jsonDatas,
        dataType: 'json',
        success: function (data) {
            PaginationResult = {};
            var c = $('#pagePagination').find('#current-page');//当前页
            var t = $('#pagePagination').find('#total-page');//总页数
            c.val(data.curPage);
            t.html(data.pageCount);
            dataObj = data;
            layer.close(loading);
            model.datas = data.rows;
            console.log(data);

        }, error: function (data) {
            layer.close(loading);
            console.log(data);
        }
    });
    return dataObj

}
//分页
function pagination() {
    var that = {};
    that.o = $('#pagePagination');//分页容器
    that.c = that.o.find('#current-page');//当前页
    that.f = that.o.find('.first-page');//第一页
    that.p = that.o.find('.prev');//上一页元素；
    that.n = that.o.find('.next');//下一页
    that.l = that.o.find('.last-page');//最后一页
    return that;
}
function clickFirstPage() {//点击首页
    PaginationObj.pageNo = 1;
    getTableData(PaginationObj);
    return false;

};
function prevPage() {
    var c = $('#pagePagination').find('#current-page');//当前页
    var t = $('#pagePagination').find('#total-page');//总页数
    var p = Number(c.val()) - 1;
    if (p == 0) {//第一页
        return false;
    } else {
        c.val(p);
        PaginationObj.pageNo = p;
        getTableData(PaginationObj);
    }
    return false;
};
function changeIt() {
    var c = $('#pagePagination').find('#current-page');//当前页
    var t = $('#pagePagination').find('#total-page');//总页数
    var m = $.trim(c.val());
    if (m <= 0 || m > t.html()) {
        return false;
    } else {
        c.val(m);
        PaginationObj.pageNo = m;
        getTableData(PaginationObj);
    }
    return false;
};
function nextPage() {
    var c = $('#pagePagination').find('#current-page');//当前页
    var t = $('#pagePagination').find('#total-page');//总页数
    var p = Number(c.val()) + 1;
    if (p > t.html()) {//
        return false;
    } else {
        c.val(p);
        PaginationObj.pageNo = p;
        getTableData(PaginationObj);
    }
    return false;
};
function clickLastPage() {
    var c = $('#pagePagination').find('#current-page');//当前页
    var t = $('#pagePagination').find('#total-page');//总页数
    var p = Number(t.html());
    c.val(p);
    PaginationObj.pageNo = p;
    getTableData(PaginationObj);
    return false;

}
$('body').on('click', '.first-page', clickFirstPage);
$('body').on('click', '.prev', prevPage);
$('body').on('change', '#current-page', changeIt);
$('body').on('click', '.next', nextPage);
$('body').on('click', '.last-page', clickLastPage);

var model = new Vue({
    el: '#contentList',
    data: {
        datas: {},
        sharesCode: 'wqwq',
        sharesPy: '123',
        sharesName: '123',
        setVipDate: {}
    },
    methods: {
        //删除
        isDelete: function (id) {
            layer.confirm('你确认要删除这篇文章吗？', {
                btn: ['确认', '取消'] //按钮
            }, function () {
                /*http://www.gushidianjin.com/webapp/article/deleteArticle
                 删除文章的
                 articleId //文章id
                 */
                $.ajax({
                    url: 'http://www.gushidianjin.com/webapp/article/deleteArticle',
                    type: 'post',
                    data: {"articleId": id},
                    dataType: 'json',
                    success: function (data) {
                        if (data.retCode == 1) {
                            layer.msg('已删除', {time: 1000, icon: 1});
                            getTableData(PaginationObj);
                        } else {
                            layer.msg('删除失败', {time: 1000, icon: 1});
                        }
                    },
                    error: function (data) {
                        layer.msg('删除失败', {time: 1000, icon: 1});
                    }
                });

            }, function () {
                /*layer.msg('也可以这样', {
                 time: 20000, //20s后自动关闭
                 btn: ['明白了', '知道了']
                 });*/
            });

        },
        getVipDate: function () {
            var that = this;
            /*http://www.gushidianjin.com/webapp/vipPackage/queryPackageList*/
            $.ajax({
                url: 'http://www.gushidianjin.com/webapp/vipPackage/queryPackageList',
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data.retCode == 1) {
                        // layer.msg('已删除', {time: 1000, icon: 1});
                        that.setVipDate = data.retContent;
                    } else {
                        layer.msg('获取数据失败', {time: 1000, icon: 1});
                    }
                },
                error: function (data) {
                    layer.msg('获取数据失败', {time: 1000, icon: 1});
                }
            });

        },
        //设为VIP
        setVip: function (telIid, event) {
            /*http://www.gushidianjin.com/webapp/user/addUserVip?userTel=15510677963&pkgId=34567890*/
            var userTel = telIid;
            layer.closeAll();
            var index = layer.open({
                type: 1,
                title: 'VIP会员期限选择',
                content: $('#setVipContent'),
                btn: ['确定'],
                btn1: function (index, layero) {
                    var pkgId = $(layero).find("input[type='radio']:checked").val();
                    if (pkgId == "" || typeof(pkgId) == 'undefined') {
                        layer.msg('请选择会员期限', {time: 1000, icon: 2});
                        return false;
                    } else {
                        $.ajax({
                            url: 'http://www.gushidianjin.com/webapp/user/addUserVip',
                            type: 'post',
                            data: {userTel: userTel, pkgId: pkgId},
                            dataType: 'json',
                            success: function (data) {
                                if (data.retCode == 1) {
                                    layer.msg('设置成功', {time: 1000, icon: 1});
                                    layer.closeAll();
                                    $(layero).find("input[type='radio']").prop('checked', false);
                                } else {
                                    layer.msg('设置失败', {time: 1000, icon: 2});
                                }
                            },
                            error: function (data) {
                                layer.msg('设置失败', {time: 1000, icon: 2});
                            }
                        });
                    }
                }
            });
        },
        //查询文章列表
        queryArticleList: function (kinds, isVip) {
            var that = this;
            var dataValue = $('#date-range2').val();
            var dateStart = dataValue.split('~')[0];
            var dataEnd = dataValue.split('~')[1];
            that.dataArea = dataValue;
            console.log(that.dataArea);
            var setObj = {
                pageNo: "1", //页数
                pageSize: "10", //每页显示条数
                createDateTimeStart: dateStart, //开始时间
                createDateTimeEnd: dataEnd,//结束时间
                articleTypeName: kinds, //文章类型id
                isVip: isVip //是否vip 1-vip，0-不是vip
            };
            getTableData(setObj);
        }

    }
});
model.getVipDate();

//初始化获取数据
getTableData({});
/*
 张旭锋
 我把后台用户列表接口发出来：
 www.gushidianjin.com/webapp/user/queryUserInfoList
 张旭锋 2016/11/8 星期二 20:24:56
 3个参数：
 pageNo
 pageSize
 userType  用户类型 1-普通用户，2-vip用户


 */









