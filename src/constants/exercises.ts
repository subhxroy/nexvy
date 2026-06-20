export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
}

export const exercises: ExerciseDefinition[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell' },
  { id: 'dumbbell-bench', name: 'Dumbbell Bench Press', muscleGroup: 'chest', equipment: 'dumbbell' },
  { id: 'incline-bench', name: 'Incline Bench Press', muscleGroup: 'chest', equipment: 'barbell' },
  { id: 'incline-dumbbell', name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'dumbbell' },
  { id: 'decline-bench', name: 'Decline Bench Press', muscleGroup: 'chest', equipment: 'barbell' },
  { id: 'chest-fly', name: 'Chest Fly', muscleGroup: 'chest', equipment: 'dumbbell' },
  { id: 'cable-fly', name: 'Cable Fly', muscleGroup: 'chest', equipment: 'cable' },
  { id: 'push-up', name: 'Push Up', muscleGroup: 'chest', equipment: 'bodyweight' },
  { id: 'dip', name: 'Dip', muscleGroup: 'chest', equipment: 'bodyweight' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'pull-up', name: 'Pull Up', muscleGroup: 'back', equipment: 'bodyweight' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'cable' },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'back', equipment: 'barbell' },
  { id: 'dumbbell-row', name: 'Dumbbell Row', muscleGroup: 'back', equipment: 'dumbbell' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'cable' },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'back', equipment: 'cable' },
  { id: 't-bar-row', name: 'T-Bar Row', muscleGroup: 'back', equipment: 'barbell' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell' },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'front-raise', name: 'Front Raise', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', muscleGroup: 'shoulders', equipment: 'dumbbell' },
  { id: 'upright-row', name: 'Upright Row', muscleGroup: 'shoulders', equipment: 'barbell' },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'shoulders', equipment: 'dumbbell' },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'biceps', equipment: 'barbell' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscleGroup: 'biceps', equipment: 'dumbbell' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'biceps', equipment: 'dumbbell' },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'biceps', equipment: 'barbell' },
  { id: 'cable-curl', name: 'Cable Curl', muscleGroup: 'biceps', equipment: 'cable' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscleGroup: 'triceps', equipment: 'cable' },
  { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'triceps', equipment: 'barbell' },
  { id: 'overhead-triceps', name: 'Overhead Triceps Extension', muscleGroup: 'triceps', equipment: 'dumbbell' },
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', muscleGroup: 'triceps', equipment: 'barbell' },

  // Legs
  { id: 'squat', name: 'Squat', muscleGroup: 'quads', equipment: 'barbell' },
  { id: 'front-squat', name: 'Front Squat', muscleGroup: 'quads', equipment: 'barbell' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'quads', equipment: 'machine' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'quads', equipment: 'machine' },
  { id: 'lunges', name: 'Lunges', muscleGroup: 'quads', equipment: 'dumbbell' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscleGroup: 'quads', equipment: 'dumbbell' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'hamstrings', equipment: 'barbell' },
  { id: 'leg-curl', name: 'Leg Curl', muscleGroup: 'hamstrings', equipment: 'machine' },
  { id: 'glute-ham-raise', name: 'Glute Ham Raise', muscleGroup: 'hamstrings', equipment: 'bodyweight' },
  { id: 'calf-raise', name: 'Calf Raise', muscleGroup: 'calves', equipment: 'machine' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', muscleGroup: 'calves', equipment: 'machine' },

  // Core
  { id: 'crunch', name: 'Crunch', muscleGroup: 'abs', equipment: 'bodyweight' },
  { id: 'leg-raise', name: 'Leg Raise', muscleGroup: 'abs', equipment: 'bodyweight' },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'abs', equipment: 'bodyweight' },
  { id: 'plank', name: 'Plank', muscleGroup: 'abs', equipment: 'bodyweight' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'abs', equipment: 'cable' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscleGroup: 'abs', equipment: 'bodyweight' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscleGroup: 'abs', equipment: 'bodyweight' },
  { id: 'pallof-press', name: 'Pallof Press', muscleGroup: 'abs', equipment: 'cable' },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'glutes', equipment: 'barbell' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'glutes', equipment: 'bodyweight' },
  { id: 'cable-kickback', name: 'Cable Kickback', muscleGroup: 'glutes', equipment: 'cable' },
  { id: 'step-up', name: 'Step Up', muscleGroup: 'glutes', equipment: 'dumbbell' },

  // Cardio
  { id: 'treadmill', name: 'Treadmill', muscleGroup: 'cardio', equipment: 'machine' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'cardio', equipment: 'machine' },
  { id: 'rower', name: 'Rower', muscleGroup: 'cardio', equipment: 'machine' },
  { id: 'jump-rope', name: 'Jump Rope', muscleGroup: 'cardio', equipment: 'bodyweight' },
  { id: 'burpees', name: 'Burpees', muscleGroup: 'cardio', equipment: 'bodyweight' },
];

export const muscleGroups = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'quads', 'hamstrings', 'calves', 'glutes', 'abs', 'cardio',
] as const;

export function getExercisesByGroup(group: string): ExerciseDefinition[] {
  return exercises.filter((e) => e.muscleGroup === group);
}

export function searchExercises(query: string): ExerciseDefinition[] {
  const q = query.toLowerCase();
  return exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.muscleGroup.toLowerCase().includes(q) ||
      e.equipment.toLowerCase().includes(q)
  );
}
