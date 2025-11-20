import { BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { RegisterModel } from "./Register.Model";

@Table({
    tableName: "tb_GameStatus",
    timestamps: false
})
export class GameStatusModel extends Model<GameStatusModel>{
    

    @Column({
        type: DataType.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    })
    id : number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    name : string;

    @HasMany(() => RegisterModel)
    register: RegisterModel[];
}