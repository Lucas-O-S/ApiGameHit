
export const RoleSchema = {
    schema: {
      type: 'object',
      properties: {
        role_Name: { type: 'string', example: 'Nome' }
      },
      required: ['name']
    }
}
  