(function($) {

function methodTest( methodName ) {
	var v = jQuery( "#form" ).validate(),
		method = $.validator.methods[ methodName ],
		element = $( "#datevalidator" )[ 0 ];

	return function( value, param ) {
		element.value = value;
		return method.call( v, value, element, param );
	};
}

jQuery.validator.defaults.debug = true;

module("additional methods");

test("dateValidator", function() {
	var method = methodTest("dateValidator");

	// The field is optional
	// One assertion suffice to test this case
	ok( method( "", true ), "Valid date dateValidator (The field is optional)" );

	// Test using an array of formats
	ok( method(
		"04.12.2003",
		{
			format: [ "DD.MM.YYYY", "D.M.YYYY",  "D.MM.YYYY",  "DD.M.YYYY", "DD.MM.YY", "D.MM.YY", "DD.M.YY", "D.M.YY" ],
			separator: "."
		}
	), "Valid (Array of formats)" );
	ok( !method(
		"32.12.2003",
		{
			format: [ "DD.MM.YYYY", "D.M.YYYY",  "D.MM.YYYY",  "DD.M.YYYY", "DD.MM.YY", "D.MM.YY", "DD.M.YY", "D.M.YY" ],
			separator: "."
		}
	), "Invalid (Array of formats)" );

	// Array of format with minDate, maxDate & outputFormat options
	ok( method(
		"1.1.14",
		{
			format: [ "DD.MM.YYYY", "D.M.YY" ],
			separator: ".",
			minDate: "21.01.1900",
			maxDate: "31.12.2015",
			outputFormat: "DD.MM.YYYY"
		}
	), "Valid date dateValidator (Format: D.M.YY)" );
	equal( "01.01.2014", $("#datevalidator").val() );

	// Using the format D-M-YY
	ok( method( "9-1-15", { format: "D-M-YY", separator: "-" } ), "Valid date dateValidator (Format: D-M-YY)" );

	// Test using the options.outputFormat param
	//     format: D/M/YYYY
	//     outputFormat: DD/MM/YYYY
	//     separator: /
	ok( method(
		"1/1/2014",
		{
			format: "D/M/YYYY", outputFormat: "DD/MM/YYYY", separator: "/"
		}
	), "Valid date dateValidator (Format: DD/MM/YYYY, outputFormat: DD/MM/YYYY)" );
	equal( "01/01/2014", $("#datevalidator").val() );

	// Using
	//     format: "D-M-YYYY"
	//     separator: "-"
	//     outputFormat: "DD-MM-YYYY"
	ok( method(
		"1-1-2014",
		{
			format: "D-M-YYYY", outputFormat: "DD-MM-YYYY", separator: "-"
		}
	), "Valid date dateValidator (Format: D-M-YYYY, outputFormat: DD-MM-YYYY)" );
	equal( "01-01-2014", $("#datevalidator").val() );

	// Using the default format & separator
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// options = true
	ok( method( "29/12/2006", true ), "Valid date dateValidator (Using default format & separator, options = true)" );
	ok( !method( "29-07-2004", true ), "Invalid date dateValidator (Using default format & separator, options = true)" );
	ok( !method( "29.06.2011", true ), "Invalid date dateValidator (Using default format & separator, options = true)" );
	ok( !method( "31/04/2010", true ), "Invalid date dateValidator (Using default format & separator, options = true)" );
	ok( !method( "29/00/2001", true ), "Invalid date dateValidator (Using default format & separator, options = true)" );

	// Using the default format & separator
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// options = {} : empty object
	ok( method( "29/11/1998", {} ), "Valid date dateValidator (Using default format & separator, options = {})" );
	ok( !method( "29-11-2018", {} ), "Invalid date dateValidator (Using default format & separator, options = {})" );
	ok( !method( "29.11.2110", {} ), "Invalid date dateValidator (Using default format & separator, options = {})" );
	ok( !method( "31/04/2010", {} ), "Invalid date dateValidator (Using default format & separator, options = {})" );
	ok( !method( "029/00/1999", {} ), "Invalid date dateValidator (Using default format & separator, options = {})" );

	// YYYY{separator}MM{separator}DD
	ok( method( "1986/11/29", { format: "YYYY/MM/DD", separator: "/" } ), "Valid date dateValidator (Format: YYYY/MM/DD)" );
	ok( method( "1885-12-31", { format: "YYYY-MM-DD", separator: "-" } ), "Valid date dateValidator (Format: YYYY-MM-DD)" );
	ok( method( "1887.12.31", { format: "YYYY.MM.DD", separator: "." } ), "Valid date dateValidator (Format: YYYY.MM.DD)" );
	ok( !method( "2002/06/32", { format: "YYYY/MM/DD", separator: "/" } ), "Invalid date dateValidator (Format: YYYY/MM/DD)" );
	ok( !method( "1989-09-31", { format: "YYYY-MM-DD", separator: "-" } ), "Invalid date dateValidator (Format: YYYY-MM-DD)" );
	ok( !method( "1975.02.30", { format: "YYYY.MM.DD", separator: "." } ), "Invalid date dateValidator (Format: YYYY.MM.DD)" );

	// DD{separator}MM{separator}YYYY
	ok( method( "29/12/2010", { format: "DD/MM/YYYY", separator: "/" } ), "Valid date dateValidator (Format: DD/MM/YYYY)" );
	ok( method( "29-08-2010", { format: "DD-MM-YYYY", separator: "-" } ), "Valid date dateValidator (Format: DD-MM-YYYY)" );
	ok( method( "29.09.2010", { format: "DD.MM.YYYY", separator: "." } ), "Valid date dateValidator (Format: DD.MM.YYYY)" );
	ok( !method( "31/06/1361", { format: "DD/MM/YYYY", separator: "/" } ), "Invalid date dateValidator (Format: DD/MM/YYYY)" );
	ok( !method( "31-02-2014", { format: "DD-MM-YYYY", separator: "-" } ), "Invalid date dateValidator (Format: DD-MM-YYYY)" );
	ok( !method( "31.04.2014", { format: "DD.MM.YYYY", separator: "." } ), "Invalid date dateValidator (Format: DD.MM.YYYY)" );

	// MM{separator}DD{separator}YYYY
	ok( method( "12/27/2010", { format: "MM/DD/YYYY", separator: "/" } ), "Valid date dateValidator (Format: MM/DD/YYYY)" );
	ok( method( "11-15-2005", { format: "MM-DD-YYYY", separator: "-" } ), "Valid date dateValidator (Format: MM-DD-YYYY)" );
	ok( method( "11.11.2005", { format: "MM.DD.YYYY", separator: "." } ), "Valid date dateValidator (Format: MM.DD.YYYY)" );
	ok( !method( "06/31/1999", { format: "MM/DD/YYYY", separator: "/" } ), "Invalid date dateValidator (Format: MM/DD/YYYY)" );
	ok( !method( "02-30-2004", { format: "MM-DD-YYYY", separator: "-" } ), "Invalid date dateValidator (Format: MM-DD-YYYY)" );
	ok( !method( "04.31.2003", { format: "MM.DD.YYYY", separator: "." } ), "Invalid date dateValidator (Format: MM.DD.YYYY)" );

	// Test minDate
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// Using a date string
	ok( method( "29/12/2012", { minDate: "31/01/2012" } ), "Valid min date dateValidator (Using default format & separator)" );
	ok( !method( "15/11/2011", { minDate: "31/03/2012" } ), "Invalid min date dateValidator (Using default format & separator)" );

	// Test minDate
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// Using a date object
	ok( method( "29/12/2012", { minDate: new Date( 2012, 3, 31 ) } ), "Valid min date object dateValidator (Using default format & separator)" );
	ok( !method( "15/11/2011", { minDate: new Date( 2014, 1, 18 ) } ), "Invalid min date object dateValidator (Using default format & separator)" );

	// Test minDate
	// Using other formats & date string
	ok( method( "12/29/2012", { format: "MM/DD/YYYY", separator: "/", minDate: "01/31/2012" } ), "Valid min date dateValidator (Format: MM/DD/YYYY)" );
	ok( method( "2007-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: "2007-01-31" } ), "Valid min date dateValidator (Format: YYYY-MM-DD)" );
	ok( !method( "12/29/2011", { format: "MM/DD/YYYY", separator: "/", minDate: "01/31/2012" } ), "Invalid min date dateValidator (Format: MM/DD/YYYY)" );
	ok( !method( "2008-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: "2010-01-31" } ), "Invalid min date dateValidator (Format: YYYY-MM-DD)" );

	// Test minDate
	// Using other formats & date object
	ok( method( "12/29/2012", { format: "MM/DD/YYYY", separator: "/", minDate: new Date( 2012, 0, 31 ) } ), "Valid min date object dateValidator (Format: MM/DD/YYYY)" );
	ok( method( "2007-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: new Date( 2007, 0, 31 ) } ), "Valid min date object dateValidator (Format: YYYY-MM-DD)" );
	ok( !method( "12/29/2011", { format: "MM/DD/YYYY", separator: "/", minDate: new Date( 2012, 1, 15 ) } ), "Invalid min date object dateValidator (Format: MM/DD/YYYY)" );
	ok( !method( "2008-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: new Date( 2009, 11, 31 ) } ), "Invalid min date object dateValidator (Format: YYYY-MM-DD)" );

	// Test maxDate
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// Using a date string
	ok( method( "29/12/2014", { maxDate: "31/01/2015" } ), "Valid max date dateValidator (Using default format & separator)" );
	ok( !method( "15/11/2013", { maxDate: "31/03/2012" } ), "Invalid max date dateValidator (Using default format & separator)" );

	// Test maxDate
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// Using a date object
	ok( method( "29/12/2014", { maxDate: new Date( 2015, 1, 21 ) } ), "Valid max date object dateValidator (Using default format & separator)" );
	ok( !method( "15/11/2013", { maxDate: new Date( 2012, 2, 15 ) } ), "Invalid max date object dateValidator (Using default format & separator)" );

	// Test maxDate
	// Using other formats & date string
	ok( method( "29/12/2012", { format: "DD/MM/YYYY", separator: "/", maxDate: "31/01/2014" } ), "Valid max date dateValidator (Format: DD/MM/YYYY)" );
	ok( method( "2013-12-31", { format: "YYYY-MM-DD", separator: "-", maxDate: "2014-05-31" } ), "Valid max date dateValidator (Format: YYYY-MM-DD)" );
	ok( !method( "29/12/2015", { format: "DD/MM/YYYY", separator: "/", maxDate: "31/01/2012" } ), "Invalid max date dateValidator (Format: DD/MM/YYYY)" );
	ok( !method( "2015-02-19", { format: "YYYY-MM-DD", separator: "-", maxDate: "2014-05-31" } ), "Invalid max date dateValidator (Format: YYYY-MM-DD)" );

	// Test maxDate
	// Using other formats & date object
	ok( method( "12/29/2010", { format: "MM/DD/YYYY", separator: "/", maxDate: new Date( 2014, 0, 31 ) } ), "Valid max date object dateValidator (Format: MM/DD/YYYY)" );
	ok( method( "2011-12-31", { format: "YYYY-MM-DD", separator: "-", maxDate: new Date( 2013, 0, 31 ) } ), "Valid max date object dateValidator (Format: YYYY-MM-DD)" );
	ok( !method( "12/29/2013", { format: "MM/DD/YYYY", separator: "/", maxDate: new Date( 2012, 1, 15 ) } ), "Invalid max date object dateValidator (Format: MM/DD/YYYY)" );
	ok( !method( "2011-12-31", { format: "YYYY-MM-DD", separator: "-", maxDate: new Date( 2010, 11, 31 ) } ), "Invalid max date object dateValidator (Format: YYYY-MM-DD)" );

	// Test range date
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// Using a date string
	ok( method( "29/07/2013", { minDate: "31/01/2012", maxDate: "31/01/2014" } ), "Valid range date dateValidator (Using default format & separator)" );
	ok( !method( "15/11/2013", { minDate: "31/03/2012", maxDate: "31/03/2013" } ), "Invalid range date dateValidator (Using default format & separator)" );

	// Test range date
	// Default is: { format: "DD/MM/YYYY", separator: "/" }
	// Using a date object
	ok( method( "29/07/2013", { minDate: new Date( 2012, 0, 31 ), maxDate: new Date( 2014, 0, 31 ) } ), "Valid range date object dateValidator (Using default format & separator)" );
	ok( !method( "15/11/2013", { minDate: new Date( 2012, 2, 2012 ), maxDate: new Date( 2013, 2, 31 ) } ), "Invalid range date object dateValidator (Using default format & separator)" );

	// Test range date
	// Using other formats & date string
	ok( method( "29/12/2012", { format: "DD/MM/YYYY", separator: "/", minDate: "31/01/2012", maxDate: "31/01/2014" } ), "Valid range date dateValidator (Format: DD/MM/YYYY)" );
	ok( method( "2013-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: "2013-05-31", maxDate: "2014-05-31" } ), "Valid range date dateValidator (Format: YYYY-MM-DD)" );
	ok( !method( "29/12/2015", { format: "DD/MM/YYYY", separator: "/", minDate: "31/01/2012", maxDate: "31/05/2012" } ), "Invalid range date dateValidator (Format: DD/MM/YYYY)" );
	ok( !method( "2012-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: "2013-05-31", maxDate: "2014-05-31" } ), "Valid range date dateValidator (Format: YYYY-MM-DD)" );

	// Test range date
	// Using other formats & date object
	ok( method( "12/29/2012", { format: "MM/DD/YYYY", separator: "/", minDate: new Date( 2012, 0, 31 ), maxDate: new Date( 2014, 0, 31 ) } ), "Valid range date object dateValidator (Format: DD/MM/YYYY)" );
	ok( method( "2013-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: new Date( 2013, 4, 21 ), maxDate: new Date( 2014, 4, 21 ) } ), "Valid range date object dateValidator (Format: YYYY-MM-DD)" );
	ok( !method( "12/29/2015", { format: "MM/DD/YYYY", separator: "/", minDate: new Date( 2012, 0, 25 ), maxDate: new Date( 2012, 4, 29 ) } ), "Invalid range date object dateValidator (Format: DD/MM/YYYY)" );
	ok( !method( "2012-12-31", { format: "YYYY-MM-DD", separator: "-", minDate: new Date( 2013, 4, 31 ), maxDate: new Date( 2014, 4, 31 ) } ), "Valid range date object dateValidator (Format: YYYY-MM-DD)" );
});

})(jQuery);
