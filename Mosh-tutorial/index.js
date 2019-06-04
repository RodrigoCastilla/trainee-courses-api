const Joi = require('joi');
const express = require('express');
const app = express();
const jwt = require ('jsonwebtoken');

app.use(express.json());



const courses =[
    {id: 1, courseName: 'course1'},
    {id: 2, courseName: 'course2'},
    {id: 3, courseName: 'course3'}
];

const users = [
    {id:1, name: "Rodrigo", email: "armc3po@gmail.com", password: "Admin123", role: "Admin", enrolledCourses: []},
    {id:2, name: "Groot", email: "iamgrood@gmail.com", password: "User123", role: "User", enrolledCourses: []}
];

app.get('/', (req, res)=>{
    res.send('Howdie');
});

app.get('/api/auth/login'/*, verifyToken*/,  (req, res) => {
    // //jwt.verify(req.token, 'secretKey', (err, authData) => {
    //     if(err){
    //         console.log("forbidden from login")
    //         res.sendStatus(403);
    //     } else{
            res.send(`
                <form method='POST'>
                    <input type= 'email' placeholder= 'email here' />
                    <input type= 'password' placeholder= 'pwd here' />
                    <button>Log</button>
                </form>`
            );
            // res.json({
            //     message: "Holi",
            //     authData
            // });
        // }
    //});
    
});
app.post('/api/auth/login', (req,res)=>{
    const user = {
        name: req.body.name,
        email: req.body.email
    }

    jwt.sign({user:user}, 'secretKey'/*, {expiresIn: '30s'} */,(err, token)=>{
        res.json({
            token
        });
    });
});


//------------------------------------------User's Operations----------------------------------------
app.get('/api/users/:name/courses', (req,res) => {
    const {name} = req.params;
    const user = users.find(userElem => userElem.name === name);
    
    if (!user) {
        return res.status(404).send('The user with the given NAME was not found');
    }
    // validate
    // If valid, return 400 - Bad request
    const { enrolledCourses } = user; 

    if(!enrolledCourses){
        return res.status(404).send('The user with the given NAME has no courses');
    }
    
    // Return the updated user
    res.send(user.enrolledCourses);
});

app.post('/api/users/:name/courses', (req,res) => {
    const {name} = req.params;
    const user = users.find(userElem => userElem.name === name);
    
    if (!user) {
        return res.status(404).send('The user with the given NAME was not found');
    }

    const course = courses.find(courseElem => courseElem.courseName === req.body.courseName);
    
    if(!course){
        return res.status(404).send('The course with the given NAME was not found');
    }
    
    if(user.enrolledCourses.length >= 1){
        const userAlreadyEnrolled = user.enrolledCourses.find(courseElem => courseElem.courseName === course.courseName);
        if(userAlreadyEnrolled){
            console.log('Already Enrolled');
            return res.status(404).send('Already Enrolled');
        }
    }
    console.log('inscrito');
    user.enrolledCourses.push(course);
    // Return the updated user
    res.send(user);
    
    //--
});

//---------------------------------------------END USER SERVICES -------------------
//------------------------------------------COURSES ------------------------------------------------------------------
app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.post('/api/courses', (req,res) => {
    const { error } = validateCourse(req.body); 
    if(error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:name', (req,res) =>{
    course = courses.find(courseElem => courseElem.name === req.params.name);

    if (!course) {
        return res.status(404).send('The course with the given NAME was not found');
    }
    // validate
    // If valid, return 400 - Bad request
    const { error } = validateCourse(req.body); 
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    // Update course
    course.name = req.body.name;
    // Return the updated course
    res.send(course);

});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}

app.get('/api/courses/:name', (req, res)=>{
    const course = courses.find(courseElem => courseElem.name === (req.params.name));

    if (!course) {
        return res.status(404).send('The course with the given NAME was not found');
    }
    res.send(course);
});

app.delete('/api/courses/:name', (req, res) =>{
    //Look up the course
    // Not Existing, return 404
    course = courses.find(courseElem => courseElem.name === (req.params.name));
    if (!course) {
        return res.status(404).send('The course with the given NAME was not found');
    }

    //Delete
    const index= courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);

    // Return the same course


});
//--------------------------------------------END COURSES----------------------------------------------------------
//--------------------------------------------USERS-----------------------------------------------------------------
app.get('/api/users', (req, res) => {
    res.send(users);
})

app.post('/api/users', (req,res) => {
    const { error } = validateUser(req.body); 
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const user = 
    {
        id: users.length+1, 
        name: req.body.name, 
        email: req.body.email, 
        password: req.body.password, 
        role: req.body.role, 
        enrolledCourses: []
    }
    const isRegistered = users.find(userElem => userElem.name === user.name);
    if(isRegistered)
        return res.status(403).send("Already Registered");
    
    users.push(user);
    res.send(user);
});

app.put('/api/users/:name', (req,res) =>{
    user = users.find(userElem => userElem.name === req.params.name);

    if (!user) {
        return res.status(404).send('The user with the given NAME was not found');
    }
    // validate
    // If valid, return 400 - Bad request
    const { error } = validateUser(req.body); 
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    
    // Update user
    user.name = req.body.name;
    // Return the updated user
    res.send(user);

});

function validateUser(user){
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(), 
        password: Joi.string().min(3).required(), 
        role: Joi.string().min(3).required(), 
    }
    return Joi.validate(user, schema);
}

app.get('/api/users/:name', (req, res)=>{
    const user = users.find(userElem => userElem.name === (req.params.name));

    if (!user) {
        return res.status(404).send('The user with the given NAME was not found');
    }
    res.send(user);
});

app.delete('/api/users/:name', (req, res) =>{
    //Look up the user
    // Not Existing, return 404
    user = users.find(userElem => userElem.name === (req.params.name));
    if (!user) {
        return res.status(404).send('The user with the given NAME was not found');
    }

    //Delete
    const index= users.indexOf(user);
    users.splice(index,1);

    res.send(user);

    // Return the same user


});
//--------------------------------------------END USERS-----------------------------------------------


//Format of Token
//Authorization: Bearer <acess_token>
//VerifyToken
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //aplit at the space
        const bearer = bearerHeader.split(' ');
        //Get Token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next Middleware
        next();

    } else{
        //Forbidden
        console.log("Forbidden from VerifyToken");
        res.sendStatus(403);
    }
}


//PORT
const port = process.env.PORT || 3000;


app.listen(port, ()=> console.log(`Listening on port ${port}`));