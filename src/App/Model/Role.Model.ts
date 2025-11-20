import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserModel } from "./User.Model";

@Table({
    tableName: "tb_Role",
    timestamps: false
})
export class RoleModel extends Model<RoleModel>{
    

    @Column({
        type: DataType.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    })
    id : number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    role_Name : string;

    
    @HasMany(() => UserModel, { foreignKey: "roleId" })
    user : UserModel[];
}