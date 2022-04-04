import { DataTypes } from "sequelize";
import sequelize from "./Db.js";
/*
`id`, 
`Title`,
 `Description`, 
 `Requirement`, 
 `Delivery_Time`, 
 `IsOnTime_Service`, 
 `NumberOf_Request_Done`, 
 `created_at`, 
 `updated_at`, 
 `user_id`

*/


const Rating = sequelize.define('rating', {

  Service_id: {
    type: DataTypes.INTEGER,
  },
  
  Start_n: {
    type: DataTypes.INTEGER,
  },
  
  User_id: {
    type: DataTypes.INTEGER,
  },
  
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  }

},{
  timestamps: false
});
const ratingModle = {}
ratingModle.Rating= Rating;




export default ratingModle;


