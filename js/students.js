function displayStudents(students){
    const studentsSection = document.getElementById("students");

    for (let student of students) {
        const studentContainer = document.createElement("div");
    
        const idSpan = document.createElement("span");
        idSpan.classList.add("student-id");
        const nameSpan = document.createElement("span");
        nameSpan.classList.add("student-name");
        const gpaSpan = document.createElement("span");
        gpaSpan.classList.add("student-gpa");
    
        idSpan.textContent = student.id;
        nameSpan.textContent = student.name;
        gpaSpan.textContent = student.gpa2Display;
    
        studentContainer.appendChild(idSpan);
        studentContainer.appendChild(nameSpan);
        studentContainer.appendChild(gpaSpan);
    
        studentsSection.appendChild(studentContainer);
        studentContainer.addEventListener("click", studentStats(student));
        studentContainer.style.cursor = "pointer";
    }
}
  
function clearDisplayedStudents(){
    studentsSection.innerHTML = "";
}

function clear(){
    clearDisplayedStudents();
    displayStudents(Student.students);
    document.querySelector("#search-section > input").value = "";
}

function search(){
    clearDisplayedStudents();
    const searchBy = document.getElementById("search-by-option").value;
    const searchText = document.querySelector("#search-section > input").value;

    // if input is empty then display all students
    if (!searchText)
        displaydisplayStudents(Student.students);
    else{
        const students2Display = [];
        if (searchBy == "student-id") {
            for (let student of Student.students) {
                if (student.id.includes(searchText))
                    students2Display.push(student)
            }
        }
        else {  // searchBy == "student-name"
            for (let student of Student.students) {
                if (student.name.toLowerCase().includes(searchText.toLowerCase()))
                    students2Display.push(student)
            }
        }
        for (let student of students2Display) {
            const studentContainer = document.createElement("div");
        
            const idSpan = document.createElement("span");
            idSpan.classList.add("student-id");
            const nameSpan = document.createElement("span");
            nameSpan.classList.add("student-name");
            const gpaSpan = document.createElement("span");
            gpaSpan.classList.add("student-gpa");
        
            idSpan.textContent = student.id;
            nameSpan.textContent = student.name;
            gpaSpan.textContent = student.gpa2Display;
        
            studentContainer.appendChild(idSpan);
            studentContainer.appendChild(nameSpan);
            studentContainer.appendChild(gpaSpan);
        
            studentsSection.appendChild(studentContainer);
            studentContainer.addEventListener("click", studentStats(student));
            studentContainer.style.cursor = "pointer";
          }
    }
}

function studentStats(student){
    return function (){
        stats_window.querySelector(".student-id").textContent = student.id;
        stats_window.querySelector(".student-name").textContent = student.name;
        stats_window.querySelector(".student-gpa").textContent = student.gpa2Display;
        
        for (let lectureID in student.lectures){
            const lectureContainer = document.createElement("div");
            lectureContainer.classList.add();

            // create tags for lecture
            const lectureIDSpan = document.createElement("span");
            const lectureNameSpan = document.createElement("span");
            const lectureCreditSpan = document.createElement("span");
            const lectureMidtermInput = document.createElement("input");
            const lectureFinalInput = document.createElement("input");
            const lectureOverallSpan = document.createElement("span");

            // add to classes
            lectureIDSpan.classList.add("lecture-id");
            lectureNameSpan.classList.add("lecture-name");
            lectureCreditSpan.classList.add("lecture-credit");
            lectureMidtermInput.classList.add("lecture-midterm");
            lectureFinalInput.classList.add("lecture-final");
            lectureOverallSpan.classList.add("lecture-overall");

            // load the content
            lectureIDSpan.textContent = lectureID;
            lectureNameSpan.textContent = lectures[lectureID]["lecture-name"];
            lectureCreditSpan.textContent = lectures[lectureID]["credit"];
            lectureMidtermInput.value = student.lectures[lectureID]["midterm"];
            lectureFinalInput.value = student.lectures[lectureID]["final"];
            lectureOverallSpan.textContent = student.lectures[lectureID]["overall"][lectures[lectureID]["grade-scale"]];

            // append to container
            lectureContainer.appendChild(lectureIDSpan);
            lectureContainer.appendChild(lectureNameSpan);
            lectureContainer.appendChild(lectureCreditSpan);
            lectureContainer.appendChild(lectureMidtermInput);
            lectureContainer.appendChild(lectureFinalInput);
            lectureContainer.appendChild(lectureOverallSpan);

            // append container to screen
            document.getElementById("student-lectures").appendChild(lectureContainer);
        }

        document.body.classList.add("no-scroll");
        student_stats.classList.remove("hidden");
        document.getElementById("save-lectures").addEventListener("click", saveLectures(student));
    }
}

function closeStudentStats(event){
    // if clicked out of the stats_window which is half black bacground, close the stats
    if (event.target == event.currentTarget){
        document.body.classList.remove("no-scroll");
        student_stats.classList.add("hidden");
        document.getElementById("student-lectures").innerHTML = "";
        document.getElementById("save-lectures").removeEventListener("click", saveLectures);
    }
}



function saveLectures(student){
    return function(){
        const studentLectureDivs = document.querySelectorAll("#student-lectures > *");
        const newLectureGrades = {};
        
        for (let lectureDiv of studentLectureDivs){
            const lectureID = lectureDiv.querySelector(".lecture-id").textContent;
            const lecture = student.lectures[lectureID];
            const lectureMidterm = lectureDiv.querySelector(".lecture-midterm").value;
            const lectureFinal = lectureDiv.querySelector(".lecture-final").value;

            const lectureMidtermNum = parseFloat(lectureMidterm);
            const lectureFinalNum = parseFloat(lectureFinal);

            newGrades = {
                "midterm": null,
                "final": null,
                "overall": {"number": null, "10-based": null, "7-based": null}
            }

            // if any exam input includes non numeric character or not between 0 and 100 pop an alert
            if ((lectureMidterm.length && isNaN(lectureMidtermNum) || (lectureFinal.length && isNaN(lectureFinalNum))) || lectureMidtermNum < 0 || lectureMidtermNum > 100 || lectureFinalNum < 0 || lectureFinalNum > 100){
                alert("Provide numbers between 0 and 100.");
                return;
            }

            // if both exam grades given empty
            if (isNaN(lectureMidtermNum) && isNaN(lectureFinalNum)){
                newLectureGrades[lectureID] = newGrades;
            }
            // if midterm was not given but final was that pop an alert
            else if(isNaN(lectureMidtermNum) && !isNaN(lectureFinalNum)){
                alert("You cant provide just final grade for any lecture!");
                return;
            }
            // if midterm was given and final was not
            else if (!isNaN(lectureMidtermNum) && isNaN(lectureFinalNum)){
                newGrades.midterm = lectureMidtermNum;
                newLectureGrades[lectureID] = newGrades;
            }
            // if both exam grades given properly
            else{
                newGrades.midterm = lectureMidtermNum;
                newGrades.final = lectureFinalNum;
                newGrades.overall = getOverall(newGrades.midterm, newGrades.final, lectures[lectureID]["midterm-rate"]);
                newLectureGrades[lectureID] = newGrades;
            }
        }
        

        student.lectures = newLectureGrades;
        Student.updateStudentLectures(student.id, student.lectures);
        refreshPage(200);
    }
}

displayStudents(Student.students);

const studentsSection = document.getElementById("students");

document.getElementById("search-button").addEventListener("click", search);
document.getElementById("clear-button").addEventListener("click", clear);

const student_stats = document.getElementById("student-stats");
student_stats.addEventListener("click", closeStudentStats);
const stats_window = student_stats.querySelector("#stats-window");
