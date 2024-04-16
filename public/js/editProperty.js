

document.addEventListener("DOMContentLoaded", async function () {
    // Add event listener for logout
    document.getElementById('logout').addEventListener('click', function () {
        logout();
    });

    // Function to handle logout
    async function logout() {
        try {
            const response = await fetch('/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Include credentials for session handling
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully Logged Out',
                    text: 'Logged out successfully.'
                });

                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cannot log out.'
                });
                console.error('Error logging out');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Internal Server Error.'
            });
            console.log('Error:', error);
        }
    }

    // Get editPropertyData from localStorage
    const editPropertyData = JSON.parse(localStorage.getItem('editProperty'));
    console.log(editPropertyData);

    let property_options;
    let property_type;
    // Check if editPropertyData exists
    if (editPropertyData) {
        // Fill values in input fields
        var uppercasePropertyName = editPropertyData.editPropertyName.toUpperCase();
        document.getElementById('propertyName').value = uppercasePropertyName;

        try {
            // Call fetch API to get property options
            const response = await fetch(`/jsonfileeditor/getpropertyoptions/${editPropertyData.editPropertyName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                ({ property_options, property_type } = responseData.data);

                if (property_type === 'ARRAY(CHECKBOXES)') {

                    const optionsDiv = document.getElementById('activeOutputModuleOptions');
                    property_options.forEach(option => {
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.name = 'modules[]';
                        checkbox.value = option;
                        checkbox.style.margin = '5px'
                        checkbox.id = option.toLowerCase();

                        const label = document.createElement('label');
                        label.htmlFor = option.toLowerCase();
                        label.style.margin = '3px'
                        label.appendChild(document.createTextNode(option));

                        optionsDiv.appendChild(checkbox);
                        optionsDiv.appendChild(label);

                        if (editPropertyData.editPropertyValue.includes(option)) {
                            checkbox.checked = true;
                        }
                        document.getElementById('activeOutputModuleOptions').style.display = 'block';
                    });
                } else if (property_type === 'DROPDOWN') {

                    const dropdown = document.getElementById('modeDropdown');
                    property_options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.text = option;
                        dropdown.appendChild(optionElement);
                    });

                    dropdown.value = editPropertyData.editPropertyValue;
                    document.getElementById('modeOptions').style.display = 'block';
                } 
                // else {
                   
                // }
            } else {
                document.getElementById('propertyValue').style.display = 'block';
                document.getElementById('propertyValue').value = editPropertyData.editPropertyValue;
                console.error('Error fetching property options:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching property options:', error);
        }
    }

    // Add event listener on Save button
    document.getElementById('editPropertyForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Get updated property value based on the input type
        let newPropertyValue;
        if (property_type === 'ARRAY(CHECKBOXES)') {
            const selectedModules = Array.from(document.querySelectorAll('input[name="modules[]"]:checked')).map(module => module.value);
            newPropertyValue = selectedModules.join(',');
        } else if (property_type === 'DROPDOWN') {
            newPropertyValue = document.getElementById('modeDropdown').value;
        } else {
            newPropertyValue = document.getElementById('propertyValue').value;
        }

        // Show SweetAlert confirmation dialog
        const confirmEdit = await Swal.fire({
            icon: 'question',
            title: 'Confirm Edit',
            text: 'Do you want to save changes?',
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            cancelButtonText: 'Discard Changes',
        });
        
        if (confirmEdit.isConfirmed) {
            
            try {
                // Call fetch API to update property
                const response = await fetch('/jsonfileeditor/updateproperty', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: localStorage.getItem('user_id'),
                        email: localStorage.getItem('email'),
                        columnname: editPropertyData.editPropertyName,
                        newValue: newPropertyValue,
                        property_type:property_type
                    }),
                });

                if (response.ok) {
                    // Redirect to localhost:3000/home on success
                    window.location.href = '/home';
                }
            } catch (error) {
                console.error('Error:', error);
                // Show failure modal on fetch error
                $('#failureModal').modal('show');
            }
        } else {
            // User clicked 'Discard Changes', redirect to localhost:3000/home
            window.location.href = '/home';
        }
    });

    // Add event listener to redirect to localhost:3000/home on OK button click in failure modal
    document.getElementById('failureModalOKBtn').addEventListener('click', function () {
        window.location.href = '/home';
    });

    // Prevent back navigation
    function preventBackNavigation(replaceState = false) {
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
    }
});
