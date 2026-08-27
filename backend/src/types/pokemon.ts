export type Pokemon = {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    stats: {
      base_stat: number,
      stat: {
        name: string
      }
    }[];
    types: {
        type: {
          name:string
        }
    }[];
};

export type CatchResult = {
    caught: boolean;
    pokemon: {
        id: number;
        name: string;
    };
};