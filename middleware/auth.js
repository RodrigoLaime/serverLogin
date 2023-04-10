const jwt = require('jsonwebtoken');
//my-text:middleware para que una ves logueado se puede crear usuarios y si no esta logueado no permitido
//desactivara la contraseña y registrara la solcitud
function auth(req, res, next) {
    try {
        //obtener el token de la cookie(manera de obtener info desde la cookie)
        const token = (req.cookies.token);
        //si no hay tockn es que no existe el usuario o
        //si no hay token es que se expiro la sesion y no esta autorizado
        if (!token)
            return res.status(401).json({
                errorMessage: 'Unauthorized'
            });

        //verificar el tocken, si el tocken no se a creado con esa contrasña error
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        //obtenemos el usuario del tocken
        req.user = verified.user

        next()

    } catch (error) {
        console.log(error);
        res.status(401).json({
            errorMessage: 'Unauthorized'
        });
    }
}

module.exports = auth;