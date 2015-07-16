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

// validation
$('#dateForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: true // Or {}
        }
    }
});

$('#customDateForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: {
                format: 'YYYY-MM-DD',
                separator: '-'
            }
        }
    }
});

$('#arrayDateForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: {
                format: ['DD-MM-YYYY', 'D-M-YYYY', 'D-M-YY'],
                separator: '-'
            }
        }
    }
});

$('#minMaxForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: {
                format: 'DD-MM-YYYY',
                separator: '-',
                minDate: "01-01-2014",  // Or new Date( 2014, 0, 1 )
                maxDate: "01-01-2016"   // Or new Date( 2016, 0, 1 )
            }
        }
    }
});
