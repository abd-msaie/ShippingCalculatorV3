document.addEventListener("DOMContentLoaded", function () {
  const typeDropdown = document.getElementById("type");
  const destinationDropdown = document.getElementById("destination");
  const formContainer = document.querySelector(".form-container");
  const lengthInput = document.getElementById("length");
  const heightInput = document.getElementById("height");
  const widthInput = document.getElementById("width");
  const weightInput = document.getElementById("weight");
  // Data for destinations based on type
  const destinationOptions = {
    Express: [
      "OMAN", "UAE", "QATAR", "BELGIUM", "FRANCE", "GERMANY", "ITALY", "NETHERLANDS", "SPAIN",
      "UNITED KINGDOM", "CANADA", "CHINA", "HONG KONG", "USA", "ALGIERS", "INDIA", "PORTUGAL",
      "TURKEY", "BRAZIL", "TAIWAN", "SWITZERLAND", "BAHRAIN", "EGYPT", "LEBANON", "KUWAIT",
      "SAUDI ARABIA", "WEST BANK", "TUNISIA", "SOUTH KOREA", "CYPRUS", "IRAQ", "JERSEY CI",
      "IRELAND", "SENEGAL", "MONACO", "AUSTRIA", "DENMARK", "FINLAND", "GREECE", "LUXEMBOURG",
      "PAKISTAN", "SINGAPORE", "SWEDEN", "ICELAND", "INDONESIA", "MALAYSIA", "NEW ZEALAND",
      "PHILIPPINES", "SRI LANKA", "THAILAND", "BRUNEI", "CHILE", "CZECH", "HUNGARY", "JAPAN",
      "MOROCCO", "RUSSIA", "SOUTH AFRICA"
    ],
    Cargo: [
      "OMAN", "UAE", "QATAR", "BELGIUM", "FRANCE", "GERMANY", "ITALY", "NETHERLANDS", "SPAIN",
      "UNITED KINGDOM", "CANADA", "CHINA", "HONG KONG", "USA", "ALGIERS", "INDIA", "PORTUGAL",
      "TURKEY", "BRAZIL", "TAIWAN", "SWITZERLAND", "BAHRAIN", "EGYPT", "LEBANON", "KUWAIT",
      "SAUDI ARABIA", "WEST BANK", "TUNISIA", "SOUTH KOREA", "CYPRUS", "IRAQ", "JERSEY CI",
      "IRELAND", "SENEGAL", "MONACO", "AUSTRIA", "DENMARK", "FINLAND", "GREECE", "LUXEMBOURG",
      "PAKISTAN", "SINGAPORE", "SWEDEN", "ICELAND", "INDONESIA", "MALAYSIA", "NEW ZEALAND",
      "PHILIPPINES", "SRI LANKA", "THAILAND", "BRUNEI", "CHILE", "CZECH", "HUNGARY", "JAPAN",
      "MOROCCO", "RUSSIA", "SOUTH AFRICA"
    ],
    Sea: ["BARCELONA", "SHANGHAI", "GENOA", "NEW YORK"],
    Land: ["RUH-KSA", "DXB", "KWI"],
  };

  function updateDestinations() {
    // Clear current options
    destinationDropdown.innerHTML = "";

    // Remove any additional dropdowns if they exist
    const additionalDropdowns = document.querySelectorAll(".additional-dropdown");
    additionalDropdowns.forEach((dropdown) => dropdown.remove());

    // Get the selected type
    const selectedType = typeDropdown.value;

    // Populate destination options based on type
    if (destinationOptions[selectedType]) {
      destinationOptions[selectedType].forEach((destination) => {
        const option = document.createElement("option");
        option.value = destination;
        option.textContent = destination;
        destinationDropdown.appendChild(option);
      });

      // Add additional dropdowns for Sea and Land
      if (selectedType === "Sea" || selectedType === "Land") {
        createAdditionalDropdown(selectedType);
        disableInputs(true);  // ADDED: Disable inputs
      } else {
        disableInputs(false); // ADDED: Enable inputs for other types
      }
    } else {
      // Show default or empty message if no destinations available
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No destinations available";
      destinationDropdown.appendChild(option);
    }
  }

  function disableInputs(disable) {
    lengthInput.disabled = disable;
    heightInput.disabled = disable;
    widthInput.disabled = disable;
    weightInput.disabled = disable;
  }

  function createAdditionalDropdown(type) {
    const additionalDropdown = document.createElement("div");
    additionalDropdown.className = "input-group additional-dropdown";

    const label = document.createElement("label");
    label.textContent = "CBM:"; // Label for the new dropdown
    additionalDropdown.appendChild(label);

    const select = document.createElement("select");
    select.className = "cpm-select"; // Add a class for easy reference

    const options = ["20", "40"];
    options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.appendChild(option);
    });

    additionalDropdown.appendChild(select);
    formContainer.insertBefore(additionalDropdown, document.getElementById("calculate-btn")); // Position it before the calculate button
  }


  // Initialize destinations on page load
  updateDestinations();

  // Update destinations when the type changes
  typeDropdown.addEventListener("change", updateDestinations);
});
document.getElementById("calculate-btn").addEventListener("click", function () {
  let weight = parseFloat(document.getElementById("weight").value);
  const type = document.getElementById("type").value;
  const destination = document.getElementById("destination").value;
  const length = parseFloat(document.getElementById("length").value);
  const height = parseFloat(document.getElementById("height").value);
  const width = parseFloat(document.getElementById("width").value);

  // Get the value of the CPM dropdown if it's visible
  let cpmValue = '';
  const cpmSelect = document.querySelector(".cpm-select"); // Use the class assigned to the CPM dropdown
  if (cpmSelect) {
    cpmValue = cpmSelect.value; // Get the selected value
  }
  let cost = 0;
  let finalWeight = weight;
  let resultMessage = '';

  if (type === "Cargo" || type === "Express") {
    // Calculate Y using the formula
    const Y = (length * height * width) / 5000;

    // Compare Y with weight, use the greater value for shipping cost calculation
    if (Y >= weight) {
      finalWeight = Y;
      resultMessage = "By using the dimensional value(" + Y + ").";
    } else {
      finalWeight = weight;
      resultMessage = "Using provided weight for shipping cost.";
    }

    // Automatically set the type to "Cargo" if weight is 120 or more        
    if (finalWeight >= 120 && type !== "Cargo" && type !== "Y") {
      document.getElementById("type").value = "Cargo"; // Change the select value to Cargo
      resultMessage += " Weight is 120kg or more, setting shipping type to Cargo.";
    }

    // Cap weight to 500 if it exceeds that value
    if (finalWeight > 500) {
      finalWeight = 500;
      resultMessage += " Weight exceeded 500kg, capping it to 500kg, to accurate cost connect with this email Logistics@optimizasolutions.com";
    }

    // Validate input fields
    if (!finalWeight || !destination) {
      document.getElementById("result").textContent = "Please enter valid values for weight and destination.";
      return;
    }
    // Calculate cost based on type and destination
    if (type === "Express") {
      if (destination === "OMAN" || destination === "UAE" || destination === "QATAR") {
        cost = 4.2729 * finalWeight + 30.957;
      } else if (destination === "BELGIUM" || destination === "FRANCE" || destination === "GERMANY" ||
        destination === "ITALY" || destination === "NETHERLANDS" || destination === "SPAIN" ||
        destination === "UNITED KINGDOM") {
        cost = 3.9074 * finalWeight + 122.75;
      } else if (destination === "CANADA" || destination === "CHINA" || destination === "HONGKONG" || destination === "USA") {
        cost = 4.5756 * finalWeight + 18.714;
      } else if (destination === "ALGIERS" || destination === "INDIA" || destination === "PORTUGAL" || destination === "TURKEY") {
        cost = 4.6749 * finalWeight + 26.002;
      } else if (destination === "BRAZIL") {
        cost = 5.8967 * finalWeight + 27.153;
      } else if (destination === "TAIWAN" || destination === "SWISS") {
        cost = -0.0132 * (Math.pow(finalWeight, 2)) + 11.566 * finalWeight + 37.357;
      } else if (destination === "BAHRAIN" || destination === "EGYPT" || destination === "LEBANON" ||
        destination === "KUWAIT" || destination === "SAUDI AR" || destination === "WEST BANK") {
        cost = 3.2901 * finalWeight + 36.588;
      } else if (destination === "TUNIS" || destination === "S-KOREA") {
        cost = 4.2665 * finalWeight + 49.031;
      } else if (destination === "CYPRUS" || destination === "IRAQ") {
        cost = 4.5393 * finalWeight + 50.794;
      } else if (destination === "JERSEY CI" || destination === "IRELAND" || destination === "SENEGAL" || destination === "MONACO") {
        cost = 5.0436 * finalWeight + 48.908;
      } else if (destination === "AUSTRIA" || destination === "DENMARK" || destination === "FINLAND" ||
        destination === "GREECE" || destination === "LUXEMBOURG" || destination === "PAKISTAN" ||
        destination === "SINGAPORE" || destination === "SWEDEN") {
        cost = 6.2087 * finalWeight + 64.293;
      } else if (destination === "ICELAND" || destination === "INDONESIA" || destination === "SOUTH KOREA" ||
        destination === "MALAYSIA" || destination === "NEW ZEALAND" || destination === "PHILLIPINES" ||
        destination === "SRI LANKA" || destination === "THAILAND") {
        cost = 5.0436 * finalWeight + 48.908;
      } else if (destination === "BRUNEI" || destination === "CHILE" || destination === "CZECH" ||
        destination === "HUNGARY" || destination === "JAPAN" || destination === "MOROCCO" ||
        destination === "RUSSIA" || destination === "SOUTH AFRICA") {
        cost = 6.2087 * finalWeight + 64.293;
      }
    } else if (type === "Cargo") {
      if (destination === "OMAN" || destination === "UAE" || destination === "QATAR") {
        cost = 4.2729 * finalWeight + 30.957;
      } else if (destination === "BELGIUM" || destination === "FRANCE" || destination === "GERMANY" ||
        destination === "ITALY" || destination === "NETHERLANDS" || destination === "SPAIN" ||
        destination === "UNITED KINGDOM") {
        cost = 3.9074 * finalWeight + 122.75;
      } else if (destination === "CANADA" || destination === "CHINA" || destination === "HONGKONG" || destination === "USA") {
        cost = 4.5756 * finalWeight + 18.714;
      } else if (destination === "ALGIERS" || destination === "INDIA" || destination === "PORTUGAL" || destination === "TURKEY") {
        cost = 4.6749 * finalWeight + 26.002;
      } else if (destination === "BRAZIL") {
        cost = 5.8967 * finalWeight + 27.153;
      } else if (destination === "TAIWAN" || destination === "SWISS") {
        cost = -0.0132 * (Math.pow(finalWeight, 2)) + 11.566 * finalWeight + 37.357;
      } else if (destination === "BAHRAIN" || destination === "EGYPT" || destination === "LEBANON" ||
        destination === "KUWAIT" || destination === "SAUDI AR" || destination === "WEST BANK") {
        cost = 3.2901 * finalWeight + 36.588;
      } else if (destination === "TUNIS" || destination === "S-KOREA") {
        cost = 4.2665 * finalWeight + 49.031;
      } else if (destination === "CYPRUS" || destination === "IRAQ") {
        cost = 4.5393 * finalWeight + 50.794;
      } else if (destination === "JERSEY CI" || destination === "IRELAND" || destination === "SENEGAL" || destination === "MONACO") {
        cost = 5.0436 * finalWeight + 48.908;
      } else if (destination === "AUSTRIA" || destination === "DENMARK" || destination === "FINLAND" ||
        destination === "GREECE" || destination === "LUXEMBOURG" || destination === "PAKISTAN" ||
        destination === "SINGAPORE" || destination === "SWEDEN") {
        cost = 6.2087 * finalWeight + 64.293;
      } else if (destination === "ICELAND" || destination === "INDONESIA" || destination === "SOUTH KOREA" ||
        destination === "MALAYSIA" || destination === "NEW ZEALAND" || destination === "PHILLIPINES" ||
        destination === "SRI LANKA" || destination === "THAILAND") {
        cost = 5.0436 * finalWeight + 48.908;
      } else if (destination === "BRUNEI" || destination === "CHILE" || destination === "CZECH" ||
        destination === "HUNGARY" || destination === "JAPAN" || destination === "MOROCCO" ||
        destination === "RUSSIA" || destination === "SOUTH AFRICA") {
        cost = 6.2087 * finalWeight + 64.293;
      }
    }
  }

  else {
    resultMessage = "Using provided CBM for shipping cost.";
    if (type === "Sea") {
      if (destination === "BARCELONA") {
        if (cpmValue == 20)
          cost = 2100;
        else cost = 4200;
      }
      if (destination === "SHANGHAI") {
        if (cpmValue == 20)
          cost = 1900;
        else cost = 3800;
      }
      if (destination === "GENOA") {
        if (cpmValue == 20)
          cost = 2000;
        else cost = 4000;
      }
      if (destination === "NEW YORK") {
        if (cpmValue == 20)
          cost = 2300;
        else cost = 4600;
      }
    } else if (type === "Land") {
      if (destination === "RUH-KSA") {
        if (cpmValue == 20)
          cost = 1900;
        else cost = 3800;
      }
      if (destination === "DXB") {
        if (cpmValue == 20)
          cost = 2400;
        else cost = 4800;
      }
      if (destination === "KWI") {
        if (cpmValue == 20)
          cost = 2000;
        else cost = 4000;
      }
    }
  }
  // Display result with notification
  if (resultMessage) {
    document.getElementById("result").textContent = resultMessage + " The shipping cost is: " + cost.toFixed(2) + " JOD";
  } else {
    document.getElementById("result").textContent = "The shipping cost is: " + cost.toFixed(2) + " JOD";
  }
});

const hsDescriptions = {
  "852589": "Television Cameras", 
  "730830": "Fire-Resistant Iron Doors",
  "853110": "Anti-Theft or Fire Alarm Devices and Similar Devices",
  "847130": "Portable Data Processing Machines Weighing No More Than 10kg, Consisting At Least of a Central Processing Unit, Keyboard, and Screen",
  "851762": "Auto Dialer - Automatic Dialing System for Fire Alarm System (Auto Dialer)",
  "854470": "Optical Fiber Cables (N.E.C.)",
  "853710": "Lighting Control Panels Including Energy-Saving Devices Equipped with Two or More Devices...8535 for Voltage <= 1kV",
  "844332": "Plastic Card Printers",
  "901060": "Projection Screens",
  "850440": "Static Converters for Data Processing Machines and Units, and for Communication Devices",
  "852190": "Devices for Recording or Broadcasting Sound and Image (Video), (N.E.C.)",
  "852849": "Display Screens Designed to Work with Computers...Not Integrated with a Cathode Ray Tube Video Receiver",
  "851714": "Communication System Consisting of a Switchboard Used in Fire Alarm Systems",
  "854370": "Metal Detectors",
  "847190": "Magnetic or Optical Readers, Machines for Transferring Information on Carriers in the Form of Codes and Machines for Processing Them (N.E.C.)",
  "853650": "Manual Activation Points for Fire Alarm System",
  "830160": "Parts of Locks and Latches (Bolts), of Common Metals (N.E.C.)",
  "853590": "Other Electrical Devices for Dividing Electrical Circuits, for Voltage > 1kV, (N.E.C.)",
  "830140": "Other Latches (Bolts) of Common Metals, (N.E.C.)",
  "853190": "Parts for Electrical Devices for Sound or Visual Alarms, (N.E.C.)",
  "850450": "Other Electrical Induction Coils for Power Supplies for Data Processing Devices and Units, and for Communication Devices",
  "851890": "Parts of Microphones, Loudspeakers, Headphones, Amplifiers, and Other Items of Heading 8518",
  "851821": "Single Loudspeakers, Mounted in Their Enclosures",
  "851769": "Communication Systems Consisting of a Switchboard Used in Fire Systems",
  "851822": "Multiple Loudspeakers, Mounted in the Same Enclosure",
  "847150": "Other Processing Units, Including at Least One Storage, Input, Output Unit (Except 847141ü, 847149)",
  "853670": "Connectors for Optical Fibers, Fiber Bundles, and Optical Cables",
  "851830": "Speakers for Voice Evacuation System (Wall and Ceiling Mounted)",
  "851840": "Electrical Amplifiers for Sound Frequencies",
  "851810": "Sound Transmitters (Microphones) and Their Stands (N.E.C.)",
  "853810": "Panels, Desks, Cabinets, and Other Supports for Items of Heading 8537ü, Not Equipped with Their Devices",
  "392690": "Plastic Electrical Boxes",
  "841459": "Propulsion, Ventilation, and Positive Pressure Fans for Stairwells and Parking Lots (Jet Fan + Axial Fan) and Smoke Control Fan",
  "852791": "Radio Receivers, Integrated with a Recording Device or a Sound Broadcasting Device",
  "852349": "Optical Carriers for Recording Sound or Other Phenomena (N.E.C.)",
  "851850": "Sound Amplifiers for Voice Evacuation System",
  "902810": "Gas Meters",
  "902820": "Liquid Meters",
  "902830": "Electricity Meters",
  "854420": "Coaxial Cables and Other Coaxial Electrical Connectors, (N.E.C.)",
  "851771": "Antennas and Reflectors of All Types, Sound Transmitting or Receiving Devices",
  "940399": "Parts of Other Furniture (N.E.C.)",
  "845110": "Dry Cleaning Devices",
  "852871": "Receivers, Integrated with a Radio Receiver or Not Designed to Contain a Device or Screen (N.E.C.)",
  "732690": "Iron Restraints"
};
const hsDescriptions2 = { 
  "852589": "Approval from the (TRA,MSD),MIT,MOI,JSI,JNEA)",
  "730830": "Approval from the (JSI) ",
  "853110": "Approval from the (CDD)",
  "847130": "Approval from the  (MSD,MIT,JSI).",
  "851762": "Approval from the (TRA, MSD,JSI).",
  "854470": "Approval from the (TRA,MSD,JSI).",
  "853710": "Approval from the (MIT,JSI,MOI/CDD).",
  "844332": "Approval from the (MSD,JSI, MOI/CDD).",
  "901060": "Approval from the (MSD,MOIT,JSI).",
  "850440": "Approval from the (JSI).",
  "852190": "Approval from the (JSI).",
  "852849": "Approval from the (MSD,MOIT,JSI).",
  "851714": "Approval from the (TRA,MSD,MOIT,JSI).",
  "854370": "Approval from the (TRA).",
  "847190": "Approval from the (TRA,MSD,MOIT,MOI,JSI,JNEEA).",
  "853650": "Approval from the (MSD,MOIT,MOI,JSI).",
  "830160": "Approval from the (JSI, MOI/CD).",
  "853590": "Approval from the (JSI).",
  "830140": "Approval from the (JSI).",
  "853190": "Approval from the (JSI).",
  "850450": "Approval from the (MSD,JSI,MOI/CD).",
  "851890": "Approval from the (JSI).",
  "851821": "Approval from the (MSD,JSI,MOI/CD).",
  "851769": "Approval from the (MSD,JSI,MOI/CD).",
  "851822": "Approval from the (MSD,JSI,MOI/CD).",
  "847150": "Approval from the (TRA,MSD,JSI).",
  "853670": "Approval from the (MSD,JSI,MOI/CD).",
  "851830": "Approval from the (MSD,MOIT,JSI).",
  "851840": "Approval from the (JSI,MOI/CD).",
  "851810": "Approval from the (MSD,JSI,MOI/CD).",
  "853810": "Approval from the  (MSD,JSI,MOI/CD).",
  "392690": "Approval from the  (MSD,JSI,MOI/CD).",
  "841459": "Approval from the (JSI).",
  "852791": "Approval from the (MOIT,JSI,MOE).",
  "852349": "Approval from the (MOIT,JSI).",
  "851850": "Approval from the (TRA,MSD,MOIT,JSI).",
  "902810": "Approval from the (MSD).",
  "902820": "Approval from the (MSD,MOI,JSI,MOI/CD).",
  "902830": "Approval from the (JSI).",
  "854420": "Approval from the (JSI).",
  "851771": "Approval from the (JSI).",
  "940399": "Approval from the (MOIT,JSI,MOI/CD).",
  "845110": "Approval from the (JIS).",
  "852871": "Approval from the (TRA,MSD,MOIT,MSD,TRA).",
  "732690": "Approval from the (MSD,JSI)."
};
const taxRates = {
  "852589": 0.10, 
  "730830": 0.30, 
  "853110": 0.00, 
  "847130": 0.00, 
  "851762": 0.00, 
  "854470": 0.00, 
  "853710": 0.20, 
  "844332": 0.00, 
  "901060": 0.10, 
  "850440": 0.00, 
  "852190": 0.10, 
  "852849": 0.10, 
  "851714": 0.00, 
  "854370": 0.10, 
  "847190": 0.00, 
  "853650": 0.20, 
  "830160": 0.10, 
  "853590": 0.20, 
  "830140": 0.10, 
  "853190": 0.10, 
  "850450": 0.00, 
  "851890": 0.00, 
  "851821": 0.10, 
  "851769": 0.00, 
  "851822": 0.10, 
  "847150": 0.00, 
  "853670": 0.20, 
  "851830": 0.10, 
  "851840": 0.10, 
  "851810": 0.10, 
  "853810": 0.10, 
  "392690": 0.10, 
  "841459": 0.30, 
  "852791": 0.10, 
  "852349": 0.00, 
  "851850": 0.10, 
  "902810": 0.10, 
  "902820": 0.10, 
  "902830": 0.10, 
  "854420": 0.30, 
  "851771": 0.00, 
  "940399": 0.30, 
  "845110": 0.30, 
  "852871": 0.20, 
  "732690": 0.10  
};
// Reference to the select element and paragraph
const selectElement = document.getElementById("HS-type");
const descriptionElement = document.querySelector(".hs-description");
const resulttax= document.querySelector(".tax-rate");
const invoiceInput = document.getElementById("invoice");
const calculateButton = document.getElementById("calculate-btn2");
const resultElement = document.getElementById("HS-result");
// Event listener for change event
selectElement.addEventListener("change", function () {
  const selectedValue = selectElement.value;
  const description = hsDescriptions[selectedValue];
  descriptionElement.textContent = description;
  resulttax.textContent=taxRates[selectedValue]*100;
});
calculateButton.addEventListener("click", function () {
  const selectedValue = selectElement.value;
  const invoiceValue = parseFloat(invoiceInput.value);

  // Validate input
  if (!selectedValue) {
    resultElement.textContent = "Please select an HS code.";
    return;
  }

  if (isNaN(invoiceValue) || invoiceValue <= 0) {
    resultElement.textContent = "Please enter a valid invoice value.";
    return;
  }

  // Perform calculation
  const description =hsDescriptions2[selectedValue];
  const taxRate = taxRates[selectedValue];
  const tax = invoiceValue * taxRate;
  const totalCost = invoiceValue + tax+ 250;
  const Insurance = (invoiceValue * 0.007 < 50) ? 50 : invoiceValue * 0.007;

  // Display result
  resultElement.innerHTML = "Total cost is: " + totalCost+" JOD" + "<br>" + "Cost of Insurance:"+Insurance+ "JOD" +"<br>"+ description + "<br>"+" (need to be held at customs from 1-14 days for approvals)";
});
totalCost.toFixed(2)
// Initialize description on page load
selectElement.dispatchEvent(new Event("change"));





