/**
 * Created by hu on 2018/4/9.
 */
$(function(){
  $.ajax({
    type:"get",
    url:"/category/queryTopCategory",
    success:function(info){
      console.log(info);
      $("#ul_left").html(template("categoryTmp",info));
      render(info.rows[0].id);

    }
  });

  function render(id){
    $.ajax({
      url:'/category/querySecondCategory',
      type:'get',
      data:{
        id:id
      },
      success:function(info){
        console.log(info);
        $("#ul_right").html( template("secondTmp",info));
      }
    })
  };

  //通过事件委托，点击a渲染页面
  $("#ul_left").on("click","a",function(){
    var id=$(this).data("id");

    //渲染页面
    render(id);

    $(this).addClass("current").parent().siblings().children().removeClass("current");
  })



})