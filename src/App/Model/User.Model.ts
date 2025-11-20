import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, Table, Unique } from "sequelize-typescript";
import * as bcrypt from "bcrypt";
import { RegisterModel } from "./Register.Model";
import { RoleModel } from "./Role.Model";

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
        unique : true
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
        type: DataType.BLOB("long"),
        allowNull: true
    })
    userImage?: Buffer;

    @BelongsTo(() => RoleModel, {foreignKey : "roleId"})
    role : RoleModel;

    
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    roleId : number;

    @HasMany(() => RegisterModel)
    register: RegisterModel[];




}