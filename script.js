document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const studentRecords = document.querySelector('#studentRecords tbody');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentName = document.getElementById('studentName').value;
        const studentId = document.getElementById('studentId').value;
        const emailId = document.getElementById('emailId').value;
        const contactNo = document.getElementById('contactNo').value;

        if (validateInputs(studentName, studentId, emailId, contactNo)) {
            if (!isStudentIdExists(studentId)) {
                addStudentRecord(studentName, studentId, emailId, contactNo);
                form.reset();
            } else {
                alert('Student ID already exists. Please use a different ID.');
            }
        }
    });

    function validateInputs(name, id, email, contact) {
        const idRegex = /^\d+$/;
        const contactRegex = /^\d+$/;
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!idRegex.test(id)) {
            alert('Student ID should be a number.');
            return false;
        }
        if (!contactRegex.test(contact)) {
            alert('Contact number should be a number.');
            return false;
        }
        if (!nameRegex.test(name)) {
            alert('Student name should contain only characters.');
            return false;
        }
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        return true;
    }

    function isStudentIdExists(id) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        return students.some(student => student.id === id);
    }

    function addStudentRecord(name, id, email, contact) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${id}</td>
            <td>${email}</td>
            <td>${contact}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        studentRecords.appendChild(row);

        saveToLocalStorage(name, id, email, contact);
    }

    function saveToLocalStorage(name, id, email, contact) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push({ name, id, email, contact });
        localStorage.setItem('students', JSON.stringify(students));
    }

    function loadFromLocalStorage() {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        students.forEach(student => {
            addStudentRecord(student.name, student.id, student.email, student.contact);
        });
    }

    loadFromLocalStorage();

    studentRecords.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            editStudentRecord(e.target);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteStudentRecord(e.target);
        }
    });

    function editStudentRecord(button) {
        const row = button.parentElement.parentElement;
        const cells = row.querySelectorAll('td');
        document.getElementById('studentName').value = cells[0].innerText;
        document.getElementById('studentId').value = cells[1].innerText;
        document.getElementById('emailId').value = cells[2].innerText;
        document.getElementById('contactNo').value = cells[3].innerText;

        deleteStudentRecord(button);
    }

    function deleteStudentRecord(button) {
        const row = button.parentElement.parentElement;
        const id = row.children[1].innerText;
        row.remove();
        removeFromLocalStorage(id);
    }

    function removeFromLocalStorage(id) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
    }
});
