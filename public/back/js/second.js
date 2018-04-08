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
  })
})