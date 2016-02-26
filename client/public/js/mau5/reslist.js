var bgColor;
var effect = 'animated bounceInLeft';

$('.all-content').hide();

$('.content li').click(function() {
    $('.card-front, .card-back').hide();
    $('.content li').removeClass('active').hide().css('border', 'none');
    $(this).addClass('active').show();
    bgColor = $('.active .card-back').css('background-color');
    $('.content').css('background-color', bgColor);
    $('.close, .all-content').show();
    $('.responsive').append('<span class="close">close</span>').addClass(
        effect);
});


$('.responsive').on('click', '.close', function() {

    $('.close').remove();
    bgColor = $('.active .card-front').css('background-color');
    $('.responsive').removeClass(effect);
    $('.all-content').hide();
    $('.content li').removeClass('active').show().css({
        'border-bottom': '1px solid #2c2c2c',
        'border-left': '1px solid #2c2c2c'
    });
    $('.card-front, .card-back').show();
    $('.content').css('background-color', bgColor);
});
