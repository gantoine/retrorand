$(document).ready(function () {
  $('.modal-trigger').leanModal();

  $('.platform').click(function () {
    $(this).toggleClass('active');
  });
});
