(function() {

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
		// Get the date part of the date format
		dateFormat = dateFormat.split( " " )[ 0 ];
		// Split it to three parts: year, month & day
		dateFormat = dateFormat.split( separator );
		var hours       = 12, minutes = 0, seconds = 0,
			sections    = value.split( " " ),
			dateSection = sections[ 0 ].split( separator ),
			timeSection = ( sections.length > 1 ) ? sections[ 1 ] : null,
			amOrPm      = ( sections.length > 2 ) ? sections[ 2 ] : null,
			year        = dateSection[ $.inArray( "YYYY", dateFormat ) ] ||
				( dateSection[ $.inArray( "YY", dateFormat ) ].length === 2 ? getYear( dateSection[ $.inArray( "YY", dateFormat ) ] ) : dateSection[ $.inArray( "YY", dateFormat ) ] ),
			month       = dateSection[ $.inArray( "MM", dateFormat ) ] || dateSection[ $.inArray( "M", dateFormat ) ],
			day         = dateSection[ $.inArray( "DD", dateFormat ) ] || dateSection[ $.inArray( "D", dateFormat ) ];

		if ( timeSection ) {
			timeSection = timeSection.split( ":" );
			hours       = timeSection.length > 0 ? timeSection[ 0 ] : null;
			minutes     = timeSection.length > 1 ? timeSection[ 1 ] : null;
			seconds     = timeSection.length > 2 ? timeSection[ 2 ] : null;

			if ( amOrPm ) {
				if ( ( amOrPm === "am" || amOrPm === "AM" ) && hours === 12 ) {
					hours = parseInt( hours, 10 ) - 12;
				}

				if ( ( amOrPm === "pm" || amOrPm === "PM" ) && hours < 12 ) {
					hours = parseInt( hours, 10 ) + 12;
				}
			}
		}

		return new Date( year, month - 1, day, hours, minutes, seconds );
	}

	/**
	 * This method will validate the year, the month and the day
	 *     - The year should be between 1000 & 9999
	 *     - The month between 1 & 12
	 *     - the day between 1 & 31 (28 or 29 for February)
	 *
	 * @param dateFormat   The date format, consiste of Year (YYYY, YY),
	 *                     Month (MM, M) and Day (DD, D).
	 * @param dateValue    The date value.
	 * @param separator    The separator used in the date (/, -. .).
	 * @returns {boolean}  The validity of the passed date value.
	 */
	function dateHelper( dateFormat, dateValue, separator ) {
		var year, month, day, yearLength, monthLength, dayLength, yearToken, monthToken, dayToken,
			// Days number of each month.
			monthsDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		dateFormat = dateFormat.split( separator );
		dateValue  = dateValue.split( separator );

		// Check if dateValues & dateFormats have the same length
		// If no, exit with error
		if ( dateValue.length !== dateFormat.length ) {
			return false;
		}

		// Retrieve the year, the month & the day values.
		year  = dateValue[ $.inArray( "YYYY", dateFormat ) ] || dateValue[ $.inArray( "YY", dateFormat ) ];
		month = dateValue[ $.inArray( "MM", dateFormat ) ] || dateValue[ $.inArray( "M", dateFormat ) ];
		day   = dateValue[ $.inArray( "DD", dateFormat ) ] || dateValue[ $.inArray( "D", dateFormat ) ];

		// Retrieve the year, the month & the day tokens.
		yearToken  = dateFormat[ $.inArray( "YYYY", dateFormat ) ] || dateFormat[ $.inArray( "YY", dateFormat ) ];
		monthToken = dateFormat[ $.inArray( "MM", dateFormat ) ] || dateFormat[ $.inArray( "M", dateFormat ) ];
		dayToken   = dateFormat[ $.inArray( "DD", dateFormat ) ] || dateFormat[ $.inArray( "D", dateFormat ) ];

		// Check the year, the month and the day
		if ( !year || !month || !day || isNaN( year ) || isNaN( month ) || isNaN( day ) ) {
			return false;
		}

		// Get the initial length of the year, month & day
		yearLength  = year.length;
		monthLength = month.length;
		dayLength   = day.length;

		// Validate the year
		year  = parseInt( year, 10 );
		switch ( yearToken ) {
		case ( "YY" ):
			if ( yearLength !== 2 ) {
				return false;
			}
			break;
		case ( "YYYY" ):
			if ( yearLength !== 4 ) {
				return false;
			}
			// Validate only years between 1000 & 9999
			if ( year < 1000 || year > 9999 ) {
				return false;
			}
			break;
		default:
			break;
		}

		// Validate the month
		month = parseInt( month, 10 );
		// Check that month is between 1 & 12
		if ( month < 1 || month > 12 ) {
			return false;
		}

		switch ( monthToken ) {
		case ( "M" ):
			if ( month > 0 & month <= 9 && monthLength !== 1 ) {
				return false;
			}
			break;
		case ( "MM" ):
			if ( monthLength !== 2 ) {
				return false;
			}
			break;
		default:
			break;
		}

		// Validate the day
		// If the year is leap, then update the number of days in February to 29 days
		if ( year % 400 === 0 || ( year % 100 !== 0 && year % 4 === 0 ) ) {
			monthsDays[ 1 ] = 29;
		}
		day   = parseInt( day, 10 );

		// Then check that the day is between 1 & the number of days of the month
		if ( day < 1 || day > monthsDays[ month - 1 ] ) {
			return false;
		}

		switch ( dayToken ) {
		case ( "D" ):
			if ( day > 0 & day <= 9 && dayLength !== 1 ) {
				return false;
			}
			break;
		case ( "DD" ):
			if ( monthLength !== 2 ) {
				return false;
			}
			break;
		default:
			break;
		}

		return true;
	}

	/**
	 * This method will validate the hour, the minute and the second
	 *     - The hour should be between 00 & 23 or between 01 & 12 if AM or PM.
	 *     - The minute between 00 & 59
	 *     - The second between 00 & 59
	 *
	 * @param timeFormat   The time format, can consiste of hours (hh, h, HH or H),
	 *                     minutes (mm or m) & seconds (ss or s).
	 * @param timeValues   The time value.
	 * @param amOrPm       the am/pm token, it can be either "A" for "AM" & "PM"
	 *                     or "a" for "am" & "pm".
	 * @param amOrPmValue  The value of the amOrPm token, it can be either "AM", "am",
	 *                     "PM" or "pm".
	 * @returns {boolean}  The validity of the passed time value.
	 */
	function timeHelper( timeFormat, timeValue, amOrPm, amOrPmValue ) {
		var hours, minutes, seconds, hoursToken, minutesToken, secondsToken,
			hoursLength, minutesLength, secondsLength;

		// Determine the time
		if ( timeFormat ) {
			timeFormat = timeFormat.split( ":" );
			timeValue = timeValue.split( ":" );

			// Check if timeValues has the same size as timeFormat
			if ( timeFormat.length !== timeValue.length ) {
				return false;
			}

			// Get the hours, minutes and seconds tokens from the time format.
			hoursToken   = timeFormat[ 0 ];
			minutesToken = timeFormat[ 1 ];
			secondsToken = timeFormat[ 2 ];

			if ( amOrPm ) {
				if ( amOrPm && hoursToken === hoursToken.toUpperCase() ) {
					throw new SyntaxError( "'A' and 'a' tokens are used only with 'h' or 'hh'." );
				}

				if ( !amOrPmValue ) {
					return false;
				}

				if ( amOrPm === "A" && amOrPmValue !== "AM" && amOrPmValue !== "PM" ) {
					return false;
				}

				if ( amOrPm === "a" && amOrPmValue !== "am" && amOrPmValue !== "pm" ) {
					return false;
				}
			}

			// Retrieve the hours, the minutes & the seconds values.
			hours   = timeValue[ $.inArray( hoursToken, timeFormat ) ] || undefined;
			minutes = timeValue[ $.inArray( minutesToken, timeFormat ) ] || undefined;
			seconds = timeValue[ $.inArray( secondsToken, timeFormat ) ] || undefined;

			// Hours & minutes are required, seconds required only when using the full format: hours:minutes:seconds
			if ( !hours || !minutes || ( secondsToken && !seconds ) ) {
				return false;
			}

			// Get the initial length of hours, minutes
			hoursLength   = hours.length;
			minutesLength = minutes.length;

			// Validate hours
			if ( isNaN( hours ) || hoursLength > 2 ) {
				return false;
			}

			hours = parseInt( hours, 10 );
			switch ( hoursToken ) {
			case ( "h" ):
			case ( "hh" ):
				if ( hours < 1 || hours > 12 ) {
					return false;
				}
				if ( hours > 0 && hours <= 9 &&
					( hoursLength !== 1 && hoursToken === "h" || hoursLength !== 2 && hoursToken === "hh" ) ) {
					return false;
				}
				break;
			case ( "H" ):
			case ( "HH" ):
				if ( hours < 0 || hours > 23 ) {
					return false;
				}
				if ( hours > 0 && hours <= 9 &&
					( hoursLength !== 1 && hoursToken === "H" || hoursLength !== 2 && hoursToken === "HH" ) ) {
					return false;
				}
				break;
			default:
				break;
			}

			// Validate minutes
			if ( isNaN( minutes ) || minutesLength > 2 ) {
				return false;
			}

			minutes = parseInt( minutes, 10 );
			if ( minutes < 0 || minutes > 59 ) {
				return false;
			}

			if ( minutes > 0 && minutes <= 9 &&
				( minutesLength !== 1 && minutesToken === "m" || minutesLength !== 2 && minutesToken === "mm" ) ) {
				return false;
			}

			// Validate seconds
			if ( seconds ) {
				secondsLength = seconds.length;
				if ( isNaN( seconds ) || secondsLength > 2 ) {
					return false;
				}

				seconds = parseInt( seconds, 10 );
				if ( seconds < 0 || seconds > 59 ) {
					return false;
				}

				if ( seconds > 0 && seconds <= 9 &&
					( secondsLength !== 1 && secondsToken === "s" || secondsLength !== 2 && secondsToken === "ss" ) ) {
					return false;
				}
			}
		}

		return true;
	}

	/*
	 * dateValidator validator:
	 *     check if the given date is valid following the given format.
	 *
	 * the 'options' param is a JSON like object and has the following structure:
	 *     {
	 *        format:    "The date format",  // Can be a string or an array of strings
	 *        separator: "The used separator",
	 *        minDate:   "The min date",     // Can be a string or a Date object
	 *        maxDate:   "The max date",     // Can be a string or a Date object
	 *     }
	 *
	 * Usage examples & docs: http://arkni.github.io/date-validator/
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
			format, formats, separator, dateFormat, timeFormat, values, dateValue,
			timeValue, amOrPm, amOrPmValue, date, minDate, maxDate, valid;

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
			format      = options.format ? options.format : "DD/MM/YYYY";
			separator   = options.separator || "/";
			formats     = format.split( " " );
			dateFormat = formats[ 0 ];
			timeFormat  = ( formats.length > 1 ) ? formats[ 1 ] : null;
			amOrPm      = ( formats.length > 2 ) ? formats[ 2 ] : null;
			values      = value.split( " " );
			dateValue  = values[ 0 ];
			timeValue  = ( values.length > 1 ) ? values[ 1 ] : null;
			amOrPmValue = ( values.length > 2 ) ? values[ 2 ] : null;

			// Check if formats & values have the same length
			// If no, exit with error
			if ( formats.length !== values.length ) {
				return false;
			}

			valid = dateHelper( dateFormat, dateValue, separator );

			if ( valid && !timeHelper( timeFormat, timeValue, amOrPm, amOrPmValue )) {
				return false;
			}

			// Check if options.minDate was set
			if ( options.minDate ) {
				minDate = options.minDate instanceof Date ? options.minDate : parse( options.minDate, format, separator );
			}

			// Check if maxDate was set
			if ( options.maxDate ) {
				maxDate = options.maxDate instanceof Date ? options.maxDate : parse( options.maxDate, format, separator );
			}

			if ( valid ) {
				date = parse( value, format, separator );
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
