/**
 * Created by hu on 2018/4/7.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
   function render(){
     $.ajax({
       url:'/category/querySecondCategoryPaging',
       type:'get',
       data:{
        page:currentPage,
        pageSize:pageSize
       },
       success:function(info){
         console.log(info);
         $('.mian_body tbody').html(template("secondTmp",info));

         //分页
         $('#paginator').bootstrapPaginator({
           bootstrapMajorVersion:3,
           currentPage:info.page,
           totalPages:Math.ceil(info.total/info.size),
           onPageClicked:function(event, originalEvent, type,page){
             currentPage=page;//当前页
             render();

           }
         })
       }

     })
   }

  //1-渲染数据
  render();

  //2-点击按钮，模态框显示
  $('#addBtn').click(function(){
    $('#addModal').modal("show");

    //3-获取一级分类数据
    $.ajax({
      url:"/category/queryTopCategoryPaging",
      type:"get",
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        console.log(info);
        $(".dropdown-menu").html( template("dropdownTmp",info));
      }

    })
  })


  //3-通过注册委托事件。给a添加点击事件,改变文本内容
  $(".dropdown-menu").on("click","a",function(){
    var txt=$(this).text();
    var id=$(this).data("id");
    $("#dropdownText").text(txt);

    $('[name="categoryId"]').val(id);

    //将校验状态重置为valid
    $('#form').data("bootstrapValidator").updateStatus('categoryId','VALID');
  })

  //4-上传图片
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var picAddr = data.result.picAddr;
      $('#imgBox img').attr("src",picAddr);

      //将图片地址存在隐藏域中
      $('[name="brandLogo"]').val(picAddr);

      //重置校验
      $('#form').data("bootstrapValidator").updateStatus('brandLogo','VALID');
    }
  });


  //5-表单校验
  $("#form").bootstrapValidator({
    excluded:[],

    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandName: {
        validators:{
          notEmpty:{
            message:"请输入二级分类名称"
          }
        }
      },
      categoryId: {
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandLogo: {
        validators:{
          notEmpty:{
            message:"请上传图片"
          }
        }
      }
    }
  });


  //6-注册校验成功事件，通过ajax进行添加
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();//阻止默认提交
    //使用ajax提交逻辑

    $.ajax({
      url:'/category/addSecondCategory',
      type:'post',
      data:$("#form").serialize(),
      success:function(info){
        console.log(info);
        $('#addModal').modal("hide");
        //重置内容和校验状态
        $("#form").data('bootstrapValidator').resetForm(true);
        currentPage=1;
        render();

        //找到下拉菜单重置
        $('#dropdownText').text("请选择一级分类");

        //找到图片重置
        $('#imgBox img').attr("src","images/none.png");
      }
    })
  });



})