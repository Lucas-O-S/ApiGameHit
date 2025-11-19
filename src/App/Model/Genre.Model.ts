import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "tb_Genre",
    timestamps: false
})
export class GenreModel extends Model<GenreModel> {
    

    @Column({
        type: DataType.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    })
    id : number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    name : string;
}