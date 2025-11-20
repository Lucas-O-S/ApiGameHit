
export const RegisterSchema = {
    schema: {
      type: 'object',
      properties: {
        review: { type: 'string', example: 'something something i suppose' },
        startedDate : {           
          type: 'string', 
          format: 'date', 
          example: '1000-01-01'
        },
        completedDate : {           
          type: 'string', 
          format: 'date', 
          example: '1000-01-01'
        },
        personalRating: {
          type: 'number',
          example: '1'
        },
        userId: {
          type: 'number',
          example: '1'
        },
        gameId: {
          type: 'number',
          example: '1'
        },
        gameStatusId: {
          type: 'number',
          example: '1'
        },
      },
      required: ['userId', 'gameId', 'gameStatusid'],

    },
}
  