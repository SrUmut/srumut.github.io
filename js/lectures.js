function showLectures(){
    const lectures = loadLectures();
    const lectures_section = document.getElementById("lectures");

    for (let lecture_id in lectures){
        const lecture_container = document.createElement("div");

        const lecture_id_span = document.createElement("span");
        const lecture_name_span = document.createElement("span");
        const lecture_credit_span = document.createElement("span");
        const lecture_grade_scale_span = document.createElement("span");
        const lecture_midterm_rate_span = document.createElement("span");

        lecture_id_span.classList.add("lecture-id");
        lecture_name_span.classList.add("lecture-name");
        lecture_credit_span.classList.add("lecture-credit");
        lecture_grade_scale_span.classList.add("lecture-grade-scale");
        lecture_midterm_rate_span.classList.add("lecture-midterm-rate");

        lecture_id_span.textContent = lecture_id;
        lecture_name_span.textContent = lectures[lecture_id]["lecture-name"];
        lecture_credit_span.textContent = lectures[lecture_id]["credit"];
        lecture_grade_scale_span.textContent = lectures[lecture_id]["grade-scale"];
        lecture_midterm_rate_span.textContent = lectures[lecture_id]["midterm-rate"];

        lecture_container.appendChild(lecture_id_span);
        lecture_container.appendChild(lecture_name_span);
        lecture_container.appendChild(lecture_credit_span);
        lecture_container.appendChild(lecture_grade_scale_span);
        lecture_container.appendChild(lecture_midterm_rate_span);

        lecture_container.addEventListener("click", lectureDetails(lecture_id));
        lecture_container.style.cursor = "pointer";

        lectures_section.appendChild(lecture_container);
    }
}

function lectureDetails(lecture_id){
    return function(event){
        const lectures = loadLectures();
        const lecture_details = document.getElementById("lecture-details");
        lecture_details.classList.remove("hidden");

        document.getElementById("lecture-id").textContent = lecture_id;
        document.getElementById("lecture-name").textContent = lectures[lecture_id]["lecture-name"];
        document.getElementById("lecture-credit").textContent = lectures[lecture_id]["credit"];

        const grade_scale = document.getElementById("lecture-grade-scale");
        grade_scale.value = lectures[lecture_id]["grade-scale"];
        const midterm_rate_span = document.getElementById("lecture-midterm-rate");
        midterm_rate_span.value = lectures[lecture_id]["midterm-rate"];

        const save_button = document.querySelector("#lecture-details button");
        save_button.addEventListener("click", saveNewMidtermRate(lecture_id));
    }
}

function saveNewMidtermRate(lecture_id){
    return function(event){
        let new_midterm_rate = document.getElementById("lecture-midterm-rate").value;
        const new_grade_scale = document.getElementById("lecture-grade-scale").value;

        new_midterm_rate = parseFloat(new_midterm_rate);
        if (new_midterm_rate <= 0 || new_midterm_rate >= 1 || !new_midterm_rate){
            alert("Midterm rate must be between 0 and 100 both exclusive.");
            return;
        }

        Student.updateAllStudentsOveralls(lecture_id, new_midterm_rate);
        updateLecture(lecture_id, new_midterm_rate, new_grade_scale);
        Student.updateAllStudentsGPA();
        refreshPage(500);
    };
}

function closeLectureDetails(event){
    if (event.target == event.currentTarget){
        refreshPage(50);
    }
}

document.getElementById("lecture-details").addEventListener("click", closeLectureDetails);
showLectures();
