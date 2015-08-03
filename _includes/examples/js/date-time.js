$('#dateTimeDateForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: {
                format: 'YYYY-MM-DD HH:mm',
                separator: '-'
            }
        }
    },
    messages: {
        date: {
            dateValidator: "Please enter a valid date (Format YYYY-MM-DD HH:mm)."
        }
    }
});
