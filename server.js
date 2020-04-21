const db = require('./OreintDB');
const http = require('http');
var express = require('express');
var app = express();
var query = require('./orientQuery');
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
var homePageData = {};
var favCourse=[];

const authID = '234-324234-3242342342-234234-3423423';
// const server = http.createServer((req, res) => {
//    const url=req.url;
//    var header=req.headers;
//    console.log("url",url);
//    if(header.authorization == authID){
//    if(url == "/login"){

//        console.log("login woking",header);
//    }
//    console.log("login woking");
// }else{
//     res.sendDate({error:"unauthenticated user"});
//     res.statusCode(500);
// }
//    res.end();

// });
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`server is started in ${PORT}`));

console.log("Log....")
app.post('/login', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    query.login(body.username, body.password)
        .then(responseJson => {
            var userData = responseJson[0];
            if (userData) {
                if (userData.password == body.password) {
                    res.json(userData);
                } else {
                    res.json({ error: "Incorrect password" });
                }

            } else {
                res.json({ error: "user not found, Please register" });
            }


            res.end();
        })



});
app.post('/signup', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    console.log("body", body);
    query.checkForEmailExists(body.email)
        .then(response1 => {
            console.log("response1", response1[0]);
            if (!(response1[0])) {
                query.checkForPhoneNoExists(body.phoneNumber)
                    .then(response2 => {
                        console.log("response12", response2[0]);
                        if (!(response2[0])) {
                            query.signUp(body.username, body.password, body.email, body.expo_token, body.phoneNumber, body.id)
                                .then((response3) => {
                                    console.log("res", response3);
                                    res.json({ "success": "Success fully registered" });
                                    res.end();
                                }).catch((error) => {
                                    console.log("error", error);
                                });

                        } else {
                            res.json({ "error": "Phone number is already exists" });
                            res.end();
                        }
                    })
            } else {
                res.json({ "error": "Email is already exists" });
                res.end();
            }

        });
});
function getHomeRecu(data, currentIndex, res) {
    query.getCouserDetails(data[currentIndex].id)
        .then(response => {

            var len = data.length - 1;
            var nameCat = data[currentIndex].name;
            //    console.log("name",nameCat,response);

            homePageData[nameCat] = response;
            var next = currentIndex + 1;
            if (next <= len) {
                getHomeRecu(data, next, res);

            } else {
                console.log("home data", homePageData)
                res.json(homePageData);
                res.end();
            }

        })

}
app.post('/homepagedata', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;

    query.getCatagoryId()
        .then((catId) => {
            // console.log("catId",catId);
            console.log(catId.length);
            homePageData = {}
            getHomeRecu(catId, 0, res);


        })

});
app.post('/video', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;

    console.log("body", body.vid);
    query.getCourseVideo(body.vid)
        .then((response) => {
            console.log("video id", response);
            res.json({ "videoId": response });
            res.end();
        })


});
app.post('/coursesForSearch', (req, res) => {
    console.log("working login", req.body);
    query.getCourseForSearch()
        .then(response => {
            res.json({ "courses": response });
            res.end();
        })


});
app.post('/studentMetaData', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    query.getStudentMetaData(body.sid)
        .then(response => {
            console.log("student", response);
            res.json({ "Student": response[0] });
            res.end();
        })


});
app.post('/checkForCurrentPassword', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    query.checkForCurrentPassword(body.password, body.sid)
        .then(response => {
            console.log("response", response);
            if (response[0]) {
                res.json({ "auth": "authanticated user" });
            } else {
                res.json({ "error": "Worng password" });
            }

            res.end();
        })


});
app.post('/updatenewpassword', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    query.updateNewPassword(body.password, body.id)
        .then(response => {
            console.log("response", response);
            if (response[0]) {
                res.json({ "ok": "updated" });
            } else {
                res.json({ "error": "Worng password" });
            }




            res.end();
        })


});
app.post('/addfav', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    console.log("body", body);
    

    query.checkCourseIsAlreadyInFav(body.sid, body.cid)
        .then((response1) => {
            console.log("response1", response1);
            if (response1[0]) {
                res.json({ "res": "Already in favorite" });
                res.end();
            } else {
               
                query.insertTheFavCourse(body.sid, body.cid)
                    .then((response2) => {
                        query.createEdgeForFav(body.sid, body.cid)
                            .then((response3) => {
                                res.json({ "res": "Successfully added" });
                                res.end();
                            })
                    })
            }
        })



});
 function getFavCourseRecu(courseIds,currentIndex,res){
     query.getFavCourse(courseIds[currentIndex].cid)
     .then((response)=>{
         console.log("response in fav",response);
     var next=currentIndex+1;
     favCourse.push(response[0]);
     var len=courseIds.length-1;
     if(len >=next){
       getFavCourseRecu(courseIds,next,res)
     }else{
         res.json({"courses":favCourse});
         res.end();
     }
     });
}
app.post('/getfavcourse', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    query.getFavCourseID(body.sid)
    .then(response1=>{
        console.log("response",response1);
        favCourse=[];
        if(response1[0]){
        getFavCourseRecu(response1,0,res);
        }else{
            res.json({"courses":favCourse});
            res.end();
        }
    })
    
   

});
app.post('/removefavcourse', (req, res) => {
    console.log("working login", req.body);
    var body = req.body;
    query.removeFavCourse(body.sid,body.cid)
    .then(response1=>{
        console.log("response",response1);
        res.json({"success":"Removed successfully"});
        res.end();
    })
    
   

});

app.listen(5000);