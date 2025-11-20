import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { GenreModel } from "./Genre.Model";
import { RegisterModel } from "./Register.Model";

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
    id: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    firstReleaseDate: string;

    @Column({
        type: DataType.BLOB("long"),
        allowNull: true
    })
    cover?: Buffer;


    @ForeignKey(() => GenreModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    genreId: number;

    @BelongsTo(() => GenreModel)
    genre: GenreModel;

    @HasMany(() => RegisterModel)
    register: RegisterModel[];
}
