
export const GameStatusSchema = {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Nome' }
      },
      required: ['name']
    }
}
  