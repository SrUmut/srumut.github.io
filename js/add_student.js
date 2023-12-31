function saveNewStudent(){
    let first_name = document.getElementById("add-student-first-name-input").value;
    let middle_name = document.getElementById("add-student-middle-name-input").value;
    let last_name = document.getElementById("add-student-last-name-input").value;
    const id = document.getElementById("add-student-id-input").value;
    let number_of_lectures = document.getElementById("add-student-lecture-number").value;

    if (!isValidName(first_name) || (!isValidName(middle_name) && middle_name) || !isValidName(last_name)){
        alert("Please provide a valid name.");
        return;
    }

    if (!isValidStudentID(id)){
        alert("Please provide a valid id number.");
        return;
    }

    //capitalizing first letters
    first_name = capitalizeFirstLetter(first_name.toLowerCase());
    last_name = capitalizeFirstLetter(last_name.toLowerCase());

    let name = first_name;
    if (middle_name){
        middle_name = capitalizeFirstLetter(middle_name.toLowerCase());
        name += " " + middle_name + " " + last_name;
    }
    else
        name += " " + last_name;


    if (Student.searchStudentById(id)){
        alert("A student with this id number already exist.");
        return;
    }


    if (!middle_name)
        middle_name = null;

    const new_student_info_obj = {
        "first-name": first_name,
        "middle-name": middle_name,
        "last-name": last_name
    }

    if (number_of_lectures && parseInt(number_of_lectures) > 0){
        number_of_lectures = parseInt(number_of_lectures);
        addLectures2NewStudent(number_of_lectures, new_student_info_obj, id);
    }
    else {
        new_student_info_obj["gpa"] = null;
        new_student_info_obj["lectures"] = {};
        new_student_info_obj["total-credit"] = null;
        Student.registerNewStudent(new_student_info_obj, id);
        refreshPage(500);
    }
    
}

// unhide adding lectures window, appending as much as lecture admin decided to sign student
function addLectures2NewStudent(numberOfLectures, student_info_obj, student_id){
    document.getElementById("add-lectures-to-new-student").classList.remove("hidden");
    document.body.classList.add("no-scroll");

    const lectures_div = document.getElementById("add-student-lectures");

    for (let i = 0; i < parseInt(numberOfLectures); i++){
        const lecture_div = document.createElement("div");

        const lecture_id_input = document.createElement("input");
        lecture_id_input.classList.add("add-student-lecture-id");
        lecture_id_input.setAttribute("placeholder", "lecture id");
        lecture_div.appendChild(lecture_id_input);

        const lecture_midterm_input = document.createElement("input");
        lecture_midterm_input.classList.add("add-student-lecture-midterm");
        lecture_midterm_input.setAttribute("placeholder", "midterm grade");
        lecture_midterm_input.setAttribute("type", "number");
        lecture_midterm_input.setAttribute("min", "0");
        lecture_midterm_input.setAttribute("max", "100");
        lecture_midterm_input.setAttribute("step", "0.01");
        lecture_div.appendChild(lecture_midterm_input);

        const lecture_final_input = document.createElement("input");
        lecture_final_input.classList.add("add-student-lecture-final");
        lecture_final_input.setAttribute("placeholder", "final grade");
        lecture_final_input.setAttribute("type", "number");
        lecture_final_input.setAttribute("min", "0");
        lecture_final_input.setAttribute("max", "100");
        lecture_final_input.setAttribute("step", "0.01");
        lecture_div.appendChild(lecture_final_input);

        lectures_div.appendChild(lecture_div);
        saveLecturesFunction = saveNewLectures(student_info_obj, student_id);
    }
    document.getElementById("add-student-save-lectures-button").addEventListener("click", saveLecturesFunction);

}

function saveNewLectures(student_info_obj, student_id){
    return function(event){
        const lecture_divs = document.querySelectorAll("#add-student-lectures > div");
        const lectures2Save = {};
        const lectures_ids = [];

        for (let lecture_div of lecture_divs){
            const lecture_id = lecture_div.querySelector(".add-student-lecture-id").value;
            let lecture_midterm = lecture_div.querySelector(".add-student-lecture-midterm").value;
            let lecture_final = lecture_div.querySelector(".add-student-lecture-final").value;

            // checking if id is a proper id
            if (!isValidLectureID(lecture_id)){
                alert("Please provide valid lecture id: " + lecture_id);
                return;
            }
            
            // checking if there is any lecture with given id
            if (!searchLecture(lecture_id)){
                alert("There is no lecture with id: " + lecture_id);
                return;
            }

            if(lectures_ids.includes(lecture_id)){
                alert("You can't add a lecture multiple times.");
                return;
            }

            // converting midterm and final to number
            lecture_midterm = parseFloat(lecture_midterm);
            lecture_final = parseFloat(lecture_final);

            if (lecture_midterm < 0 || lecture_midterm > 100 || lecture_final < 0 || lecture_final > 100){
                alert("Grades must be bettwen 0 and 100.");
                return;
            }

            // getting info of the given lecture by lecture_id
            const lecture_info = lectures[lecture_id];

            // getting midterm rate and calculate Overall grade
            const midterm_rate = lecture_info["midterm-rate"];
            const overall_number = lecture_midterm * midterm_rate + lecture_final * (1-midterm_rate);

            let overall;
            if (lecture_final < 40){
                overall = {
                    "number": overall_number,
                    "10-based": "F",
                    "7-based": "F"
                }
            }
            else{
                overall = {
                    "number": overall_number,
                    "10-based": num2TenBased(overall_number),
                    "7-based": num2SevenBased(overall_number)
                }
            }

            lecture = {
                "midterm": lecture_midterm,
                "final": lecture_final,
                "overall": overall
            }

            // adding lecture object to temporary lectures object to hold untill saving new student with all lectures
            lectures2Save[lecture_id] = lecture;
            // add lecture to list to check if any try to sign up a lecture more than 1
            lectures_ids.push(lecture_id);
        }
        const total_credit_and_gpa = Student.calculateTotalCreditAndGPA(lectures2Save);
        student_info_obj["gpa"] = total_credit_and_gpa.gpa;
        student_info_obj["lectures"] = lectures2Save;
        student_info_obj["total-credit"] = total_credit_and_gpa["total-credit"];

        Student.registerNewStudent(student_info_obj, student_id);

        add_student_lectures_section.classList.add("hidden");
        document.body.classList.remove("no-scroll");
        document.getElementById("add-student-lectures").innerHTML = "";
        refreshPage(500);
    }
}

add_student_save_button = document.querySelector("#add-student-save-button");
add_student_save_button.addEventListener("click", saveNewStudent);


add_student_lectures_section = document.getElementById("add-lectures-to-new-student");
//add_student_lectures_section.addEventListener("click", closeLectures);

// variable to store function to attach #add-student-save-lectures-button
let saveLecturesFunction;