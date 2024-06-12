const Ajv = require("ajv")
const ajv = new Ajv({allErrors: true})

const registerFormSchema = {
   "type": "object",
   "properties": {
      "fullName": {
         "type": "string",
         "minLength": 1,
         "description": "User Full Name"
      },
     "username": {
       "type": "string",
       "minLength": 3,
       "maxLength": 20,
       "pattern": "^[a-zA-Z0-9_]+$",
       "description": "Username, alphanumeric and underscore allowed"
     },
     "emailId": {
       "type": "string",
       "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
       "description": "User email address"
     },
     "password": {
       "type": "string",
       "minLength": 8,
       "maxLength": 12,
       "description": "User password, at least 8 characters"
     }
   },
   "required": ["fullName", "username", "emailId", "password"],
   "additionalProperties": false,
}

const loginFormSchema = {
   "type": "object",
   "properties": {
     "username": {
       "type": "string",
       "minLength": 3,
       "maxLength": 20,
       "pattern": "^[a-zA-Z0-9_]+$",
       "description": "Username, alphanumeric and underscore allowed"
     },
     "password": {
       "type": "string",
       "minLength": 8,
       "maxLength": 12,
       "description": "User password, at least 8 characters"
     }
   },
   "required": ["username", "password"],
   "additionalProperties": false,
}

// categories:- business, sports
// sources:- bbc-news

exports.Validator = {
    isEmpty: (data) => {
       if(data !== undefined && data !== null && typeof data === 'string' && data !== "") return true;
       else return false;
    },

    isBoolean: (data) => {
        if(data !== undefined && typeof data === 'boolean') return true;
        else return false;
    },

    validateRegisterForm: (data) => {
        const validate = ajv.compile(registerFormSchema)
        const valid = validate(data)
        if (valid) return { status: true, message: "Valid!" }
        else return { status: false, message: "Invalid: " + ajv.errorsText(validate.errors) }
    },
    
    validateLoginForm: (data) => {
        const validate = ajv.compile(loginFormSchema)
        const valid = validate(data)
        if (valid) return { status: true, message: "Valid!" }
        else return { status: false, message: "Invalid: " + ajv.errorsText(validate.errors) }
    }
}

