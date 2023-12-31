function showStudents(event){
    if (students_section.classList.contains("hidden")){
        students_section.classList.remove("hidden");

        add_student.classList.add("hidden");
        lectures_section.classList.add("hidden");

        event.currentTarget.style.border = "3px solid blue";

        add_student_button.style.border = "";
        lectures_button.style.border = "";
    }
}

function showAddStudent(event){
    if (add_student.classList.contains("hidden")){
        add_student.classList.remove("hidden");

        students_section.classList.add("hidden");
        lectures_section.classList.add("hidden");

        event.currentTarget.style.border = "3px solid blue";

        students_button.style.border = "";
        lectures_button.style.border = "";
    }
}

function showLectures(event){
    if(lectures_section.classList.contains("hidden")){
        lectures_section.classList.remove("hidden");

        students_section.classList.add("hidden");
        add_student.classList.add("hidden");

        event.currentTarget.style.border = "3px solid blue";

        students_button.style.border = "";
        add_student_button.style.border = "";
    }
}

const students_section = document.getElementById("students-section");
const add_student = document.getElementById("add-student");
const lectures_section = document.getElementById("lectures-section");

const students_button = document.getElementById("students-nav-button");
students_button.addEventListener("click", showStudents);
students_button.style.border = "3px solid blue";

const add_student_button = document.getElementById("add-student-nav-button");
add_student_button.addEventListener("click", showAddStudent);

const lectures_button = document.getElementById("lectures-nav-button");
lectures_button.addEventListener("click", showLectures);

