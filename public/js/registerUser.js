// Set global SweetAlert options
const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
const showErrorAlert = (messages) => {
    Toast.fire({
        icon: 'error',
        title: 'Error',
        //   html: messages.map((msg) => `<p>${msg}</p>`).join(''),
        html: `<ol>${messages.map((msg) => `<li>${msg}</li>`).join('\n')}</ol>`,
    });
};

const showSuccessAlert = (message) => {
    Toast.fire({
        icon: 'success',
        title: 'Success',
        text: message,
    });
};

const showError = (input) => {
    const formControl = input.parentElement;
    formControl.classList.add('error');
};

const showSuccess = (input) => {
    const formControl = input.parentElement;
    formControl.classList.remove('error');
};

const checkEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const checkPasswordStrength = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
};

const hasUpperCase = (password) => /[A-Z]/.test(password);
const hasLowerCase = (password) => /[a-z]/.test(password);
const hasNumber = (password) => /\d/.test(password);
const hasSpecialCharacter = (password) => /[!@#$%^&*]/.test(password);

const registerUser = async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorMessages = [];

    if (!username) {
        showError(document.getElementById('username'))
        errorMessages.push('Username is mandatory');
    }
    
    if (!password) {
        showError(document.getElementById('password'))
        errorMessages.push('Password is mandatory');
    } else if (!checkPasswordStrength(password)) {
        // showError(document.getElementById('password'))
        // errorMessages.push('Password should be at least 8 characters long, containing atleast 1 special character,1 lowercase character, 1 uppercase character and 1 number.')
        if (!hasUpperCase(password)) {
            showError(document.getElementById('password'))
            errorMessages.push('Password should contain at least one uppercase letter.');
        }
        if (!hasLowerCase(password)) {
            showError(document.getElementById('password'))
            errorMessages.push('Password should contain at least one lowercase letter.');
        }
        if (!hasNumber(password)) {
            showError(document.getElementById('password'))
            errorMessages.push('Password should contain at least one number.');
        }
        if (!hasSpecialCharacter(password)) {
            showError(document.getElementById('password'))
            errorMessages.push('Password should contain at least one special character.');
        }
    }

    if (!confirmPassword) {
        showError(document.getElementById('confirmPassword'))
        errorMessages.push('Confirm password is mandatory');
    }

    if (!email) {
        // Handle empty email case
        showError(document.getElementById('email'));
        errorMessages.push('Email is mandatory');
    } else if (!checkEmailFormat(email)) {
        // Handle invalid email format case
        showError(document.getElementById('email'));
        errorMessages.push('Invalid email format');
    }

    if (password !== confirmPassword) {
        showError(document.getElementById('confirmPassword'))
        errorMessages.push('Passwords do not match');
    }

    if (errorMessages.length > 0) {
        showErrorAlert(errorMessages);
    } else {
        const data = {
            username,
            email,
            password
        };

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            //const result = await response.json();

            if (response.ok) {
                showSuccessAlert('Registration successful!');
                setTimeout(() =>{
                window.location.href = 'http://localhost:3000/login';},2000);
            } else {
                showErrorAlert([response.message || 'Error in registration']);
            }
        } catch (error) {
            console.error('Error during registration', error);
            showErrorAlert(['Error in registration']);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    //Swal.fire.defaults.position = 'bottom-end';
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser();
    });
});
