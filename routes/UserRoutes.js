const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserSchema = require('../models/User');
const MessageSchema = require('../models/Message');
const UserController = require('../controllers/UserController'); //Importando el controllador
const multer = require('multer');
const userController = new UserController(); // creando una instancia de ese controlador



router.get('/user', async (req, res) => {
    //Traer todos los usuarios
    const users = await UserSchema.find(); 
    res.json(users)
})

router.get('/user/:id', async (req, res) => {
    //Traer un usuario especifico pasando el ID
    const id = req.params.id
    const user = await UserSchema.findById(id); 
    res.json(user)

    //Traer un usuario pasandole el email
    // const query = UserSchema.where({ email: email });
    // const user = await query.findOne()
})

router.post('/user', async (req, res) => {
    //Crear un usuario
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = UserSchema({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id,
        password: hashedPassword
    })

    user.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        if(err.code == 11000){
            res.send({"status" : "error", "message" :"El correo ya fue registrado"})      
        }else{
            res.send({"status" : "error", "message" :err.message})      
        }
    })
})



router.patch('/user/:id', userController.validateToken, (req, res) => {
    //Actualizar un usuario
    // Cuando viene por la url del servicio web params
    const id = req.params.id
    
    // Cuando viene por el body se usa body
    const updateUser = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id
    }

    UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log(error)
        res.send("Error actualizando el registro")
    })
})

router.deconste('/user/:id', userController.validateToken, (req, res) => {
    
    const id = req.params.id

    //Puedo establecer cualquier parametro para eliminar
    UserSchema.deconsteOne({_id: id}).then(() => {
        res.json({"status": "success", "message": "User deconsted successfully"})
    }).catch((error) => {
        console.log(error)
        res.json({"status": "failed", "message": "Error deconsting user"})
    })

    //Ejemplo 2
    // const name = req.params.name
    // const email = req.params.email
    // const query;
    // if(email != null){
    //     query = {name: name, email: email}
    // }else{
    //     query = {name: name}
    // }
    // //Puedo establecer cualquier parametro para eliminar
    //     UserSchema.deconsteOne(query).then(() => {
    //         res.json({"status": "success", "message": "User deconsted successfully"})
    //     }).catch((error) => {
    //         console.log(error)
    //         res.json({"status": "failed", "message": "Error deconsting user"})
    //     })
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userController.login(email, password).then((result) => {
        if(result.status == "error"){
            res.status(401).send(result)
        }else{
            res.send(result)
        }
    })
})

//Configuracion de la libreria multer
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{        
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {    
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    }else{
        cb(new Error('El archivo no es una imagen'))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter})

// Servicio web para el almacenamiento de archivos
router.post('/upload/:id/user', upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).send({ 'status': 'error', 'message': 'No se proporciono ningun archivo'})
    }

    const id = req.params.id

    const updateUser = {
        avatar: req.file.path
    }

    console.log(id)

    UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then(() => {
        res.send({"status": "success", "message": "Archivo subido correctamente"})
    }).catch((error) => {
        console.log(error)
        res.send({"status": "success", "message" : "Error actualizando el registro"})
    })

})

module.exports = router