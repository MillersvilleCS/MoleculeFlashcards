
/**
 * Used to indicate an implemented function hasn't been overriden;
 * @param {String} name
 * @returns {String}
 */
function UnimplementedFunctionException (name) {
    'use strict';
    return "Function '" + name + "' has not been implemented.";
};

/**
 * Used to indicate an object has already been initialized;
 * @param {type} name
 * @returns {String}
 */
function AlreadyInitilizedException (name) {
    'use strict';
    return name + " has already been initialized.";
};
