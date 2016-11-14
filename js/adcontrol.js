/**
 * Created by Administrator on 2016/11/1 0001.
 */
$(function () {
    //start 公用的添加token
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
//end

//时间filter
    var dataObj = {};

    function editArticleType(ev) {
        layer.closeAll();
        /* var loading = layer.load(1, {shade: [0.8, '#393D49']}); //0代表加载的风格，支持0-2*/
        var _this = $(ev);
        //         //jsonData = {
        //     "carouselUrl":"广告图片url",
        //         "carouselOrder":"广告位置序号",//1，2，3
        //         "carouselContent":"备注",
        //         "carouselLink":"广告链接"
        // }
        var trsPrarent = _this.closest('tr');
        var Nowtime = moment().format('YYYY-MM-DD HH:MM:SS');
        var carouselOrder = trsPrarent.find('td').eq(0).html();
        var carouselUrl = trsPrarent.find('td').eq(1).find('img').attr('src');
        var carouselLink = trsPrarent.find('td').eq(2).html();
        var carouselContent = trsPrarent.find('td').eq(3).html();
        var htmlStr = ' <div class="form-horizontal" id="typeEditContent">' +
            '        <div class="control-group">' +
            '            <label class="control-label" for="typeahead">广告位置</label>' +
            '            <div class="controls">' +
            '                <input type="text" id="typeNamearticle" value="' + carouselOrder + '"' +
            'class="span6 typeaheadspan6" data-provide="typeahead" data-items="4">' +
            '            </div>' +
            '        </div>' +
            '        <div class="control-group">' +
            '            <label class="control-label" for="fileInput">广告图片</label>' +
            '            <div class="controls upload-bg"><!--如果存在这个属性，就是过来的数据--->' +
            '                <img id="showImg" style="display:block;width:100%;height:100%" alt="" src="' + carouselUrl + '"/>' +
            '                <p class="reupload" style="display: block">' +
            '                    重新上传' +
            '                    <input class="imgEditor" id="uploadNextOk" type="file" name="file" value=""/>' +
            '                </p>' +
            '                <input type="hidden" value="" id="url">' +
            '            </div>' +
            '        </div>' +
            '        <div class="control-group">' +
            '            <label class="control-label" for="typeahead">广告链接</label>' +
            '            <div class="controls">' +
            '                <input type="text" id="typeNamearticle" value="' + carouselLink + '"' +
            'class="span6 typeaheadspan6" data-provide="typeahead" data-items="4">' +
            '            </div>' +
            '        </div>' +
            '        <div class="control-group control-group-style-1">' +
            '            <label class="control-label" for="typeahead">备注</label>' +
            '            <div class="controls">' +
            '                <textarea wrap="physical" id="remarksContent" class="span6 typeaheadspan6"' +
            '                   data-provide="typeahead" data-items="4">' + carouselContent + '</textarea>' +
            '            </div>' +
            '        </div>' +
            '    </div>';
        var indexEdit = layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['420px', '380px'], //宽高
            content: htmlStr,
            btn: ['确定', '取消'],
            success: function (layero, index) {
                $(layero).find('#uploadNextOk').on('change', imgUpLoad('uploadNextOk'));
            },
            yes: function (index, layero) {
                var elName = $.trim($('#typeNamearticle').val());
                var elSrc = $('#showImg').attr('src');
                var elMarks = $.trim($('#remarksContent').val());
                if (elName == '' || elSrc == '' || elMarks == '') {
                    layer.msg('参数不能为空', {time: 1000, icon: 1});
                    return false;
                }
                /*http://localhost:8080/webapp/articleType/addArticleType
                 添加文章类型的参数：
                 jsonData=｛"articleTypeName":"文章类型名称","articleTypeIcon":"文章类型图标的url","articleTypeRemarks":"文章类型的说明"｝
                 */
                var PaginationObj = {
                    articleTypeName: elName,
                    articleTypeIcon: elSrc,
                    articleTypeRemarks: elMarks
                };
                var setObj = JSON.stringify(PaginationObj);
                $.ajax({
                    url: 'http://www.gushidianjin.com/webapp/articleType/addArticleType',
                    type: 'post',
                    dataType: 'json',
                    data: {jsonData: setObj},
                    success: function (data) {
                        console.log(data);
                        if (data.retCode == 1) {
                            var trsPrarent = _this.closest('tr');
                            var Nowtime = moment().format('YYYY-MM-DD HH:MM:SS');
                            trsPrarent.find('td').eq(0).html(elName);
                            trsPrarent.find('td').eq(1).find('img').attr('src', elSrc);
                            trsPrarent.find('td').eq(2).html(elMarks);
                            trsPrarent.find('td').eq(3).html(Nowtime);
                            layer.msg('编辑成功', {time: 1000, icon: 1});
                            layer.close(indexEdit);
                        }

                    }, error: function (data) {
                        layer.msg('编辑失败', {time: 1000, icon: 2});
                        layer.close(loading);
                        layer.close(indexEdit)
                    }
                })

            }, btn2: function (index, layero) {


            }
        });

    };
    function isDeleteType(articleTypeId, ev) {
        //删除 http://localhost:8080/webapp/articleType/deleteArticleType?articleTypeId=1470666409979007
        var _this = $(ev.target);
        var trsPrarent = _this.closest('tr');
        layer.confirm('你确认要删除这条文章类型吗？', {
            btn: ['确认', '取消'] //按钮
        }, function () {
            $.ajax({
                url: 'http://www.gushidianjin.com/webapp/articleType/deleteArticleType',
                type: 'post',
                data: {"articleTypeId": articleTypeId},
                dataType: 'json',
                success: function (data) {
                    if (data.retCode == 1) {
                        layer.msg('已删除', {time: 1000, icon: 1});
                        trsPrarent.remove();
                    } else {
                        layer.msg('删除失败', {time: 1000, icon: 1});
                    }
                },
                error: function (data) {
                    layer.msg('删除失败', {time: 1000, icon: 1});
                }
            })
        })
    };
    function addType() {
        var htmlStr = ' <div class="form-horizontal" id="typeEditContent">' +
            '        <div class="control-group">' +
            '            <label class="control-label" for="typeahead">分类名称</label>' +
            '            <div class="controls">' +
            '                <input type="text" id="typeNamearticle" value=""' +
            'class="span6 typeaheadspan6" data-provide="typeahead" data-items="4">' +
            '            </div>' +
            '        </div>' +
            '        <div class="control-group">' +
            '            <label class="control-label" for="fileInput">分类图标</label>' +
            '            <div class="controls upload-bg"><!--如果存在这个属性，就是过来的数据--->' +
            '                <input class="upload fileUpOk" style="display: block" id="fileUpOk" type="file" name="file">' +
            '                <img id="showImg" style="display:none;width:100%;height:100%" alt="" src=""/>' +
            '                <input type="hidden" value="" id="url">' +
            '            </div>' +
            '        </div>' +
            '        <div class="control-group control-group-style-1">' +
            '            <label class="control-label" for="typeahead">备注</label>' +
            '            <div class="controls">' +
            '                <textarea wrap="physical" id="remarksContent" class="span6 typeaheadspan6"' +
            '                   data-provide="typeahead" data-items="4"></textarea>' +
            '            </div>' +
            '        </div>' +
            '    </div>';
        var indexEdit = layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            area: ['420px', '380px'], //宽高
            content: htmlStr,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var elName = $.trim($('#typeNamearticle').val());
                var elSrc = $('#showImg').attr('src');
                var elMarks = $.trim($('#remarksContent').val());
                if (elName == '' || elSrc == '' || elMarks == '') {
                    layer.msg('参数不能为空', {time: 1000, icon: 1});
                    return false;
                }
                /*http://localhost:8080/webapp/articleType/addArticleType
                 添加文章类型的参数：
                 jsonData=｛"articleTypeName":"文章类型名称","articleTypeIcon":"文章类型图标的url","articleTypeRemarks":"文章类型的说明"｝
                 */
                var PaginationObj = {articleTypeName: elName, articleTypeIcon: elSrc, articleTypeRemarks: elMarks};
                var setObj = JSON.stringify(PaginationObj);
                $.ajax({
                    url: 'http://www.gushidianjin.com/webapp/articleType/addArticleType',
                    type: 'post',
                    dataType: 'json',
                    data: {jsonData: setObj},
                    success: function (data) {
                        console.log(data);
                        if (data.retCode == 1) {
                            layer.msg('添加成功', {time: 1000, icon: 1});
                            layer.close(indexEdit);
                            getKindsType();
                        }

                    }, error: function (data) {
                        layer.msg('添加失败', {time: 1000, icon: 2});

                    }
                })

            }, btn2: function (index, layero) {


            }
        });


    };
    function imgUpLoad(eleId) {
        $('#' + eleId).fileupload({
            autoUpload: true,//自动上传
            url: "http://www.gushidianjin.com/webapp/fileUpload/imgFileUpload",//�ϴ���ַ
            dataType: 'json',
            done: function (e, data) {
                var oimage = data,
                    _this = $('#' + eleId);
                if (eleId == 'fileUpOk') {
                    _this.hide();
                    _this.siblings('img').attr('src', oimage.result.url).show();
                } else {//重新上传
                    _this.parent().siblings('img').attr('src', oimage.result.url);
                }
                ;

            }
        });
    };
    $('body').on('click', '.editTypeClick', function () {
        var articleTypeId = $(this).attr('idNum');
        editArticleType(this);

    });
    $('body').on('change', '#fileUpOk', function () {
        imgUpLoad('fileUpOk');
    });


//获取列表
    function getKindsType() {
        var loading = layer.load(1, {shade: [0.8, '#393D49']}); //0代表加载的风格，支持0-2
        $.ajax({
            url: 'http://www.gushidianjin.com/webapp/carousel/selectCarouselList',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                var html = '';
                var allData = data.retContent;
                for (var i = 0, l = allData.length; i < l; i++) {
                    html += ' <tr class="odd gradeX">' +
                        '<td>' + allData[i].carouselOrder + '</td>' +
                        '<td><img name="" src="' + allData[i].carouselUrl + '" alt=""></td>' +
                        '<td>' + allData[i].carouselLink + '</td>' +
                        '<td>' + allData[i].carouselContent + '</td>' +
                        '<td>' + moment(allData[i].carouselCreateDate).format('YYYY-MM-DD HH:MM:SS') + '</td>' +
                        '<td><a idNum=' + allData[i].carouselId + ' class="editTypeClick">编辑</a> <a href="javascript:;" idNum=' + allData[i].carouselId + ' class="deleteTypeClick">删除</a></td> </tr>'

                }
                $('.htmlTbody').html(html);
                layer.close(loading);
            }, error: function (data) {
                layer.close(loading);
                console.log(data);
            }
        })

    };
    getKindsType();
    $('.upload-bg').hover(function () {
        console.log($(this).find('img').attr('src'));
        if ($(this).find('img').attr('src') == undefined) {
            return false;
        }
        $(this).find('p').show();
    }, function () {
        $(this).find('p').hide();
    });
    $('.pull-right').on('click', function () {
        addType();
    })


})




