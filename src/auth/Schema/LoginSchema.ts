
export const LoginSchema = {
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'abc@email.com' },
        password: { type: 'string', example: '12345' },
      }
    },
}
  