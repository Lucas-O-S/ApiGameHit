import { AllowNull, Column, DataType, Model, Table } from "sequelize-typescript";
import * as bcrypt from "bcrypt";

@Table({
    tableName: "tb_User",
    timestamps: false
})
export class UserModel extends Model<UserModel>{
    
    @Column({
        type: DataType.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    })
    id:number;


    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    username : string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    email : string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        validate : {
            notEmpty : true,
            len : [0,255]
        },
        set (value : string) {
            const hashed = bcrypt.hashSync(value, 10);
            this.setDataValue("password", hashed);
        }

    })
    password : string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 2
    })
    roleId: number;

    @Column({
        type: DataType.BLOB("long"),
        allowNull: true
    })
    userImage?: Buffer;

}