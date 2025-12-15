function calculateResult() {
    let name = document.getElementById("name").value;
    let marks = document.getElementById("marks").value;

    let result = "";
    let grade = "";

    if (marks >= 40) {
        result = "Pass";
    } else {
        result = "Fail";
    }

    if (marks >= 80) grade = "A";
    else if (marks >= 60) grade = "B";
    else if (marks >= 40) grade = "C";
    else grade = "F";

    document.getElementById("output").innerHTML =
        "Name: " + name + "<br>Result: " + result + "<br>Grade: " + grade;
}
