import { Sequelize } from "sequelize";

const sequelize = new Sequelize('Services', 'mustafa', 'Aa@123456', {
  host: 'localhost',
  dialect:  'mysql' 
});



 
 export default sequelize;

 


