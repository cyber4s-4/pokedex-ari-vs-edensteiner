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

//interface for preview data
export interface PreviewData {
  name: string;
  front_image: string;
  back_image: string;
}

export function fuseNames(firstName: string, secondName: string): string {
  return firstName.substring(0, firstName.length / 2) + secondName.substring(secondName.length / 2, secondName.length);
}

export function fuseAbilities(firstAbilityList: string[], secondAbilityList: string[]): string[] {
  const combinedAbilityList: string[] = [...firstAbilityList, ...secondAbilityList];
  const shuffledList: string[] = combinedAbilityList.sort((a, b) => 0.5 - Math.random());
  return shuffledList.slice(0, Math.floor(Math.random() * shuffledList.length + 1));
}

export function fuseTypes(firstTypeList: string[], secondTypeList: string[]): string[] {
  const combinedTypeList: string[] = [...firstTypeList, ...secondTypeList];
  const shuffledList: string[] = combinedTypeList.sort((a, b) => 0.5 - Math.random());
  return shuffledList.slice(0, Math.floor(Math.random() * shuffledList.length + 1));
}

export function fuseStats(firstStatList: string[], secondStatList: string[]): string[] {
  const hp: number =
    (Number(firstStatList[0].substring(firstStatList[0].search(" "))) +
      Number(secondStatList[0].substring(secondStatList[0].search(" ")))) /
    2;
  const attack: number =
    (Number(firstStatList[1].substring(firstStatList[1].search(" "))) +
      Number(secondStatList[1].substring(secondStatList[1].search(" ")))) /
    2;
  const defense: number =
    (Number(firstStatList[2].substring(firstStatList[2].search(" "))) +
      Number(secondStatList[2].substring(secondStatList[2].search(" ")))) /
    2;
  const specialAttack: number =
    (Number(firstStatList[3].substring(firstStatList[3].search(" "))) +
      Number(secondStatList[3].substring(secondStatList[3].search(" ")))) /
    2;
  const specialDefense: number =
    (Number(firstStatList[4].substring(firstStatList[4].search(" "))) +
      Number(secondStatList[4].substring(secondStatList[4].search(" ")))) /
    2;
  const speed: number =
    (Number(firstStatList[5].substring(firstStatList[5].search(" "))) +
      Number(secondStatList[5].substring(secondStatList[5].search(" ")))) /
    2;

  return [
    `hp: ${hp}`,
    `attack: ${attack}`,
    `defense: ${defense}`,
    `special-attack: ${specialAttack}`,
    `special-defense: ${specialDefense}`,
    `speed: ${speed}`,
  ];
}

export function fuseWeight(firstWeight: string, secondWeight: string): string {
  const fusedWeight: number = (Number(firstWeight) + Number(secondWeight)) / 2;
  return String(fusedWeight);
}

export function fuseHeight(firstHeight: string, secondHeight: string): string {
  const fusedHeight: number = (Number(firstHeight) + Number(secondHeight)) / 2;
  return String(fusedHeight);
}

export function fuseImage(firstImage: string, secondImage: string): string {
  return Math.random() > 0.5 ? firstImage : secondImage;
}
