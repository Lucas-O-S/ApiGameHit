
export const LoginSchema = {
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'Nome' },
        password: { type: 'string', example: '12345' },
      }
    },
}
  