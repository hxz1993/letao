/**
 * Created by hu on 2018/4/7.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
  
  function render(){
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        $('.mian_body tbody').html(template('userTmp',info));

        //2-分页
        $('#paginator').bootstrapPaginator({
          //指定bootstrap版本
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),

          //当页面本点击时触发
          onPageClicked:function(a,b,c,page){
            //page位当前页码
            currentPage=page;
            render();

          }
        })

      }


    });
  }

  //1-渲染页面
  render();

  // 2. 通过事件委托给 按钮注册点击事件//2-点击按钮
 $('.mian_body tbody').on('click','.btn',function(){
   //console.log('jja');
   //弹出模态框
   $('#userModal').modal('show');

   var id=$(this).parent().data('id');
   console.log(id);
    var isDelete=$(this).hasClass("btn-success") ? 1:0;
   //3-启动禁用修改
   // 先解绑, 在绑定事件, 可以保证只有一个事件绑定在 按钮上
   $('#confirmBtn').off("click").click(function(){

     $.ajax({
       type:'post',
       url:'/user/updateUser',
       data:{
          id:id,
         isDelete:isDelete
       },
       success:function(info){
         console.log(info);
         if(info.success){
            //模态框隐藏
           $('#userModal').modal('hide');
           //重新渲染页面
           render();
         }
       }
     })
   })

 })

})