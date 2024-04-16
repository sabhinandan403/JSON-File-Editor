
document.addEventListener("DOMContentLoaded", async function () {
    const addPropertyModal = new bootstrap.Modal(document.getElementById('addPropertyModal'), {
        backdrop: false, // or 'true' if you want a backdrop
    });


    const addPropertyModal2 = new bootstrap.Modal(document.getElementById('addPropertyModal2'));
    let user_id;
    let email;
    try {
        user_id = localStorage.getItem('user_id');
        email = localStorage.getItem('email')
        // Fetch data from the API on page load
        const response = await fetch(`/jsonfileeditor/getproperty/${user_id}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
            },

        });
        if (response.ok) {
            const data = await response.json();
            populateTable(data.data);
        } else {
            console.error('Error fetching property data');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // Activate the Add Property modal from navbar
    document.getElementById('add-property-link').addEventListener('click', async function () {

        var selectPropertyTypeDropdown = document.getElementById("filterColumn")

        // Property Type data
        var propertyType = await getPropertyType()
        selectPropertyTypeDropdown.innerHTML = '';

        propertyType.forEach(type => {
            var option = document.createElement('option');
            option.value = type.property_name.trim();
            option.text = type.property_name.trim();
            selectPropertyTypeDropdown.appendChild(option); //

        });

        addPropertyModal.show();
    });
    let arrayValues = []
    filterColumn.addEventListener('change', function () {
        const selectedType = filterColumn.value;

        //Array to store the  values of checkbox labels
        // let checkBoxValues = [];
        // let dropdownValues = [];

        // Clear previous content
        propertyValueContainer.innerHTML = '';
        if (selectedType === 'BOOLEAN') {
            //Check if checkbox button is displayed
            if (document.getElementById('addCheckboxBtn').style.display != 'none' || document.getElementById('addDropdownBtn').style.display != 'none') {
                document.getElementById('addCheckboxBtn').style.display = 'none';
                document.getElementById('addDropdownBtn').style.display = 'none'
            }

            // If BOOLEAN is selected, generate options for the checkbox
            const checkboxTrue = document.createElement('input');
            checkboxTrue.type = 'checkbox';
            checkboxTrue.id = 'newPropertyValueTrue';
            checkboxTrue.name = 'newColumnValue';
            checkboxTrue.value = 'true';

            const labelTrue = document.createElement('label');
            labelTrue.htmlFor = 'newPropertyValueTrue';
            labelTrue.appendChild(document.createTextNode('True'));

            const checkboxFalse = document.createElement('input');
            checkboxFalse.type = 'checkbox';
            checkboxFalse.id = 'newPropertyValueFalse';
            checkboxFalse.name = 'newColumnValue';
            checkboxFalse.value = 'false';

            const labelFalse = document.createElement('label');
            labelFalse.htmlFor = 'newPropertyValueFalse';
            labelFalse.appendChild(document.createTextNode('False'));

            propertyValueContainer.appendChild(checkboxTrue);
            propertyValueContainer.appendChild(labelTrue);
            propertyValueContainer.appendChild(checkboxFalse);
            propertyValueContainer.appendChild(labelFalse);
        } else if (selectedType === 'INTEGER') {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control';
            input.id = 'newPropertyValue';
            input.name = 'newColumnValue';
            propertyValueContainer.appendChild(input);
        }

        else if (selectedType === 'ARRAY(CHECKBOXES)') {
            //Check if checkbox button is displayed
            if (document.getElementById('addDropdownBtn').style.display != 'none') {
                document.getElementById('addDropdownBtn').style.display = 'none'
            }
            addCheckboxButton = document.getElementById('addCheckboxBtn')
            addCheckboxButton.style.display = 'block';
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = 'newCheckboxOption';
            input.name = 'newCheckboxOption';
            input.placeholder = 'Enter label for the checkbox';
            input.style.marginBottom = '10px';
            input.style.marginTop = '10px';
            // Append input to the container
            propertyValueContainer.appendChild(input);

            //Add event listener on addCheckboxBtn


            addCheckboxButton.addEventListener('click', function () {
                // Function to add checkbox dynamically
                addInputFieldForNewCheckbox();
            });


            function addInputFieldForNewCheckbox() {

                // Add value to the array when Add Checkbox is clicked
                let newLabel = document.getElementById("newCheckboxOption").value.trim();
                if (newLabel != '') {
                    arrayValues.push(newLabel);

                    // Create a div element which will hold the remove button and the text of the checkbox
                    const div = document.createElement('div');
                    div.style.display = "flex";
                    div.alignItems = "center";
                    // Create a span element to hold the text of the checkbox
                    const span = document.createElement('span');
                    span.innerText = newLabel + ": ";
                    document.getElementById("newCheckboxOption").value = ''
                    // Create a button element to remove the checkbox from the interface
                    const btn = document.createElement('button');
                    btn.classList.add('close', 'float-none')
                    btn.setAttribute('aria-label', 'Close');
                    btn.onclick = function () { removeCheckboxFromInterface(div) };
                    btn.innerHTML = '&times;'
                    // Append the buttons and the textbox to the div
                    div.append(span, btn)
                    // Append the div to the main container
                    propertyValueContainer.prepend(div)
                } else {
                    alert("Please enter a valid label")
                }
            };
            function removeCheckboxFromInterface(e) {
                e.remove();
                // Get the label associated with the removed checkbox
                const label = e.querySelector('span').innerText.replace(': ', '');

                // Find and remove the label from the checkBoxValues array
                const index = checkBoxValues.indexOf(label);
                if (index !== -1) {
                    checkBoxValues.splice(index, 1);
                }
            }


        }

        else if (selectedType === 'DROPDOWN') {
            //Check if checkbox button is displayed
            if (document.getElementById('addCheckboxBtn').style.display != 'none') {
                document.getElementById('addCheckboxBtn').style.display = 'none'
            }


            addDropdownButton = document.getElementById('addDropdownBtn')
            addDropdownButton.style.display = 'block'


            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = 'newDropdownOption';
            input.name = 'newDropdownOption';
            input.placeholder = 'Enter label for the dropdown';
            input.style.marginBottom = '10px';
            input.style.marginTop = '10px';
            // Append input to the container
            propertyValueContainer.appendChild(input);

            // Add button that will handle adding new dropdown values on click
            addDropdownButton.addEventListener('click', function () {
                // Function to add checkbox dynamically
                addNewDropDownElementForNewProperty();
            });


            function addNewDropDownElementForNewProperty() {
                // Add value to the array when Add Checkbox is clicked
                let newLabel = document.getElementById("newDropdownOption").value;
                if (newLabel != '') {
                    arrayValues.push(newLabel);

                    // Create a div element which will hold the remove button and the text of the checkbox
                    const div = document.createElement('div');
                    div.style.display = "flex";
                    div.alignItems = "center";
                    // Create a span element to hold the text of the checkbox
                    const span = document.createElement('span');
                    span.innerText = newLabel + ": ";
                    document.getElementById("newDropdownOption").value = ''
                    // Create a button element to remove the checkbox from the interface
                    const btn = document.createElement('button');
                    btn.classList.add('close', 'float-none')
                    btn.setAttribute('aria-label', 'Close');
                    btn.onclick = function () { removeDropdownFromInterface(div) };
                    btn.innerHTML = '&times;'
                    // Append the buttons and the textbox to the div
                    div.append(span, btn)
                    // Append the div to the main container
                    propertyValueContainer.prepend(div)
                } else {
                    alert("Please enter a valid label")
                }
            };
            function removeDropdownFromInterface(e) {
                e.remove();
                // Get the label associated with the removed checkbox
                const label = e.querySelector('span').innerText.replace(': ', '');

                // Find and remove the label from the checkBoxValues array
                const index = dropdownValues.indexOf(label);
                if (index !== -1) {
                    dropdownValues.splice(index, 1);
                }
            }
        } else if (selectedType === 'INET') {
            //Check if checkbox button is displayed
            if (document.getElementById('addCheckboxBtn').style.display != 'none' || document.getElementById('addDropdownBtn').style.display != 'none') {
                document.getElementById('addCheckboxBtn').style.display = 'none';
                document.getElementById('addDropdownBtn').style.display = 'none'
            }
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = 'newINETValue';
            input.name = 'newINETValue';
            input.placeholder = 'Enter value';
            input.style.marginBottom = '10px';
            input.style.marginTop = '10px';
            // Append input to the container
            propertyValueContainer.appendChild(input);
        } else {
            //Check if checkbox button is displayed
            if (document.getElementById('addCheckboxBtn').style.display != 'none' || document.getElementById('addDropdownBtn').style.display != 'none') {
                document.getElementById('addCheckboxBtn').style.display = 'none';
                document.getElementById('addDropdownBtn').style.display = 'none'
            }
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = 'newColumnValue';
            input.name = 'newColumnValue';
            input.placeholder = 'Enter value';
            input.style.marginBottom = '10px';
            input.style.marginTop = '10px';
            // Append input to the container
            propertyValueContainer.appendChild(input);
        }
    });

    // Add event listener for the new property form submission
    document.getElementById('newPropertyForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const propertyObject = {};

        for (const [key, value] of formData.entries()) {
            propertyObject[key] = value;
        }
        console.log('property Object after loop :  ', propertyObject)
        var newColumnType = document.getElementById('filterColumn').value
        //console.log(newColumnType)

        if (newColumnType === 'ARRAY(CHECKBOXES)' || newColumnType === 'DROPDOWN') {
            // Set the appropriate column type and options
            propertyObject["newColumnType"] = 'VARCHAR[]';
            propertyObject['property_options'] = arrayValues;

            // Update the modal fields and display them
            document.getElementById('propertyName').value = propertyObject['newColumnName'];
            document.getElementById('propertyType').value = newColumnType;
            document.getElementById('propertyName').style.display = 'block';
            document.getElementById('propertyType').style.display = 'block';
            //document.getElementById('enterValue').style.display = 'block';

            // Display multiselection checkboxes or dropdown based on column type
            if (newColumnType === 'ARRAY(CHECKBOXES)') {
                propertyObject['newColumnValueType'] = 'ARRAY(CHECKBOXES)'
                displayMultiSelectionCheckboxes(propertyObject['property_options']);
            } else if (newColumnType === 'DROPDOWN') {
                propertyObject['newColumnValueType'] = 'DROPDOWN'
                displayDropdown(propertyObject['property_options']);
            }
        } else {
            let container = document.getElementById('enterValue');
            container.innerHTML = ''; // Clear previous content 
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = 'propertyValue';
            input.name = 'propertyValue';
            input.style.marginBottom = '10px';
            input.style.marginTop = '10px';
            document.getElementById('propertyName').value = propertyObject['newColumnName'];
            document.getElementById('propertyType').value = newColumnType;
            
            // Append input to the container
            container.appendChild(input);
            document.getElementById('propertyValue').value = propertyObject['newColumnValue']
            // If not ARRAY(CHECKBOXES) or DROPDOWN, set the column type
            propertyObject["newColumnType"] = newColumnType;
        }

        function displayMultiSelectionCheckboxes(options) {
            const container = document.getElementById('enterValue');
            container.innerHTML = ''; // Clear previous content

            options.forEach(option => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option;
                container.appendChild(checkbox);

                const label = document.createElement('label');
                label.textContent = option;
                container.appendChild(label);

                container.appendChild(document.createElement('br'));
            });
        }

        function displayDropdown(options) {
            const container = document.getElementById('enterValue');
            container.innerHTML = ''; // Clear previous content
            const select = document.createElement('select');
            select.className = 'form-select';
            select.id = 'dropdownValue';
            container.appendChild(select);

            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                select.appendChild(optionElement);
            });
        }

        propertyObject['user_id'] = user_id;
        propertyObject['email'] = email;

        //console.log('propertyObject to be sent to API :', propertyObject )

        // Show Add Property Modal 2
        addPropertyModal2.show();

        // Add event listener for Add Property Modal 2
        document.getElementById('addPropertyBtn').addEventListener('click', async function () {
            // Get the selected values from multiselection checkboxes or dropdown
            const selectedValues = [];
            const enterValueField = document.getElementById('enterValue');
            if (propertyObject.newColumnValueType === 'ARRAY(CHECKBOXES)') {
                // Check if any checkboxes are checked
                const checkboxes = enterValueField.querySelectorAll('#enterValue input[type="checkbox"]:checked');
                console.log(checkboxes.length)
                if (checkboxes.length > 0) {
                    checkboxes.forEach(checkbox => {
                        selectedValues.push(checkbox.value);
                    });
                    
                }
                console.log('selectedValues array is :', selectedValues)
                propertyObject['newColumnValue'] = selectedValues;
            } else if (propertyObject.newColumnValueType === 'DROPDOWN') {
                // Get the selected option from the dropdown
                const dropdown = document.getElementById('dropdownValue');
                console.log(dropdown)
                const selectedOption = dropdown.value;
                console.log(selectedOption)
                if (selectedOption) {
                    selectedValues.push(selectedOption);
                }
                console.log('selectedValues array is :', selectedValues)
                propertyObject['newColumnValue'] = selectedValues;
            }

            // Add key-value pair to propertyObject
            

            console.log('property Object before sending to API:', propertyObject);

            try {
                const response = await fetch('/jsonfileeditor/addproperty', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...propertyObject
                    }),
                });

                if (response.ok) {
                    //successModal.show();
                    setTimeout(() => {
                        //successModal.hide();
                        location.reload();
                    }, 2000);
                } else {
                    console.error('Error adding property');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Add event listeners for edit and delete buttons in the table
    document.getElementById('property-table').addEventListener('click', async function (event) {
        const target = event.target;

        if (target.classList.contains('edit-property')) {
            const propertyName = target.getAttribute('data-property-name');
            const propertyValue = target.getAttribute('data-property-value');


            var editPropertyData = { 'editPropertyName': propertyName, 'editPropertyValue': propertyValue }
            localStorage.setItem('editProperty', JSON.stringify(editPropertyData));
            window.location.href = '/jsonfileeditor/editproperty'


        } else if (target.classList.contains('delete-property')) {
            const propertyName = target.getAttribute('data-property-name');
            // Display confirmation dialog
            const confirmDelete = await Swal.fire({
                icon: 'question',
                title: 'Confirm Deletion',
                text: `Do you want to delete property: ${propertyName.toUpperCase()}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
            });

            if (confirmDelete.isConfirmed) {
                // User clicked 'Yes', proceed with deletion
                await deleteProperty(user_id, email, propertyName);
            }
        }
    });

    // Add event listener for logout
    document.getElementById('logout').addEventListener('click', function () {
        logout();
    });

    // Function to populate the table with property data

    function populateTable(data) {
        const tableBody = document.getElementById('property-table').getElementsByTagName('tbody')[0];

                for (const [key, value] of Object.entries(data)) {
                    // Check if the value contains curly braces
                    if (typeof value === 'string' && value.includes('{') && value.includes('}')) {
                        // Remove curly braces from the value
                        let cleanedValue = value.replace(/{|}/g, '');
                        cleanedValue = cleanedValue.replace(/"/g, '')
                        // Split the cleaned value into parts
                        const parts = cleanedValue.split(',');
                        // Replace the original value with the result
                        data[key] = parts;
                        console.log(data[key]);
                    }
                }

        for (const [key, value] of Object.entries(data)) {
            const row = tableBody.insertRow();
            const uppercaseKey = key.toUpperCase();
            row.innerHTML = `
                <td>${uppercaseKey}</td>
                <td>${value}</td>
                <td>
                    <button class="btn btn-primary edit-property" data-property-name="${key}" data-property-value="${value}"  id="editPropertyBtn">Edit</button>
                    <button class="btn btn-danger delete-property" data-property-name="${key}" id="deletePropertyBtn">Delete</button>
                </td>
            `;
        }
        // const row = tableBody.insertRow();
        // const uppercaseKey = key.toUpperCase();

        // // Create the first td element
        // const td1 = document.createElement('td');
        // td1.textContent = uppercaseKey;

        // // Create the second td element
        // const td2 = document.createElement('td');
        // td2.textContent = value;

        // // Create the Edit button
        // const editButton = document.createElement('button');
        // editButton.className = 'btn btn-primary edit-property';
        // editButton.setAttribute('data-property-name', key);
        // editButton.setAttribute('data-property-value', value);
        // editButton.id = 'editPropertyBtn';
        // editButton.textContent = 'Edit';

        // // Create the Delete button
        // const deleteButton = document.createElement('button');
        // deleteButton.className = 'btn btn-danger delete-property';
        // deleteButton.setAttribute('data-property-name', key);
        // deleteButton.id = 'deletePropertyBtn';
        // deleteButton.textContent = 'Delete';

        // // Create the third td element and append buttons
        // const td3 = document.createElement('td');
        // td3.appendChild(editButton);
        // td3.appendChild(deleteButton);

        // // Append td elements to the row
        // row.appendChild(td1);
        // row.appendChild(td2);
        // row.appendChild(td3);

    }

    // Toast notification 
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });


    //Function to get property types from property_type_master table
    async function getPropertyType() {

        try {
            const response = await fetch('/jsonfileeditor/getpropertytype', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status == 200) {
                var result = await response.json()
                // Toast.fire({
                //     icon: 'success',
                //     title: 'Got Property types',
                //     text: ' Successfully get property types from database'
                // })
                return result.data
            } else {
                console.error('Error getting property type from property type master table');
                // Toast.fire({
                //     icon: 'error',
                //     text: 'getting property type from property type master table'
                // })
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                text: 'Internal Server Error'
            })
            console.error('Error:', error);
        }
    }

    // function to prevent user to go back after logout
    function preventBackNavigation(replaceState = false) {
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
    }

    // Function to handle logout
    async function logout() {
        try {
            const response = await fetch('/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Include credentials for session handling
            })

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Successfull',
                    text: 'Logged out successfully'
                });

                setTimeout(() => {
                    preventBackNavigation(true);
                    window.location.replace('/login') //
                }, 2000)

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cannot log out'
                });
                console.error('Error logging out')
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Internal Server Error'
            });
            console.log('Error:', error)
        }
    }
    // Function to delete property
    async function deleteProperty(user_id, email, propertyName) {
        try {
            const response = await fetch('/jsonfileeditor/deleteproperty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id,
                    email: email,
                    property_name: propertyName,
                }),
            });

            if (response.status == 200) {
                window.location.href = '/home'
            } else if (response.status == 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'User is unauthorized. Please login first'
                });

                setTimeout(() => {
                    preventBackNavigation(true);
                    window.location.replace('/login') //
                }, 2000)

            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});


