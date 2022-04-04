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


const Cats = sequelize.define('categories', {

  Categories_Title: {
    type: DataTypes.STRING,
  },
  
  Parent_Categories: {
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

const CatsModle = {}
CatsModle.Cats= Cats;




export default CatsModle;


