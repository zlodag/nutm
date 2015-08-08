module.exports = function(error,status){
    if (typeof error === 'string'){error = new Error(error);}
    if (status){error.status = status;}
    return error;
};