/**
 * Created by hu on 2018/4/6.
 */

$(function(){
  //1-表单校验
  $("#form").bootstrapValidator({
    //指定校验是的图标，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //指定校验字段
    fields:{
      //校验用户名，对应name表单的name属性
      username:{
        //校验的规则
        validators: {
          //不能为空
          notEmpty:{
            //为空时显示的提示信息
            message:'用户名不能为空'
          },
          //长度校验
          stringLength: {
            min:2,
            max:6,
            message:'用户名长度必须是2-6位'
          },

          //专门用于配置回调函数提示信息的校验规则
          callback:{
            message:'用户名不存在'
          }

        }
      },

      password:{
        validators: {
          //不能为空
          notEmpty:{
            message:'密码不能为空'
          },
          //长度校验
          stringLength: {
            min:6,
            max:12,
            message:'用户名长度必须是6-12位'
          },

          callback:{
            message:'密码错误'
          }

        }
      }
    }
  });

  //2-进行登录请求

  $('#form').on("success.form.bv",function(e){
    //阻止表单校验功能
    e.preventDefault();

    $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      data:$('#form').serialize(),
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.error===1000){
          $('#form').data("bootstrapValidator").updateStatus('username','INVALID','callback');
        }

        if(info.error===1001){
          $('#form').data("bootstrapValidator").updateStatus('password','INVALID','callback');
        }

        if(info.success){
          location.href="index.html";
        }
      }
    })
  })


  //3-重置表单
  $('[type="reset"]').click(function(){
    //除了重置文本，还要重置校验文本
    $("#form").data('bootstrapValidator').resetForm();
  })


})