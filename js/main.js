$(document).ready(function () {
    $('#home').find('h2, h3').each(function () {
        if (!$(this).attr('id')) {
            return;
        }

        var $heading = $(this),
            $span = $heading.find('span'),
            $anchor = $('<a/>')
            .html('#')
            .attr('href', '#' + $heading.attr('id'))
            .attr('title', $heading.text())
            .hide();
        ($span.length === 0) ? $anchor.appendTo($heading): $anchor.insertBefore($span);
        $heading.hover(function () {
            $(this).find('a').toggle();
        });
    });
});

// just for the demos, avoids form submit
$.validator.setDefaults({
    debug: true,
    success: "valid"
});
