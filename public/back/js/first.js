/**
 * Created by hu on 2018/4/7.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;

  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        $('.mian_body tbody').html(template('firstTmp',info));

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:1,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(event, originalEvent, type,page){
            currentPage=page;//当前页
            render();

          }

        });

      }
    })
  }
  //1-渲染数据
  render();

  //2-添加分类功能模态框显示
  $("#addBtn").click(function(){
    $("#addCategory").modal("show");
  });

  //3-表单校验
  $("#form").bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //校验字段
    fields:{
      categoryName:{
       validators: {
         //非空校验
         notEmpty:{
           message:'请输入一级分类名称'
         }
       }
      }
    }
  })

  //表单验证成功事件
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();//阻止默认提交事件
    //使用ajax提交逻辑
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$("#form").serialize(),
      success:function(info){
        console.log(info);
        if (info.success){
          //模态框隐藏
          $("#addCategory").modal("hide");
          currentPage=1;
          render();

          //重置表单
          // 传 true 不仅可以重置 状态, 还可以重置内容
          $("#form").data('bootstrapValidator').resetForm(true);
        }
      }
    })

  });


  })