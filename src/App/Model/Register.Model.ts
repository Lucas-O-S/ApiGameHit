import { AllowNull, BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { GenderModel } from "./Gender.Model";
import { UserModel } from "./User.Model";
import { GameModel } from "./Game.Model";
import { GameStatusModel } from "./GameStatus.Model";

@Table({
    tableName: "tb_Register",
    timestamps: false
})
export class RegisterModel extends Model<RegisterModel> {
    

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
    review : string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    completedDate : String;

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    startedDate : String;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    personalRating

    @BelongsTo(() => UserModel, {foreignKey : "userId"})
    user : UserModel;

    @BelongsTo(() => GameModel, {foreignKey : "gameId"})
    game : GameModel;
   
    @BelongsTo(() => GameStatusModel, {foreignKey : "gameStatusId"})
    gameStatus : GameStatusModel;


}