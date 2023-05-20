const isAuth = (req, res, next) =>{
    const {user} = req.session;
    if(user !== undefined && user.id !== undefined){
        next()
    }else{
        res.redirect('/login')
    }
}

module.exports = isAuth