let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let students = JSON.parse(localStorage.getItem("students")) || [];

const subjectSelect = document.getElementById("subject");
const msg = document.getElementById("msg");


function loadSubjects() {
    subjectSelect.innerHTML = "";

    if (subjects.length === 0) {
        const opt = document.createElement("option");
        opt.innerText = "Add a subject first";
        opt.value = "";
        subjectSelect.appendChild(opt);
        return;
    }

    subjects.forEach(sub => {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.innerText = sub;
        subjectSelect.appendChild(opt);
    });
}

function addSubject() {
    const sub = document.getElementById("newSubject").value.trim();
    if (!sub) return;

    if (subjects.includes(sub)) {
        msg.innerText = "Subject already exists";
        msg.style.color = "red";
        return;
    }

    subjects.push(sub);


    students.forEach(stu => {
        stu.marks[sub] = 0;
    });

    saveAll();
    loadSubjects();

    msg.innerText = "Subject added successfully";
    msg.style.color = "green";

    document.getElementById("newSubject").value = "";
}


function removeSubject() {
    const sub = subjectSelect.value;
    if (!sub) return;

    subjects = subjects.filter(s => s !== sub);

    students.forEach(stu => {
        delete stu.marks[sub];
    });

    saveAll();
    loadSubjects();

    msg.innerText = "Subject removed";
    msg.style.color = "green";
}


function saveResult() {
    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const course = document.getElementById("course").value.trim();
    const subject = subjectSelect.value;
    const marks = parseInt(document.getElementById("marks").value);

    if (!name || !roll || !course) {
        msg.innerText = "Please fill student details";
        msg.style.color = "red";
        return;
    }

    if (!subject) {
        msg.innerText = "Please add and select a subject first";
        msg.style.color = "red";
        return;
    }

    if (isNaN(marks) || marks < 0 || marks > 100) {
        msg.innerText = "Enter valid marks (0–100)";
        msg.style.color = "red";
        return;
    }

    let student = students.find(s => s.roll === roll);

    if (!student) {
        let marksObj = {};
        subjects.forEach(s => marksObj[s] = 0);

        student = {
            name,
            roll,
            course,
            marks: marksObj
        };
        students.push(student);
    }

    student.marks[subject] = marks;

    saveAll();

    msg.innerText = "Result saved successfully ✅";
    msg.style.color = "green";

    document.getElementById("marks").value = "";
}


function saveAll() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    localStorage.setItem("students", JSON.stringify(students));
}

loadSubjects();
