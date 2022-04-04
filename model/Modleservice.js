import { DataTypes } from "sequelize";
import Joi from "joi";
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
 const Schema = Joi.object({
  id: Joi.required(),
  Title: Joi.string(),


})


const Services = sequelize.define('service', {

  Title: {
    type: DataTypes.STRING,
  },
  
  Description: {
    type: DataTypes.STRING,
  },
  
  Requirement: {
    type: DataTypes.STRING,
  },
  
  Delivery_Time: {
    type: DataTypes.DATE,
  },
  
  NumberOf_Request_Done: {
    type: DataTypes.INTEGER,
  },
  cat_id: {
    type: DataTypes.INTEGER,
  },
  
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },

},{
  timestamps: false
});
const servicesModle = {}
servicesModle.Services = Services;




export default servicesModle;


