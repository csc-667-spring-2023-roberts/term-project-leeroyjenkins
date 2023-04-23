// module.exports.isAuth = (req,res,next)=>{
//     console.log('*isAuth* req.body: '+JSON.stringify(req.body))
//     console.log('*isAuth* req.user: ' + req.user)
//     console.log('*isAuth* Session:', req.session)
//     console.log('*isAuth* isAuthenticated(): '+req.isAuthenticated())
//     if(req.isAuthenticated()){
//         next();
//     }else{
//         res.redirect('/')
//     }
// }

module.exports.isAuth = (req, res, next) => {
    console.log('*isAuth* req.body: '+JSON.stringify(req.body))
    console.log('*isAuth* req.user: ' + req.user)
    console.log('*isAuth* Session:', req.session)
    console.log("*isAuth* req.session.passport: " + req.session.passport)
    console.log('*isAuth* isAuthenticated(): '+req.isAuthenticated())
  
    if (req.session.passport && req.session.passport.user) {
      console.log('User ID from session:', req.session.passport.user);
      next();
    } else {
      res.redirect('/');
    }
  };
  
