import { Column, DataType, Model, Table } from "sequelize-typescript";

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
}