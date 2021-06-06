
$('.navbar-nav .nav-item-drop').click(function () {
  console.log(this)
  // $('.navbar-nav .nav-item-drop').removeClass('active')
  $(this).toggleClass('active')
})
