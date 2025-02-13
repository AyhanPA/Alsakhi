
function showToast(message) {
    const toastEl = document.getElementById('customToast');
    const toastBody = document.getElementById('toastMessage');


    toastBody.innerText = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

let activeCell;  // To store the currently clicked cell


// Log when the script starts
console.log("Script Loaded and Running");


document.querySelectorAll("td:nth-child(5)").forEach((cell, index) => {
    console.log(`Adding event listener to cell ${index + 1}`);
    
    // Change to dblclick event
    cell.addEventListener("dblclick", function() {
        console.log("Date cell double-clicked!");


        activeCell = cell;  // Store the clicked cell
        const currentDate = activeCell.textContent.trim(); // Get the current date from the cell
        console.log("Current Date in Cell: ", currentDate);


        const [day, month] = currentDate.split('/'); // Extract day and month
        console.log("Extracted Day: ", day, "Extracted Month: ", month);


        // Set the day and month values in the select elements
        document.getElementById("select-day").value = day || "01"; // Default to "01" if no day is present
        document.getElementById("select-month").value = month || "01"; // Default to "01" if no month is present


        // Show the popup
        document.getElementById("date-popup").style.display = "flex"; 
        console.log("Popup should be displayed now.");
    });
});


// Save Date Button: Update the cell with the selected date
document.getElementById("save-date").addEventListener("click", function() {
    console.log("Save Date button clicked!");


    const day = document.getElementById("select-day").value;
    const month = document.getElementById("select-month").value;
    const newDate = `${day}/${month}/2025`; // Format the new date with year 2025
    console.log("New Date to Save: ", newDate);


    if (activeCell) {
        activeCell.textContent = newDate;  // Update the cell with the new date
        console.log("Cell Updated with Date: ", newDate);
    }


    document.getElementById("date-popup").style.display = "none"; // Close the popup
    console.log("Popup Closed");
});


// Cancel Button: Close the popup without saving
document.getElementById("cancel-date").addEventListener("click", function() {
    console.log("Cancel button clicked. Closing the popup without saving.");
    document.getElementById("date-popup").style.display = "none"; // Close the popup
});



        let activeElement;
        let originalText = "";
        let originalFontSize = "";
        let originalFontStyle = "";
// Double-click to open the popup
document.querySelectorAll("td, th").forEach(cell => {
    cell.addEventListener("dblclick", () => {
        activeElement = cell;
        document.querySelector(".editor-popup").style.display = "block";

        // Store original values
        originalText = cell.textContent;
        originalFontSize = parseInt(window.getComputedStyle(cell).fontSize, 10); // Ensure numeric font size
        originalFontStyle = window.getComputedStyle(cell).fontStyle;

        // Populate popup fields
        document.getElementById("cell-text").value = originalText;
        document.getElementById("font-slider").value = originalFontSize;
        document.getElementById("font-style").value = originalFontStyle;
        document.getElementById("font-size-display").textContent = `${originalFontSize}px`;

        // Populate preview
        updateLivePreview();
    });
});

// Update preview text dynamically and synchronize slider
document.getElementById("cell-text").addEventListener("input", updateLivePreview);
document.getElementById("font-slider").addEventListener("input", (e) => {
    const fontSize = e.target.value;
    document.getElementById("font-size-display").textContent = `${fontSize}px`;

    // Apply the font size to the active element in real-time
    if (activeElement) {
        activeElement.style.fontSize = `${fontSize}px`;
    }
});
document.getElementById("font-style").addEventListener("change", updateLivePreview);

// Synchronize font size display on popup close or save
function updateLivePreview() {
    const preview = document.getElementById("preview-text");
    const fontSize = document.getElementById("font-slider").value;
    preview.textContent = document.getElementById("cell-text").value;
    preview.style.fontSize = `${fontSize}px`;
    preview.style.fontStyle = document.getElementById("font-style").value;

    // Update slider value display dynamically
    document.getElementById("font-size-display").textContent = `${fontSize}px`;
}

// Save changes
document.getElementById("save-edit").addEventListener("click", () => {
    const newText = document.getElementById("cell-text").value;
    const newFontSize = document.getElementById("font-slider").value + "px";
    const newFontStyle = document.getElementById("font-style").value;

    // Apply changes to the active element
    if (activeElement) {
        activeElement.textContent = newText;
        activeElement.style.fontSize = newFontSize;
        activeElement.style.fontStyle = newFontStyle;
    }

    closePopup();
});

// Cancel editing
document.getElementById("cancel-edit").addEventListener("click", closePopup);

// Reset changes
document.getElementById("reset-edit").addEventListener("click", () => {
    document.getElementById("cell-text").value = originalText;
    document.getElementById("font-slider").value = originalFontSize;
    document.getElementById("font-style").value = originalFontStyle;
    document.getElementById("font-size-display").textContent = `${originalFontSize}px`;
    updateLivePreview();
});

function closePopup() {
    document.querySelector(".editor-popup").style.display = "none";
}

        // Cancel editing
        document.getElementById("cancel-edit").addEventListener("click", closePopup);

        // Reset changes
        document.getElementById("reset-edit").addEventListener("click", () => {
            document.getElementById("cell-text").value = originalText;
            document.getElementById("font-slider").value = originalFontSize;
            document.getElementById("font-style").value = originalFontStyle;
            document.getElementById("font-size-display").textContent = originalFontSize + "px";
            updateLivePreview();
        });

                function closePopup() {
            document.querySelector(".editor-popup").style.display = "none";
        }

        // Handle Resize Columns Button
document.getElementById("resize-columns-button").addEventListener("click", () => {
    const resizingTool = document.getElementById("resizing-tool");
    if (resizingTool.style.display === "none") {
        generateSliders();
        resizingTool.style.display = "block";
    } else {
        resizingTool.style.display = "none";
    }
});

function applyPopupToNewCells() {
    // Reapply the double-click event listener to all table cells
    document.querySelectorAll("td, th").forEach(cell => {
        cell.removeEventListener("dblclick", handleCellDoubleClick); // Avoid duplicate listeners
        cell.addEventListener("dblclick", handleCellDoubleClick);
    });
}


    
// Generate Sliders for Each Column
// Generate Sliders for Each Column
function generateSliders() {
    const table = document.querySelector(".resizable-table");
    const slidersContainer = document.getElementById("sliders-container");
    slidersContainer.innerHTML = ""; // Clear previous sliders

    const columns = table.querySelectorAll("th");
    columns.forEach((column, index) => {
        // Create slider container
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "slider-container";

        // Column label
        const label = document.createElement("label");
        label.textContent = `Column ${index + 1}`;

        // Slider
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = index === 0 ? "15" : "50"; // Smaller minimum for the first column
        slider.max = index === 0 ? "200" : "500"; // Smaller maximum for the first column
        slider.value = column.offsetWidth; // Set current width as default

        // Slider value display
        const valueDisplay = document.createElement("span");
        valueDisplay.className = "slider-value";
        valueDisplay.textContent = `${column.offsetWidth}px`;

        // Update column width on slider input
        slider.addEventListener("input", () => {
            column.style.width = `${slider.value}px`;
            table.querySelectorAll(`td:nth-child(${index + 1})`).forEach(cell => {
                cell.style.width = `${slider.value}px`;
            });
            valueDisplay.textContent = `${slider.value}px`;
        });

        // Append elements to slider container
        sliderContainer.appendChild(label);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);

        // Append slider container to sliders container
        slidersContainer.appendChild(sliderContainer);
    });
}

function handleCellDoubleClick() {
    activeElement = this; // Reference the clicked element
    document.querySelector(".editor-popup").style.display = "block";

    // Store original values
    originalText = this.textContent;
    originalFontSize = parseInt(window.getComputedStyle(this).fontSize, 10); // Ensure numeric font size
    originalFontStyle = window.getComputedStyle(this).fontStyle;

    // Populate popup fields
    document.getElementById("cell-text").value = originalText;
    document.getElementById("font-slider").value = originalFontSize;
    document.getElementById("font-style").value = originalFontStyle;
    document.getElementById("font-size-display").textContent = `${originalFontSize}px`;

    updateLivePreview();
}


function applyDynamicFeatures() {
    document.querySelectorAll("td, th").forEach(cell => {
        cell.removeEventListener("dblclick", handleCellDoubleClick); // Avoid duplicates
        cell.addEventListener("dblclick", handleCellDoubleClick); // Reapply popup listener
    });
}

// Get references to elements
const agentSelector = document.getElementById("agent-selector");
const popupContainer = document.getElementById("agent-popup");
const closePopupButton = document.getElementById("close-popup");
const agentButtons = document.querySelectorAll(".agent-button");


// Show the popup when clicking the oval text



// Add a new column to the table
document.getElementById("add-column-button").addEventListener("click", () => {
    const table = document.querySelector(".resizable-table");
    const rows = table.querySelectorAll("tr");

    // Add a new header for the column
    if (rows[0]) {
        const headerCell = document.createElement("th");
        headerCell.textContent = `New Column ${rows[0].children.length + 1}`;
        rows[0].appendChild(headerCell);
    }

    // Add new cells to each row
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip header row
        const newCell = document.createElement("td");
        newCell.contentEditable = true; // Make it editable
        newCell.textContent = ""; // Default content
        row.appendChild(newCell);
    });

    // Reapply popup functionality for all cells
    applyPopupToNewCells();
});

// Remove the last column from the table
document.getElementById("remove-column-button").addEventListener("click", () => {
    const table = document.querySelector(".resizable-table");
    const rows = table.querySelectorAll("tr");

    if (rows[0] && rows[0].children.length > 1) {
        rows.forEach(row => {
            row.removeChild(row.lastElementChild);
        });

        // Reapply features to remaining cells
        applyDynamicFeatures();
    } else {
        showToast("No columns left to remove!");
    }
});
applyDynamicFeatures();

// Reset Columns to Default Widths
document.getElementById("reset-columns").addEventListener("click", () => {
    const table = document.querySelector(".resizable-table");
    const columns = table.querySelectorAll("th");

    columns.forEach((column, index) => {
        column.style.width = ""; // Reset to default
        table.querySelectorAll(`td:nth-child(${index + 1})`).forEach(cell => {
            cell.style.width = ""; // Reset cells too
        });
    });

    // Regenerate sliders to reflect reset widths
    generateSliders();
});

// Add a new row to the table
document.getElementById("add-row-button").addEventListener("click", () => {
    
})
 

// Remove the last row from the table
document.getElementById("remove-row-button").addEventListener("click", () => {

});



// Global Variables
const savedTablesKey = "savedTables"; // LocalStorage key for saved tables
const savedFilesList = document.getElementById("saved-files-list");

// Save Table Functionality with Validation for Agent Selection
// Save Table Functionality with Correct Data Structure
function saveTable() {
    const table = document.querySelector(".resizable-table");
    const headers = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent);
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((row) =>
        Array.from(row.cells).map((cell) => ({
            content: cell.textContent,
            styles: {
                fontSize: cell.style.fontSize || "",
                fontStyle: cell.style.fontStyle || "",
                width: cell.style.width || "",
            },
        }))
    );


    // Get totals
    const totalDebit = document.getElementById("total-debit").value || "0.00";
    const totalCredit = document.getElementById("total-credit").value || "0.00";
    const totalBalance = document.getElementById("total-balance").value || "0.00";


    // Check if an agent is selected
    const agentName = document.getElementById("agent-selector").textContent.trim();
    if (agentName === "Select Agent") {
        showToast("Please select an agent before saving the table.");
        return;
    }


    const savedTables = JSON.parse(localStorage.getItem("savedTables")) || [];
    const firstName = agentName.split(" - ")[0]; // Extract first name from "Full Name - Location"


    const existingIndex = savedTables.findIndex((entry) => entry.agentName === firstName);


    const newTableData = {
        fullAgentName: agentName, // Save the full agent name for later display
        agentName: firstName, // Save only the first name for the saved files list
        headers,
        rows,
        totalRow: { totalDebit, totalCredit, totalBalance },
        timestamp: new Date().toLocaleString(),
    };


    if (existingIndex !== -1) {
        savedTables[existingIndex] = newTableData;
    } else {
        savedTables.push(newTableData);
    }


    localStorage.setItem("savedTables", JSON.stringify(savedTables));
    loadSavedTables();


    showToast(`Table for agent "${firstName}" has been saved successfully.`);
}


// Load Saved Files List (Existing Function)

function loadSavedTables() {
    const savedTablesKey = "savedTables";
    const savedTables = JSON.parse(localStorage.getItem(savedTablesKey)) || [];
    const savedFilesList = document.getElementById("saved-files-list");
    savedFilesList.innerHTML = ""; // Clear the list


    // If no saved tables, display a message
    if (savedTables.length === 0) {
        savedFilesList.innerHTML = "<p>No saved files found.</p>";
        return;
    }


    // Loop through saved tables and render each
    savedTables.forEach((table, index) => {
        const fileEntry = document.createElement("div");
        fileEntry.className = "saved-file-entry";
        fileEntry.innerHTML = `
            <p><strong>${table.agentName}</strong> (Saved on: ${table.timestamp || "No Date"})</p>
            <button class="load-button" onclick="loadTable(${index})">Load</button>
            <button class="delete-button" onclick="deleteTable(${index})">Delete</button>
        `;
        savedFilesList.appendChild(fileEntry);
    });
}



// Load a Specific Table by Index, Including Total Row and Agent Name
function loadTable(index) {
    const savedTables = JSON.parse(localStorage.getItem("savedTables")) || [];
    if (index < 0 || index >= savedTables.length) {
        showToast("Invalid table index. Failed to load table.");
        return;
    }


    const { rows, totalRow, fullAgentName } = savedTables[index];
    const table = document.querySelector(".resizable-table");


    // Clear the table body
    const tableBody = table.querySelector("tbody");
    tableBody.innerHTML = ""; // Remove all rows


    // Recreate the rows
    rows.forEach((rowData) => {
        const row = document.createElement("tr");
        rowData.forEach((cellData) => {
            const cell = document.createElement("td");
            cell.textContent = cellData.content;
            Object.assign(cell.style, cellData.styles);
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });


    // Update totals only if totalRow exists
    if (totalRow) {
        document.getElementById("total-debit").value = totalRow.totalDebit || "0.00";
        document.getElementById("total-credit").value = totalRow.totalCredit || "0.00";
        document.getElementById("total-balance").value = totalRow.totalBalance || "0.00";
    } else {
        // Reset totals if not available
        document.getElementById("total-debit").value = "0.00";
        document.getElementById("total-credit").value = "0.00";
        document.getElementById("total-balance").value = "0.00";
    }


    // Update agent selector with full name
    document.getElementById("agent-selector").textContent = fullAgentName || "Select Agent";

reinitializeFeatures();
    showToast("Table loaded successfully!");
}


// Delete a Saved Table with Confirmation
function deleteTable(index) {
    const savedTables = JSON.parse(localStorage.getItem(savedTablesKey)) || [];
    const confirmation = confirm("Are you sure you want to delete this saved table?");

    if (confirmation) {
        // If the user clicks "Yes," delete the table
        savedTables.splice(index, 1);
        localStorage.setItem(savedTablesKey, JSON.stringify(savedTables));
        loadSavedTables(); // Refresh the list
        showToast("Table deleted successfully!");
    } else {
        // If the user clicks "Cancel," do nothing
       
    }
}


// Reinitialize All Features After Loading
function reinitializeFeatures() {
    // Reapply Add/Remove Row and Column functionality
    document.getElementById("add-row-button").onclick = addRow;
    //document.getElementById("remove-row-button").onclick = removeRow;


    // Reapply Calculate Totals functionality
    document.getElementById("calculate-total").onclick = calculateTotals;


    // Reapply Popup Editor functionality
    applyPopupToNewCells();


    // Reapply column resizing functionality
    generateSliders();
}


// Add Row Functionality
function addRow() {
    const tableBody = document.querySelector(".resizable-table tbody");
    const firstRow = tableBody.querySelector("tr");
    const newRow = document.createElement("tr");
  


    // Create new cells for the new row
    if (firstRow) {
        const numColumns = firstRow.children.length; // Match the column count
        for (let i = 0; i < numColumns; i++) {
            const newCell = document.createElement("td");
            newCell.contentEditable = true; // Make it editable
            newCell.textContent = ""; // Default content
            newRow.appendChild(newCell);
            newCell.textContent = "";
            newCell.contentEditable = true;
            newRow.classList.add("added");
            tableBody.appendChild(newRow);

            setTimeout(() => newRow.classList.remove("added"), 1500);
        }
    }


    tableBody.appendChild(newRow);


    // Reapply popup functionality for all cells
    applyPopupToNewCells();
}


// Remove Row Functionality
function removeRow() {
    const tableBody = document.querySelector(".resizable-table tbody");
    const lastRow = tableBody.querySelector("tr:last-child");


    if (lastRow) {
        tableBody.removeChild(lastRow);


        // Reapply popup functionality for remaining cells
        applyPopupToNewCells();
    } else {
        showToast("No rows left to remove!");
    }
}



// Calculate Totals Functionality
function calculateTotals() {
    const rows = document.querySelectorAll(".resizable-table tbody tr");
    let totalDebit = 0;
    let totalCredit = 0;


    console.log("Calculate button clicked"); // Log when the button is clicked


    // Loop through each row in the table
    rows.forEach(row => {
        const debitCell = row.children[1]; // 2nd child (مدين)
        const creditCell = row.children[2]; // 3rd child (دائن)
        const additionalCell = row.children[3]; // 4th child (نقل)
        const balanceCell = row.children[6]; // Final child (الرصيد)


        // Get numeric values from the cells
        const debitValue = parseFloat(debitCell.textContent) || 0;
        const creditValue = parseFloat(creditCell.textContent) || 0;
        const additionalValue = parseFloat(additionalCell.textContent) || 0;


        console.log(`Row - Debit: ${debitValue}, Credit: ${creditValue}, Additional: ${additionalValue}`); // Log each row's values


        // Calculate balance
        const totalCreditAndAdditional = creditValue + additionalValue;
        const balance = debitValue - totalCreditAndAdditional;
        balanceCell.textContent = balance.toFixed(2);


        // Update totals
        totalDebit += debitValue;
        totalCredit += totalCreditAndAdditional;
    });


    console.log(`Total Debit: ${totalDebit}, Total Credit: ${totalCredit}, Total Balance: ${totalDebit - totalCredit}`); // Log final totals


    // Update totals in the Total Section
    document.getElementById("total-debit").value = totalDebit.toFixed(2);
    document.getElementById("total-credit").value = totalCredit.toFixed(2);
    document.getElementById("total-balance").value = (totalDebit - totalCredit).toFixed(2);
}



// Initialize Saved Files List on Page Load
window.onload = loadSavedTables;


// Add Save Button Event Listener
//document.getElementById("save-table-button").addEventListener("click", saveTable);


// Initialize Add/Remove Row Buttons
document.getElementById("add-row-button").onclick = addRow;
document.getElementById("remove-row-button").onclick = removeRow;


// Initialize Calculate Button
document.getElementById("calculate-total").onclick = calculateTotals;



// Show/Hide Popup
const showSavedFilesButton = document.getElementById("load-from-firestore-button");
const savedFilesPopup = document.getElementById("firestore-popup");
const closeSavedFilesButton = document.getElementById("close-saved-files");


showSavedFilesButton.addEventListener("click", () => {
    savedFilesPopup.style.display = "block";
});


closeSavedFilesButton.addEventListener("click", () => {
    savedFilesPopup.style.display = "none";
});


savedFilesPopup.addEventListener("click", (e) => {
    if (e.target === savedFilesPopup) {
        savedFilesPopup.style.display = "none";
    }
});


// Load Saved Tables into the Popup

// Reinitialize Save Button and Load Tables on Page Load
window.onload = () => {
    loadSavedTables();
    applyDynamicFeatures();
};

// Show/Hide Login Popup

const closeLoginPopup = document.getElementById('close-login-popup');
const loginPopupOverlay = document.getElementById("login-popup-overlay");

// Show popup function
function showLoginPopup() {
  loginPopupOverlay.style.display = 'block';
}


// Close popup function
function closeLoginPopupFunction() {
  loginPopupOverlay.style.display = 'none';
}


// Event Listeners
closeLoginPopup.addEventListener('click', closeLoginPopupFunction);
loginPopupOverlay.addEventListener('click', (e) => {
  if (e.target === loginPopupOverlay) {
    closeLoginPopupFunction();
  }
});




       // Calculate Totals Functionality
// Calculate Totals Functionality
function calculateTotals() {
    const rows = document.querySelectorAll(".resizable-table tbody tr");
    let totalDebit = 0;
    let totalCredit = 0;


    console.log("Calculate button clicked"); // Log when the button is clicked


    // Loop through each row in the table
    rows.forEach(row => {
        const debitCell = row.children[1]; // 2nd child (مدين)
        const creditCell = row.children[2]; // 3rd child (دائن)
        const additionalCell = row.children[3]; // 4th child (نقل)
        const balanceCell = row.children[6]; // Final child (الرصيد)


        // Get numeric values from the cells
        const debitValue = parseFloat(debitCell.textContent) || 0;
        const creditValue = parseFloat(creditCell.textContent) || 0;
        const additionalValue = parseFloat(additionalCell.textContent) || 0;


        console.log(`Row - Debit: ${debitValue}, Credit: ${creditValue}, Additional: ${additionalValue}`); // Log each row's values


        // Calculate balance
        const totalCreditAndAdditional = creditValue + additionalValue;
        const balance = debitValue - totalCreditAndAdditional;
        balanceCell.textContent = balance.toFixed(2);


        // Update totals
        totalDebit += debitValue;
        totalCredit += totalCreditAndAdditional;
    });


    console.log(`Total Debit: ${totalDebit}, Total Credit: ${totalCredit}, Total Balance: ${totalDebit - totalCredit}`); // Log final totals


    // Update totals in the Total Section
    document.getElementById("total-debit").value = totalDebit.toFixed(2);
    document.getElementById("total-credit").value = totalCredit.toFixed(2);
    document.getElementById("total-balance").value = (totalDebit - totalCredit).toFixed(2);
}


        // Reset totals
        //document.getElementById("reset-total").addEventListener("click", () => {
           // document.getElementById("total-debit").value = "0.00";
          //  document.getElementById("total-credit").value = "0.00";
           // document.getElementById("total-balance").value = "0.00";
     //   });

        
        