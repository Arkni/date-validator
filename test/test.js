( function( $ ) {

	$.validator.defaults.debug = true;

	var method,
		methodTest = function( methodName ) {
			var v = $( "#form" ).validate(),
				method = $.validator.methods[ methodName ],
				element = $( "#datevalidator" )[ 0 ];

			return function( value, param ) {
				element.value = value;
				return method.call( v, value, element, param );
			};
		};

	QUnit.module( "date validator", {
		before: function() {
			method = methodTest( "dateValidator" );
		}
	} );

	// Default options are: { format: "DD/MM/YYYY", separator: "/" }
	QUnit.test( "Using the default format & separator", function( assert ) {

		// Options = true
		assert.ok( method( "29/12/2006", true ), "Valid date (options = true)" );
		assert.ok( !method( "29-07-2004", true ), "Invalid date (options = true)" );
		assert.ok( !method( "29.06.2011", true ), "Invalid date (options = true)" );
		assert.ok( !method( "31/04/2010", true ), "Invalid date (options = true)" );
		assert.ok( !method( "29/00/2001", true ), "Invalid date (options = true)" );

		// Options = {} : empty object
		assert.ok( method( "29/11/1998", {} ), "Valid date (options = {})" );
		assert.ok( !method( "29-11-2018", {} ), "Invalid date (options = {})" );
		assert.ok( !method( "29.11.2110", {} ), "Invalid date (options = {})" );
		assert.ok( !method( "31/04/2010", {} ), "Invalid date (options = {})" );
		assert.ok( !method( "029/00/1999", {} ), "Invalid date (options = {})" );
	} );

	QUnit.test( "YYYY{separator}MM{separator}DD", function( assert ) {
		assert.ok(
			method( "1986/11/29", {
				format: "YYYY/MM/DD",
				separator: "/"
			} ),
			"Valid date (Format: YYYY/MM/DD)"
		);
		assert.ok(
			method( "1885-12-31", {
				format: "YYYY-MM-DD",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD)"
		);
		assert.ok(
			method( "1887.12.31", {
				format: "YYYY.MM.DD",
				separator: "."
			} ),
			"Valid date (Format: YYYY.MM.DD)"
		);
		assert.ok(
			!method( "2002/06/32", {
				format: "YYYY/MM/DD",
				separator: "/"
			} ),
			"Invalid date (Format: YYYY/MM/DD)"
		);
		assert.ok(
			!method( "1989-09-31", {
				format: "YYYY-MM-DD",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD)"
		);
		assert.ok(
			!method( "1975.02.30", {
				format: "YYYY.MM.DD",
				separator: "."
			} ),
			"Invalid date (Format: YYYY.MM.DD)"
		);
	} );

	QUnit.test( "DD{separator}MM{separator}YYYY", function( assert ) {
		assert.ok(
			method( "29/12/2010", {
				format: "DD/MM/YYYY",
				separator: "/"
			} ),
			"Valid date (Format: DD/MM/YYYY)"
		);
		assert.ok(
			method( "29-08-2010", {
				format: "DD-MM-YYYY",
				separator: "-"
			} ),
			"Valid date (Format: DD-MM-YYYY)"
		);
		assert.ok(
			method( "29.09.2010", {
				format: "DD.MM.YYYY",
				separator: "."
			} ),
			"Valid date (Format: DD.MM.YYYY)"
		);
		assert.ok(
			!method( "31/06/1361", {
				format: "DD/MM/YYYY",
				separator: "/"
			} ),
			"Invalid date (Format: DD/MM/YYYY)"
		);
		assert.ok(
			!method( "31-02-2014", {
				format: "DD-MM-YYYY",
				separator: "-"
			} ),
			"Invalid date (Format: DD-MM-YYYY)"
		);
		assert.ok(
			!method( "31.04.2014", {
				format: "DD.MM.YYYY",
				separator: "."
			} ),
			"Invalid date (Format: DD.MM.YYYY)"
		);
	} );

	QUnit.test( "MM{separator}DD{separator}YYYY", function( assert ) {
		assert.ok(
			method( "12/27/2010", {
				format: "MM/DD/YYYY",
				separator: "/"
			} ),
			"Valid date (Format: MM/DD/YYYY)"
		);
		assert.ok(
			method( "11-15-2005", {
				format: "MM-DD-YYYY",
				separator: "-"
			} ),
			"Valid date (Format: MM-DD-YYYY)"
		);
		assert.ok(
			method( "11.11.2005", {
				format: "MM.DD.YYYY",
				separator: "."
			} ),
			"Valid date (Format: MM.DD.YYYY)"
		);
		assert.ok(
			!method( "06/31/1999", {
				format: "MM/DD/YYYY",
				separator: "/"
			} ),
			"Invalid date (Format: MM/DD/YYYY)"
		);
		assert.ok(
			!method( "02-30-2004", {
				format: "MM-DD-YYYY",
				separator: "-"
			} ),
			"Invalid date (Format: MM-DD-YYYY)"
		);
		assert.ok(
			!method( "04.31.2003", {
				format: "MM.DD.YYYY",
				separator: "."
			} ),
			"Invalid date (Format: MM.DD.YYYY)"
		);
	} );

	QUnit.test( "YY{separator}M{separator}D", function( assert ) {
		assert.ok(
			method( "86/1/29", {
				format: "YY/M/D",
				separator: "/"
			} ),
			"Valid date (Format: YY/M/D)"
		);
		assert.ok(
			method( "85-2-1", {
				format: "YY-M-D",
				separator: "-"
			} ),
			"Valid date (Format: YY-M-D)"
		);
		assert.ok(
			method( "87.12.31", {
				format: "YY.M.D",
				separator: "."
			} ),
			"Valid date (Format: YY.M.D)"
		);
		assert.ok(
			!method( "5/06/13", {
				format: "YY/M/D",
				separator: "/"
			} ),
			"Invalid date (Format: YY/M/D)"
		);
		assert.ok(
			!method( "14-09-29", {
				format: "YY-M-D",
				separator: "-"
			} ),
			"Invalid date (Format: YY-M-D)"
		);
		assert.ok(
			!method( "75.2.01", {
				format: "YY.M.D",
				separator: "."
			} ),
			"Invalid date (Format: YY.M.D)"
		);
	} );

	QUnit.test( "D{separator}M{separator}YY", function( assert ) {
		assert.ok(
			method( "29/12/10", {
				format: "D/M/YY",
				separator: "/"
			} ),
			"Valid date (Format: D/M/YY)"
		);
		assert.ok(
			method( "29-8-10", {
				format: "D-M-YY",
				separator: "-"
			} ),
			"Valid date (Format: D-M-YY)"
		);
		assert.ok(
			method( "9.9.10", {
				format: "D.M.YY",
				separator: "."
			} ),
			"Valid date (Format: D.M.YY)"
		);
		assert.ok(
			!method( "11/10/1", {
				format: "D/M/YY",
				separator: "/"
			} ),
			"Invalid date (Format: D/M/YY)"
		);
		assert.ok(
			!method( "31-02-14", {
				format: "D-M-YY",
				separator: "-"
			} ),
			"Invalid date (Format: D-M-YY)"
		);
		assert.ok(
			!method( "01.11.14", {
				format: "D.M.YY",
				separator: "."
			} ),
			"Invalid date (Format: D.M.YY)"
		);
	} );

	QUnit.test( "M{separator}D{separator}YY", function( assert ) {
		assert.ok(
			method( "12/27/10", {
				format: "M/D/YY",
				separator: "/"
			} ),
			"Valid date (Format: M/D/YY)"
		);
		assert.ok(
			method( "11-5-05", {
				format: "M-D-YY",
				separator: "-"
			} ),
			"Valid date (Format: M-D-YY)"
		);
		assert.ok(
			method( "1.11.05", {
				format: "M.D.YY",
				separator: "."
			} ),
			"Valid date (Format: M.D.YY)"
		);
		assert.ok(
			!method( "12/31/9", {
				format: "M/D/YY",
				separator: "/"
			} ),
			"Invalid date (Format: M/D/YY)"
		);
		assert.ok(
			!method( "02-27-04", {
				format: "M-D-YY",
				separator: "-"
			} ),
			"Invalid date (Format: M-D-YY)"
		);
		assert.ok(
			!method( "10.01.03", {
				format: "M.D.YY",
				separator: "."
			} ),
			"Invalid date (Format: M.D.YY)"
		);
	} );

	QUnit.test( "Datetime values", function( assert ) {

		// Format: (we will test only one format)
		//     YYYY-MM-DD HH:mm
		assert.ok(
			method( "1885-12-31 12:01", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			!method( "1885-12-31 24:60", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			!method( "1885-12-31 :", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			!method( "1885-12-31 12:", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			!method( "1885-12-31 :59", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm)"
		);

		// Formats:
		//     YYYY-MM-DD hh:mm A
		//     YYYY-MM-DD hh:mm a
		assert.ok(
			method( "1885-12-31 02:01 AM", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			method( "1885-12-31 01:15 PM", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			method( "1885-12-31 11:59 am", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm a)"
		);
		assert.ok(
			method( "1885-12-31 12:00 pm", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm a)"
		);
		assert.ok(
			!method( "1885-12-31 13:00 AM", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			!method( "1885-12-31 21:15 PM", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			!method( "1885-12-31 01:00 A", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			!method( "1885-12-31 01:15 PP", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			!method( "1885-12-31 01:00 ", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			!method( "1885-12-31 01:15", {
				format: "YYYY-MM-DD hh:mm A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm A)"
		);
		assert.ok(
			!method( "1885-12-31 19:59 am", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm a)"
		);
		assert.ok(
			!method( "1885-12-31 15:00 pm", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm a)"
		);
		assert.ok(
			!method( "1885-12-31 01:59 a", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm a)"
		);
		assert.ok(
			!method( "1885-12-31 12:00 m", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm a)"
		);
		assert.ok(
			!method( "1885-12-31 01:59 ", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm a)"
		);
		assert.ok(
			!method( "1885-12-31 12:00", {
				format: "YYYY-MM-DD hh:mm a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm a)"
		);

		// Format:
		//     YYYY-MM-DD HH:mm:ss
		assert.ok(
			method( "1885-12-31 12:01:00", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 22:60:59", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 ::", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 12::", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 :15:", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 ::10", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 12:15:", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 12::15", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "1885-12-31 :12:15", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD HH:mm:ss)"
		);

		// Formats:
		//     YYYY-MM-DD hh:mm:ss A
		//     YYYY-MM-DD hh:mm:ss a
		assert.ok(
			method( "1885-12-31 02:01:59 AM", {
				format: "YYYY-MM-DD hh:mm:ss A",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm:ss A)"
		);
		assert.ok(
			method( "1885-12-31 01:15:59 PM", {
				format: "YYYY-MM-DD hh:mm:ss A",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm:ss A)"
		);
		assert.ok(
			method( "1885-12-31 11:59:59 am", {
				format: "YYYY-MM-DD hh:mm:ss a",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm:ss a)"
		);
		assert.ok(
			method( "1885-12-31 12:00:59 pm", {
				format: "YYYY-MM-DD hh:mm:ss a",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD hh:mm:ss a)"
		);
		assert.ok(
			!method( "1885-12-31 13:00:19 AM", {
				format: "YYYY-MM-DD hh:mm:ss A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss A)"
		);
		assert.ok(
			!method( "1885-12-31 21:15:19 PM", {
				format: "YYYY-MM-DD hh:mm:ss A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss A)"
		);
		assert.ok(
			!method( "1885-12-31 01:00:19 A", {
				format: "YYYY-MM-DD hh:mm:ss A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss A)"
		);
		assert.ok(
			!method( "1885-12-31 01:15:19 PP", {
				format: "YYYY-MM-DD hh:mm:ss A",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss A)"
		);
		assert.ok(
			!method( "1885-12-31 19:59:19 am", {
				format: "YYYY-MM-DD hh:mm:ss a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss a)"
		);
		assert.ok(
			!method( "1885-12-31 15:00:19 pm", {
				format: "YYYY-MM-DD hh:mm:ss a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss a)"
		);
		assert.ok(
			!method( "1885-12-31 01:59:19 a", {
				format: "YYYY-MM-DD hh:mm:ss a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss a)"
		);
		assert.ok(
			!method( "1885-12-31 12:00:19 m", {
				format: "YYYY-MM-DD hh:mm:ss a",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD hh:mm:ss a)"
		);

		// Format: (we will test only one format)
		//     YYYY-MM-DD H:m:s
		assert.ok(
			method( "1885-12-31 2:1:9", {
				format: "YYYY-MM-DD H:m:s",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD H:m:s)"
		);
		assert.ok(
			!method( "1885-12-31 01:13:20", {
				format: "YYYY-MM-DD H:m:s",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD H:m:s)"
		);
		assert.ok(
			!method( "1885-12-31 22:09:59", {
				format: "YYYY-MM-DD H:m:s",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD H:m:s)"
		);
		assert.ok(
			!method( "1885-12-31 23:13:02", {
				format: "YYYY-MM-DD H:m:s",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD H:m:s)"
		);

		// Format: (we will test only one format)
		//     YYYY-MM-DD h:m:s
		assert.ok(
			method( "1885-12-31 2:1:9", {
				format: "YYYY-MM-DD h:m:s",
				separator: "-"
			} ),
			"Valid date (Format: YYYY-MM-DD h:m:s)"
		);
		assert.ok(
			!method( "1885-12-31 01:13:20", {
				format: "YYYY-MM-DD h:m:s",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD h:m:s)"
		);
		assert.ok(
			!method( "1885-12-31 22:29:59", {
				format: "YYYY-MM-DD h:m:s",
				separator: "-"
			} ),
			"Invalid date (Format: YYYY-MM-DD h:m:s)"
		);
	} );

	QUnit.test( "MinDate", function( assert ) {

		// Using a date string
		assert.ok(
			method( "29/12/2012", {
				minDate: "31/01/2012"
			} ),
			"Valid min date (Using default format & separator)"
		);
		assert.ok(
			!method( "15/11/2011", {
				minDate: "31/03/2012"
			} ),
			"Invalid min date (Using default format & separator)"
		);

		// Using a date object
		assert.ok(
			method( "29/12/2012", {
				minDate: new Date( 2012, 3, 31 )
			} ),
			"Valid min date object (Using default format & separator)"
		);
		assert.ok(
			!method( "15/11/2011", {
				minDate: new Date( 2014, 1, 18 )
			} ),
			"Invalid min date object (Using default format & separator)"
		);

		// Using other formats & date string
		assert.ok(
			method( "12/29/2012", {
				format: "MM/DD/YYYY",
				separator: "/",
				minDate: "01/31/2012"
			} ),
			"Valid min date (Format: MM/DD/YYYY)"
		);
		assert.ok(
			method( "2007-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: "2007-01-31"
			} ),
			"Valid min date (Format: YYYY-MM-DD)"
		);
		assert.ok(
			method( "12/29/2012 15:00", {
				format: "MM/DD/YYYY HH:mm",
				separator: "/",
				minDate: "01/31/2012 12:00"
			} ),
			"Valid min date (Format: MM/DD/YYYY HH:mm)"
		);
		assert.ok(
			method( "2007-12-31 23:59", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-",
				minDate: "2007-01-31 23:59"
			} ),
			"Valid min date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			method( "12/29/2012 15:00:00", {
				format: "MM/DD/YYYY HH:mm:ss",
				separator: "/",
				minDate: "01/31/2012 12:00:00"
			} ),
			"Valid min date (Format: MM/DD/YYYY HH:mm:ss)"
		);
		assert.ok(
			method( "2007-12-31 23:59:59", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-",
				minDate: "2007-01-31 23:59:59"
			} ),
			"Valid min date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "12/29/2011", {
				format: "MM/DD/YYYY",
				separator: "/",
				minDate: "01/31/2012"
			} ),
			"Invalid min date (Format: MM/DD/YYYY)"
		);
		assert.ok(
			!method( "2008-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: "2010-01-31"
			} ),
			"Invalid min date (Format: YYYY-MM-DD)"
		);
		assert.ok(
			!method( "12/29/2011 15:00", {
				format: "MM/DD/YYYY HH:mm",
				separator: "/",
				minDate: "01/31/2012 12:00"
			} ),
			"Invalid min date (Format: MM/DD/YYYY HH:mm)"
		);
		assert.ok(
			!method( "2007-01-30 23:59", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-",
				minDate: "2007-01-31 23:59"
			} ),
			"Invalid min date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			!method( "01/31/2012 11:59:59", {
				format: "MM/DD/YYYY HH:mm:ss",
				separator: "/",
				minDate: "01/31/2012 12:00:00"
			} ),
			"Invalid min date (Format: MM/DD/YYYY HH:mm:ss)"
		);
		assert.ok(
			!method( "2007-01-31 23:59:58", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-",
				minDate: "2007-01-31 23:59:59"
			} ),
			"Invalid min date (Format: YYYY-MM-DD HH:mm:ss)"
		);

		// Using other formats & date object
		assert.ok(
			method( "12/29/2012", {
				format: "MM/DD/YYYY",
				separator: "/",
				minDate: new Date( 2012, 0, 31 )
			} ),
			"Valid min date object (Format: MM/DD/YYYY)"
		);
		assert.ok(
			method( "2007-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: new Date( 2007, 0, 31 )
			} ),
			"Valid min date object (Format: YYYY-MM-DD)"
		);
		assert.ok(
			!method( "12/29/2011", {
				format: "MM/DD/YYYY",
				separator: "/",
				minDate: new Date( 2012, 1, 15 )
			} ),
			"Invalid min date object (Format: MM/DD/YYYY)"
		);
		assert.ok(
			!method( "2008-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: new Date( 2009, 11, 31 )
			} ),
			"Invalid min date object (Format: YYYY-MM-DD)"
		);
	} );

	QUnit.test( "MaxDate", function( assert ) {

		// Using a date string
		assert.ok(
			method( "29/12/2014", {
				maxDate: "31/01/2015"
			} ),
			"Valid max date (Using default format & separator)"
		);
		assert.ok(
			!method( "15/11/2013", {
				maxDate: "31/03/2012"
			} ),
			"Invalid max date (Using default format & separator)"
		);

		// Using a date object
		assert.ok(
			method( "29/12/2014", {
				maxDate: new Date( 2015, 1, 21 )
			} ),
			"Valid max date object (Using default format & separator)"
		);
		assert.ok(
			!method( "15/11/2013", {
				maxDate: new Date( 2012, 2, 15 )
			} ),
			"Invalid max date object (Using default format & separator)"
		);

		// Using other formats & date string
		assert.ok(
			method( "29/12/2012", {
				format: "DD/MM/YYYY",
				separator: "/",
				maxDate: "31/01/2014"
			} ),
			"Valid max date (Format: DD/MM/YYYY)"
		);
		assert.ok(
			method( "2013-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				maxDate: "2014-05-31"
			} ),
			"Valid max date (Format: YYYY-MM-DD)"
		);
		assert.ok(
			method( "12/29/2011 15:00", {
				format: "MM/DD/YYYY HH:mm",
				separator: "/",
				maxDate: "01/31/2012 12:00"
			} ),
			"Valid max date (Format: MM/DD/YYYY HH:mm)"
		);
		assert.ok(
			method( "2006-12-31 23:59", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-",
				maxDate: "2007-01-31 23:59"
			} ),
			"Valid max date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			method( "12/29/2011 15:00:00", {
				format: "MM/DD/YYYY HH:mm:ss",
				separator: "/",
				maxDate: "01/31/2012 12:00:00"
			} ),
			"Valid max date (Format: MM/DD/YYYY HH:mm:ss)"
		);
		assert.ok(
			method( "2007-01-30 23:59:59", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-",
				maxnDate: "2007-01-31 23:59:59"
			} ),
			"Valid max date (Format: YYYY-MM-DD HH:mm:ss)"
		);
		assert.ok(
			!method( "29/12/2015", {
				format: "DD/MM/YYYY",
				separator: "/",
				maxDate: "31/01/2012"
			} ),
			"Invalid max date (Format: DD/MM/YYYY)"
		);
		assert.ok(
			!method( "2015-02-19", {
				format: "YYYY-MM-DD",
				separator: "-",
				maxDate: "2014-05-31"
			} ),
			"Invalid max date (Format: YYYY-MM-DD)"
		);
		assert.ok(
			!method( "12/31/2012 12:00", {
				format: "MM/DD/YYYY HH:mm",
				separator: "/",
				maxDate: "01/31/2012 12:00"
			} ),
			"Invalid max date (Format: MM/DD/YYYY HH:mm)"
		);
		assert.ok(
			!method( "2007-01-31 23:59", {
				format: "YYYY-MM-DD HH:mm",
				separator: "-",
				maxDate: "2007-01-31 23:58"
			} ),
			"Invalid max date (Format: YYYY-MM-DD HH:mm)"
		);
		assert.ok(
			!method( "01/31/2012 12:00:00", {
				format: "MM/DD/YYYY HH:mm:ss",
				separator: "/",
				maxDate: "01/31/2012 11:59:59"
			} ),
			"Invalid max date (Format: MM/DD/YYYY HH:mm:ss)"
		);
		assert.ok(
			!method( "2007-01-31 23:59:59", {
				format: "YYYY-MM-DD HH:mm:ss",
				separator: "-",
				maxDate: "2007-01-31 23:59:58"
			} ),
			"Invalid max date (Format: YYYY-MM-DD HH:mm:ss)"
		);

		// Using other formats & date object
		assert.ok(
			method( "12/29/2010", {
				format: "MM/DD/YYYY",
				separator: "/",
				maxDate: new Date( 2014, 0, 31 )
			} ),
			"Valid max date object (Format: MM/DD/YYYY)"
		);
		assert.ok(
			method( "2011-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				maxDate: new Date( 2013, 0, 31 )
			} ),
			"Valid max date object (Format: YYYY-MM-DD)"
		);
		assert.ok(
			!method( "12/29/2013", {
				format: "MM/DD/YYYY",
				separator: "/",
				maxDate: new Date( 2012, 1, 15 )
			} ),
			"Invalid max date object (Format: MM/DD/YYYY)"
		);
		assert.ok(
			!method( "2011-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				maxDate: new Date( 2010, 11, 31 )
			} ),
			"Invalid max date object (Format: YYYY-MM-DD)"
		);
	} );

	QUnit.test( "Range of dates", function( assert ) {

		// Using a date string
		assert.ok(
			method( "29/07/2013", {
				minDate: "31/01/2012",
				maxDate: "31/01/2014"
			} ),
			"Valid range date string (Using default format & separator)"
		);
		assert.ok(
			!method( "15/11/2013", {
				minDate: "31/03/2012",
				maxDate: "31/03/2013"
			} ),
			"Invalid range date string (Using default format & separator)"
		);

		// Using a date object
		assert.ok(
			method( "29/07/2013", {
				minDate: new Date( 2012, 0, 31 ),
				maxDate: new Date( 2014, 0, 31 )
			} ),
			"Valid range date object (Using default format & separator)"
		);
		assert.ok(
			!method( "15/11/2013", {
				minDate: new Date( 2012, 2, 2012 ),
				maxDate: new Date( 2013, 2, 31 )
			} ),
			"Invalid range date object (Using default format & separator)"
		);

		// Using other formats & date string
		assert.ok(
			method( "29/12/2012", {
				format: "DD/MM/YYYY",
				separator: "/",
				minDate: "31/01/2012",
				maxDate: "31/01/2014"
			} ),
			"Valid range date (Format: DD/MM/YYYY)"
		);
		assert.ok(
			method( "2013-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: "2013-05-31",
				maxDate: "2014-05-31"
			} ),
			"Valid range date (Format: YYYY-MM-DD)"
		);
		assert.ok(
			!method( "29/12/2015", {
				format: "DD/MM/YYYY",
				separator: "/",
				minDate: "31/01/2012",
				maxDate: "31/05/2012"
			} ),
			"Invalid range date (Format: DD/MM/YYYY)"
		);
		assert.ok(
			!method( "2012-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: "2013-05-31",
				maxDate: "2014-05-31"
			} ),
			"Valid range date (Format: YYYY-MM-DD)"
		);

		// Using other formats & date object
		assert.ok(
			method( "12/29/2012", {
				format: "MM/DD/YYYY",
				separator: "/",
				minDate: new Date( 2012, 0, 31 ),
				maxDate: new Date( 2014, 0, 31 )
			} ),
			"Valid range date object (Format: DD/MM/YYYY)"
		);
		assert.ok(
			method( "2013-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: new Date( 2013, 4, 21 ),
				maxDate: new Date( 2014, 4, 21 )
			} ),
			"Valid range date object (Format: YYYY-MM-DD)"
		);
		assert.ok(
			!method( "12/29/2015", {
				format: "MM/DD/YYYY",
				separator: "/",
				minDate: new Date( 2012, 0, 25 ),
				maxDate: new Date( 2012, 4, 29 )
			} ),
			"Invalid range date object (Format: DD/MM/YYYY)"
		);
		assert.ok(
			!method( "2012-12-31", {
				format: "YYYY-MM-DD",
				separator: "-",
				minDate: new Date( 2013, 4, 31 ),
				maxDate: new Date( 2014, 4, 31 )
			} ),
			"Valid range date object (Format: YYYY-MM-DD)"
		);
	} );

} )( jQuery );
