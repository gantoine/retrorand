$(document).ready(function () {
  $('.modal-trigger').leanModal();

  $('.platform, .platform-dry').click(function () {
    $(this).toggleClass('active');
  });
});
