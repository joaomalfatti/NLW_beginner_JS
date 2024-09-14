const  { select, input } = require('@inquirer/prompts');

let goal = {
  value: "Driks 3L of water per day",
  checked: false
}
let goals = [goal]

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


//Aqui começamos o aplicativo
const start = async () => {
  while (true) {

    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Registers Goals",
          value: "register"
        },
        {
          name: "Listar metas",
          value: "listar"
        },
        {
          name: "Sair",
          value: "sair"
        }
      ]
    })
    
    switch (opcao) {
      case "register":
        await registerGoal();
        console.log(goals)
        break
      case "listar":
        await listarMetas();
        console.log(listarMetas)
        break
      case "sair":
        console.log("Saindo...")
        return
      }
  }
}

start()