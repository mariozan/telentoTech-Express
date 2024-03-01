const request = require('supertest');
const app = require('../index.js');

// describe('GET /', () => {
//     it('responds with status 200', async () => {
//         const response = await request(app).get('/');
//         // console.log(response)
//         expect(response.status).toBe(200);
//     })
//     it('responds with test Hello world', async () => {
//         const response = await request(app).get('/');        
//         expect(response.text).toBe('Hello world');        
//     })
// })

// describe('GET /user', () => {
//     it('responds with status 200', async () => {
//         const response = await request(app).get('/user');              
//         expect(response.status).toBe(200);
//     })

//     it('responds with an array Object that contains an specific user', async () => {
//         const response = await request(app).get('/user');      
//         const objectToTest = {
//             "_id": "65ceb65726834f4c0d8c451a",
//             "id": 7845454545,
//             "name": "Carolina",
//             "lastname": "Ruiz",
//             "email": "marcela@correo.com",
//             "password": "$2b$10$Q.5dBN/5G7.ckKOc19n4SOBCfenNFfIU4ccBVDbbh8YVtJsjFNuea",
//             "__v": 0,
//             "avatar": "uploads\\1708391419588-descarga.jpeg"
//             }

//         expect(Array.isArray(response.body)).toBe(true);
//         expect(response.body).toEqual(expect.arrayContaining([objectToTest]))
//     })
// })

// describe('GET /user/:id', () => {
//     it('responds with an Object that contains an specific user', async () => {
        
//         const id = "65ceb65726834f4c0d8c451a"
//         const response = await request(app).get('/user/'+id);      
//         const objectToTest = {
//             "_id": "65ceb65726834f4c0d8c451a",
//             "id": 7845454545,
//             "name": "Carolina",
//             "lastname": "Ruiz",
//             "email": "marcela@correo.com",
//             "password": "$2b$10$Q.5dBN/5G7.ckKOc19n4SOBCfenNFfIU4ccBVDbbh8YVtJsjFNuea",
//             "__v": 0,
//             "avatar": "uploads\\1708391419588-descarga.jpeg"
//             }
//         expect(response.status).toBe(200);
//         expect(typeof response.body === "object").toBe(true);
//         expect(response.body).toStrictEqual(objectToTest)
//     })
// })

// describe('POST /user', () => {
//     it('create a new user in the DB and response with the data', async () => {
//         const newUser = {
//             "id": 4784512,
//             "name": "Lucia",
//             "lastname": "Pardo",
//             "email": "lucia-pardo10@correo.com",
//             "password": "UsuarioDePrueba"
//         }

//         const response = await request(app).post('/user').send(newUser)

//         expect(response.statusCode).toBe(200)
//         expect(response.body).toHaveProperty('_id')
//         expect(response.body.name).toBe(newUser.name)
//         expect(response.body.lastname).toBe(newUser.lastname)
//         expect(response.body.email).toBe(newUser.email)
//     })
// })

describe('POST /login', () => {
    it('Success login with email and password', async () => {
        const user = {
            "email": "lucia-pardo10@correo.com",
            "password": "UsuarioDePrueba"
        }

        const response = await request(app).post('/login').send(user)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('token')
        expect(response.body.status).toBe("success")
    })

    it('Error login with email and password', async () => {
        const user = {
            "email": "lucia-pardo10@correo.com",
            "password": "UsuarioDePrueba1111"
        }

        const response = await request(app).post('/login').send(user)

        expect(response.statusCode).toBe(401)
        expect(response.body).not.toHaveProperty('token')
        expect(response.body.status).toBe("error")
    })
})

describe('POST /delete', () => {
    it('Success delete with _id', async () => {
        const id = "65e12d8d0b0db8e56e5b01b1"
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWUwOGE4MjlhOTQ2ZjQzMmM2NjRmZGYiLCJlbWFpbCI6Im1hcmNlbGEyMzIzMzJAY29ycmVvLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwOTI1NzM2MywiZXhwIjoxNzA5MjYwOTYzfQ.bwNZPBiohBCMLhQeBWJ5xkMcAr69PHKVfhyg2yY2UZk";

        const response = await request(app).delete('/user/'+id).set('Authorization', 'Bearer ' + token)

        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })
})