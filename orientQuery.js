const db = require('./OreintDB');

const query = {
  login(username, password) {
    var foundAt = username.search("@");
    var searchWith = "";
    if (foundAt == -1) {
      searchWith = "phoneNumber";
    } else {
      searchWith = "email";
    }
    //  var login_query="select from student_details where id='123123'";
    var login_query = "select from student_details where " + searchWith + " = '" + username + "'";
    console.log("login in query", login_query);
    return db.query(login_query);

  },
  checkForEmailExists(email) {
    var checkEmail_query = "select from student_details where email ='" + email + "'";
    console.log("checkEmail_query", checkEmail_query);
    return db.query(checkEmail_query);
  },
  checkForPhoneNoExists(PhoneNo) {
    var no = parseFloat(PhoneNo)
    var checkPhoneNo_query = "select from student_details where phoneNumber =" + no;
    console.log("checkPhoneNo_query", checkPhoneNo_query);
    return db.query(checkPhoneNo_query);

  },
  signUp(name, password, email, expo_token, phoneNumber, id) {
    var no = parseFloat(phoneNumber)
    var insertStudent_query = "insert into student_details content {'email':'" + email + "','expo_token':'" +
      expo_token + "','id':'" + id + "','password':'" + password + "','phoneNumber':" +
      no + ",'name':'" + name + "'}";
    console.log("insertStudent_query", insertStudent_query);

    return db.query(insertStudent_query);
  },

  getCatagoryId() {
    var cat_query = "select id,name from category";
    console.log("Category", cat_query);
    return db.query(cat_query);
  },
  getCouserDetails(catId) {
    var courseDetails_query = "select from course_details where catId='"+catId+"'";
    console.log("courseDetails_query", courseDetails_query);
    return db.query(courseDetails_query);
  },
  getCourseVideo(vid) {
    var getVideo_query = "select from course_video where cid='"+vid+"'";
    console.log("getVideo_query", getVideo_query);
    return db.query(getVideo_query);
  },
  getCourseForSearch() {
    var getCourseForSearch_query = "select from course_details";
    console.log("getCourseForSearch_query", getCourseForSearch_query);
    return db.query(getCourseForSearch_query);
  },
  getStudentMetaData(sid) {
    var getStudentMetaData_query = "select from student_details where id='"+sid+"'";
    console.log(" getStudentMetaData_query",  getStudentMetaData_query);
    return db.query(getStudentMetaData_query);
  },
  checkForCurrentPassword(password,sid) {
    var checkForCurrentPassoword_query = "select from student_details where password='"+password+"' and id='"+sid+"'";
    console.log(" checkForCurrentPassoword_query",  checkForCurrentPassoword_query);
    return db.query(checkForCurrentPassoword_query);
  },
  updateNewPassword(password,sid) {
    var updateNewPassoword_query = "update student_details set password='"+password+"' where id='"+sid+"'";
    console.log(" updateNewPassoword_query",  updateNewPassoword_query);
    return db.query(updateNewPassoword_query);
  },
  checkCourseIsAlreadyInFav(sid,cid){
    var checkCourseIsAlreadyInFav_query = "select from favorite_course where cid='"+cid+"' and sid='"+sid+"'";
    console.log(" checkCourseIsAlreadyInFav_query",  checkCourseIsAlreadyInFav_query);
    return db.query(checkCourseIsAlreadyInFav_query);
  },
  insertTheFavCourse(sid,cid){
    var insertTheFavCourse_query ="insert into favorite_course content {'sid':'"+sid+"','cid':'"+cid+"'}";
    console.log(" insertTheFavCourse_query",  insertTheFavCourse_query);
    return db.query(insertTheFavCourse_query);
  },
  createEdgeForFav(sid,cid){
    var createEdgeForFav_query ="create edge favorite_course_edge FROM (SELECT FROM favorite_course WHERE sid = '"+sid+"' and cid='"+cid+"') TO (SELECT FROM student_details WHERE id= '"+sid+"')";
    console.log(" createEdgeForFav_query",  createEdgeForFav_query);
    return db.query(createEdgeForFav_query);
  },
  getFavCourseID(sid){
    var getFavCourseID_query ="select cid from favorite_course where sid='"+sid+"'";
    console.log(" getFavCourseID_query",  getFavCourseID_query);
    return db.query(getFavCourseID_query);
  },
  getFavCourse(cid){
    var getFavCourse_query ="select from course_details where id='"+cid+"'";
    console.log(" getFavCourse_query",  getFavCourse_query);
    return db.query(getFavCourse_query);
  },
  removeFavCourse(sid,cid){
    var removeFavCourse_query ="delete vertex favorite_course where cid='"+cid+"' and sid='"+sid+"'";
    console.log(" removeFavCourse_query",  removeFavCourse_query);
    return db.query(removeFavCourse_query);
  },


}

module.exports = query;