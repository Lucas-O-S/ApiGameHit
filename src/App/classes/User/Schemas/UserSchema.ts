
export const UserSchema = {
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'Nome' },
        email: { type: 'string', example: 'abc@email.com' },
        password: { type: 'string', example: '12345' },
        userImage: {
                type: 'string',
                format: 'binary',
        },
      },
      required: ['username', 'email', 'password'],

    },
}
  