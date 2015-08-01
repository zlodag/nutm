module.exports = function(req, res, next) {
    console.log(req.decoded);
    if (req.decoded.admin) {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: 'You need to be admin to do that.' 
        });
    }
};
