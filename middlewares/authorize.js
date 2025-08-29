export const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user?.role)){
            return res.status(403).json({
                message: `Acces denied: required role - ${roles.join(',')}`
            })
        }
        next()
    }
}