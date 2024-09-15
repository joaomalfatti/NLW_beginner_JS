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
    message: "Goals performed",
    choices: [...performed]
  })
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
          name: "Listar metas",
          value: "list"
        },
        {
          name: "Metas Realizadas",
          value: "Performed"
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
      case "sair":
        console.log("Saindo...")
        return
      }
  }
}

start()