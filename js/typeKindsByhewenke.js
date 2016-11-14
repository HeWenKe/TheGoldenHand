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
    function editArticleType(articleTypeId, ev) {
        var loading = layer.load(1, {shade: [0.8, '#393D49']}); //0代表加载的风格，支持0-2
        var _this = $(ev);
        $.ajax({
            url: 'http://www.gushidianjin.com/webapp/articleType/queryArticleType',
            type: 'post',
            data: {'articleTypeId': articleTypeId},
            dataType: 'json',
            success: function (data) {
                layer.close(loading);
                if (data.retCode == 1) {
                    dataObj = data.retContent;
                    var htmlStr = ' <div class="form-horizontal" id="typeEditContent">' +
                        '        <div class="control-group">' +
                        '            <label class="control-label" for="typeahead">分类名称</label>' +
                        '            <div class="controls">' +
                        '                <input type="text" id="typeNamearticle" value="' + dataObj.articleTypeName +'"' +
                        'class="span6 typeaheadspan6" data-provide="typeahead" data-items="4">' +
                        '            </div>' +
                        '        </div>';
                    if (dataObj.articleTypeIcon == '') {
                        htmlStr += ' <div  class="controls upload-bg">' + <!---->
                            '<input class="upload" id="file" type="file" name="file">' +
                            '<img id="showImg" style="display:none;width:100%;height:100%" src="" alt="" />' +
                            '<p class="reupload"> 重新上传 <input class="imgEditor" id="uploadNext" type="file" name="file" value=""/></p>' +

                            '<input type="hidden" value="" id="url"></div>';
                    }
                    if (dataObj.articleTypeIcon != '') {
                        htmlStr += '        <div class="control-group">' +
                            '            <label class="control-label" for="fileInput">分类图标</label>' +
                            '            <div class="controls upload-bg"><!--如果存在这个属性，就是过来的数据--->' +
                            '                <input class="upload fileUpOk" style="display: none" id="fileUpOk" type="file" name="file">' +
                            '                <img id="showImg" style="display:block;width:100%;height:100%" alt="" src="' + dataObj.articleTypeIcon + '"/>' +
                            '                <p class="reupload" style="display: block">' +
                            '                    重新上传' +
                            '                    <input class="imgEditor" id="uploadNextOk" type="file" name="file" value=""/>' +
                            '                </p>' +
                            '                <input type="hidden" value="" id="url">' +
                            '            </div>' +
                            '        </div>';
                    }

                    htmlStr += '        <div class="control-group control-group-style-1">' +
                        '            <label class="control-label" for="typeahead">备注</label>' +
                        '            <div class="controls">' +
                        '                <textarea wrap="physical" id="remarksContent" class="span6 typeaheadspan6"' +
                        '                   data-provide="typeahead" data-items="4">' + dataObj.articleTypeRemarks + '</textarea>' +
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
                            $(layero).find('#fileUpOk').on('change', imgUpLoad('fileUpOk'));
                            $(layero).find('#uploadNextOk').on('change', imgUpLoad('uploadNextOk'));
                            $(layero).find('.upload-bg').hover(function () {
                                console.log($(this).find('img').attr('src'));
                                if ($(this).find('img').attr('src') == '') {
                                    return false;
                                }
                                $(this).find('p').show();
                            }, function () {
                                $(this).find('p').hide();
                            });
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
                }
            }, error: function (data) {
                layer.msg('编辑失败', {time: 1000, icon: 2});
                layer.close(loading);
                console.log(data);
            }
        });
    };
    function isDeleteType(ev) {
        var articleTypeId = ev.attr('idnum');
        //删除 http://localhost:8080/webapp/articleType/deleteArticleType?articleTypeId=1470666409979007
        var trsPrarent = ev.closest('tr');
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
            '               <img id="showImg" style="display:none;width:100%;height:100%" alt="" src=""/>' +
            '                <p class="reupload" style="display: none">' +
            '                    重新上传' +
            '                    <input class="imgEditor" id="uploadNextOk" type="file" name="file" value=""/>' +
            '                </p>' +
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
            success: function (layero, index) {
                $(layero).find('#fileUpOk').on('change', imgUpLoad('fileUpOk'));
                $(layero).find('#uploadNextOk').on('change', imgUpLoad('uploadNextOk'));
                $(layero).find('.upload-bg').hover(function () {
                    if ($(this).find('img').attr('src') == '') {
                        return false;
                    }
                    $(this).find('p').show();
                }, function () {
                    $(this).find('p').hide();
                });
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
                };

            }
        });
    };
    $('body').on('click','.editTypeClick',function(){
        var articleTypeId=$(this).attr('idNum');
        editArticleType(articleTypeId,this);

    });
//获取列表
    function getKindsType() {
        var loading = layer.load(1, {shade: [0.8, '#393D49']}); //0代表加载的风格，支持0-2
        $.ajax({
            url: 'http://www.gushidianjin.com/webapp/articleType/queryAllArticleList',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                var html = '';
                var allData = data.retContent;
                for (var i = 0, l = allData.length; i < l; i++) {
                    html += ' <tr class="odd gradeX">' +
                        '<td>' + allData[i].articleTypeName + '</td>' +
                        '<td><img name="" src="' + allData[i].articleTypeIcon + '" alt=""></td>' +
                        '<td>' + allData[i].articleTypeRemarks + '</td>' +
                        '<td>' + moment(allData[i].creatDate).format('YYYY-MM-DD HH:MM:SS') + '</td>' +
                        '<td><a idNum='+allData[i].articleTypeId+' class="editTypeClick">编辑</a> <a href="javascript:;" idNum='+allData[i].articleTypeId+' class="deleteTypeClick">删除</a></td> </tr>'

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

    $('.pull-right').on('click',function(){
        addType();
    })
    $('body').on('click', '.deleteTypeClick', function () {
        var _this = $(this);
        isDeleteType(_this);
    })


})



