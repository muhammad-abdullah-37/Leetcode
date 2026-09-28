const validator = require('validator');

const validate = async(data) => {
    // mandatory fields verification
    const mandatoryFields = ['firstName', 'emailId','password'];
    const isAllowed = mandatoryFields.every((field) => Object.keys(data).includes(field));
    if (!(isAllowed)) {
        throw new Error('Field Missing');
    }

    // First Name validation
    if (!(data.firstName.length >=3)) {
        throw new Error('First Name should have atleast 3 characters')
    }
    if (!(data.firstName.length <= 20)) {
        throw new Error('First Name should have at most 20 characters')
    }

    // Email validation
    if (!(validator.isEmail(data.emailId))) {
        throw new Error('Invalid Email')
    }

    // password validation
    if (!(validator.isStrongPassword(data.password))) {
        throw new Error('Weak Passwrod')
    }
}

module.exports = validate;