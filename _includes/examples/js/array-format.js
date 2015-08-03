$('#arrayDateForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: {
                format: ['DD-MM-YYYY', 'D-M-YYYY', 'D-M-YY'],
                separator: '-'
            }
        }
    },
    messages: {
        date: {
            dateValidator: "Please enter a valid date (Format: 'DD-MM-YYYY', 'D-M-YYYY', 'D-M-YY')."
        }
    }
});
