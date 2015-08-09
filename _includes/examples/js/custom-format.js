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
