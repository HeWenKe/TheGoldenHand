/**
 * Created by wk on 2016/10/25.
 */

//url参数截取
function queryUrlPromete(url){
    var url=url||window.location.href;
    var obj={};
    var reg=/([^?&=]+)=([^?&=]+)/g;
    url.replace(reg,function(){
        var arg=arguments;
        obj[arg[1]]=arg[2];
    })
    return obj;

}
var urlObj=queryUrlPromete();
var token = urlObj.token;
$.each($('#sidebar').find('a'),function(i,n){
    var url=$(this).attr('href');
    $(this).attr('href',url+'?token='+token);

});
//根据条件获取数据ajax请求
var PaginationObj={};
var PaginationResult={};
function getTableData (options) {
    var loading = layer.load(1, {shade: [0.8, '#393D49']}); //0代表加载的风格，支持0-2
    var dataObj = null;
    PaginationObj= $.extend({
        pageNo: "1", //页数
        pageSize: "10" ,//每页显示条数
        sharesCode: "", //股票代码
        sharesName: "",//股票名称
        sharesPy: "", //股票名称的拼音的首字母
    },options);
    var jsonDatas =JSON.stringify(PaginationObj);
    $.ajax({
        url: 'http://www.gushidianjin.com/webapp/share/querySharesListByPage',
        type: 'post',
        async: false,
        data: {jsonData:jsonDatas},
        dataType: 'json',
        success: function (data) {
            PaginationResult={};
            var c=$('#pagePagination').find('#current-page');//当前页
            var t=$('#pagePagination').find('#total-page');//总页数
            c.val(data.curPage);
            t.html(data.pageCount);
            dataObj = data;
            layer.close(loading);
            model.datas=data.rows;
            console.log(data);

        }, error: function (data) {
            layer.close(loading);
            console.log(data);
        }
    });
    return dataObj

}
//分页
function pagination(){
    var  that={};
    that.o=$('#pagePagination');//分页容器
    that.c=that.o.find('#current-page');//当前页
    that.f=that.o.find('.first-page');//第一页
    that.p=that.o.find('.prev');//上一页元素；
    that.n=that.o.find('.next');//下一页
    that.l=that.o.find('.last-page');//最后一页
    return that;
}
function clickFirstPage(){//点击首页
    PaginationObj.pageNo=1;
    getTableData(PaginationObj);
    return false;

};
function prevPage(){
    var c=$('#pagePagination').find('#current-page');//当前页
    var t=$('#pagePagination').find('#total-page');//总页数
    var p= Number(c.val())-1;
    if(p==0){//第一页
        return false;
    }else{
        c.val(p);
        PaginationObj.pageNo=p;
        getTableData(PaginationObj);
    }
    return false;
};
function changeIt(){
    var c=$('#pagePagination').find('#current-page');//当前页
    var t=$('#pagePagination').find('#total-page');//总页数
    var m=$.trim(c.val());
    if(m<=0||m>t.html()){return false;}else{
        c.val(m);
        PaginationObj.pageNo=m;
        getTableData(PaginationObj);
    }
    return false;
};
function nextPage(){
    var c=$('#pagePagination').find('#current-page');//当前页
    var t=$('#pagePagination').find('#total-page');//总页数
    var p= Number(c.val())+1;
    if(p>t.html()){//
        return false;
    }else{
        c.val(p);
        PaginationObj.pageNo=p;
        getTableData(PaginationObj);
    }
    return false;
};
function clickLastPage(){
    var c=$('#pagePagination').find('#current-page');//当前页
    var t=$('#pagePagination').find('#total-page');//总页数
    var p= Number(t.html());
    c.val(p);
    PaginationObj.pageNo=p;
    getTableData(PaginationObj);
    return false;

}
$('body').on('click','.first-page',clickFirstPage);
$('body').on('click','.prev',prevPage);
$('body').on('change','#current-page',changeIt);
$('body').on('click','.next',nextPage);
$('body').on('click','.last-page',clickLastPage);

var model = new Vue({
    el: '#contentList',
    data: {
        datas: {},
        sharesCode: '',
        sharesPy: '',
        sharesName: '',
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
                    url:'http://www.gushidianjin.com/webapp/article/deleteArticle',
                    type:'post',
                    data:{"articleId":id},
                    dataType:'json',
                    success:function (data) {
                        if(data.retCode==1){
                            layer.msg('已删除', {time: 1000, icon: 1});
                            getTableData(PaginationObj);
                        }else{
                            layer.msg('删除失败', {time: 1000, icon: 1});
                        }
                    },
                    error:function(data){
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
        //编辑文章
        editArticle: function (id, event) {
            //iframe窗
            var index = layer.open({
                type: 2,
                title: false,
                offset: '100px',
                area: ['80%','90%'],
                closeBtn: 1, //显示关闭按钮
                shade: [0.6, '#393D49'],
                shift: 2,
                content: ['iframeDetial.html?url=http://www.gushidianjin.com/webapp/article/getArticleDetail&articleId='+id+'&token='+token],
                success: function(layero, index){
                    window.name=index;


                }
            });
        },
        //查询文章列表
        queryArticleList: function (kinds, isVip) {
            var that=this;
            var dataValue=$('#date-range2').val();
            var dateStart=dataValue.split('~')[0];
            var dataEnd=dataValue.split('~')[1];
            that.dataArea=dataValue;
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
        },
        addStock:function(el){
           if(el=='1'){//添加股票
               if (this.sharesCode && this.sharesName && this.sharesPy) {
                   var jsonData = {sharesCode: this.sharesCode, sharesName: this.sharesName, sharesPy: this.sharesPy};
                   jsonData = JSON.stringify(jsonData);
                   $.ajax({
                       url: 'http://www.gushidianjin.com/webapp/share/addSharesInfo',
                       type: 'post',
                       data: {jsonData: jsonData},
                       dataType: 'json',
                       success: function (data) {
                           console.log(data);
                           if (data.retCode == 1) {
                               layer.msg('添加完成', {time: 1000, icon: 1});
                               getTableData(PaginationObj);
                           } else {
                               layer.msg('添加失败', {time: 1000, icon: 1});
                           }
                       },
                       error: function (data) {
                           layer.msg('添加失败', {time: 1000, icon: 1});
                       }
                   });

               } else {
                   layer.msg('参数不能为空！', {time: 1000, icon: 2}); return false;
               }
           }else if(el=="2"){//查询股票
               var PaginationObj={
                       pageNo: "1", //页数
                       pageSize: "10" ,//每页显示条数
                       sharesCode:this.sharesCode , //股票代码
                       sharesName:this.sharesName,//股票名称
                       sharesPy:this.sharesPy, //股票名称的拼音的首字母
               };
               getTableData(PaginationObj);

           }





        }
    }
});

//初始化获取数据
getTableData({});
/*
 www.gushidianjin.com/webapp/share/querySharesListByPage 查询搜有股票接口
* jsonData：{"pageNo":"1","pageSize":"10","sharesCode":"股票代码","sharesName":"股票名称","sharesPy":"股票名称的拼音的首字母"}
* www.gushidianjin.com/webapp/share/addSharesInfo，添加单支股票接口
 2016/11/2 星期三 20:55:38
 张旭锋 2016/11/2 星期三 20:55:38
 参数：
 jsonData：{"sharesCode":"股票代码","sharesName":"股票名称","sharesPy":"股票名称的拼音的首字母"}

 */









