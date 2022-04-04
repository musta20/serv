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


const Users = sequelize.define('user', {

  name: {
    type: DataTypes.STRING,
  },
  
  username: {
    type: DataTypes.STRING,
  },
    
  des: {
    type: DataTypes.STRING,
  },
    //
  user_type: {  
    type: DataTypes.INTEGER,
  },
  
  img_id: {  
    type: DataTypes.INTEGER,
  },

  email_verified_at	: {
    type: DataTypes.DATE,
  },
  
  password: {
    type: DataTypes.INTEGER,
  },
  
  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  password: {
    type: DataTypes.STRING,
  },
  remember_token: {
    type: DataTypes.STRING,
  },

},{
  timestamps: false
});
const userModle = {}
userModle.User= Users;




export default userModle;


