import { Column, DataType, Model, Table } from "sequelize-typescript";

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
}