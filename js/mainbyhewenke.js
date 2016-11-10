/**
 * Created by wk on 2016/10/25.
 */

//图片上传 eleId   type=file的id
function imgUpLoad(eleId) {
    $('#' + eleId).fileupload({
        autoUpload: true,//自动上传
        url: "http://www.gushidianjin.com/webapp/fileUpload/imgFileUpload",//�ϴ���ַ
        dataType: 'json',
        done: function (e, data) {
            var oimage = data,
                _this = $('#' + eleId);
            if (eleId == 'file') {
                _this.hide();
                _this.siblings('img').attr('src', oimage.result.url).show();
            } else {//重新上传
                _this.parent().siblings('img').attr('src', oimage.result.url);

            }
            _this.closest('div').hover(function () {
                $(this).children('p').show();
            }, function () {
                $(this).children('p').hide();
            });
            $('#url').val(oimage.result.url);

        }
        //上传之前可以执行的
        /* $('#fileuploada').on('fileuploadstart', function (e, data) {
         if( $('.imageload').attr('src')=='') {
         $('.imageload').attr('src', "/images/loading.gif")} ;
         });*/
    });
}

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
    PaginationObj={};
    PaginationObj= $.extend({
        pageNo: "1", //页数
        pageSize: "10" ,//每页显示条数
        createDateTimeStart: "", //开始时间
        createDateTimeEnd: "",//结束时间
        articleTypeName: "", //文章类型id
        isVip: "" //是否vip 1-vip，0-不是vip
    },options);
    var jsonDatas =JSON.stringify(PaginationObj);
    $.ajax({
        url: 'http://www.gushidianjin.com/webapp/article/getArticleList',
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
    el: '#dataTable',
    data: {
        datas: {},
        kindsName:'',
        optionKinds:{},
        attrIsVip:'',
        DateArea:'',
        optionIsVip:[
            {name:'选择文章属性',value:''},
            {name:'VIP内容',value:'1'},
            {name:'公开内容',value:'0'},
        ]
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
        //获取栏目分类
        getoptionKinds:function(){
            var that = this;
            $.ajax({
                url:'http://www.gushidianjin.com/webapp/articleType/queryAllArticleList',
                type:'post',
                dataType:'json',
                success:function (data) {
                    if(data.retCode==1){
                        that.optionKinds=data.retContent;
                        that.optionKinds.unshift({articleTypeId:'',articleTypeRemarks:'分类栏目'})
                    }
                },
                error:function(data){
                    console.log(data);
                }
            });
        },
        //双日历调用
        setDate:function (event) {
            $(event.target).dateRangePicker(
                {
                    startOfWeek: 'monday',
                    separator : ' ~ ',
                    format: 'YYYY-MM-DD HH:mm:ss',
                    time: {
                        enabled: true
                    },
                    autoClose: false,
                    singleDate : false,
                    showShortcuts: false
                });
        },
        //置顶与取消置顶
        setTop: function (id, event) {
            var _this = $(event.target);
            var num;
            /*http://www.gushidianjin.com/webapp/article/updateArticleKind
             参数2个：
             articleId //文章id
             kind // 0-置顶，1-取消置顶
             */
            if (_this.html() == '置顶') {
                num=0;
                _this.html('取消置顶').css('color', '#ff0000');
            } else {
                _this.html('置顶').css('color', '#08c');
                num=1;
            };
            var obj={"articleId":id,"kind":num};
            $.ajax({
                url:'http://www.gushidianjin.com/webapp/article/updateArticleKind',
                type:'post',
                data:obj,
                dataType:'json',
                success:function (data) {
                    if(data.retCode==1){
                        layer.msg('设置成功', {
                            icon: 1,
                            time: 1000 //2秒关闭（如果不配置，默认是3秒）
                        });
                    }else if(data.retCode==0){
                        layer.msg('设置置顶超过了10篇，不能再置顶文章', {
                            icon: 2,
                            time: 1000 //2秒关闭（如果不配置，默认是3秒）
                        });
                    }
                },
                error:function(data){
                    layer.msg('设置成功', {
                        icon: 2,
                        time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    });
                }
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
        }
    }
});
//获取分组参数
model.getoptionKinds();

//初始化获取数据
getTableData({});

/*
* {"retCode":"1","retMessage":"查询信息成功！","retContent":{"article":{"articleId":1470668055038000,"userId"
 :1469584441021001,"articleTitle":"政策大礼包 | 总理牵挂，五大教育红包你收到了吗？","articleAuthor":"中国政府网","articleCoverUrl"
 :"http://localhost:8080/webapp/static/pic/1470668034587582a3cb3c9c742628fb89658aadbd890.jpg","isVipArticle"
 :"1","creatDate":"2016-08-08 00:00:00","articleTypeId":1470668055038001,"isDraft":"1","kind":"1","kindDate"
 :null,"auditingFlag":"1","articleContent":"（原标题：政策大礼包 | 总理牵挂，五大教育红包你收到吗？）加快中西部教育发展意见、加强困境儿童教育保障、财政经费支持、治理教育乱收费……今年以来，国务院为全国的家长和学生派发了多个“红包”，多项教育政策密集出台，内容涵盖方方面面。下面跟随国务院客户端一起细数今年以来国务院派出的教育“大红包”————6月1日的
 国务院常务会议部署加强困境儿童保障工作，对他们的成长给予更多关爱帮助。随后，国务院印发《关于加强困境儿童保障工作的意见》。对于家庭经济困难儿童，要落实教育资助政策和义务教育阶段“两免一补”政策。对于残
 疾儿童，要建立随班就读支持保障体系，为其中家庭经济困难的提供包括义务教育、高中阶段教育在内的12年免费教育。对于农业转移人口及其他常住人口随迁子女，要将其义务教育纳入各级政府教育发展规划和财政保障范畴
 ，全面落实在流入地参加升学考试政策和接受中等职业教育免学费政策。","cDate":null,"release":1477208008000,"status":"1"},"articleType":{"articleTypeId"
 :1470668055038001,"articleTypeName":"高级席位","articleTypeIcon":null,"articleTypeRemarks":"高级席位","creatDate"
 :1470585600000},"articleSharesRelations":[{"id":1470668055038002,"articleId":1470668055038000,"sharesId"
 :"sh600007","sharesName":"中国国贸","creatDate":null},{"id":1470668055038003,"articleId":1470668055038000
 ,"sharesId":"sh600038","sharesName":"中直股份","creatDate":null},{"id":1470668055038004,"articleId":1470668055038000
 ,"sharesId":"sh600050","sharesName":"中国联通","creatDate":null},{"id":1470668055038005,"articleId":1470668055038000
 ,"sharesId":"sh600028","sharesName":"中国石化","creatDate":null}],"dayReference":null},"success":true}*/







