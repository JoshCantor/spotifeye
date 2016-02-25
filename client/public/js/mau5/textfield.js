var text = '';
var textArr = [];
var splitArr = [];
// get textarea innertext on focus out
$('textarea').on('focusout', function gettext() {
    // console.log("inside gettext");
    // console.log($(this).val());
    text = $(this).val().split('/\n');
    textArr = $(this).val().split('/\n');
    textArr = textArr.toString('\n');
    splitArr = textArr.split('\n');
    console.log(splitArr);
});

// split text line by line
// .on(events, selector, data, function(e))

// textArr = text.split("/\n");
// console.log("outside gettext");
// console.log(text);
// console.log(textArr);


var parse = function() {
  var str = $('textarea').val();
  var results = str.split('\n');
  $.each(results, function(index, element) {
    console.log('inside parse');
    console.log(element);
  });
};


$(function() {
  $('button').on('click', parse);
});


// console.log("textfield");
