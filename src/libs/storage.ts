import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface Plant {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: Array<string>;
  frequency: {
    times: number;
    repeat_every: string;
  }
  dateTimeNotification: Date;
  hour: string;
}

interface StoragePlantProps {
  [id: string]: {
    data: Plant;
  }
}

export async function savePlant(plant: Plant): Promise<void> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const newPlant = {
      [plant.id]: {
        data: plant
      }
    }

    await AsyncStorage.setItem("@plantmanager:plants",
      JSON.stringify({
        ...newPlant,
        ...oldPlants,
      })
    )

  } catch (error) {
    throw new Error(error);
    
  }
}

export async function loadPlant(): Promise<Plant[]> {
  try {
    const data = await AsyncStorage.getItem("@plantmanager:plants");
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const plantSorted = Object.keys(plants)
      .map(plantKey=> {
        return {
          ...plants[plantKey].data,
          hour: format(new Date(plants[plantKey].data.dateTimeNotification), "HH:mm")
        }
      })
      .sort( (a, b) => Math.floor(
        new Date(a.dateTimeNotification).getTime() / 1000
        - Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
      ))
      // sort ordena Date convertido para segundos

    return plantSorted;

  } catch (error) {
    throw new Error(error);
    
  }
}
