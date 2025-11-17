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
