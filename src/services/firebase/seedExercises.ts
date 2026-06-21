import { writeBatch, doc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from './config';
import { exercises } from '../../constants/exercises';

export async function seedUserExercisesIfMissing(uid: string) {
  try {
    const exercisesRef = collection(db, 'users', uid, 'exercises');
    const q = query(exercisesRef, limit(1));
    const existingSnap = await getDocs(q);

    if (!existingSnap.empty) {
      console.log('Exercise library already seeded.');
      return;
    }

    console.log('Seeding exercise library for user:', uid);
    const batch = writeBatch(db);

    for (const ex of exercises) {
      const docRef = doc(db, 'users', uid, 'exercises', ex.id);
      batch.set(docRef, {
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment,
        isCustom: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await batch.commit();
    console.log('Successfully seeded exercises in batch.');
  } catch (error) {
    console.error('Failed to seed exercises:', error);
  }
}
