const  { select, input, checkbox } = require('@inquirer/prompts');
// Dynamic added Goals
let goal = {
  value: "Driks 3L of water per day",
  checked: false
}
// Structure for storing a list of goals.
let goals = [goal]

// Add goals
const registerGoal = async () => {
  let success = false;
  while (!success) {
    try {
      // Prompts the user to enter the goal
      const userInput = await input({ message:"Enter your goal:"})
      //Checks if the goal is empty
      if (!userInput.trim()) {
        console.log("The goal cannot be empty. Please enter something.")
        return
      }
      // Add the goal to the goal list
      goals.push({value: userInput.trim(), checked: false})
      //Display a success message
      console.log("Goal registered successfully!")

      success = true;

    } catch (error) { 
      console.log("An error occurred while registering the goal. Try again.", error)
    }
  }
}

// List goals
const listGoals = async () => {
  const responses = await checkbox({
    message: "Use t he arrow keys to change the goal, the espace to select or unmark and the Enter key to finish this stpe",
    choices: [...goals],
    instructions: false
  })

  goals.forEach((m) => {
    m.checked = false
  })

  if(responses.length == 0){
    console.log("No goals selected")
    return
  }

  responses.forEach((response) => {
    const goal = goals.find((m) =>{
      return m.value == response
    })
    goal.checked = true
  })

  console.log("Goal(s) marked as completed.")

}

//GoalsAccomplished
const GoalsAccomplished = async () => {
  //Looking for an accomplished goal to be listed
  const performed = goals.filter((goal) => {
    return goal.checked
  })
  
  //If there is no goal achieved
  if(performed.length == 0) {
    console.log("There are no goals achieved! 😪")
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
  const open = goals.filter((goal) => {
    return goal.checked != true
  })

  if(open.length == 0) {
    console.log("There are no open goals! 😍")
    return
  }

  await select({
    message: "Goals open: " + open.length,
    choices: [...open]
  })
}

//Delete goals
const deleteGoals = async () => {

  const deleteGoals = goals.map((goal) => {
    return { value: goal.value, checked: false }
  })

  const ItemsToDelete = await checkbox({
    message: "Select goals to delete",
    choices: [...deleteGoals],
    instructions: false,
  })

  if (ItemsToDelete.length == 0) {
    console.log("No items to delete")
    return
  }

  ItemsToDelete.forEach((item) => {
    goals = goals.filter((goal) => {
      return goal.value!== item
    })
  })
  console.log("Goals deleted successfully!")
}

// Here we start the application
const start = async () => {
  while (true) {

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
          name: "Sair",
          value: "sair"
        }
      ]
    })
    
    switch (option) {
      case "register":
        await registerGoal();
        console.log(goals)
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
      case "sair":
        console.log("Saindo...")
        return
      }
  }
}

start()