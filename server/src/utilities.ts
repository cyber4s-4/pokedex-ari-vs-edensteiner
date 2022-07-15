//interface for pokemon data
export interface Data {
  name: string;
  front_image: string;
  back_image: string;
  abilities: string[];
  types: string[];
  stats: string[];
  height: string;
  weight: string;
}

//class for pokemon
export class Pokemon {
  data: Data;
  constructor(data: Data) {
    this.data = data;
  }
}

export function fuseNames(firstName: string, secondName: string): string {
  return firstName.substring(0, firstName.length / 2) + secondName.substring(secondName.length / 2, secondName.length);
}
