import moment from 'moment';
import React from 'react';

// /**
//  * Util to convert a string to a slug format
//  * @param {string} text The string to format
//  * @returns {string} The resulting string
//  */
// export const slugify = text =>
//     text
//         .toString()
//         .toLowerCase()
//         .replace(/\s+/g, '_') // Replace spaces with _
//         .replace(/\-+/g, '_') // Replace all - with _
//         .replace(/[^\w\-]+/g, '') // Remove all non-word chars
//         .replace(/\_\_+/g, '_') // Replace multiple _ with single _
//         .replace(/^_+/, '') // Trim _ from start of text
//         .replace(/_+$/, ''); // Trim _ from end of text

/**
 * Checks if an array is empty
 * @param {Array} arr Array to be tested
 * @returns {Boolean} Boolean value
 */
export const isNotEmptyArray = (arr: any) => Array.isArray(arr) && arr.length > 0;

// /**
//  * Delete an array of keys from a given object
//  * @param {Object} targetObj Object to remove propeties from
//  * @param {Array} props Array of object properties to be deleted
//  * @returns {Object} A copy of the orginal object excluding the specified properties
//  */
// export const omit = (targetObj, props) => {
//     // Clone the targetObj to avoid mutating the original data
//     const obj = Object.assign({}, targetObj);

//     if (!Array.isArray(props)) {
//         return;
//     }

//     props.forEach(prop => {
//         obj.hasOwnProperty(prop) && delete obj[prop];
//     });

//     return obj;
// };

// export const getUrlParams = (url = window.location.href) => {
//     const params = {};
//     url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
//         params[key] = value;
//     });
//     return params;
// };

// /**
//  * Return file extension
//  * @param {string} fileName file name
//  * 
//  * @returns {string} Empty string or file extension
//  */
// export const getFileExtenion = (fileName) => {
//     if(!fileName){
//         return '';
//     } 
//     return fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || '';

// };

// /**
//  * Return bool
//  * @param {string} stringPiece String Piece
//  * @param {string} fullString Full Piece
//  * 
//  * @returns {boolean} true or false
//  */
// export const checkIfStringStartWith = (stringPiece, fullString) => {
//     return fullString.startsWith(stringPiece);

// };

// /**
//  * Pick an array of keys from a given object
//  * @param {Object} targetObj Object to remove propeties from
//  * @param {Array} props Array of object properties to be deleted
//  * @returns {Object} A new object that has the specified properties
//  */
// export const pick = (targetObj, props) => {
//     const picked = {};

//     if (!Array.isArray(props)) {
//         return;
//     }

//     props.forEach(prop => {
//         if (targetObj.hasOwnProperty(prop)) {
//             (picked[prop] = targetObj[prop]);
//         }
//     });

//     return picked;
// };

/**
 * Checks if an object has no set properties
 * @param {*} obj The object to test
 * @returns {*} boolean
 */
export const isObjectEmpty = (obj = {}) =>
    !obj || Object.keys(obj).length === 0;

// /**
//  * Return a user-friendly format for a number
//  * @param {Number} number Passed number
//  * @returns {String} Formatted number string
//  */
// export const formatNumber = number => {
//     if ((!number && number !== 0) || isNaN(number)) {
//         return '';
//     }

//     return number.toLocaleString();
// };

// /**
//  * Return a user-friendly format for a number forcing a decimal place
//  * @param {Number} number Passed number
//  * @returns {String} Formatted number string
//  */
// export const formatFloat = number => {
//     if ((!number && number !== 0) || isNaN(number)) {
//         return '';
//     }

//     const floatVal = parseFloat(number);
//     const decimalVal = floatVal % 1 === 0 ? `${floatVal}.0` : floatVal;

//     return decimalVal.toLocaleString();
// };

// /**
//  * Format a given number to a currency format
//  * NOTE: If we ever need to format for different currencies, this is be a good place to do that :)
//  * @param {Number} price The given price
//  * @returns {String} Formatted price
//  */
// export const formatMoney = price => {
//     if (!price && price !== 0) {
//         return '';
//     }

//     return (
//         <>
//             {/* Resetting the font-family for the naira icon ensures that the
//         Naira symbol renders correctly as some font don't render it properly
//         (e.g. system-ui on Mac) */}
//             <span
//                 style={{
//                     fontFamily: 'sans-serif',
//                     marginRight: '1px',
//                 }}
//             >
//                 &#x20A6;
//             </span>
//             {formatNumber(price)}
//         </>
//     );
// };

// /**
//  * Format a money string to a currency format
//  * @param {String} price The given price
//  * @returns {String} Formatted price
//  */
// export const formatMoneyString = price => {
//     const priceNumber = parseFloat(price.replace(/[, ]+/g, '').trim());

//     return formatMoney(priceNumber);
// };

// /**
//  * Ensure that a given string matches the character count and ellipsized at that point
//  * @param {String} text Target text
//  * @param {Number} numChars Number of characters needed
//  * @returns {String} Truncated text
//  */
export const truncateMultilineText = (text:string, numChars:number) => {
    if (!text) return '';

    // Because '...' will be appended to long strings,
    // this ensures that the entire character count is as specified
    const maxStringLength = numChars - 3;

    return maxStringLength > text.length
        ? text
        : `${text.trim().substring(0, maxStringLength)}...`;
};

// /**
//  * Helper function to prevent default event handling and call a specified handler
//  * @param {A} event The DOM event
//  * @param {A} handler The callback to handle the event
//  * @returns {*} undefined
//  */
// export const handleDOMEvent = (event, handler) => {
//     event.preventDefault();
//     event.stopPropagation();

//     if (typeof handler === 'function') handler(event);
// };

// /**
//  * Building query parameters based on injected query object;
//  * object of format { "phone": "09091234321", "category_id": 1234  } is converted
//  * to string of the following format 'phone: "09091234321", category_id: 1234'
//  * @param {object} queryObj The object to format
//  * @returns {*} The formatted object
//  */
// export const stripBraces = queryObj => {
//     //STEP 1: Removing '"' around object keys in the json string
//     let _queryObj = JSON.stringify(queryObj).replace(/"\w*":/g, str => {
//         return str.replace(/"+/g, '');
//     });

//     //STEP 2: removing '{' and '}' around the json string
//     _queryObj = _queryObj.replace(/(^[{])/, '').replace(/(}(?=[^}]*$))/, '');

//     return _queryObj;
// };

/**
 * Function that does nothing:
 * Useful as a default value for an optional Component prop
 * that's of type - function
 * Or for stubbing function calls in Tests and Storybook Docs
 * @returns {*} undefined
 */
export const noOp = () => { };

// /**
//  * Method to extract error message from error response object
//  * @returns {*} The error messgae
//  */
export const extractErrorMessage = (err: any): string => {
    
    const errResponse = err.response || err.toString();
    console.log(err.toString());
    const errorMessage =
    errResponse === null ? 'Something went Wrong. Please try again' : 
        errResponse && errResponse.data && errResponse.data.message
            ? errResponse.data.message
            :  err.toString();

    return errorMessage;
};

// /**
//  * Method to extract error message from error response object
//  * @returns {*} The error messgae
//  */
// export const extractSurveyError = (err) => {
//     let error = [];
//     const errorObj = {};
//     if(err.response){
//         if(err.response.data){
//             error = err.response.data.errors; 
//         }
//     }
//     for (let index = 0; index < error.length; index++) {
//         const element = error[index];
//         const object = {...element};
//         for (const key in object) {
//             if (Object.hasOwnProperty.call(object, key)) {
//                 const el = object[key];
//                 errorObj[key] = el;      
//             }
//         }
//     }

//     return errorObj;

// };

// /**
//  * Method to Extract initials from Full name
//  * @param {string} name name
//  * @returns {string} initials
//  */
// export const getInitials = name => {
//     const fullName = name.split(' '),
//         initials = fullName[0].substring(0, 1).toUpperCase();

//     if (fullName.length > 1) {
//         initials.concat(fullName[fullName.length - 1].substring(0, 1).toUpperCase());
//     }

//     return initials;
// };

// /**
//  * convert isoDate to human readable date
//  * @param {*} date date
//  * @returns {string} date
//  */
// export const humanReadableDate = (date, separator='/') => {
//     if (date === '') return '';
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();
//     if (month.length < 2) month = '0' + month;
//     if (day.length < 2) day = '0' + day;

//     return `${[day, month, year].join(separator)}`;
// };

// export const humanReadableTime = date => {
//     date = new Date(date);
//     return date.toLocaleTimeString();
// }

// /**
//  * 
//  * @param {*} link 
//  */
// export const determineActiveMenu = (link) => {
//     return window.location.pathname.includes(link) ? 'active' : '';
// };


// export const checkIfArray = (param) => {
//     return Array.isArray(param);
// }

// /**
//  * 
//  */
export const scrollTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export const scrollDown = () => {
    window.scrollTo({
        //bottom:0,
        behavior: 'smooth',
    });
};

export const formatDate = (date: Date) => {
    if (!date) return '';
    const d = new Date(date);
    
    const newDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    return newDate;
};
export const formatDate2 = (date: Date) => {
    if (!date) return '';
    return moment(date).format('DD-MM-YYYY');
};

export const formatInitialDateValue = (data: Date) => {
    return moment(data).fromNow();
   
        // return moment(data, 'YYYY-MM-DD');
        
}

export const getMomentAgo = (data: Date) => {
 
    return moment(data).fromNow();
}

export const capiitalizeFirstLetter = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// export const extractFirstLetter = (string = '') => {
//     if(string){
//          return string.charAt(0).toUpperCase();
//      }

//      return string;
   
// }

// export const randomlySelectColor = () => {
//     const arr = [
//             {backgroundColor:'#7467c3', color:'white'},
//             {backgroundColor:'#e74c4d', color:'white'},
//             {backgroundColor:'#368055', color:'white'},
//             {backgroundColor:'#efb931', color:'white'},
//     ];
//     return arr[Math.floor(Math.random() * arr.length)];

// }

// export const trimString = (string) => {
//     if(string.length > 45){
//         string = string.substring(0, 35);
//         return string + ' ...';
//     }
    
//     return string;
// }
export const changeOptionsToBool = (value: string):any => {
    const obj:any = {
        'false': 'false',
        'true': 'true',
        'active': 'true',
        'non-active': 'true',
        '': 'null',
        'null': 'null',
    }
    return obj[value];
};

export const processAlertError =(message: string) : object => {
    return {type: 'alert-danger', text: message};
};
export const processAlertSuccess =(message: string) : object => {
    return {type: 'alert-success', text: message};
};
export const processAlertInfo =(message: string) : object => {
    return {type: 'alert-primary', text: message};
};

export const validateImage = (file: any) : boolean=> {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }

    return true;
}
export const replaceUnderScore = (str = '') => {
    return str.split('_').join(' ');
};

export const getDateFromWeek = (w:any,y:any) => {
    
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
 
    return ISOweekStart;
    
};

export const splitBiblePassage = (biblePassageStr: String, version= 'niv') => {
    let str: Array<String>|String = biblePassageStr;
    str = str.split(':');
    let verse = str[1];
    let book = str[0].split(' ');
    let getBook:any = [...book];
    getBook.pop();
    let changeIndex = 0;
    for (let index = 0; index < getBook.length; index++) {
        let element = getBook[index];
        if((/[a-zA-Z]/).test(element)){
            changeIndex = index;
        };
    };
    getBook[changeIndex] = capiitalizeFirstLetter(getBook[changeIndex]);
    let checkmultipleVerse = verse.split('');
        return {
            book: getBook.join(' ').trim(),
            chapter: book[book.length - 1],
            verse: verse,
            version,
            multipleVerses: !checkmultipleVerse.includes("-")? false: true,
        };
};

export const getScripture = (scriptureData:any) => {
    const data = scriptureData?.refrence ? scriptureData?.refrence : '';
    return data;
};

export const getSupportingVerses = (supportingverseData:any) => {
    const confirmDataValidity = isNotEmptyArray(supportingverseData);
    if(confirmDataValidity){
        const returnArr = [];
        for (let index = 0; index < supportingverseData.length; index++) {
            const element = supportingverseData[index];
                returnArr.push(element?.refrence);
        }
        return returnArr;
    }
    return [];
};
