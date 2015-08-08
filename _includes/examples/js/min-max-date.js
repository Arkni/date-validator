$('#minMaxForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: {
                format: 'YYYY-MM-DD',
                separator: '-',
                minDate: "2014-01-01",  // Or new Date( 2014, 0, 1 )
                maxDate: "2016-01-01"   // Or new Date( 2016, 0, 1 )
            }
        }
    }
});
