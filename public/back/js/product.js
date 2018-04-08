/**
 * Created by hu on 2018/4/8.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
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
  });

  //5-上传图片



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

        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品库存'
          },

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
    }
  })



})