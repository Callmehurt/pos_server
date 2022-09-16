const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.role){
            return res.status(401).json({
                message: 'No permission'
            });
        }

        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.role);
        const result = rolesArray.includes(req.role);
        if(!result){
            return res.status(401).json({
                message: 'No permission'
            });        }
        next();
    }
}

module.exports = verifyRoles;