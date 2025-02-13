import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";


import {
  getFirestore,
  doc,
  setDoc,
  writeBatch,
  getDocs,
  deleteDoc,
  collection,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxRpkI57dnQJtGZOzMSMTm8tl2qkU4lxY",
  authDomain: "the-website-saves.firebaseapp.com",
  projectId: "the-website-saves",
  storageBucket: "the-website-saves.appspot.com",
  messagingSenderId: "963337513800",
  appId: "1:963337513800:web:a0503592a496bd9a89217d",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// DOM Elements
const accountButton = document.getElementById("account-button");
const signinButton = document.getElementById("signin-btn");
const signupButton = document.getElementById("signup-btn");
const signoutButton = document.getElementById("signout-btn");


const closeLoginPopupButton = document.getElementById("close-login-popup");
const saveToFirestoreButton = document.getElementById("save-table-2-button");
const loadFirestorePopupButton = document.getElementById("load-from-firestore-button");
const firestorePopup = document.getElementById("firestore-popup");
const closeFirestorePopupButton = document.getElementById("close-firestore-popup");
const firestoreTableList = document.getElementById("firestore-tables-list");


// Account Button: Show Login Popup
accountButton.addEventListener("click", () => {
  const loginPopupOverlay = document.getElementById("login-popup-overlay");
  loginPopupOverlay.style.display = "block";
});

closeLoginPopupButton.addEventListener("click", () => {
loginPopupOverlay.style.display = "none";  // Hide the popup
});


// Sign-Up Logic
signupButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();


  if (!email || !password) {
    showToast("Please fill in both email and password.");
    return;
  }


  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showToast("Sign-up successful!");
  } catch (error) {
    showToast("Sign-up error: " + error.message);
  }
});


// Sign-In Logic
signinButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();


  if (!email || !password) {
    showToast("Please fill in both email and password.");
    return;
  }


  try {
    await signInWithEmailAndPassword(auth, email, password);
    showToast("Sign-in successful!");
    document.getElementById("login-popup-overlay").style.display = "none";
  } catch (error) {
    showToast("Sign-in error: " + error.message);
  }
});


// Sign-Out Logic
signoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showToast("Sign-out successful!");
  } catch (error) {
    showToast("Sign-out error: " + error.message);
  }
  loginPopupOverlay.style.display = "none";
});


// Auto-Login State Handling
// Automatically check login status on page load
onAuthStateChanged(auth, async (user) => {
const loginPopupOverlay = document.getElementById("login-popup-overlay");


if (user) {
// User is authenticated
document.getElementById("account-button").textContent = `👤✔️`;
document.getElementById("signin-btn").style.display = "none";
document.getElementById("signup-btn").style.display = "none";
document.getElementById("signout-btn").style.display = "block";


// Explicitly hide the login popup
loginPopupOverlay.style.display = "none";


// Automatically load the latest saved table
try {
  const tablesSnapshot = await getDocs(collection(db, `users/${user.uid}/tables`));


  if (!tablesSnapshot.empty) {
    // Find the latest saved table by timestamp
    let latestTable = null;
    tablesSnapshot.forEach((doc) => {
      const tableData = doc.data();
      if (!latestTable || new Date(tableData.timestamp) > new Date(latestTable.timestamp)) {
        latestTable = { id: doc.id, ...tableData };
      }
    });


    // Load the latest table
    if (latestTable) {
      //showToast(`Automatically loading the latest save for agent: ${latestTable.agentName}`);
      loadTableFromFirestore(latestTable.id);
    }
  } else {
    console.log("No saved tables found for this user.");
  }
} catch (error) {
  console.error("Error fetching tables:", error);
}
} else {
// User is not authenticated
document.getElementById("account-button").textContent = "👤 Account";
document.getElementById("signin-btn").style.display = "block";
document.getElementById("signup-btn").style.display = "block";
document.getElementById("signout-btn").style.display = "none";


// Show the login popup
loginPopupOverlay.style.display = "block";
}
});
document.addEventListener("keydown", (event) => {
// Check if the "Shift" key is pressed
if (event.key === "Shift") {
event.preventDefault(); // Prevent any default browser behavior for the Shift key


// Simulate a click on the "Save Table" button
const saveTableButton = document.getElementById("save-table-2-button"); // Replace with your Save Table button ID
if (saveTableButton) {
  saveTableButton.click();
}
}
});


function enableCellEditing() {
const table = document.querySelector(".resizable-table");
const cells = table.querySelectorAll("td, th"); // Select all table cells, including headers


// Enable editing on touch or click
cells.forEach((cell) => {
cell.contentEditable = true; // Make all cells editable
cell.addEventListener("click", () => {
  cell.focus(); // Focus the clicked cell for editing
});
});


// Enable keyboard navigation for editing
document.addEventListener("DOMContentLoaded", () => {
const table = document.querySelector("#myTable"); // Ensure your table has an ID


if (!table) {
console.error("Table not found!");
return;
}


table.addEventListener("keydown", (event) => {
const activeCell = document.activeElement;


// Ensure the focused element is a table cell (td or th)
if (!activeCell || !activeCell.matches("td, th")) return;


const row = activeCell.parentElement;
const columnIndex = Array.from(row.children).indexOf(activeCell);
const rows = Array.from(table.querySelectorAll("tbody tr"));


let targetCell = null;


switch (event.key) {
  case "ArrowUp":
    event.preventDefault();
    const prevRow = row.previousElementSibling;
    if (prevRow) targetCell = prevRow.children[columnIndex];
    break;


  case "ArrowDown":
    event.preventDefault();
    const nextRow = row.nextElementSibling;
    if (nextRow) targetCell = nextRow.children[columnIndex];
    break;


  case "ArrowRight":
    event.preventDefault();
    targetCell = activeCell.previousElementSibling;
    break;


  case "ArrowLeft":
    event.preventDefault();
    targetCell = activeCell.nextElementSibling;
    break;
}


if (targetCell) targetCell.focus();
});


// Make all table cells focusable
table.querySelectorAll("td, th").forEach((cell) => {
cell.setAttribute("tabindex", "0");
});
});

}


// Call this function after loading or saving a table to ensure the feature is applied
enableCellEditing();




async function loadAutosavedTable(agentName) {
const user = auth.currentUser;


if (!user || agentName === "Select Agent") {
console.error("Cannot load table: no user is logged in or no agent is selected.");
return;
}


try {
const tableDoc = await getDoc(doc(db, `users/${user.uid}/tables`, agentName));
if (tableDoc.exists()) {
  const { headers, rows, totalRow } = tableDoc.data();
  const table = document.querySelector(".resizable-table");
  const tableBody = table.querySelector("tbody");
  const tableHead = table.querySelector("thead tr");


  // Clear existing table rows and headers
  tableBody.innerHTML = "";
  tableHead.innerHTML = "";


  // Recreate headers
  headers.forEach((header) => {
    const newHeaderCell = document.createElement("th");
    newHeaderCell.textContent = header.name;
    newHeaderCell.style.width = header.width || "auto";
    tableHead.appendChild(newHeaderCell);
  });

  

  // Recreate rows
  rows.forEach((rowData) => {
    const newRow = document.createElement("tr");
    headers.forEach((header) => {
      const cellData = rowData[header.name] || { content: "", fontSize: "", fontStyle: "", width: "" };
      const newCell = document.createElement("td");
      newCell.textContent = cellData.content;
      newCell.style.fontSize = cellData.fontSize;
      newCell.style.fontStyle = cellData.fontStyle;
      newCell.style.width = cellData.width || "auto";
      newRow.appendChild(newCell);
    });
    tableBody.appendChild(newRow);
  });


  // Update total row values
  document.getElementById("total-debit").value = totalRow?.totalDebit || "0.00";
  document.getElementById("total-credit").value = totalRow?.totalCredit || "0.00";
  document.getElementById("total-balance").value = totalRow?.totalBalance || "0.00";


  // Reapply cell editing and enable autosave
  enableCellEditing();
  enableAutosave(agentName);
  console.log(`Autosaved table loaded for agent: ${agentName}`);
} else {
  console.log("No autosaved table found for this agent.");
}
} catch (error) {
console.error("Failed to load autosaved table:", error);
}
}

// DOM Elements


const agentPopup = document.getElementById("agent-popup");

//agentSelector.addEventListener("click", () => {
// agentPopup.style.display = "block"; // Show the popup
//});

///closePopupButton.addEventListener("click", () => {
/// agentPopup.style.display = "none"; // Hide the popup
///});


// Add event listeners to agent buttons
// Call enableAutosave on agent selection


// Show the agent selection popup
agentSelector.addEventListener("click", () => {
agentPopup.style.display = "block";
});


// Close the agent popup when clicking the "Close" button
closePopupButton.addEventListener("click", () => {
agentPopup.style.display = "none";
});


// Handle Agent Selection and Load Correct Data
agentButtons.forEach((button) => {
button.addEventListener("click", async () => {
    const selectedAgent = button.getAttribute("data-agent");
    const previousAgent = agentSelector.textContent.trim();


    // Prevent selecting the same agent again
    if (selectedAgent === previousAgent) {
        agentPopup.style.display = "none";
        return;
    }


    // Confirmation before switching (prevents accidental overwrites)
    if (previousAgent !== "Select Agent") {
        const confirmSwitch = confirm(
            `Switching agents will clear unsaved changes. Continue?`
        );
        if (!confirmSwitch) return;
        saveToFirestoreButton.click(); // Save the current table before switching
    }


    // Update UI with selected agent
    agentSelector.textContent = selectedAgent;
    agentPopup.style.display = "none";


    // Load the table for the selected agent
    await loadTableFromFirestore(selectedAgent);
});
});


// Load the correct table when the page loads
onAuthStateChanged(auth, async (user) => {
if (user) {
    console.log("User is logged in:", user.email);
    
    const lastSavedAgent = agentSelector.textContent.trim();
    if (lastSavedAgent && lastSavedAgent !== "Select Agent") {
        console.log("Auto-loading last saved agent:", lastSavedAgent);
        await loadTableFromFirestore(lastSavedAgent);
    }
}
});




// Save Table to Firestore with Column Widths
let lastSavedData = {}; // Stores the last saved version for change detection


saveToFirestoreButton.addEventListener("click", async () => {
const user = auth.currentUser;
if (!user) {
showToast("Sign in to save tables.");
return;
}


const table = document.querySelector(".resizable-table");
const headers = Array.from(table.querySelectorAll("thead th")).map((th) => ({
name: th.textContent,
width: th.style.width || "auto",
}));


// Collect row data for Firestore
const rows = Array.from(table.querySelectorAll("tbody tr")).map((row) => {
const rowData = {};
Array.from(row.cells).forEach((cell, index) => {
  rowData[headers[index].name || `Column${index + 1}`] = {
    content: cell.textContent.trim(),
    fontSize: cell.style.fontSize || "",
    fontStyle: cell.style.fontStyle || "",
    width: cell.style.width || "",
  };
});
return rowData;
});


// Get agent name
const agentName = document.getElementById("agent-selector").textContent.trim();
if (agentName === "Select Agent") {
showToast("Please select an agent before saving.");
return;
}


// Get total row values
const totalDebit = document.getElementById("total-debit").value || "0.00";
const totalCredit = document.getElementById("total-credit").value || "0.00";
const totalBalance = document.getElementById("total-balance").value || "0.00";


// Construct new table data
const newTableData = {
agentName,
headers,
rows,
totalRow: { totalDebit, totalCredit, totalBalance },
timestamp: new Date().toISOString(),
};


// Check if data has changed (Prevent unnecessary writes)
const newDataString = JSON.stringify(newTableData);
if (lastSavedData[agentName] === newDataString) {
console.log("No changes detected. Skipping save.");
return;
}


try {
// Use batch write to optimize database operations
const batch = writeBatch(db);
const tableRef = doc(db, `users/${user.uid}/tables`, agentName);
batch.set(tableRef, newTableData);


await batch.commit();
lastSavedData[agentName] = newDataString; // Update last saved state
showToast(`Table for "${agentName}" saved successfully!`);
} catch (error) {
showToast("Failed to save table: " + error.message);
}
});


// Enable Autosave: Attach event listeners to track changes in the table
let autosaveEnabled = false;
let autosaveTimeout;
let isSaving = false; // Prevents duplicate saves


// Enable Autosave
function enableAutosave() {
const table = document.querySelector(".resizable-table");


// Track changes only when the user finishes editing
table.addEventListener("focusout", handleAutosaveDebounced);
table.addEventListener("keydown", (event) => {
if (event.key === "Enter") {
  event.preventDefault(); // Prevents newline
  handleAutosaveNow();
  event.target.blur(); // Exits cell after saving
}
});


// Monitor changes in total row inputs
document.getElementById("total-debit").addEventListener("focusout", handleAutosaveDebounced);
document.getElementById("total-credit").addEventListener("focusout", handleAutosaveDebounced);
document.getElementById("total-balance").addEventListener("focusout", handleAutosaveDebounced);
}


// Disable Autosave
function disableAutosave() {
const table = document.querySelector(".resizable-table");


table.removeEventListener("focusout", handleAutosaveDebounced);
table.removeEventListener("keydown", handleAutosaveNow);


document.getElementById("total-debit").removeEventListener("focusout", handleAutosaveDebounced);
document.getElementById("total-credit").removeEventListener("focusout", handleAutosaveDebounced);
document.getElementById("total-balance").removeEventListener("focusout", handleAutosaveDebounced);
}


// Debounced Autosave - Waits before saving
function handleAutosaveDebounced(event) {
if (!autosaveEnabled || event.target.tagName !== "TD") return;


clearTimeout(autosaveTimeout);
autosaveTimeout = setTimeout(handleAutosaveNow, 500); // Delayed save
}


// Immediate Save on Cell Exit or Enter Key
function handleAutosaveNow() {
if (!autosaveEnabled || isSaving) return;


isSaving = true;
showAutosaveIndicator(); // Show "Saving..." message


try {
document.getElementById("save-table-2-button").click(); // Trigger save
console.log("Autosaved Table!"); // Debugging log
} catch (error) {
console.error("Autosave failed:", error);
} finally {
setTimeout(() => {
  hideAutosaveIndicator();
  isSaving = false;
}, 1500); // Simulated save delay
}
}


// Show Autosave Indicator
function showAutosaveIndicator() {
const indicator = document.getElementById("autosave-indicator");
indicator.style.display = "block";
}


// Hide Autosave Indicator
function hideAutosaveIndicator() {
const indicator = document.getElementById("autosave-indicator");
indicator.style.display = "none";
}


// Enable Autosave Button Handler
document.getElementById("enable-autosave-button").addEventListener("click", () => {
autosaveEnabled = !autosaveEnabled;
document.getElementById("enable-autosave-button").textContent = autosaveEnabled ? "Disable Autosave" : "Enable Autosave";


if (autosaveEnabled) {
enableAutosave();
} else {
disableAutosave();
}
});


// Enable Autosave Button


// Function to Trigger Save
async function autosave() {
if (autosaveEnabled) {
const saveToFirestoreButton = document.getElementById("save-table-2-button");
if (saveToFirestoreButton) {
  saveToFirestoreButton.click();
}
}
}


// Toggle Autosave on Button Click



// Trigger Save on Calculation
document.getElementById("calculate-total").addEventListener("click", autosave);


// Trigger Save on Column Resize
document.querySelectorAll(".slider-container input[type='range']").forEach((slider) => {
slider.addEventListener("input", autosave);
});


// Optional: Ensure Any Future Resizing Sliders Are Linked
function attachSliderAutosave() {
document.querySelectorAll(".slider-container input[type='range']").forEach((slider) => {
slider.removeEventListener("input", autosave); // Avoid duplicates
slider.addEventListener("input", autosave);
});
}



// Load Tables from Firestore
loadFirestorePopupButton.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    showToast("Sign in to load tables.");
    return;
  }


  firestorePopup.style.display = "block";
  firestoreTableList.innerHTML = "<p>Loading tables...</p>";


  try {
    const tablesSnapshot = await getDocs(collection(db, `users/${user.uid}/tables`));
    firestoreTableList.innerHTML = "";


    tablesSnapshot.forEach((doc) => {
      const tableData = doc.data();
      const tableEntry = document.createElement("div");
      tableEntry.className = "saved-file-entry";
      tableEntry.innerHTML = `
        <p><strong>${tableData.agentName}</strong> (Saved on: ${new Date(
        tableData.timestamp
      ).toLocaleString()})</p>
        <button class="load-button" data-id="${doc.id}">Load</button>
        <button class="delete-button" data-id="${doc.id}">Delete</button>
      `;
      firestoreTableList.appendChild(tableEntry);
    });


    // Add event listeners for Load and Delete buttons
    firestoreTableList.querySelectorAll(".load-button").forEach((button) => {
      button.addEventListener("click", () => loadTableFromFirestore(button.dataset.id));
    });


    firestoreTableList.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", () => deleteTableFromFirestore(button.dataset.id));
    });
  } catch (error) {
    showToast("Failed to load tables: " + error.message);
  }
});


// Close Firestore Popup
closeFirestorePopupButton.addEventListener("click", () => {
  firestorePopup.style.display = "none";
});


function reapplyCellEditing() {
document.querySelectorAll("td").forEach((cell) => {
cell.addEventListener("dblclick", () => {
  const originalContent = cell.textContent;


  // Create input field for editing
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalContent;
  input.style.width = "100%";


  // Replace cell content with input
  cell.textContent = "";
  cell.appendChild(input);


  // Save changes on blur or Enter key
  input.addEventListener("blur", () => {
    cell.textContent = input.value || originalContent;
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      cell.textContent = input.value || originalContent;
    }
  });


  // Focus input field
  input.focus();
});
});
}
function reapplyColumnResizing() {
const table = document.querySelector(".resizable-table");
const slidersContainer = document.getElementById("sliders-container");


// Clear previous sliders
slidersContainer.innerHTML = "";


const columns = table.querySelectorAll("thead th");
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
slider.min = "50";
slider.max = "500";
slider.value = parseInt(column.style.width) || column.offsetWidth;


// Slider value display
const valueDisplay = document.createElement("span");
valueDisplay.className = "slider-value";
valueDisplay.textContent = `${slider.value}px`;


// Update column width on slider input
slider.addEventListener("input", () => {
  column.style.width = `${slider.value}px`;
  table.querySelectorAll(`td:nth-child(${index + 1})`).forEach((cell) => {
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



async function clearTable() {
const user = auth.currentUser;


if (!user) {
    console.error("No user is logged in.");
    return;
}


const agentName = document.getElementById("agent-selector").textContent.trim();


if (agentName === "Select Agent") {
    console.error("No agent selected.");
    return;
}


try {
    // Check if the table exists in Firestore for the selected agent
    const tableDoc = await getDoc(doc(db, `users/${user.uid}/tables`, agentName));


    if (tableDoc.exists()) {
        console.log(`Table exists for agent: ${agentName}. Not clearing.`);
        return; // Exit if a table is saved
    }


    // If no table exists, clear the table
    const table = document.querySelector(".resizable-table");
    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead");


    // Clear the table content
    tableBody.innerHTML = "";
    tableHead.innerHTML = "";


    // Add default headers
    const headerRow = document.createElement("tr");
    const headers = ["", "مدين", "دائن", "نقل", "التاريخ", "البيان", "الرصيد"];


    headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });


    tableHead.appendChild(headerRow);


    // Add default rows
    for (let i = 0; i < 10; i++) {
        const row = document.createElement("tr");


        headers.forEach((_, columnIndex) => {
            const cell = document.createElement("td");
            cell.textContent = ""; // Other cells remain empty
            cell.contentEditable = true;


            // ✅ Ensure double-click for the 5th column (date selection)
            if (columnIndex === 4) { // 5th column index (0-based)
                cell.addEventListener("dblclick", handleDateCellClick);
            }


            row.appendChild(cell);
        });


        tableBody.appendChild(row);
    }


    // Reset total values
    document.getElementById("total-debit").value = "0.00";
    document.getElementById("total-credit").value = "0.00";
    document.getElementById("total-balance").value = "0.00";


    console.log(`Table cleared for agent: ${agentName}`);
} catch (error) {
    console.error("Error checking or clearing table:", error);
    showToast("Failed to clear the table due to an error.");
}
}


function applyDatePopupToCells() {
document.querySelectorAll("td:nth-child(5)").forEach((cell) => {
    cell.removeEventListener("dblclick", handleDateCellClick); // Prevent duplicates
    cell.addEventListener("dblclick", handleDateCellClick);
});
}


function handleDateCellClick(event) {
const cell = event.target;
console.log("Date cell double-clicked!");


activeCell = cell;  // Store the clicked cell
const currentDate = activeCell.textContent.trim();
console.log("Current Date in Cell:", currentDate);


const [day, month] = currentDate.split('/');
document.getElementById("select-day").value = day || "01";
document.getElementById("select-month").value = month || "01";


document.getElementById("date-popup").style.display = "flex";
}


// Load Table from Firestore
// Load Table from Firestore with Column Widths
let localTableCache = {}; // Stores recently loaded tables to reduce Firestore reads

async function loadTableFromFirestore(agentName) {
const user = auth.currentUser;
if (!user) {
    showToast("Sign in to load tables.");
    return;
}


try {
    const tableRef = doc(db, `users/${user.uid}/tables`, agentName);
    const tableSnapshot = await getDoc(tableRef);


    const table = document.querySelector(".resizable-table");
    const tableBody = table.querySelector("tbody");
    const tableHead = table.querySelector("thead");


    // ✅ Clear table before loading
    tableBody.innerHTML = "";
    tableHead.innerHTML = "";


    if (tableSnapshot.exists()) {
        const { headers, rows, totalRow, agentName: savedAgentName } = tableSnapshot.data();


        console.log("🔥 Loading Table Data:", { headers, rows, totalRow, savedAgentName });


        // ✅ Restore headers
        const headerRow = document.createElement("tr");
        headers.forEach((header) => {
            const newHeaderCell = document.createElement("th");
            newHeaderCell.textContent = header.name || "";
            newHeaderCell.style.width = header.width || "auto";
            headerRow.appendChild(newHeaderCell);
        });
        tableHead.appendChild(headerRow);


        // ✅ Restore rows, including added ones
        rows.forEach((rowData) => {
            const newRow = document.createElement("tr");


            headers.forEach((header, index) => {
                const cellData = rowData[header.name] || { content: "", fontSize: "", fontStyle: "", width: "" };
                const newCell = document.createElement("td");


                newCell.textContent = cellData.content || "";
                newCell.style.fontSize = cellData.fontSize || "";
                newCell.style.fontStyle = cellData.fontStyle || "";
                newCell.style.width = cellData.width || "auto";
                newCell.contentEditable = true; // ✅ Make sure cells are still editable


                // ✅ Ensure double-click for 5th column (date selection)
                if (index === 4) {
                    newCell.addEventListener("dblclick", handleDateCellClick);
                }


                newRow.appendChild(newCell);
            });


            tableBody.appendChild(newRow);
        });


        // ✅ Restore totals
        document.getElementById("total-debit").value = totalRow?.totalDebit || "0.00";
        document.getElementById("total-credit").value = totalRow?.totalCredit || "0.00";
        document.getElementById("total-balance").value = totalRow?.totalBalance || "0.00";


        // ✅ FIX: Update the agent name in the UI
        document.getElementById("agent-selector").textContent = savedAgentName || agentName;


        showToast("✅ Table loaded successfully!");


    } else {
        console.log(`⚠️ No saved table for agent: ${agentName}. Creating a new empty table.`);
        clearTable();
    }


    // ✅ Ensure new rows can be edited after load
    enableCellEditing();
    reapplyColumnResizing();


} catch (error) {
    console.error("🔥 Load Error:", error);
    showToast("❌ Failed to load table: " + error.message);
}
}



// Delete Table from Firestore
async function deleteTableFromFirestore(docId) {
  const user = auth.currentUser;
  if (!user) {
    showToast("Sign in to delete tables.");
    return;
  }


  if (!confirm("Are you sure you want to delete this table?")) {
    return;
  }


  try {
    await deleteDoc(doc(db, `users/${user.uid}/tables`, docId));
    showToast("Table deleted successfully!");
    loadFirestorePopupButton.click(); // Refresh the popup
  } catch (error) {
    showToast("Failed to delete table: " + error.message);
  }

}
window.onload = () => {
  autosaveEnabled = true;
  enableAutosave();
}