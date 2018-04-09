/**
 * Created by hu on 2018/4/8.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
  var picArr=[];//用来保存图片对象
  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);

        $('.mian_body tbody').html(template("productTmp",info));

        //分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil( info.total / info.size ),
          onPageClicked: function( a, b, c, page ) {
            currentPage = page;
            render();
          },
          // 配置分页item的文本
          itemTexts:function(type, page, current){
            switch (type){
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              default :
                return page;

            }
          },

          //设置操作按钮的title属性
          tooltipTitles:function( type, page, current){
            switch (type){
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              default :
                return "前往第"+page+"页";

            }
          }
        })

      }
    })
  }
  //1-渲染页面
  render();

  //2-点击按钮，显示模态框
  $('#addBtn').click(function(){
    $("#addModal").modal("show");

    //3-获取二级分类渲染到下拉菜单数据
    $.ajax({
      type:"get",
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        currentPage:100
      },
      success:function(info){
        console.log(info);
        $(".dropdown-menu").html( template("dropdownTmp",info));
      }
    })
  });

  //4-通过事件委托，下拉菜单选择
  $(".dropdown-menu").on("click","a",function(){
    var id=$(this).data("id");
    var txt=$(this).text();
    $('#dropdownText').text(txt);
    $('[name="brandId"]').val(id);

    $("#form").data('bootstrapValidator').updateStatus("brandId", "VALID");
  });

  //5-上传图片
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var picObj=data.result;
      var picAddr=picObj.picAddr;

      picArr.unshift(picObj);

      $("#imgBox").prepend('<img src="'+ picAddr +'" width="100">');

      if(picArr.length>3){
        picArr.pop();
        $("#imgBox img:last-of-type").remove();
      }

      //如果处理好，图片数组的长度为3，说明已经选择了三张图片，可以进行提交
      //需要将表单picStatus的校验状态，设置成VALID
      if(picArr.length==3){
        $("#form").data('bootstrapValidator').updateStatus("brandLogo", "VALID");
      }
    }
  });


  //6-表单校验

  $("#form").bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      //校验用户名，对应name表单的name属性
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品名称'
          },

        }
      },
      oldPrice: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品原价'
          },

        }
      },
      price: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品现价'
          },

        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品描述'
          },

        }
      },
      size: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的尺码'
          },

          //正则校验
          regexp: {
            regexp: /\d{2}-\d{2}$/,
            message: '尺码格式，必须是32-40'
          }

        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          // 数字: \d
          // + 表示一个或多个
          // * 表示零个或多个
          // ? 表示零个或1个
          // {n} 表示出现 n 次
          //^开头  $结尾
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式，必须是非零开头的数字'
          }
        }
      },
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          },

        }
      },
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请上传三张图片'
          },

        }
      },

    }
  });

  //7-注册表单验证成功事件
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    var parm=$("#form").serialize();
    console.log(picArr);
    parm+="&picName1="+picArr[0].picName+"&picAddr1"+picArr[0].picAddr;
    parm+="&picName2="+picArr[1].picName+"&picAddr2"+picArr[1].picAddr;
    parm+="&picName3="+picArr[2].picName+"&picAddr3"+picArr[2].picAddr;

    $.ajax({
      url:'/product/addProduct',
      type:'post',
      data:parm,
      success:function(info){
        console.log(info);

        if(info.success){
          //模态框隐藏
          $("#addModal").modal("hide");

          //重新渲染页面
          currentPage=1;
          render();

          //重置表单校验状态
          $("#form").data('bootstrapValidator').resetForm(true);

          //下拉菜单文本重置
          $("#dropdownText").text("请选择二级分类");

          //图片重置
          $("#imgBox img").remove();



        }
      }
    })
  });



})