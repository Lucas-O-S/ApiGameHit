import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { GenreModel } from "./Genre.Model";
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
        allowNull: true,
    })
    review : string;

    @Column({
        type: DataType.STRING(10),
        allowNull: true
    })
    completedDate : String;

    @Column({
        type: DataType.STRING(10),
        allowNull: true
    })
    startedDate : String;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    personalRating : number
    
    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number;

    @BelongsTo(() => UserModel)
    user: UserModel;
    
    @ForeignKey(() => GameModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    gameId: number;

    @BelongsTo(() => GameModel)
    game: GameModel;
   
    @ForeignKey(() => GameStatusModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    gameStatusId: number;

    @BelongsTo(() => GameStatusModel)
    gameStatus: GameStatusModel;


}