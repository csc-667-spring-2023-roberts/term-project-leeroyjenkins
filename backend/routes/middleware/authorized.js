module.exports.isAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/')
    }
}

module.exports.isNotAuth = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.redirect('/login-success')
    }else{
        next()
    }
}