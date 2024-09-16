const  { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises;

let message = "⚡Welcome daily goals application ⚡";

// Structure for storing a list of goals.
let goals

const loadGoals = async () => {
  try {
    const data = await fs.readFile("goals.json", "utf-8");
    goals = JSON.parse(data);
  }
  catch (error) {
    console.error("An error occurred while loading the goals. Starting with an empty list.", error)
    goals = []
  }
}

const saveGoals = async () => {
  try {
    await fs.writeFile("goals.json", JSON.stringify(goals, null, 2))
    message = "Goals saved successfully!"
  }
  catch (error) {
    console.error("An error occurred while saving the goals.", error)
  }
}


// Add goals
const registerGoal = async () => {
  let success = false;
  while (!success) {
    try {
      // Prompts the user to enter the goal
      const userInput = await input({ message:"Enter your goal:"})
      //Checks if the goal is empty
      if (!userInput.trim()) {
        message = "The goal cannot be empty. Please enter something."
        return
      }
      // Add the goal to the goal list
      goals.push({value: userInput.trim(), checked: false})
      //Display a success message

      message = "Goal registered successfully! 😎"

      success = true;
      
    } catch (error) { 
      console.log("An error occurred while registering the goal. Try again.", error)
    }
  }
}

// List goals
const listGoals = async () => {

  if(goals.length == 0) {
    message = "No goals found. Use the 'Add Goal' button to add your first goal."
    return
  }

  const responses = await checkbox({
    message: "Use t he arrow keys to change the goal, the espace to select or unmark and the Enter key to finish this stpe",
    choices: [...goals],
    instructions: false
  })

  goals.forEach((m) => {
    m.checked = false
  })

  if(responses.length == 0){
    message = "No goals selected"
    return
  }

  responses.forEach((response) => {
    const goal = goals.find((m) =>{
      return m.value == response
    })
    goal.checked = true
  })

  message = "Goal(s) marked as completed."

}

//GoalsAccomplished
const GoalsAccomplished = async () => {

  if(goals.length == 0) {
    message = "No goals found. Use the 'Add Goal' button to add your first goal."
    return
  }

  //Looking for an accomplished goal to be listed
  const performed = goals.filter((goal) => {
    return goal.checked
  })
  
  //If there is no goal achieved
  if(performed.length == 0) {
    message("There are no goals achieved! 😪")
    return
  }

  // Here lists the goals achieved.
  await select({
    message: "Goals performed: " + performed.length,
    choices: [...performed]
  })
}

// openGoals
const openGoals = async () => {

  if(goals.length == 0) {
    message = "No goals found. Use the 'Add Goal' button to add your first goal."
    return
  }

  const open = goals.filter((goal) => {
    return goal.checked != true
  })

  if(open.length == 0) {
    message("There are no open goals! 😍")
    return
  }

  await select({
    message: "Goals open: " + open.length,
    choices: [...open]
  })
}

//Delete goals
const deleteGoals = async () => {

  if(goals.length == 0) {
    message = "No goals found. Use the 'Add Goal' button to add your first goal."
    return
  }

  const deleteGoals = goals.map((goal) => {
    return { value: goal.value, checked: false }
  })

  const ItemsToDelete = await checkbox({
    message: "Select goals to delete",
    choices: [...deleteGoals],
    instructions: false,
  })

  if (ItemsToDelete.length == 0) {
    message = "No items to delete"
    return
  }

  ItemsToDelete.forEach((item) => {
    goals = goals.filter((goal) => {
      return goal.value!== item
    })
  })
  message = "Goals deleted successfully!"
}

const showMessage =  () => {
  console.clear();
  
  if(message != ""){
    console.log(message)
    console.log("")
    message = ""
  }

}
// Here we start the application
const start = async () => {
  await loadGoals ()

  while (true) {
    showMessage()
    await saveGoals()
    
    const option = await select({
      message: "Menu >",
      choices: [
        {
          name: "Registers Goals",
          value: "register"
        },
        {
          name: "List Goals",
          value: "list"
        },
        {
          name: "Goals Accomplished",
          value: "Performed"
        },
        {
          name: "Open Goals",
          value: "open"
        },
        {
          name: "Delete Goals",
          value: "delete"
        },
        {
          name: "exit",
          value: "exit"
        }
      ]
    })
    
    switch (option) {
      case "register":
        await registerGoal();
        break
      case "list":
        await listGoals();
        break
      case "Performed":
        await GoalsAccomplished();
        break
      case "open":
        await openGoals();
        break
      case "delete":
        await deleteGoals();
        break
      case "exit":
        console.log("GoodBye...")
        return
      }
  }
}

start()