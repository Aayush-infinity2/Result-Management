let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let students = JSON.parse(localStorage.getItem("students")) || [];

const headerRow = document.getElementById("headerRow");
const tableBody = document.getElementById("tableBody");

const totalEl = document.getElementById("total");
const passEl = document.getElementById("pass");
const failEl = document.getElementById("fail");

let barChart = null;
let pieChart = null;


function getTotalMarks(student) {
    return subjects.reduce((sum, s) => sum + (student.marks[s] || 0), 0);
}

function getAverage(student) {
    return subjects.length === 0 ? 0 : getTotalMarks(student) / subjects.length;
}

function getStatus(student) {
    return getAverage(student) >= 50 ? "Pass" : "Fail";
}


function renderTable(data = students) {
    headerRow.innerHTML = "";
    tableBody.innerHTML = "";

    headerRow.innerHTML += "<th>Name</th><th>Roll</th><th>Course</th>";
    subjects.forEach(sub => {
        headerRow.innerHTML += `<th onclick="sortBySubject('${sub}')">${sub}</th>`;
    });
    headerRow.innerHTML += "<th>Total</th><th>Result</th><th>Action</th>";

    data.forEach(stu => {
        let row = `<tr>
            <td>${stu.name}</td>
            <td>${stu.roll}</td>
            <td>${stu.course}</td>`;

        subjects.forEach(sub => {
            row += `<td>${stu.marks[sub] ?? 0}</td>`;
        });

        row += `<td>${getTotalMarks(stu)}</td>
                <td>${getStatus(stu)}</td>
                <td>
                    <button class="delete-btn" onclick="deleteStudent('${stu.roll}')">
                        🗑️
                    </button>
                </td>
        </tr>`;

        tableBody.innerHTML += row;
    });

    updateStats();
    renderCharts();
}

function deleteStudent(roll) {
    if(confirm("Are you sure you want to delete this student?")) {
        students = students.filter(s => s.roll !== roll);
        localStorage.setItem("students", JSON.stringify(students));
        renderTable();
    }
}

function updateStats() {
    const passCount = students.filter(s => getStatus(s) === "Pass").length;
    totalEl.innerText = students.length;
    passEl.innerText = passCount;
    failEl.innerText = students.length - passCount;
}

function sortBySubject(subject) {
    students.sort((a, b) => (b.marks[subject] || 0) - (a.marks[subject] || 0));
    localStorage.setItem("students", JSON.stringify(students));
    renderTable();
}


function searchStudent() {
    const key = document.getElementById("search").value.toLowerCase();
    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(key) ||
        s.roll.toLowerCase().includes(key)
    );
    renderTable(filtered);
}


function renderCharts() {
    const passCount = students.filter(s => getStatus(s) === "Pass").length;
    const failCount = students.length - passCount;

    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();

    const barCtx = document.getElementById("barChart").getContext("2d");
    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: ["Pass", "Fail"],
            datasets: [{
                label: "Students",
                data: [passCount, failCount],
                backgroundColor: ["#22c55e", "#ef4444"]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    const pieCtx = document.getElementById("pieChart").getContext("2d");
    pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: ["Pass", "Fail"],
            datasets: [{
                data: [passCount, failCount],
                backgroundColor: ["#22c55e", "#ef4444"]
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}


function exportCSV() {
    let csv = [];
    let header = ["Name", "Roll", "Course", ...subjects, "Total", "Result"];
    csv.push(header.join(","));

    students.forEach(stu => {
        let row = [stu.name, stu.roll, stu.course];
        subjects.forEach(sub => row.push(stu.marks[sub] ?? 0));
        row.push(getTotalMarks(stu));
        row.push(getStatus(stu));
        csv.push(row.join(","));
    });

    const csvString = csv.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_results.csv";
    link.click();
}


renderTable();
