const STUDENTS_JSON_PATH = "./../json/students.json";
const LECTURES_JSON_PATH = "./../json/lectures.json";


class Student{
    static students = [];
    static students_object = {};

    constructor(studentID, fname, mname, lname, gpa, lectures, total_credit){
        this.id = studentID;
        this.first_name = fname;
        this.middle_name = mname;
        this.last_name = lname;
        if (this.middle_name)
            this.name = this.first_name + " " + this.middle_name + " " + this.last_name;
        else
            this.name = this.first_name + " " + this.last_name;
        this.gpa = gpa;
        if (!this.gpa && this.gpa != 0)
            this.gpa2Display = " "
        else
            this.gpa2Display = roundDecimal(this.gpa, 2);
        this.lectures = lectures;
        this.totalCredit = total_credit;
        this._addStudent();
    }

    _addStudent(){
        if (Student.students.indexOf(this) == -1){
            Student.students.push(this);
        }
        else{
            cl("this student already exist!");
            delete this;
        }
    }

    static getStudentById(studentID){
        for (let student of Student.students){
            if (student.id == studentID)
                return student;
        }
        return null;
    }

    static updateStudentLectures(studentID, lecturesObj){
        Student.students_object[studentID]["lectures"] = lecturesObj;
        Student.students_object[studentID].gpa = Student.calculateGPA(lecturesObj);
        Student._saveStudents2LocalMachine();
    }

    static _saveStudents2LocalMachine(){
        const students_json = JSON.stringify(Student.students_object);
        localStorage.setItem("2469126028students2469126028", students_json);
    }

    // searchs a student by id number returns true if a student with that id number exist.
    static searchStudentById(studentID){
        if (this.getStudentById(studentID))
            return true;
        return false
    }

    // searchs a student by name returns true if a student with that name exist.
    static searchStudentByName(name){
        for (let student of Student.students){
            if (student.name.toLowerCase() == name.toLowerCase())
                return true;
        }
        return false;
    }

    static calculateTotalCreditAndGPA(lecturesObj){
        let sum = 0;
        let total_credit = 0;
        for (let lecture_id in lecturesObj){
            const lectures = loadLectures();
            const lecture_info = lectures[lecture_id];
            const credit = lecture_info.credit;
            const grade_scale = lecture_info["grade-scale"];
            const letterGrade = lecturesObj[lecture_id]["overall"][grade_scale];
            sum += letter2Num[letterGrade] * credit;
            total_credit += credit;
        }
        return {
            "gpa":sum/total_credit,
            "total-credit": total_credit
        };
    }

    static calculateGPA(lecturesObj){
        let sum = 0;
        let total_credit = 0;
        for (let lecture_id in lecturesObj){
            const lecture = lecturesObj[lecture_id];
            const grade_scale = lectures[lecture_id]["grade-scale"];
            if (!lecture["overall"][grade_scale])
                continue;
            const credit = lectures[lecture_id].credit;
            sum += letter2Num[lecture["overall"][grade_scale]] * credit;
            total_credit += credit;
        }
        if (total_credit == 0)
            return null;
        else
            return sum / total_credit;
    }

    static registerNewStudent(studentObj, student_id){
        new Student(student_id, studentObj["first-name"], studentObj["middle-name"], 
        studentObj["last-name"], studentObj.gpa, studentObj.lectures, studentObj["total-credit"])

        Student.students_object[student_id] = studentObj;
        Student._saveStudents2LocalMachine();
        cl(Student.students);
        cl(Student.students_object);
    }

    static updateAllStudentsOveralls(lecture_id_2_change, midterm_rate){
        for (let student_id in Student.students_object){
            const student = Student.students_object[student_id]
            const students_lectures = student["lectures"];

            for (let lecture_id in students_lectures){
                if (lecture_id == lecture_id_2_change){
                    const lecture = students_lectures[lecture_id]
                    let overall_number;
                    // if final note has been entered then calculate the overall grades
                    if (lecture["final"]){
                        // if final is less than 40 then student is failed from this lecture
                        if (lecture["final"] < 40){
                            Student.students_object[student_id]["lectures"][lecture_id]["overall"] = {
                                "number": overall_number,
                                "10-based": "F",
                                "7-based": "F"
                            }
                            break;
                        }
                        overall_number = lecture["midterm"] * midterm_rate + lecture["final"] * (1-midterm_rate);
                        Student.students_object[student_id]["lectures"][lecture_id]["overall"] = {
                            "number": overall_number,
                            "10-based": num2TenBased(overall_number),
                            "7-based": num2SevenBased(overall_number)
                        }
                        break;
                    }
                }
            }
        }
    }

    static updateAllStudentsGPA(){
        for (let student_id in Student.students_object){
            Student.students_object[student_id]["gpa"] = Student.calculateGPA(Student.students_object[student_id]["lectures"]);
        }
        localStorage.setItem("2469126028students2469126028", JSON.stringify(Student.students_object));
    }
}


function roundDecimal(number, roundAfterDot){
    const factor = 10 ** roundAfterDot;
    return Math.round(number * factor) / factor;
}

function cl(...args){
    console.log(...args);
}

function loadStudents(){
    let students = localStorage.getItem("2469126028students2469126028");
    if (!students){
        fetch(STUDENTS_JSON_PATH).then(response => response.json()).then(data => {
            students = data;
            localStorage.setItem("2469126028students2469126028", JSON.stringify(students));
            return students;
        })
    }
    else{
        students = JSON.parse(students);
        return students;
    }
}

function deleteStudents(){
    localStorage.removeItem("2469126028students2469126028");
}

function loadLectures(){
    let lectures = localStorage.getItem("2469126028lectures2469126028");
    if (!lectures){
        fetch(LECTURES_JSON_PATH).then(response => response.json()).then(data => {
            lectures = data;
            localStorage.setItem("2469126028lectures2469126028", JSON.stringify(lectures));
            return lectures;
        })
    }
    else{
        lectures = JSON.parse(lectures);
        return lectures;
    }
}

function deleteLectures(){
    localStorage.removeItem("2469126028lectures2469126028");
}


function isNumeric(value) {
    return typeof value === 'number' && !isNaN(value);
}

function getOverall(midterm, final, midterm_rate){
    const over_all_num = midterm * midterm_rate + final * (1-midterm_rate);
    let over_all_10_based;
    let over_all_7_based;
    if (final < 40){
        over_all_10_based = "F";
        over_all_7_based = "F";
    }
    else {
        over_all_10_based = num2TenBased(over_all_num);
        over_all_7_based = num2SevenBased(over_all_num);
    }
    return {
        "number": over_all_num, 
        "10-based": over_all_10_based,
        "7-based": over_all_7_based
    };
}

function num2SevenBased(num){
    if (num >= 93)
        return "A";
    else if (num >= 85)
        return "B";
    else if (num >= 77)
        return "C";
    else if (num >= 69)
        return "D";
    else
        return "F"; 
}

function num2TenBased(num){
    if (num >= 90)
        return "A";
    else if (num >= 80)
        return "B";
    else if (num >= 70)
        return "C";
    else if (num >= 60)
        return "D";
    else
        return "F"; 
}

function isValidName(str){
    return /^[a-zA-Z]+$/.test(str);
}

function isValidStudentID(str){
    return /^[1-9][0-9]{8}$/.test(str);
}

function isValidLectureID(str){
    return /^[1-9][0-9]{3}$/.test(str);
}

function searchLecture(lectureID){
    for (let lecture_id in lectures){
        if (lecture_id == lectureID)
            return true;
    }
    return false;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function refreshPage(ms){
    setTimeout(function () {
        location.reload();
    }, ms);
}

function updateLecture(lecture_id, midterm_rate, grade_scale){
    for (let lecture in lectures){
        if (lecture == lecture_id){
            lectures[lecture]["midterm-rate"] = midterm_rate;
            lectures[lecture]["grade-scale"] = grade_scale;
        }
    }
    localStorage.setItem("2469126028lectures2469126028", JSON.stringify(lectures));
}


Student.students_object = loadStudents();
// creating each student as an instance of Student class
for (let studentID in Student.students_object){
    const student = Student.students_object[studentID];
    new Student(studentID, student["first-name"], student["middle-name"], student["last-name"], 
                student["gpa"], student["lectures"], student["total-credit"]);
}


let lectures = loadLectures();
const letter2Num = {"A": 4, "B":3, "C":2, "D":1, "F":0}

