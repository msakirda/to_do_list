import express from "express"
import dotenv from "dotenv"
import { Sequelize , DataTypes} from "sequelize";
dotenv.config();
const app = express();
const port = process.env.PORT;

// const sequelize = new Sequelize({
  
//   host: process.env.HOST,// L'adresse de votre serveur de base de données
//   dialect: 'mssql', // Le dialecte dépend de votre base de données
//   username: process.env.USERNAME,
//   password: process.env.PWD,
//   database: process.env.DATABASE,
// });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
})

const Todo = sequelize.define('Todo', {
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

funcSync();

async function testConnexion() {
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}
testConnexion()
async function funcSync()
{
  await sequelize.sync();
}

// Fonction pour ajouter une entrée "testTodoValue" dans la table Todo
async function addTestTodo(valueTodo:string) {
  try {
    // Cela crée automatiquement la table si elle n'existe pas encore
    await Todo.create({
      value: `${valueTodo}`,
    });
    console.log('Entrée "testTodoValue" ajoutée avec succès dans la table Todo.');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'entrée dans la table Todo :', error);
  } finally {
    await sequelize.close(); // N'oubliez pas de fermer la connexion lorsque vous avez terminé
  }
}

// Appelez la fonction pour ajouter une entrée "testTodoValue"


app.get('/addSentenceToBDD/:sentance', (req, res) => {
  // Récupérez les données du corps de la requête
  const donnees = req.body;
  //
  addTestTodo(req.params.sentance);

  // Faites ici ce que vous souhaitez avec les données reçues
  console.log('Données reçues :', donnees);
  // Réponse à la requête
  res.status(200).json({ message: 'Données reçues avec succès' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});