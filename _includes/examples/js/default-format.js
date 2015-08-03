$('#dateForm').validate({
    rules: {
        date: {
            required: true,
            dateValidator: true // Or {}
        }
    }
});
