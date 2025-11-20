
export const GameSchema = {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Nome' },
        firstReleaseDate : {           
          type: 'string', 
          format: 'date', 
          example: '1000-01-01'
        },
        cover: {
                type: 'string',
                format: 'binary',
        },
        genreId: {
          type: 'number',
          example: '1'
        },
      },
      required: ['name', 'genreId', 'firstReleaseDate'],

    },
}
  