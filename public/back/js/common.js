/**
 * Created by hu on 2018/4/6.
 */

//配置禁用小圆环
NProgress.configure({
  showSpinner:false
});

// ajaxStart 所有的 ajax 开始调用
$(document).ajaxStart(function(){
  NProgress.start();
});
$(document).ajaxStop(function(){
  //模拟网络延迟
  setTimeout(function(){
    NProgress.done();
  },1000)
})

//在一进入页面进行登录状况获取，登录拦截
if(location.href.indexOf("login.html")==-1){
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    success:function(info){
      console.log(info);
      if(info.error===400){
        location.href="login.html";
      }
    }


  })
}

$(function(){
  //1-二级分类显示隐藏功能
  $(".category").click(function(){
    $(this).next().stop().slideToggle();
  });

  //2-顶部菜单图标切换类
  $('.icon_menu').click(function(){
    $(".lt_aside").toggleClass('hidemenu');
    $(".lt_main").toggleClass('hidemenu');
    $(".topbar").toggleClass('hidemenu');
  });

  //3-退出登录模态框显示
  $('.icon_logout').click(function(){
    $('#logoutModal').modal("show");
  });

  //4-点击退出登录功能
  $('#logoutBtn').click(function(){
    $.ajax({
      url:'/employee/employeeLogout',
      type:'get',
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          location.href="login.html";
        }
      }
    })
  })
})