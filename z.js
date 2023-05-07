var w = $(window).width();
var h = $(window).height();
var scale = 1;

function zoom(x) {
  if (x === -1) {
    scale = scale * 1.1;
    w = w * 0.9;
    h = h * 0.9;
    $("#myiframe").width(w + "px");
    $("#myiframe").height(h + "px")
  } else {
    scale = scale * 0.9;
    w = w * 1.1;
    h = h * 1.1;
    $("#myiframe").width(w + "px");
    $("#myiframe").height(h + "px")
  }

  $('#myiframe').css('transform', `scale(${scale})`);
}
