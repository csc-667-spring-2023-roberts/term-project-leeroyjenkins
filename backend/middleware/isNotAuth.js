const isNotAuth = (req, res, next) =>{
    const {user} = req.session;
    if(user && user.id && (req.path === '/login' || req.path === '/register')){
        res.redirect('/home')
    }else{
        next()
    }
}

module.exports = isNotAuth