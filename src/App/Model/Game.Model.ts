import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { GenreModel } from "./Genre.Model";

@Table({
    tableName: "tb_Game",
    timestamps: false
})
export class GameModel extends Model<GameModel> {
    

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
    name : string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    firstReleaseDate : String;

    @Column({
        type: DataType.BLOB("long"),
        allowNull: true
    })
    cover? : Buffer

    @BelongsTo(() => GenreModel, {foreignKey : "genreId"})
    genre : GenreModel;


    


}