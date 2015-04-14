#### dateValidator:
     check if the given date is valid following the given format
     the date format can be:
         - YYYY/MM/DD
         - YYYY-MM-DD
         - YYYY.MM.DD
         - DD/MM/YYYY
         - DD-MM-YYYY
         - DD.MM.YYYY
         - ...
 the `options` param is a JSON like object and has the following structure:

 ```js
 {
    format:    "The date format",    // Can be a string or an array of strings
    separator: "The used separator", // Can be '/', '-', '.'
    minDate:   "The min date",       // Can be a string or a Date object
    maxDate:   "The max date"        // Can be a string or a Date object
 }
 ```

#### Usage example:
* Using default format & separator:

```js
// Using 'true' or an empty object {} instead of the 'options' param
dateInput: {
    dateValidator: true // Or {}
}
```

```js
// Or Use the 'minDate' and/or the 'maxDate' like the following
dateInput: {
    dateValidator: {
        minDate: "31/01/2014",  // Or new Date( 2014, 0, 31 )
        maxDate: "31/01/2016"   // Or new Date( 2016, 0, 31 )
    }
}
```

* Using other date formats with specific separator:

```js
dateInput: {
    dateValidator: {
        format: "DD-MM-YYYY",   // Required if format <> "DD/MM/YYYY"
        separator: "-",         // Required if separator <> "/"
        minDate: "01-01-2014",  // Or new Date( 2014, 0, 1 )
        maxDate: "01-01-2016"   // Or new Date( 2016, 0, 1 )
    }
}
```

* Using the outputFormat:

This options is used when you want to format the input value to an other format when this input is valid.

For example, If the format is `D-M-YY` and you want the input value to be formated to the following format `DD-MM-YYYY`
If value = `1-1-15` (Jan 1, 2015) will be formated to `01-01-2015`
JS code will be:

```js
dateInput: {
    dateValidator: {
        format: "D-M-YY",
        separator: "-",
        outputFormat: "DD-MM-YYYY"
    }
}
```

* Using an array of format:

```js
dateInput: {
    dateValidator: {
        format: ["DD-MM-YYYY", "D-M-YYYY", "D-M-YY"],   // Required if format <> "DD/MM/YYYY"
        separator: "-",         // Required if separator <> "/"
        minDate: "01-01-2014",  // Or new Date( 2014, 0, 1 )
        maxDate: "01-01-2016"   // Or new Date( 2016, 0, 1 )
    }
}
```

#### LICENCE
Released under the term of MIT Licence.
