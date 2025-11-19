-- Criação da tabela de roles
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tb_Role'
)
BEGIN
    CREATE TABLE tb_Role (
        id INT IDENTITY(1,1) PRIMARY KEY,
        role_Name VARCHAR(255) NOT NULL
    )
END

GO

IF NOT EXISTS (SELECT * FROM tb_Role WHERE role_Name = 'ADM')
BEGIN
    INSERT INTO tb_Role (role_Name) VALUES ('ADM')
END

GO

IF NOT EXISTS (SELECT * FROM tb_Role WHERE role_Name = 'USER')
BEGIN
    INSERT INTO tb_Role (role_Name) VALUES ('USER')
END

GO

IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tb_User'
)
BEGIN
    CREATE TABLE tb_User (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(255) COLLATE Latin1_General_CS_AS NOT NULL,
        password VARCHAR(255)  COLLATE Latin1_General_CS_AS NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        userImage VARBINARY(MAX) NULL,
        roleId INT NOT NULL DEFAULT 2,
        FOREIGN KEY (roleId) REFERENCES tb_Role(id)
    )
END

GO

IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tb_Genre'
)
BEGIN
    CREATE TABLE tb_Genre (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );

    INSERT INTO tb_Genre (name) VALUES
        ('Ação'),
        ('Aventura'),
        ('RPG'),
        ('Estratégia'),
        ('Simulação'),
        ('Esportes'),
        ('Corrida'),
        ('Terror'),
        ('Puzzle'),
        ('Plataforma'),
        ('FPS'),
        ('MMO');
END

GO

IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tb_Game'
)
BEGIN
    CREATE TABLE tb_Game (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(255) COLLATE Latin1_General_CS_AS NOT NULL,
        firstReleaseDate VARCHAR(10) NULL,
        cover VARBINARY(MAX) NULL,
        genreId INT NOT NULL,
        FOREIGN KEY (genreId) REFERENCES tb_Genre(id)
    )
END


GO

IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tb_GameStatus'
)
BEGIN
    CREATE TABLE tb_GameStatus (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome VARCHAR(50) NOT NULL
    );

    INSERT INTO tb_GameStatus (nome) VALUES
        ('Concluído'),
        ('Em andamento'),
        ('Aposentado'),
        ('Rejogando'),
        ('Pendência');
END

GO

IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tb_Register'
)
BEGIN
    CREATE TABLE tb_Register (
        id INT IDENTITY(1,1) PRIMARY KEY,
        completedDate VARCHAR(10) NULL,
        startedDate VARCHAR(10) NULL,
        review VARCHAR(255) NULL,
        personalRating INT NULL,
        gameId INT NOT NULL,
        userId INT NOT NULL,
        gameStatusId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES tb_User(id),
        FOREIGN KEY (gameId) REFERENCES tb_Game(id),
        FOREIGN KEY (gameStatusId) REFERENCES tb_GameStatus(id)
    )
END

GO
