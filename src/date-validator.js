( function() {

	/**
	 * Get the full year from a the last 2 digits of a year
	 *		If value > the last 2 digits of the current year
	 *		Then return ( 1900 + value )
	 *		Else return ( 2000 + value )
	 *
	 * For example:
	 *		value = 75 > 15 then the returned value will be '1975'
	 *		value = 14 <= 16 ( the last 2 digits of the current year) then return 2014
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

		return date;
	}

	/**
	 * Parse the given format and date, and return an object of tokens
	 * and values.
	 *
	 * @param format      The date format
	 * @param date        The date value
	 * @param separator   The used separator
	 *
	 * @returns {Object}  An object of the following form:
	 *    {
	 *        day    : "day",
	 *        month  : "month",
	 *        year   : "year",
	 *        hours  : "hours",
	 *        minutes: "minutes",
	 *        seconds: "seconds",
	 *        amOrPm : "am Or Pm",
	 *        format: {
	 *            date: "Date format,
	 *            time: "Time format"
	 *        },
	 *        tokens : {
	 *            day    : "Day token (D, DD)",
	 *            month  : "Month token (M, MM)",
	 *            year   : "Year token (YY, YYYY)",
	 *            hours  : "Hours token (H, HH, h, hh)",
	 *            minutes: "Minutes token (m, mm)",
	 *            seconds: "Seconds token (s, ss),
	 *            amOrPm : "AM Or PM token (A, a)"
	 *        }
	 *    }
	 */
	function parse( date, format, separator ) {
		var year, month, day;
		var hours, minutes, seconds, amOrPm;
		var	yearToken, monthToken, dayToken;
		var hoursToken, minutesToken, secondsToken, amOrPmToken;
		var sections, dateFormat, dateSection, timeSection;
		var rs;

		var patterns = {
			day: /(D{1,2})/,
			month: /(M{1,2})/,
			year: /(YY(?:YY)?)/,
			hours: /(H{1,2}|h{1,2})/,
			minutes: /(m{1,2})/,
			seconds: /(s{1,2})/,
			amOrPm: /([Aa])/
		};

		// This means that all date tokens are required
		yearToken    = patterns.year.exec( format )[ 1 ];
		monthToken   = patterns.month.exec( format )[ 1 ];
		dayToken     = patterns.day.exec( format )[ 1 ];

		// The time format tokens are optional
		hoursToken   = ( rs = patterns.hours.exec( format ) ) ? rs[ 1 ] : "";
		minutesToken = ( rs = patterns.minutes.exec( format ) ) ? rs[ 1 ] : "";
		secondsToken = ( rs = patterns.seconds.exec( format ) ) ? rs[ 1 ] : "";
		amOrPmToken  = ( rs = patterns.amOrPm.exec( format ) ) ? rs[ 1 ] : "";

		sections     = date.split( " " );
		format       = format.split( " " );
		dateFormat   = format[ 0 ].split( separator );
		dateSection  = sections[ 0 ].split( separator );
		timeSection  = sections[ 1 ];
		amOrPm       = sections[ 2 ];

		year  = dateSection[ dateFormat.indexOf( yearToken ) ];
		month = dateSection[ dateFormat.indexOf( monthToken ) ];
		day   = dateSection[ dateFormat.indexOf( dayToken ) ];

		if ( timeSection ) {
			timeSection = timeSection.split( ":" );
			hours       = timeSection[ 0 ];
			minutes     = timeSection[ 1 ];
			seconds     = timeSection[ 2 ];
		}

		return {
			day: day,
			month: month,
			year: year,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			amOrPm: amOrPm,
			format: {
				date: format[ 0 ],
				time: format[ 1 ]
			},
			tokens: {
				day: dayToken,
				month: monthToken,
				year: yearToken,
				hours: hoursToken,
				minutes: minutesToken,
				seconds: secondsToken,
				amOrPm: amOrPmToken
			}
		};
	}

	/**
	 * Parse the given date and return a Date object
	 *
	 * @param value      The date value
	 * @param dateFormat The date format
	 * @param separator  The used separator
	 *
	 * @returns {Date}
	 */
	function getDate( date, format, separator ) {
		var result = parse( date, format, separator );
		var amOrPm  = result.tokens.amOrPm;
		var year    = getYear( result.year );
		var month   = result.month;
		var day     = result.day;
		var hours   = result.hours || 12;
		var minutes = result.minutes || 0;
		var seconds = result.seconds || 0;

		if ( result.format.time && amOrPm ) {
			if ( /am/i.test( amOrPm ) && hours === 12 ) {
				hours = +hours - 12;
			}

			if ( /pm/i.test( amOrPm ) && hours < 12 ) {
				hours = +hours + 12;
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
	 * @param data    The result returned from parse method
	 *
	 * @returns {boolean}  The validity of the passed date value.
	 */
	function dateHelper( data ) {
		var year, month, day;
		var yearLength, monthLength, dayLength;
		var yearToken, monthToken, dayToken;

		// Days number of each month.
		var monthsDays = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// Retrieve the year, the month & the day values.
		year  = data.year;
		month = data.month;
		day   = data.day;

		// Retrieve the year, the month & the day tokens.
		yearToken  = data.tokens.year;
		monthToken = data.tokens.month;
		dayToken   = data.tokens.day;

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
		}

		// Validate the day
		day   = parseInt( day, 10 );

		// If the year is leap, then update the number of days in February to 29 days
		if ( year % 400 === 0 || ( year % 100 !== 0 && year % 4 === 0 ) ) {
			monthsDays[ 1 ] = 29;
		}

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
			if ( dayLength !== 2 ) {
				return false;
			}
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
	 * @param data    The result returned from parse method
	 *
	 * @returns {boolean}  The validity of the passed time value.
	 */
	function timeHelper( data ) {
		var hours, minutes, seconds;
		var hoursToken, minutesToken, secondsToken;
		var hoursLength, minutesLength, secondsLength;
		var amOrPm, amOrPmValue;

		// Determine the time
		if ( data.format.time ) {
			amOrPm = data.tokens.amOrPm;
			amOrPmValue = data.amOrPm;

			// Get the hours, minutes and seconds tokens from the time format.
			hoursToken   = data.tokens.hours;
			minutesToken = data.tokens.minutes;
			secondsToken = data.tokens.seconds;

			if ( amOrPm ) {
				if ( amOrPm && hoursToken === hoursToken.toUpperCase() ) {
					throw new SyntaxError( "'A' and 'a' tokens are only intended to be used with 'h' or 'hh'." );
				}

				if ( !amOrPmValue ) {
					return false;
				}

				if ( amOrPm === "A" && !/^[AP]M$/.test( amOrPmValue ) ) {
					return false;
				}

				if ( amOrPm === "a" && !/^[ap]m$/.test( amOrPmValue ) ) {
					return false;
				}
			}

			// Retrieve the hours, the minutes & the seconds values.
			hours   = data.hours;
			minutes = data.minutes;
			seconds = data.seconds;

			// Hours & minutes are required, seconds required only when
			// using the full format: hours:minutes:seconds
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
					( hoursLength !== 1 && hoursToken === "h" ||
					 hoursLength !== 2 && hoursToken === "hh" ) ) {
					return false;
				}
				break;
			case ( "H" ):
			case ( "HH" ):
				if ( hours < 0 || hours > 23 ) {
					return false;
				}
				if ( hours > 0 && hours <= 9 &&
					( hoursLength !== 1 && hoursToken === "H" ||
					 hoursLength !== 2 && hoursToken === "HH" ) ) {
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
				( minutesLength !== 1 && minutesToken === "m" ||
				 minutesLength !== 2 && minutesToken === "mm" ) ) {
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
					( secondsLength !== 1 && secondsToken === "s" ||
					 secondsLength !== 2 && secondsToken === "ss" ) ) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * This function is based on the dateFormat function from the Date Format 1.2.3
	 * Credit to (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	 * MIT license
	 * see http://blog.stevenlevithan.com/archives/date-time-format for the complete lib
	 *
	 * Return the date string formatted following the format provided as param
	 *
	 * @param {Date} date      The date object to format
	 * @param {String} format  The date format
	 *
	 * @returns {String}
	 */
	function dateFormater( date, format ) {
		var	token = /D{1,2}|M{1,2}|YY(?:YY)?|([HhmsAa])\1?/g,
			pad = function( val ) {
				val = "" + val;
				while ( val.length < 2 ) {
					val = "0" + val;
				}
				return val;
			},
			amOrPm = function( hours, token ) {
				if ( token === "a" ) {
					return hours <= 12 ? "am" : "pm";
				}
				return hours <= 12 ? "AM" : "PM";
			}, flags;

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date( date ) : new Date();

		// This is not supposed to happen, but play it safe.
		if ( isNaN( date ) ) {
			throw new SyntaxError( "invalid date" );
		}

		flags = {
			D:    date.getDate(),
			DD:   pad( date.getDate() ),
			M:    date.getMonth() + 1,
			MM:   pad( date.getMonth() + 1 ),
			YY:   String( date.getFullYear() ).slice( 2 ),
			YYYY: date.getFullYear(),
			h:    date.getHours() % 12 || 12,
			hh:   pad( date.getHours() % 12 || 12 ),
			H:    date.getHours(),
			HH:   pad( date.getHours() ),
			m:    date.getMinutes(),
			mm:   pad( date.getMinutes() ),
			s:    date.getSeconds(),
			ss:   pad( date.getSeconds() ),
			a:    amOrPm( date.getHours(), "a" ),
			A:    amOrPm( date.getHours() )
		};

		return format.replace( token, function( match ) {
			return match in flags ? flags[ match ] : match.slice( 1, match.length - 1 );
		} );
	}

	/**
	 * Check lengths of corresponding sections
	 *    - Date format with date value
	 *    - Time format with time value
	 *
	 * @param value       The date value
	 * @param dateFormat  The date format
	 * @param separator   The used separator
	 *
	 * @returns {boolean} true if the data are consistent
	 *                    false, otherwise
	 */
	function checkLengths( value, format, separator ) {
		var values  = value.split( " " );
		var formats = format.split( " " );

		// Check if formats & values have the same length
		if ( formats.length !== values.length ) {
			return false;
		}

		var dateValues = values[ 0 ].split( separator );
		var dateTokens = formats[ 0 ].split( separator );

		// Check if date values & date formats have the same length
		if ( dateValues.length !== dateTokens.length ) {
			return false;
		}

		if ( formats[ 1 ] ) {
			var timeValues = values[ 1 ].split( ":" );
			var timeTokens = formats[ 1 ].split( ":" );

			// Check if timeValues has the same size as timeFormat
			if ( timeValues.length !== timeTokens.length ) {
				return false;
			}
		}

		return true;
	}

	/*
	 * dateValidator method:
	 *     check if the given date is valid following the given format.
	 *
	 * the 'options' param is an object literal and has the following structure:
	 *     {
	 *        format:    "The date format",     // Can be a string or an array of strings
	 *        separator: "The used separator",
	 *        minDate:   "The min date",        // Can be a string or a Date object
	 *        maxDate:   "The max date",        // Can be a string or a Date object
	 *     }
	 *
	 * Usage examples & docs: https://arkni.github.io/date-validator/
	 */
	$.validator.addMethod( "dateValidator", function( value, element, options ) {

		// If the field is optional, then exit with success
		if ( this.optional( element ) ) {
			return true;
		}

		// If options = true or options = {}
		// The user doesn't specify the format, the separator, neither the minDate & maxDate
		// Then use the default ones
		//    - format: DD/MM/YYYY
		//    - separator: /
		options = $.extend( {}, { format: "DD/MM/YYYY", separator: "/" }, options );

		var format = options.format;
		var separator = options.separator;
		var valid = true;
		var date, minDate, maxDate;
		var messages = $.validator.messages.dateValidatorMessages;

		// Set the default message
		$.validator.messages.dateValidator = messages[ "default" ]( format );

		// Check length of eatch section
		if ( !checkLengths( value, format, separator ) ) {
			return false;
		}

		// Parse the value and the format
		var data = parse( value, format, separator );

		// Check validity of the date and the time sections
		if ( !dateHelper( data ) || !timeHelper( data ) ) {
			return false;
		}

		date = getDate( value, format, separator );

		// Check if options.minDate was set
		if ( options.minDate ) {
			minDate = options.minDate instanceof Date ?
				options.minDate : getDate( options.minDate, format, separator );
		}

		// Check if maxDate was set
		if ( options.maxDate ) {
			maxDate = options.maxDate instanceof Date ?
				options.maxDate : getDate( options.maxDate, format, separator );
		}

		// Test for minDate and maxDate
		switch ( true ) {
		case ( options.minDate && !options.maxDate ):
			valid = date.getTime() >= minDate.getTime();

			// Format the minDate if it is an instance of Date object
			minDate = options.minDate instanceof Date ? dateFormater( minDate, format ) : options.minDate;

			// Set the new error message based on the minDate value.
			$.validator.messages.dateValidator = messages.minDate( minDate );
			break;

		case ( options.maxDate && !options.minDate ):
			valid = date.getTime() <= maxDate.getTime();

			// Format the maxDate if it is an instance of Date object
			maxDate = options.maxDate instanceof Date ? dateFormater( maxDate, format ) : options.maxDate;

			// Set the new error message based on the maxDate value.
			$.validator.messages.dateValidator = messages.maxDate( maxDate );
			break;

		case ( !!options.minDate && !!options.maxDate ):
			valid = date.getTime() >= minDate.getTime() && date.getTime() <= maxDate.getTime();

			// Format the minDate & the maxDate if they are instances of Date object
			minDate = options.minDate instanceof Date ? dateFormater( minDate, format ) : options.minDate;
			maxDate = options.maxDate instanceof Date ? dateFormater( maxDate, format ) : options.maxDate;

			// Set the new error message based on the minDate & maxDate values.
			$.validator.messages.dateValidator = messages.range( minDate, maxDate );
			break;
		}

		return valid;
	}, $.validator.messages.dateValidator );

	// Adding the dateValidator messages.
	$.extend( $.validator.messages, {
		dateValidatorMessages: {
			"default": $.validator.format( "Please enter a valid date, format {0}." ),
			minDate: $.validator.format( "Please enter a date after {0}." ),
			maxDate: $.validator.format( "Please enter a date before {0}." ),
			range: $.validator.format( "Please enter a date between {0} and {1}." )
		}
	} );
}() );
