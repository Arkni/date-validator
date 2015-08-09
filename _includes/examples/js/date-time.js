$('#dateTimeForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: {
                format: 'YYYY-MM-DD HH:mm',
                separator: '-'
            }
        }
    }
});
