(function() {

	/**
	 * This method will validate the year, the month and the day
	 *     - The year should be between 1000 & 9999
	 *     - The month between 1 & 12
	 *     - the day between 1 & 31 (28 or 29 for February)
	 *
	 * @param year
	 * @param month
	 * @param day
	 * @returns {boolean}
	 */
	function dateHelper( year, month, day ) {
		// Check for the length of year, month and day
		if ( year.length !== 4 || day.length > 2 || month.length > 2 || !year || !month || !day ) {
			return false;
		}

		if ( isNaN( year ) || isNaN( month ) || isNaN( day ) ) {
			return false;
		}

		day   = parseInt( day, 10 );
		month = parseInt( month, 10 );
		year  = parseInt( year, 10 );

		// Validate only years between 1000 & 9999
		// Check that month is between 1 & 12
		if ( year < 1000 || year > 9999 || month < 1 || month > 12 ) {
			return false;
		}

		// Days number for each month
		var monthsDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// If the year is leap, then update the number of days in February to 29 days
		if ( year % 400 === 0 || ( year % 100 !== 0 && year % 4 === 0 ) ) {
			monthsDays[ 1 ] = 29;
		}

		// Then check that the day is between 1 & the number of days of the month
		if ( day < 1 || day > monthsDays[ month - 1 ] ) {
			return false;
		}

		return true;
	}

	/**
	 * Get the full year from a the last 2 digits of a year
	 *		If value > the last 2 digits of the current year
	 *		Then return ( 1900 + value )
	 *		Else return ( 2000 + value )
	 *
	 * For example:
	 *		value = 75 > 15 then the returned value will be '1975'
	 *		value = 14 <= 15 ( the last 2 digits of the current year) then return 2014
	 *      value = 15 then return 2015
	 *
	 * @param value The 2 digits year
	 *
	 * @returns {String}
	 */
	function getYear( value ) {
		var date = new Date( parseInt( value, 10 ), 0 ).getFullYear(),
			currentYear  = new Date().getFullYear();

		if ( ( date + 100 ) <= currentYear ) {
			date += 100;
		}

		return date.toString();
	}

	/**
	 * Parse the given date and return a Date object
	 *
	 * @param value      the date value
	 * @param dateFormat the date format
	 * @param separator  the used separator
	 * @returns {Date}
	 */
	function parse( value, dateFormat, separator ) {
		value      = value.split( separator );
		dateFormat = dateFormat.split( separator );

		var year  = value[ $.inArray( "YYYY", dateFormat ) ] ||
			( value[ $.inArray( "YY", dateFormat ) ].length === 2 ? getYear( value[ $.inArray( "YY", dateFormat ) ] ) : value[ $.inArray( "YY", dateFormat ) ] ),
			month = value[ $.inArray( "MM", dateFormat ) ] || value[ $.inArray( "M", dateFormat ) ],
			day   = value[ $.inArray( "DD", dateFormat ) ] || value[ $.inArray( "D", dateFormat ) ];

		return new Date( year, month - 1, day, 12, 0, 0 );
	}

	/*
	 * dateValidator validator:
	 *     check if the given date is valid following the given format
	 *     the date format can be:
	 *         - YYYY/MM/DD
	 *         - YYYY-MM-DD
	 *         - YYYY.MM.DD
	 *         - DD/MM/YYYY
	 *         - DD-MM-YYYY
	 *         - DD.MM.YYYY
	 *         - ...
	 * the 'options' param is a JSON like object and has the following structure:
	 * {
	 *    format:    "The date format",  // Can be a string or an array of strings
	 *    separator: "The used separator",
	 *    minDate:   "The min date",     // Can be a string or a Date object
	 *    maxDate:   "The max date",     // Can be a string or a Date object
	 * }
	 *
	 * Usage example
	 *
	 *    - Using default format & separator:
	 *    // Using 'true' or an empty object {} instead of the 'options' param
	 *    dateInput: {
	 *        dateValidator: true // Or {}
	 *    }
	 *
	 *    // Or Use the 'minDate' and/or the 'maxDate' like the following
	 *    dateInput: {
	 *        dateValidator: {
	 *            minDate: "31/01/2014",  // Or new Date( 2014, 0, 31 )
	 *            maxDate: "31/01/2016"   // Or new Date( 2016, 0, 31 )
	 *        }
	 *    }
	 *
	 *    - Using other date formats with specific separator
	 *    dateInput: {
	 *        dateValidator: {
	 *            format: "DD-MM-YYYY",   // Required if format <> "DD/MM/YYYY"
	 *            separator: "-",         // Required if separator <> "/"
	 *            minDate: "01-01-2014",  // Or new Date( 2014, 0, 1 )
	 *            maxDate: "01-01-2016"   // Or new Date( 2016, 0, 1 )
	 *        }
	 *    }
	 *
	 */
	$.validator.addMethod("dateValidator", function( value, element, options ) {
		// If the field is optional
		// exit with success
		if ( this.optional( element ) ) {
			return true;
		}

		// If options = true or options = {}
		// The user doesn't specify the format, the separator, nether the minDate & maxDate
		// Then use the default ones
		//    - format: DD/MM/YYYY
		//    - separator: /
		if ( options === true || $.isEmptyObject( options ) ) {
			options = {
				format: "DD/MM/YYYY",
				separator: "/"
			};
		}

		var $this = this,
			format, separator, dateFormats, dateValues, year, month, day,
			date, minDate, maxDate, valid;

		// If the format is an array of formats, then split each format (element) of the array
		if ( $.isArray( options.format ) ) {
			$.each( options.format, function( index, format ) {
				valid = $.validator.methods.dateValidator.call( $this, value, element, {
					format: format,
					separator: options.separator,
					minDate: options.minDate,
					maxDate: options.maxDate
				} );

				if ( valid ) {
					// To exit the $.each
					return false;
				}
			});
		} else {
			format      = options.format ? options.format.toUpperCase() : "DD/MM/YYYY";
			separator   = options.separator || "/";
			dateFormats = format.split( separator ); // Split the format to 3 values YYYY, MM & DD
			dateValues  = value.split( separator );  // Split the date to 3 values year, month & day
			year        = dateValues[ $.inArray( "YYYY", dateFormats ) ] || getYear( dateValues[ $.inArray( "YY", dateFormats ) ] );
			month       = dateValues[ $.inArray( "MM", dateFormats ) ] || dateValues[ $.inArray( "M", dateFormats ) ];
			day         = dateValues[ $.inArray( "DD", dateFormats ) ] || dateValues[ $.inArray( "D", dateFormats ) ];

			// Check if dateValues & dateFormats have the same length
			// If no, exit with error
			if ( dateValues.length !== dateFormats.length ) {
				return false;
			}

			valid = dateHelper( year, month, day );

			// Check if options.minDate was set
			if ( options.minDate ) {
				minDate = options.minDate instanceof Date ? options.minDate : parse( options.minDate, format, separator );
			}

			// Check if maxDate was set
			if ( options.maxDate ) {
				maxDate = options.maxDate instanceof Date ? options.maxDate : parse( options.maxDate, format, separator );
			}

			if ( valid ) {
				date = new Date( year, month - 1, day, 12, 0, 0 );
			}

			// Test for minDate and maxDate
			switch ( true ) {
			case ( options.minDate && !options.maxDate && valid ):
				valid = date.getTime() >= minDate.getTime();
				break;
			case ( options.maxDate && !options.minDate && valid ):
				valid = date.getTime() <= maxDate.getTime();
				break;
			case ( options.minDate && options.maxDate && valid ):
				valid = date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();
				break;
			default:
				break;
			}
		}

		return valid;
	}, $.validator.messages.date);
}());
